// src/utils/getUserFromToken.ts
import { mockUser } from '../services/mockData';
import { User } from './type';

export const getUserFromToken = (): { user: User } | null => {
  const token = localStorage.getItem('userToken');
  if (!token) return null;

  // For mock purposes
  return { user: mockUser };
};

