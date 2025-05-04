// Types for our API
export interface VaultAccount {
  username: string;
  masterPassword: string;
}

export interface Password {
  id?: string;
  service: string;
  username: string;
  password: string;
  notes?: string;
  url?: string;
  createdAt?: string;
  updatedAt?: string;
}


// Base API URL - adjust as needed for development/production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// API error handling
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Helper function for making API requests
const fetchApi = async <T>(
  endpoint: string, 
  method: string = 'GET', 
  data?: any
): Promise<T> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // Include cookies for authentication
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  
  const responseData = await response.json();
  
  if (!response.ok) {
    throw new ApiError(responseData.message || 'An error occurred', response.status);
  }
  
  return responseData;
};

// Authentication APIs
export const authApi = {
  // Register a new vault account
  register: (vaultAccount: VaultAccount): Promise<{ success: boolean, message: string }> => {
    return fetchApi('/auth/register', 'POST', vaultAccount);
  },
  
  // Login to a vault account
  login: (vaultAccount: VaultAccount): Promise<{ token: string, user: { username: string } }> => {
    return fetchApi('/auth/login', 'POST', vaultAccount);
  },
  
  // Logout current session
  logout: (): Promise<{ success: boolean }> => {
    return fetchApi('/auth/logout', 'POST');
  },
  
  // Check if user is authenticated
  checkAuth: (): Promise<{ authenticated: boolean, user?: { username: string } }> => {
    return fetchApi('/auth/check');
  }
};

// Password management APIs
export const passwordApi = {
  // Get all passwords for the authenticated user
  getAll: (): Promise<Password[]> => {
    return fetchApi('/passwords');
  },
  
  // Create a new password entry
  create: (password: Password): Promise<Password> => {
    return fetchApi('/passwords', 'POST', password);
  },
  
  // Update an existing password
  update: (id: string, password: Password): Promise<Password> => {
    return fetchApi(`/passwords/${id}`, 'PUT', password);
  },
  
  // Delete a password
  delete: (id: string): Promise<{ success: boolean }> => {
    return fetchApi(`/passwords/${id}`, 'DELETE');
  }
};

// Vault management
export const vaultApi = {
  // Get vault info
  getInfo: (): Promise<{ createdAt: string, passwordCount: number }> => {
    return fetchApi('/vault/info');
  },
  
  // Change master password
  changeMasterPassword: (currentPassword: string, newPassword: string): Promise<{ success: boolean }> => {
    return fetchApi('/vault/master-password', 'PUT', { currentPassword, newPassword });
  }
};
