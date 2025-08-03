'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface TestResult {
  endpoint: string;
  method: string;
  status: 'success' | 'error' | 'loading';
  message: string;
  data?: any;
  error?: string;
}

export default function TestAPI() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState({
    customerName: 'Test Customer',
    customerPhone: '+919876543210',
    customerEmail: 'test@example.com',
    productName: 'Gold Ring',
    productSku: 'GR001',
    productPrice: '25000'
  });

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const testEndpoint = async (endpoint: string, method: string, body?: any) => {
    const result: TestResult = {
      endpoint,
      method,
      status: 'loading',
      message: 'Testing...'
    };
    addResult(result);

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (response.ok) {
        addResult({
          endpoint,
          method,
          status: 'success',
          message: `✅ ${method} ${endpoint} - Success`,
          data
        });
      } else {
        addResult({
          endpoint,
          method,
          status: 'error',
          message: `❌ ${method} ${endpoint} - Error ${response.status}`,
          error: data.error || 'Unknown error'
        });
      }
    } catch (error: any) {
      addResult({
        endpoint,
        method,
        status: 'error',
        message: `❌ ${method} ${endpoint} - Network Error`,
        error: error.message
      });
    }
  };

  const runAllTests = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Get customers
    await testEndpoint('/api/customers', 'GET');

    // Test 2: Create a customer
    await testEndpoint('/api/customers', 'POST', {
      name: testData.customerName,
      phone: testData.customerPhone,
      email: testData.customerEmail,
      storeId: 'test-store-id',
      status: 'ACTIVE'
    });

    // Test 3: Get products
    await testEndpoint('/api/products', 'GET');

    // Test 4: Create a product
    await testEndpoint('/api/products', 'POST', {
      name: testData.productName,
      sku: testData.productSku,
      price: parseFloat(testData.productPrice),
      storeId: 'test-store-id',
      categoryId: 'test-category-id',
      isActive: true
    });

    // Test 5: Get floors
    await testEndpoint('/api/floors', 'GET');

    // Test 6: Get categories
    await testEndpoint('/api/categories', 'GET');

    // Test 7: Get sales
    await testEndpoint('/api/sales', 'GET');

    // Test 8: Get users
    await testEndpoint('/api/users', 'GET');

    setLoading(false);
  };

  const testDatabaseConnection = async () => {
    setLoading(true);
    setResults([]);

    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();

      if (response.ok) {
        addResult({
          endpoint: '/api/test-db',
          method: 'GET',
          status: 'success',
          message: '✅ Database connection test - Success',
          data
        });
      } else {
        addResult({
          endpoint: '/api/test-db',
          method: 'GET',
          status: 'error',
          message: '❌ Database connection test - Failed',
          error: data.error || 'Unknown error'
        });
      }
    } catch (error: any) {
      addResult({
        endpoint: '/api/test-db',
        method: 'GET',
        status: 'error',
        message: '❌ Database connection test - Network Error',
        error: error.message
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">API Endpoint Testing</h1>
        <p className="text-gray-600">Test all API endpoints to verify database connectivity</p>
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run comprehensive API tests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={runAllTests} 
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Running Tests...' : 'Run All API Tests'}
            </Button>
            
            <Button 
              onClick={testDatabaseConnection} 
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              Test Database Connection
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Data</CardTitle>
            <CardDescription>Sample data for testing</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={testData.customerName}
                onChange={(e) => setTestData(prev => ({ ...prev, customerName: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Customer Phone</Label>
              <Input
                id="customerPhone"
                value={testData.customerPhone}
                onChange={(e) => setTestData(prev => ({ ...prev, customerPhone: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                value={testData.productName}
                onChange={(e) => setTestData(prev => ({ ...prev, productName: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
          <CardDescription>
            {results.length > 0 ? `${results.length} tests completed` : 'No tests run yet'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {results.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Click "Run All API Tests" to start testing</p>
          ) : (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.status === 'success' ? 'default' : result.status === 'error' ? 'destructive' : 'secondary'}>
                        {result.status}
                      </Badge>
                      <span className="font-mono text-sm">{result.method}</span>
                      <span className="font-mono text-sm text-gray-600">{result.endpoint}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2">{result.message}</p>
                  
                  {result.error && (
                    <div className="bg-red-50 border border-red-200 rounded p-3">
                      <p className="text-red-800 text-sm font-medium">Error:</p>
                      <p className="text-red-700 text-sm">{result.error}</p>
                    </div>
                  )}
                  
                  {result.data && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <p className="text-green-800 text-sm font-medium">Response:</p>
                      <pre className="text-green-700 text-xs overflow-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 