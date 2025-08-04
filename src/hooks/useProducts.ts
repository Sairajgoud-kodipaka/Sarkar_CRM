import { useState, useEffect } from 'react';
import { ApiClient } from '@/lib/api';

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  images: string[];
  isActive: boolean;
  storeId: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  total: number;
  page: number;
  limit: number;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const fetchProducts = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.getProducts({
        page: params?.page || page,
        limit: params?.limit || limit,
        search: params?.search,
        category: params?.category,
        status: params?.status,
      }) as ProductsResponse;

      setProducts(response.data);
      setTotal(response.total);
      setPage(response.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.createProduct(productData);
      
      // Refresh the products list
      await fetchProducts();
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiClient.updateProduct(id, productData);
      
      // Update the product in the local state
      setProducts(prev => prev.map(product => 
        product.id === id ? { ...product, ...response.data } : product
      ));
      
      return response;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      console.error('Error updating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await ApiClient.deleteProduct(id);
      
      // Remove the product from the local state
      setProducts(prev => prev.filter(product => product.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      console.error('Error deleting product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    total,
    page,
    limit,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
} 