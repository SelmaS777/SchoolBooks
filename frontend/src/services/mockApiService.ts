// src/services/mockApiService.ts
import { mockProducts, mockCategories, mockUser } from './mockData';
import { Product, NewProduct } from '../utils/type';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApiService = {
  // Auth endpoints
  login: async (credentials: { identifier: string; password: string }) => {
    await delay(500);
    // Check if credentials match the mock user
    if (credentials.identifier === 'user@gmail.com' && credentials.password === 'userPassword!23') {
      const mockToken = 'mock-jwt-token-for-authentication';
      return { 
        jwt_access_token: mockToken, 
        user: mockUser 
      };
    }
    throw new Error('Invalid credentials');
  },
  
  register: async (userData: any) => {
    await delay(500);
    return { success: true };
  },
  
  // Product endpoints
  getProducts: async () => {
    await delay(300);
    return mockProducts;
  },
  
  getCategories: async () => {
    await delay(300);
    return mockCategories;
  },
  
  addProduct: async (product: NewProduct) => {
    await delay(500);
    const newProduct: Product = {
      ...product,
      id: mockProducts.length + 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return newProduct;
  },
  
  // Cart endpoints
  createCart: async (cartItems: any) => {
    await delay(300);
    return { success: true, message: 'Cart created successfully' };
  }
};