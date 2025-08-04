import { useState, useEffect } from 'react'

// Generic API hook for any endpoint
export function useAPI<T>(endpoint: string, options?: { 
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: any
  dependencies?: any[]
}) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Use real API endpoints
      const response = await fetch(`/api/${endpoint}`, {
        method: options?.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: options?.body ? JSON.stringify(options.body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      setData(result.data || result)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch data')
      console.error(`API Error for ${endpoint}:`, err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, options?.dependencies || [])

  return { data, loading, error, refetch: fetchData }
}

// Customers hook
export function useCustomers(filters?: {
  search?: string
  status?: string
  floor?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `customers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.search, filters?.status, filters?.floor, filters?.page, filters?.limit] })
}

// Products hook
export function useProducts(filters?: {
  search?: string
  category?: string
  status?: string
  floor?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.category) queryParams.append('category', filters.category)
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.search, filters?.category, filters?.status, filters?.floor, filters?.page, filters?.limit] })
}

// Sales hook
export function useSales(filters?: {
  search?: string
  status?: string
  floor?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
  if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `sales${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.search, filters?.status, filters?.floor, filters?.dateFrom, filters?.dateTo, filters?.page, filters?.limit] })
}

// Users hook
export function useUsers(filters?: {
  search?: string
  role?: string
  floor?: string
  status?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.role) queryParams.append('role', filters.role)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.search, filters?.role, filters?.floor, filters?.status, filters?.page, filters?.limit] })
}

// Analytics hook
export function useAnalytics(type: 'dashboard' | 'sales' | 'customers' | 'products', filters?: {
  floor?: string
  dateFrom?: string
  dateTo?: string
}) {
  const queryParams = new URLSearchParams()
  queryParams.append('type', type)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
  if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)

  const endpoint = `analytics?${queryParams.toString()}`
  return useAPI<any>(endpoint, { dependencies: [type, filters?.floor, filters?.dateFrom, filters?.dateTo] })
}

// Approvals hook
export function useApprovals(filters?: {
  status?: string
  priority?: string
  floor?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.priority) queryParams.append('priority', filters.priority)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `approvals${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.status, filters?.priority, filters?.floor, filters?.page, filters?.limit] })
}

// Escalations hook
export function useEscalations(filters?: {
  status?: string
  priority?: string
  floor?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.priority) queryParams.append('priority', filters.priority)
  if (filters?.floor) queryParams.append('floor', filters.floor)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `escalations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.status, filters?.priority, filters?.floor, filters?.page, filters?.limit] })
}

// Audit logs hook
export function useAuditLogs(filters?: {
  user?: string
  action?: string
  entityType?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.user) queryParams.append('user', filters.user)
  if (filters?.action) queryParams.append('action', filters.action)
  if (filters?.entityType) queryParams.append('entityType', filters.entityType)
  if (filters?.dateFrom) queryParams.append('dateFrom', filters.dateFrom)
  if (filters?.dateTo) queryParams.append('dateTo', filters.dateTo)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `audit-logs${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.user, filters?.action, filters?.entityType, filters?.dateFrom, filters?.dateTo, filters?.page, filters?.limit] })
}

// Floors hook
export function useFloors(filters?: {
  search?: string
  status?: string
  store?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.store) queryParams.append('store', filters.store)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `floors${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.search, filters?.status, filters?.store, filters?.page, filters?.limit] })
}

// Support hook
export function useSupport(filters?: {
  search?: string
  priority?: string
  status?: string
  page?: number
  limit?: number
}) {
  const queryParams = new URLSearchParams()
  if (filters?.search) queryParams.append('search', filters.search)
  if (filters?.priority) queryParams.append('priority', filters.priority)
  if (filters?.status) queryParams.append('status', filters.status)
  if (filters?.page) queryParams.append('page', filters.page.toString())
  if (filters?.limit) queryParams.append('limit', filters.limit.toString())

  const endpoint = `support${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
  return useAPI<any[]>(endpoint, { dependencies: [filters?.search, filters?.priority, filters?.status, filters?.page, filters?.limit] })
}

// CRUD Operations
export function useCRUD<T>(endpoint: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const create = async (data: any): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Create failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (err: any) {
      setError(err.message || 'Create operation failed')
      console.error(`Create Error for ${endpoint}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const update = async (id: string, data: any): Promise<T | null> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/${endpoint}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`Update failed: ${response.status} ${response.statusText}`)
      }

      const result = await response.json()
      return result.data || result
    } catch (err: any) {
      setError(err.message || 'Update operation failed')
      console.error(`Update Error for ${endpoint}:`, err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const remove = async (id: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/${endpoint}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status} ${response.statusText}`)
      }

      return true
    } catch (err: any) {
      setError(err.message || 'Delete operation failed')
      console.error(`Delete Error for ${endpoint}:`, err)
      return false
    } finally {
      setLoading(false)
    }
  }

  return { create, update, remove, loading, error }
}

// Specific CRUD hooks
export function useCustomersCRUD() {
  return useCRUD<any>('customers')
}

export function useProductsCRUD() {
  return useCRUD<any>('products')
}

export function useSalesCRUD() {
  return useCRUD<any>('sales')
}

export function useUsersCRUD() {
  return useCRUD<any>('users')
} 