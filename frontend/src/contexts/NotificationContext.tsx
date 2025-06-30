import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { fetchNotifications, addRealTimeNotification } from '../store/notificationSlice';
import { notificationService } from '../services/notificationService';
import { toast } from 'react-toastify';

interface NotificationContextType {
  unreadCount: number;
  showPopupNotification: (message: string, type?: string) => void;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType>({
  unreadCount: 0,
  showPopupNotification: () => {},
  refetch: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { userToken, userInfo } = useSelector((state: RootState) => state.auth);
  const { unreadCount } = useSelector((state: RootState) => state.notificationSlice);

  useEffect(() => {
    if (userToken && userInfo?.id) {
      try {
        // Fetch initial notifications
        dispatch(fetchNotifications() as any);

        // Initialize Pusher connection for real-time notifications
        notificationService.initializePusher(userInfo.id);

        // Subscribe to real-time notifications
        const unsubscribe = notificationService.onNotification((notification) => {
          dispatch(addRealTimeNotification(notification));
          showPopupNotification(notification.message, notification.type);
        });

        // Request browser notification permission
        if ('Notification' in window && Notification.permission === 'default') {
          Notification.requestPermission();
        }

        return () => {
          unsubscribe();
          notificationService.disconnect();
        };
      } catch (error) {
        console.error('Error setting up notifications:', error);
      }
    }
  }, [userToken, userInfo?.id, dispatch]);

  const showPopupNotification = (message: string, type: string = 'info') => {
    const options = {
      position: 'top-right' as const,
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    };

    try {
      switch (type) {
        case 'success':
        case 'order_confirmed':
        case 'order_delivered':
          toast.success(message, options);
          break;
        case 'error':
        case 'order_cancelled':
          toast.error(message, options);
          break;
        case 'warning':
        case 'order_delayed':
          toast.warn(message, options);
          break;
        default:
          toast.info(message, options);
      }

      // Also show browser notification if permission granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('SchoolBooks Notification', {
          body: message,
          icon: '/favicon.ico',
          tag: 'schoolbooks-notification'
        });
      }
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  const refetch = () => {
    try {
      dispatch(fetchNotifications() as any);
    } catch (error) {
      console.error('Error refetching notifications:', error);
    }
  };

  return (
    <NotificationContext.Provider value={{ unreadCount, showPopupNotification, refetch }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  return useContext(NotificationContext);
};