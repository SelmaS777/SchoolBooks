import React, { useState, useEffect } from 'react';
import { 
  Typography, Box, Container, Paper, Button, 
  Avatar, Divider, useTheme, Grid,
  Card, CardContent
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const PurchaseConfirmationPage = () => {
    const theme = useTheme();
    const location = useLocation();
    const [orderNumber, setOrderNumber] = useState("");
    
    // Get data from location state
    const orderItems = location.state?.orderItems || [];
    const totalAmount = location.state?.totalAmount || 0;
    
    useEffect(() => {
        // Generate a random order number
        const randomOrderNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        setOrderNumber(randomOrderNum);
        
        // Trigger confetti effect immediately
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    }, []);

       return (
        <Box sx={{ 
            background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
            minHeight: '100vh',
            py: 6
        }}>
            <Container maxWidth="md">
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        borderRadius: 3,
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    {/* Success banner */}
                    <Box 
                        sx={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            height: '8px', 
                            bgcolor: theme.palette.success.main,
                            boxShadow: `0 0 10px ${theme.palette.success.main}`
                        }} 
                    />
                    
                    <Avatar 
                        sx={{ 
                            bgcolor: theme.palette.success.main, 
                            width: 80, 
                            height: 80, 
                            mx: 'auto',
                            boxShadow: 3,
                            mb: 2
                        }}
                    >
                        <CheckCircleIcon sx={{ fontSize: 50 }} />
                    </Avatar>
                    
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        fontWeight="bold" 
                        gutterBottom
                        sx={{ 
                            color: theme.palette.success.main,
                            mb: 2
                        }}
                    >
                        Thank You for Your Purchase!
                    </Typography>
                    
                    <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                        Your order has been confirmed and will be shipped shortly.
                    </Typography>
                    
                    <Card 
                        variant="outlined"
                        sx={{ 
                            maxWidth: 400, 
                            mx: 'auto', 
                            mb: 4,
                            borderRadius: 2,
                            bgcolor: 'rgba(0,0,0,0.02)'
                        }}
                    >
                        <CardContent sx={{ py: 3 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Order #: {orderNumber}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {new Date().toLocaleDateString('en-US', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </Typography>
                            {totalAmount > 0 && (
                                <Typography variant="h6" fontWeight="bold" color="primary">
                                    Total: {totalAmount.toFixed(2)} BAM
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                    
                    <Divider sx={{ my: 3 }} />
                    
                    <Grid container spacing={3} sx={{ mb: 4, textAlign: 'left' }}>
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>
                                    <LocalShippingIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Shipping Details
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        You will receive a shipping confirmation email once your items have shipped.
                                        Expected delivery: 3 business days.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                                <Avatar sx={{ bgcolor: 'secondary.light', mr: 2 }}>
                                    <ReceiptIcon />
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        Receipt
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        A detailed receipt has been sent to your email address.
                                        You can also access it from your orders page.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            startIcon={<HomeIcon />}
                            component={RouterLink}
                            to="/"
                            sx={{ 
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                                fontWeight: 'bold',
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 3
                                }
                            }}
                        >
                            Continue Shopping
                        </Button>
                        
                        <Button 
                            variant="outlined" 
                            startIcon={<ShoppingBagIcon />}
                            component={RouterLink}
                            to="/orders"
                            sx={{ 
                                borderRadius: 2,
                                px: 3,
                                py: 1.2,
                                fontWeight: 'bold',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: 1
                                }
                            }}
                        >
                            View My Orders
                        </Button>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
                        Questions? Contact our <b>customer support</b> at support@schoolbooks.com
                    </Typography>
                </Paper>
            </Container>
        </Box>
    );
}

export default PurchaseConfirmationPage;