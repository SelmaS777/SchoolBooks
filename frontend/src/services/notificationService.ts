import AppAxios from './appAxios';
import Pusher from 'pusher-js';

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  notification_type: string;
  order_id?: number;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  order?: {
    id: number;
    product: {
      name: string;
    };
  };
}

export interface NotificationResponse {
  notifications: Notification[];
  unread_count: number;
}

export interface RealTimeNotification {
  message: string;
  type: string;
  timestamp: string;
}

class NotificationService {
  private pusher: Pusher | null = null;
  private channel: any = null;
  private callbacks: ((notification: RealTimeNotification) => void)[] = [];

  // Initialize Pusher connection
  initializePusher(userId: number) {
    try {
      // Get environment variables using Vite's import.meta.env
      const pusherKey = import.meta.env.VITE_PUSHER_KEY;
      const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER;

      if (!pusherKey || !pusherCluster) {
        console.error('Missing Pusher configuration. Please check your environment variables.');
        return;
      }

      // Initialize Pusher (remove auth config for public channels)
      this.pusher = new Pusher(pusherKey, {
        cluster: pusherCluster,
      });

      // Use public channel instead of private
      this.channel = this.pusher.subscribe(`user-${userId}`);
      
      this.channel.bind('notification-event', (data: RealTimeNotification) => {
        this.callbacks.forEach(callback => callback(data));
      });

      this.channel = this.pusher.subscribe(`private-user.${userId}`);
      
      this.channel.bind('App\\Events\\NotificationEvent', (data: RealTimeNotification) => {
        this.callbacks.forEach(callback => callback(data));
      });

      // Handle connection events
      this.pusher.connection.bind('connected', () => {
        console.log('Pusher connected successfully');
      });

      this.pusher.connection.bind('error', (err: any) => {
        console.error('Pusher connection error:', err);
      });

      this.pusher.connection.bind('disconnected', () => {
        console.log('Pusher disconnected');
      });

    } catch (error) {
      console.error('Error initializing Pusher:', error);
    }
  }

  // Subscribe to real-time notifications
  onNotification(callback: (notification: RealTimeNotification) => void) {
    this.callbacks.push(callback);
    return () => {
      this.callbacks = this.callbacks.filter(cb => cb !== callback);
    };
  }

  // Disconnect Pusher
  disconnect() {
    try {
      if (this.channel) {
        this.channel.unbind_all();
        this.pusher?.unsubscribe(this.channel.name);
      }
      this.pusher?.disconnect();
      this.pusher = null;
      this.channel = null;
      this.callbacks = [];
    } catch (error) {
      console.error('Error disconnecting Pusher:', error);
    }
  }

  // HTTP API methods
  async getNotifications(unreadOnly?: boolean): Promise<NotificationResponse> {
    const params = unreadOnly ? { unread_only: true } : {};
    const response = await AppAxios.get('/notifications', { params });
    return response.data;
  }

  async markAsRead(notificationId: number): Promise<void> {
    await AppAxios.post(`/notifications/${notificationId}/mark-read`);
  }

  async markAllAsRead(): Promise<void> {
    await AppAxios.post('/notifications/mark-all-read');
  }

  async getNotification(notificationId: number): Promise<Notification> {
    const response = await AppAxios.get(`/notifications/${notificationId}`);
    return response.data;
  }

  async deleteNotification(notificationId: number): Promise<void> {
    await AppAxios.delete(`/notifications/${notificationId}`);
  }

  // Test notification (for development)
  async testNotification(message?: string): Promise<void> {
    await AppAxios.post('/test-notification', { message });
  }
}

export const notificationService = new NotificationService();