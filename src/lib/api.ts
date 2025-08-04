// Centralized API client for all real API calls
const API_BASE = '/api';

export class ApiClient {
  // Generic API call method
  static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Customers API
  static async getCustomers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    floor?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.floor) searchParams.append('floor', params.floor);

    const query = searchParams.toString();
    return this.request(`/customers${query ? `?${query}` : ''}`);
  }

  static async createCustomer(data: any) {
    return this.request('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateCustomer(id: string, data: any) {
    return this.request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteCustomer(id: string) {
    return this.request(`/customers/${id}`, {
      method: 'DELETE',
    });
  }

  // Products API
  static async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    status?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.status) searchParams.append('status', params.status);

    const query = searchParams.toString();
    return this.request(`/products${query ? `?${query}` : ''}`);
  }

  static async createProduct(data: any) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateProduct(id: string, data: any) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteProduct(id: string) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales API
  static async getSales(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.status) searchParams.append('status', params.status);
    if (params?.floor) searchParams.append('floor', params.floor);
    if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.append('dateTo', params.dateTo);

    const query = searchParams.toString();
    return this.request(`/sales${query ? `?${query}` : ''}`);
  }

  static async createSale(data: any) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateSale(id: string, data: any) {
    return this.request(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteSale(id: string) {
    return this.request(`/sales/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  static async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    floor?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.role) searchParams.append('role', params.role);
    if (params?.floor) searchParams.append('floor', params.floor);

    const query = searchParams.toString();
    return this.request(`/users${query ? `?${query}` : ''}`);
  }

  static async createUser(data: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Analytics API
  static async getAnalytics(type: string, params?: {
    floor?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const searchParams = new URLSearchParams();
    searchParams.append('type', type);
    if (params?.floor) searchParams.append('floor', params.floor);
    if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.append('dateTo', params.dateTo);

    return this.request(`/analytics?${searchParams.toString()}`);
  }

  // Approvals API
  static async getApprovals(params?: {
    page?: number;
    limit?: number;
    status?: string;
    actionType?: string;
    requesterId?: string;
    approverId?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.actionType) searchParams.append('actionType', params.actionType);
    if (params?.requesterId) searchParams.append('requesterId', params.requesterId);
    if (params?.approverId) searchParams.append('approverId', params.approverId);

    const query = searchParams.toString();
    return this.request(`/approvals${query ? `?${query}` : ''}`);
  }

  static async createApproval(data: any) {
    return this.request('/approvals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async updateApproval(id: string, data: any) {
    return this.request(`/approvals/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Escalations API
  static async getEscalations(params?: {
    page?: number;
    limit?: number;
    status?: string;
    priority?: string;
    floor?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.status) searchParams.append('status', params.status);
    if (params?.priority) searchParams.append('priority', params.priority);
    if (params?.floor) searchParams.append('floor', params.floor);

    const query = searchParams.toString();
    return this.request(`/escalations${query ? `?${query}` : ''}`);
  }

  static async createEscalation(data: any) {
    return this.request('/escalations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Audit Logs API
  static async getAuditLogs(params?: {
    page?: number;
    limit?: number;
    userId?: string;
    action?: string;
    entityType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.action) searchParams.append('action', params.action);
    if (params?.entityType) searchParams.append('entityType', params.entityType);
    if (params?.dateFrom) searchParams.append('dateFrom', params.dateFrom);
    if (params?.dateTo) searchParams.append('dateTo', params.dateTo);

    const query = searchParams.toString();
    return this.request(`/audit-logs${query ? `?${query}` : ''}`);
  }

  static async createAuditLog(data: any) {
    return this.request('/audit-logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
} 