import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Button,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert,
  Container
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  ShoppingCart as ShoppingCartIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification
} from '../store/notificationSlice';
import { formatDistanceToNow } from 'date-fns';

const NotificationScreen: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications, unreadCount, loading, error } = useSelector(
    (state: RootState) => state.notificationSlice
  );
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    dispatch(fetchNotifications() as any);
  }, [dispatch]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_confirmed':
      case 'order_delivered':
        return <CheckCircleIcon sx={{ color: '#4caf50' }} />;
      case 'order_cancelled':
      case 'order_delayed':
        return <ErrorIcon sx={{ color: '#f44336' }} />;
      case 'warning':
        return <WarningIcon sx={{ color: '#ff9800' }} />;
      case 'order_update':
        return <ShoppingCartIcon sx={{ color: '#2196f3' }} />;
      default:
        return <InfoIcon sx={{ color: '#2196f3' }} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_confirmed':
      case 'order_delivered':
        return '#e8f5e8';
      case 'order_cancelled':
      case 'order_delayed':
        return '#ffebee';
      case 'warning':
        return '#fff3e0';
      default:
        return '#e3f2fd';
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    dispatch(markNotificationAsRead(notificationId) as any);
  };

  const handleMarkAllAsRead = async () => {
    dispatch(markAllNotificationsAsRead() as any);
  };

  const handleDeleteNotification = async (notificationId: number) => {
    dispatch(deleteNotification(notificationId) as any);
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
          Notifications
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant={filter === 'all' ? 'contained' : 'outlined'}
              onClick={() => setFilter('all')}
              sx={{ 
                backgroundColor: filter === 'all' ? 'white' : 'transparent',
                borderColor: 'white',
                color: filter === 'all' ? '#F15A24' : 'white',
                '&:hover': {
                  backgroundColor: filter === 'all' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white'
                }
              }}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'contained' : 'outlined'}
              onClick={() => setFilter('unread')}
              sx={{ 
                backgroundColor: filter === 'unread' ? 'white' : 'transparent',
                borderColor: 'white',
                color: filter === 'unread' ? '#F15A24' : 'white',
                '&:hover': {
                  backgroundColor: filter === 'unread' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'white'
                }
              }}
            >
              Unread ({unreadCount})
            </Button>
          </Box>

          {unreadCount > 0 && (
            <Button
              variant="contained"
              onClick={handleMarkAllAsRead}
              sx={{ 
                backgroundColor: 'white', 
                color: '#F15A24',
                '&:hover': { 
                  backgroundColor: 'rgba(255, 255, 255, 0.9)' 
                } 
              }}
            >
              Mark All Read
            </Button>
          )}
        </Box>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h6" color="textSecondary">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </Typography>
          </Paper>
        ) : (
          <List sx={{ width: '100%' }}>
            {filteredNotifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <Paper
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    backgroundColor: notification.is_read ? 'white' : getNotificationColor(notification.notification_type),
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <ListItem>
                    <ListItemIcon>
                      {getNotificationIcon(notification.notification_type)}
                    </ListItemIcon>
                    
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ flexGrow: 1 }}>
                            {notification.message}
                          </Typography>
                          {!notification.is_read && (
                            <Chip 
                              label="New" 
                              size="small" 
                              sx={{ 
                                backgroundColor: '#F15A24', 
                                color: 'white',
                                height: 20,
                                fontSize: '0.75rem'
                              }} 
                            />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                          <Typography variant="caption" color="textSecondary">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </Typography>
                          {notification.order && notification.order.product && (
                            <Typography variant="caption" color="textSecondary">
                              Order: {notification.order.product.name}
                            </Typography>
                          )}
                        </Box>
                      }
                    />

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {!notification.is_read && (
                        <IconButton
                          size="small"
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                          sx={{ color: '#F15A24' }}
                        >
                          <CheckCircleIcon fontSize="small" />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteNotification(notification.id)}
                        title="Delete notification"
                        sx={{ color: '#f44336' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </ListItem>
                </Paper>
                {index < filteredNotifications.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
};

export default NotificationScreen;