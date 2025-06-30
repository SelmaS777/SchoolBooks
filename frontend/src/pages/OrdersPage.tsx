import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { 
  fetchOrders, 
  acceptOrder, 
  rejectOrder, 
  shipOrder, 
  completeOrder,
  clearError
} from '../store/ordersSlice';
import { 
  Container, Typography, Box, Button, Paper, Grid, Divider, 
  useTheme, useMediaQuery, CircularProgress, Chip, Avatar,
  Card, CardContent, CardMedia, Tab, Tabs, Alert, Snackbar,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { format } from 'date-fns';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`orders-tabpanel-${index}`}
      aria-labelledby={`orders-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const OrdersPage = () => {
  const { items, loading, error, actionLoading } = useSelector((state: RootState) => state.orders);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [tabValue, setTabValue] = useState(0);
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: string;
    orderId: number | null;
    title: string;
    message: string;
  }>({
    open: false,
    action: '',
    orderId: null,
    title: '',
    message: ''
  });

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm');
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'info';
      case 'rejected': return 'error';
      case 'completed': return 'success';
      case 'cancelled': return 'default';
      default: return 'default';
    }
  };

  const getTrackingStatusText = (status: string) => {
    switch (status) {
      case 'order_placed': return 'Order Placed';
      case 'preparing': return 'Preparing';
      case 'shipped': return 'Shipped';
      case 'in_transit': return 'In Transit';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const getTrackingStatusColor = (status: string) => {
    switch (status) {
      case 'order_placed': return 'default';
      case 'preparing': return 'warning';
      case 'shipped': return 'info';
      case 'in_transit': return 'primary';
      case 'delivered': return 'success';
      default: return 'default';
    }
  };

  const handleConfirmAction = (action: string, orderId: number, title: string, message: string) => {
    setConfirmDialog({
      open: true,
      action,
      orderId,
      title,
      message
    });
  };

  const executeAction = () => {
    const { action, orderId } = confirmDialog;
    if (!orderId) return;

    switch (action) {
      case 'accept':
        dispatch(acceptOrder(orderId));
        break;
      case 'reject':
        dispatch(rejectOrder(orderId));
        break;
      case 'ship':
        dispatch(shipOrder(orderId));
        break;
      case 'complete':
        dispatch(completeOrder(orderId));
        break;
    }
    setConfirmDialog({ open: false, action: '', orderId: null, title: '', message: '' });
  };

  const buyingOrders = items.filter(order => order.buyer_id === userInfo?.id);
  const sellingOrders = items.filter(order => order.seller_id === userInfo?.id);

  const renderOrderActions = (order: any) => {
    const isSeller = order.seller_id === userInfo?.id;
    const isBuyer = order.buyer_id === userInfo?.id;
    const isActionLoading = actionLoading[order.id];

    return (
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {/* Seller Actions */}
        {isSeller && order.order_status === 'pending' && (
          <>
            <Button
              size="small"
              variant="contained"
              color="success"
              startIcon={<CheckCircleIcon />}
              disabled={isActionLoading}
              onClick={() => handleConfirmAction(
                'accept', 
                order.id, 
                'Accept Order', 
                'Are you sure you want to accept this order?'
              )}
            >
              Accept
            </Button>
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              disabled={isActionLoading}
              onClick={() => handleConfirmAction(
                'reject', 
                order.id, 
                'Reject Order', 
                'Are you sure you want to reject this order?'
              )}
            >
              Reject
            </Button>
          </>
        )}
        
        {isSeller && order.order_status === 'accepted' && order.tracking_status === 'preparing' && (
          <Button
            size="small"
            variant="contained"
            color="primary"
            startIcon={<LocalShippingIcon />}
            disabled={isActionLoading}
            onClick={() => handleConfirmAction(
              'ship', 
              order.id, 
              'Ship Order', 
              'Mark this order as shipped?'
            )}
          >
            Ship Order
          </Button>
        )}
        
        {/* Buyer Actions */}
        {isBuyer && order.order_status === 'accepted' && 
         (order.tracking_status === 'shipped' || order.tracking_status === 'in_transit') && (
          <Button
            size="small"
            variant="contained"
            color="success"
            startIcon={<ReceiptIcon />}
            disabled={isActionLoading}
            onClick={() => handleConfirmAction(
              'complete', 
              order.id, 
              'Complete Order', 
              'Confirm that you have received this order?'
            )}
          >
            Confirm Receipt
          </Button>
        )}
        
        {isActionLoading && (
          <CircularProgress size={24} />
        )}
      </Box>
    );
  };

  const renderOrderCard = (order: any) => (
    <Card key={order.id} sx={{ mb: 2, borderRadius: 2 }}>
      <CardContent>
        <Grid container spacing={2} alignItems="center">
          {/* Product Image */}
          <Grid item xs={12} sm={3} md={2}>
            <CardMedia
              component="img"
              sx={{ 
                width: '100%', 
                height: 120, 
                objectFit: 'cover', 
                borderRadius: 1 
              }}
              image={order.product.image_url}
              alt={order.product.name}
            />
          </Grid>
          
          {/* Order Details */}
          <Grid item xs={12} sm={9} md={6}>
            <Typography variant="h6" gutterBottom>
              {order.product.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              by {order.product.author}
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              ${order.total_amount}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip 
                label={order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)} 
                color={getStatusColor(order.order_status) as any}
                size="small"
              />
              <Chip 
                label={getTrackingStatusText(order.tracking_status)} 
                color={getTrackingStatusColor(order.tracking_status) as any}
                variant="outlined"
                size="small"
              />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Order placed: {formatDate(order.created_at)}
            </Typography>
            {order.accepted_at && (
              <Typography variant="body2" color="text.secondary">
                Accepted: {formatDate(order.accepted_at)}
              </Typography>
            )}
            {order.shipped_at && (
              <Typography variant="body2" color="text.secondary">
                Shipped: {formatDate(order.shipped_at)}
              </Typography>
            )}
            {order.delivered_at && (
              <Typography variant="body2" color="text.secondary">
                Delivered: {formatDate(order.delivered_at)}
              </Typography>
            )}
          </Grid>
          
          {/* User Info & Actions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                {order.seller_id === userInfo?.id ? 'Buyer' : 'Seller'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar 
                  src={order.seller_id === userInfo?.id ? order.buyer.image_url : order.seller.image_url}
                  sx={{ width: 32, height: 32 }}
                />
                <Typography variant="body2">
                  {order.seller_id === userInfo?.id ? order.buyer.full_name : order.seller.full_name}
                </Typography>
              </Box>
            </Box>
            
            {renderOrderActions(order)}
          </Grid>
        </Grid>
        
        {order.notes && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Notes:</strong> {order.notes}
            </Typography>
          </Box>
        )}
        
        {order.shipping_address && (
          <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary">
              <strong>Shipping Address:</strong> {order.shipping_address}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  if (loading && items.length === 0) {
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
        {/* Header */}
        <Typography 
          variant="h3" 
          component="h1" 
          fontWeight="bold" 
          sx={{ color: 'white', mb: 2 }}
        >
          My Orders
        </Typography>
        
        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.2)', 
          mb: 3 
        }} />

        {/* Tabs */}
        <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            sx={{ backgroundColor: 'white' }}
          >
            <Tab label={`Buying (${buyingOrders.length})`} />
            <Tab label={`Selling (${sellingOrders.length})`} />
          </Tabs>

          {/* Buying Orders Tab */}
          <TabPanel value={tabValue} index={0}>
            {buyingOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>No purchase orders</Typography>
                <Typography variant="body1" color="text.secondary">
                  Orders you make will appear here.
                </Typography>
              </Box>
            ) : (
              buyingOrders.map(renderOrderCard)
            )}
          </TabPanel>

          {/* Selling Orders Tab */}
          <TabPanel value={tabValue} index={1}>
            {sellingOrders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" gutterBottom>No sales orders</Typography>
                <Typography variant="body1" color="text.secondary">
                  Orders for your books will appear here.
                </Typography>
              </Box>
            ) : (
              sellingOrders.map(renderOrderCard)
            )}
          </TabPanel>
        </Paper>
      </Container>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
      >
        <DialogTitle>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {confirmDialog.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}>
            Cancel
          </Button>
          <Button onClick={executeAction} variant="contained" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => dispatch(clearError())}
      >
        <Alert severity="error" onClose={() => dispatch(clearError())}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersPage;