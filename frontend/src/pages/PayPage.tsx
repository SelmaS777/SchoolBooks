import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { createOrder } from '../store/ordersSlice';
import { clearCart } from '../store/cartSlice';
import { fetchCities } from '../store/productSlice'; 
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Alert,
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';

interface CheckoutItem {
  product_id: number;
  product: {
    id: number;
    name: string;
    author: string;
    price: string;
    image_url: string;
    seller_id: number;
  };
  quantity: number;
}

interface ShippingDetails {
  fullName: string;
  city: string;
  postalCode: string;
  address: string;
}

interface CardDetails {
  nameOnCard: string;
  cardNumber: string;
  ccv: string;
  expiryMonth: string;
  expiryYear: string;
}

const PayPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { loading: orderLoading } = useSelector((state: RootState) => state.orders);
  
  // Get checkout items from location state or redirect if none
  const checkoutItems: CheckoutItem[] = location.state?.items || [];
  const isSingleItem = location.state?.isSingleItem || false;
  
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    city: '',
    postalCode: '',
    address: ''
  });
  
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    nameOnCard: '',
    cardNumber: '',
    ccv: '',
    expiryMonth: '',
    expiryYear: ''
  });

  const {
    cities,
    loading: citiesLoading,
    error: citiesError
  } = useSelector((state: RootState) => state.cities);

  useEffect(() => {
    dispatch(fetchCities());
  }, [dispatch]);
  
  const [saveCard, setSaveCard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect if no items to checkout
  useEffect(() => {
    if (checkoutItems.length === 0) {
      navigate('/cart');
    }
  }, [checkoutItems, navigate]);

  // Calculate totals
  const calculateSubtotal = () => {
    return checkoutItems.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);
  };

  const calculateTax = () => {
    return 0; // Set to 0 as shown in the image
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  // Group items by seller
  const groupBySeller = () => {
    const grouped: { [sellerId: number]: CheckoutItem[] } = {};
    checkoutItems.forEach(item => {
      if (!grouped[item.product.seller_id]) {
        grouped[item.product.seller_id] = [];
      }
      grouped[item.product.seller_id].push(item);
    });
    return grouped;
  };

  const sellerGroups = groupBySeller();
  const totalSellers = Object.keys(sellerGroups).length;
  const shippingPrice = 0; // Set to 0 as shown in the image

  const handleInputChange = (
    section: 'shipping' | 'card',
    field: string,
    value: string
  ) => {
    if (section === 'shipping') {
      setShippingDetails(prev => ({ ...prev, [field]: value }));
    } else {
      setCardDetails(prev => ({ ...prev, [field]: value }));
    }
  };

  const validateForm = () => {
    // Validate shipping details
    if (!shippingDetails.fullName || !shippingDetails.address) {
      setError('Please fill in all required shipping details');
      return false;
    }

    // Validate card details
    if (!cardDetails.nameOnCard || !cardDetails.cardNumber || 
        !cardDetails.ccv || !cardDetails.expiryMonth || !cardDetails.expiryYear) {
      setError('Please fill in all card details');
      return false;
    }

    // Basic card number validation (remove spaces and check length)
    const cleanCardNumber = cardDetails.cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13 || cleanCardNumber.length > 19) {
      setError('Please enter a valid card number');
      return false;
    }

    // CCV validation
    if (cardDetails.ccv.length < 3 || cardDetails.ccv.length > 4) {
      setError('Please enter a valid CCV');
      return false;
    }

    return true;
  };

  const handleCompletePayment = async () => {
    setError(null);
    
    if (!validateForm()) {
      return;
    }

    try {
      const orderPromises = checkoutItems.map(item => {
        const orderParams = {
          product_id: item.product_id,
          shipping_address: `${shippingDetails.fullName}, ${shippingDetails.address}, ${shippingDetails.city} ${shippingDetails.postalCode}`,
          payment_method: 'credit_card',
          card_number: cardDetails.cardNumber.replace(/\s/g, ''),
          expiry_month: cardDetails.expiryMonth,
          expiry_year: cardDetails.expiryYear.length === 2 ? `20${cardDetails.expiryYear}` : cardDetails.expiryYear, // Convert 2-digit to 4-digit year
          cvv: cardDetails.ccv,
          cardholder_name: cardDetails.nameOnCard,
          save_card: saveCard
        };
        
        return dispatch(createOrder(orderParams)).unwrap();
      });

      await Promise.all(orderPromises);
      
      // Clear cart if this was a cart checkout (not single item)
      if (!isSingleItem) {
        await dispatch(clearCart()).unwrap();
      }
      
      // Navigate to orders page or success page
      navigate('/purchase-confirmation', { 
        state: { 
          message: 'Orders created successfully! Your orders are being processed.',
          orderItems: checkoutItems,
          totalAmount: calculateTotal()
        } 
      });
    } catch (err: any) {
      setError(err || 'Failed to create orders');
    }
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  if (checkoutItems.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Left side - Payment Summary */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ 
              p: 4, 
              borderRadius: 2, 
              backgroundColor: 'transparent',
              boxShadow: 'none',
              color: 'white' }}>
              <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: 'white' }}>
                Payment Summary
              </Typography>
              
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', my: 3 }} />
              
              {/* Shipping Details */}
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Shipping Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Name & Surname"
                  value={shippingDetails.fullName}
                  onChange={(e) => handleInputChange('shipping', 'fullName', e.target.value)}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(139, 52, 21, 0.8)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>City</InputLabel>
                      <Select
                        value={shippingDetails.city}
                        onChange={(e) => handleInputChange('shipping', 'city', e.target.value)}
                        sx={{
                          backgroundColor: 'rgba(139, 52, 21, 0.8)',
                          color: 'white',
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.3)'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'rgba(255, 255, 255, 0.5)'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: 'white'
                          }
                        }}
                        MenuProps={{
                          PaperProps: {
                            style: {
                              backgroundColor: 'rgba(139, 52, 21, 0.95)',
                            },
                          },
                          MenuListProps: {
                            sx: {
                              '& .MuiMenuItem-root': {
                                color: 'white',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                },
                              }
                            }
                          }
                        }}
                      >
                        <MenuItem value="">Select City</MenuItem>
                        {/* Map over cities from the API - same as MainPage */}
                        {Object.entries(cities).map(([id, name]) => (
                          <MenuItem key={id} value={name}>
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Postal Code"
                      value={shippingDetails.postalCode}
                      onChange={(e) => handleInputChange('shipping', 'postalCode', e.target.value)}
                      placeholder="- - - - -"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(139, 52, 21, 0.8)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                </Grid>
                
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={3}
                  value={shippingDetails.address}
                  onChange={(e) => handleInputChange('shipping', 'address', e.target.value)}
                  sx={{ 
                    mt: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(139, 52, 21, 0.8)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
              </Box>
              
              <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.3)', my: 3 }} />
              
              {/* Card Details */}
              <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                Card Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  label="Name on Card"
                  value={cardDetails.nameOnCard}
                  onChange={(e) => handleInputChange('card', 'nameOnCard', e.target.value)}
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(139, 52, 21, 0.8)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Card Number"
                  value={cardDetails.cardNumber}
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value);
                    if (formatted.replace(/\s/g, '').length <= 19) {
                      handleInputChange('card', 'cardNumber', formatted);
                    }
                  }}
                  placeholder="1 2 3 4 - - - - - - - - - - - -"
                  sx={{ 
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'rgba(139, 52, 21, 0.8)',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                      '&.Mui-focused fieldset': { borderColor: 'white' },
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                    '& .MuiOutlinedInput-input': { color: 'white' }
                  }}
                />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CCV"
                      value={cardDetails.ccv}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 4) {
                          handleInputChange('card', 'ccv', value);
                        }
                      }}
                      placeholder="- - -"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(139, 52, 21, 0.8)',
                          '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                          '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                          '&.Mui-focused fieldset': { borderColor: 'white' },
                        },
                        '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
                        '& .MuiOutlinedInput-input': { color: 'white' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container spacing={1}>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>MM</InputLabel>
                          <Select
                            value={cardDetails.expiryMonth}
                            onChange={(e) => handleInputChange('card', 'expiryMonth', e.target.value)}
                            sx={{
                              backgroundColor: 'rgba(139, 52, 21, 0.8)',
                              color: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.5)'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white'
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  backgroundColor: 'rgba(139, 52, 21, 0.95)',
                                },
                              },
                              MenuListProps: {
                                sx: {
                                  '& .MuiMenuItem-root': {
                                    color: 'white',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                  }
                                }
                              }
                            }}
                          >
                            {Array.from({ length: 12 }, (_, i) => (
                              <MenuItem key={i + 1} value={String(i + 1).padStart(2, '0')}>
                                {String(i + 1).padStart(2, '0')}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>YY</InputLabel>
                          <Select
                            value={cardDetails.expiryYear}
                            onChange={(e) => handleInputChange('card', 'expiryYear', e.target.value)}
                            sx={{
                              backgroundColor: 'rgba(139, 52, 21, 0.8)',
                              color: 'white',
                              '& .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.3)'
                              },
                              '&:hover .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'rgba(255, 255, 255, 0.5)'
                              },
                              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                borderColor: 'white'
                              }
                            }}
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  backgroundColor: 'rgba(139, 52, 21, 0.95)',
                                },
                              },
                              MenuListProps: {
                                sx: {
                                  '& .MuiMenuItem-root': {
                                    color: 'white',
                                    '&:hover': {
                                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                  }
                                }
                              }
                            }}
                          >
                            {Array.from({ length: 10 }, (_, i) => {
                              const year = new Date().getFullYear() + i;
                              return (
                                <MenuItem key={year} value={String(year).slice(-2)}>
                                  {String(year).slice(-2)}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      sx={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        '&.Mui-checked': {
                          color: 'white',
                        },
                      }}
                    />
                  }
                  label="Save card for future purchases"
                  sx={{
                    mt: 2,
                    color: 'rgba(255, 255, 255, 0.7)',
                    '& .MuiFormControlLabel-label': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    }
                  }}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Right side - Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Order Summary
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Delivery is expected within 3 days
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="#F15A24">Subtotal:</Typography>
                  <Typography color="#F15A24" fontWeight="bold">
                    {calculateSubtotal().toFixed(2)} BAM
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="#F15A24">Tax:</Typography>
                  <Typography color="#F15A24" fontWeight="bold">
                    {calculateTax().toFixed(2)} BAM
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography fontWeight="bold">Total:</Typography>
                  <Typography fontWeight="bold">
                    {calculateTotal().toFixed(2)} BAM
                  </Typography>
                </Box>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="#F15A24">Total sellers:</Typography>
                  <Typography>{totalSellers}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="#F15A24">Shipment Price:</Typography>
                  <Typography color="#F15A24" fontWeight="bold">
                    {shippingPrice.toFixed(2)} BAM
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography fontWeight="bold">Total:</Typography>
                  <Typography fontWeight="bold">
                    {(calculateTotal() + shippingPrice).toFixed(2)} BAM
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ my: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  • Suggestion: buy as many books from the same seller.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  • Keep in mind that you have to pay shipping price for every distinct seller you ordered the book from.
                </Typography>
              </Box>
              
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              
              <Button
                fullWidth
                variant="contained"
                onClick={handleCompletePayment}
                disabled={orderLoading}
                sx={{
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#F15A24',
                  '&:hover': {
                    backgroundColor: '#E04613',
                  },
                  '&:disabled': {
                    backgroundColor: 'rgba(241, 90, 36, 0.5)',
                  }
                }}
              >
                {orderLoading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Complete Payment'
                )}
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default PayPage;