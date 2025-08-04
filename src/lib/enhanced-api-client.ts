// Enhanced API Client with comprehensive error handling
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  timestamp?: string;
}

export interface ApiRequestConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  public statusCode: number;
  public response?: Response;
  public data?: any;

  constructor(message: string, statusCode: number = 500, response?: Response, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.response = response;
    this.data = data;
  }
}

class EnhancedApiClient {
  private baseURL: string;
  private defaultTimeout: number;
  private defaultRetries: number;
  private defaultRetryDelay: number;

  constructor(baseURL: string = '/api', options: {
    timeout?: number;
    retries?: number;
    retryDelay?: number;
  } = {}) {
    this.baseURL = baseURL;
    this.defaultTimeout = options.timeout || 10000;
    this.defaultRetries = options.retries || 3;
    this.defaultRetryDelay = options.retryDelay || 1000;
  }

  // Request interceptor
  private async interceptRequest(config: ApiRequestConfig): Promise<ApiRequestConfig> {
    // Add default headers
    const headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };

    // Add authentication token if available
    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return {
      ...config,
      headers,
    };
  }

  // Response interceptor
  private async interceptResponse(response: Response): Promise<Response> {
    // Handle common response scenarios
    if (response.status === 401) {
      // Handle unauthorized - redirect to login
      this.handleUnauthorized();
    } else if (response.status === 403) {
      // Handle forbidden
      console.warn('Access forbidden');
    } else if (response.status >= 500) {
      // Handle server errors
      console.error('Server error:', response.status, response.statusText);
    }

    return response;
  }

  // Get auth token from localStorage or cookies
  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token') || 
             document.cookie.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1] ||
             null;
    }
    return null;
  }

  // Handle unauthorized access
  private handleUnauthorized(): void {
    if (typeof window !== 'undefined') {
      // Clear auth data
      localStorage.removeItem('auth_token');
      document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login
      window.location.href = '/login';
    }
  }

  // Retry logic with exponential backoff
  private async retryRequest<T>(
    requestFn: () => Promise<T>,
    retries: number,
    delay: number
  ): Promise<T> {
    try {
      return await requestFn();
    } catch (error) {
      if (retries > 0 && this.isRetryableError(error)) {
        await this.delay(delay);
        return this.retryRequest(requestFn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  // Check if error is retryable
  private isRetryableError(error: any): boolean {
    if (error instanceof ApiError) {
      // Retry on 5xx errors and network errors
      return error.statusCode >= 500 || error.statusCode === 0;
    }
    // Retry on network errors
    return error.name === 'TypeError' && error.message.includes('fetch');
  }

  // Delay utility
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Main request method
  async request<T = any>(endpoint: string, config: ApiRequestConfig = {}): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      headers = {},
      body,
      timeout = this.defaultTimeout,
      retries = this.defaultRetries,
      retryDelay = this.defaultRetryDelay,
      signal,
    } = config;

    const requestFn = async (): Promise<ApiResponse<T>> => {
      // Intercept request
      const interceptedConfig = await this.interceptRequest(config);

      // Create timeout controller
      const timeoutController = new AbortController();
      const timeoutId = setTimeout(() => timeoutController.abort(), timeout);

      // Create fetch options
      const fetchOptions: RequestInit = {
        method,
        headers: interceptedConfig.headers,
        signal: signal || timeoutController.signal,
      };

      if (body && method !== 'GET') {
        fetchOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
      }

      try {
        const url = `${this.baseURL}${endpoint}`;
        const response = await fetch(url, fetchOptions);

        // Clear timeout
        clearTimeout(timeoutId);

        // Intercept response
        await this.interceptResponse(response);

        // Parse response
        let data: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          data = await response.json();
        } else {
          data = await response.text();
        }

        // Handle error responses
        if (!response.ok) {
          throw new ApiError(
            data.error || data.message || `HTTP ${response.status}`,
            response.status,
            response,
            data
          );
        }

        return {
          success: true,
          data: data.data || data,
          message: data.message,
          statusCode: response.status,
          timestamp: data.timestamp,
        };
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
          throw new ApiError('Request timeout', 408);
        }

        if (error instanceof ApiError) {
          throw error;
        }

        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          throw new ApiError('Network error - please check your connection', 0);
        }

        throw new ApiError(error.message || 'Unknown error occurred', 500);
      }
    };

    // Execute with retry logic
    try {
      return await this.retryRequest(requestFn, retries, retryDelay);
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
        statusCode: error.statusCode || 500,
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Convenience methods
  async get<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  async put<T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  async delete<T = any>(endpoint: string, config?: Omit<ApiRequestConfig, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  async patch<T = any>(endpoint: string, body?: any, config?: Omit<ApiRequestConfig, 'method' | 'body'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PATCH', body });
  }
}

// Create and export default instance
export const apiClient = new EnhancedApiClient();

// Export the class for custom instances
export { EnhancedApiClient };

// Utility functions
export const createApiError = (message: string, statusCode: number = 500, data?: any): ApiError => {
  return new ApiError(message, statusCode, undefined, data);
};

export const isApiError = (error: any): error is ApiError => {
  return error instanceof ApiError;
}; 