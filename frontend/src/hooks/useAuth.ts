import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { User } from '../utils/type';

export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const userInfo: User | null = auth.userInfo;
  
  // Check if we have valid user info
  const isAuthenticated = !!auth.userToken && !!userInfo;
  
  
  return {
    user: userInfo,
    token: auth.userToken,
    isAuthenticated,
    loading: auth.loading,
    error: auth.error
  };
};