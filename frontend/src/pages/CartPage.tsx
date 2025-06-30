import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCart, removeFromCart, clearCart } from '../store/cartSlice';
import { addToWishlist } from '../store/wishlistSlice';
import { 
  Container, Typography, Box, Button, IconButton, Paper, Grid, Divider, 
  Select, MenuItem, FormControl, useTheme, useMediaQuery, 
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const CartPage = () => {
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for seller filter
  const [sellerFilter, setSellerFilter] = useState('');

  // Fetch cart on component mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress sx={{ color: 'white' }} size={60} />
      </Box>
    );
  }

  // Get unique sellers
  const sellers = [...new Set(items.map(item => 
    item.product.seller?.full_name || 'Unknown'
  ))];

  // Filter items by seller if a filter is selected
  const filteredItems = sellerFilter 
    ? items.filter(item => item.product.seller?.full_name === sellerFilter)
    : items;

  const handleSellerFilterChange = (event: SelectChangeEvent) => {
    setSellerFilter(event.target.value);
  };

  const calculateSubtotal = () => {
    return filteredItems.reduce((total, item) => 
      total + Number(item.product.price) * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = 0; // No tax in this example
  const total = subtotal + tax;

  const handleCheckout = () => {
    // Convert cart items to the format expected by PayPage
    const checkoutItems = filteredItems.map(item => ({
      product_id: item.product_id,
      product: item.product,
      quantity: item.quantity
    }));

    navigate('/paypage', { 
      state: { 
        items: checkoutItems,
        isSingleItem: false
      }
    });
  };

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromCart(productId));
  };

  const handleAddToWishlist = (item: any) => {
    dispatch(addToWishlist(item.product));
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header with title and filter */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            sx={{ color: 'white' }}
          >
            Your Cart
          </Typography>
          
          {/* Seller Filter moved here */}
          <FormControl 
            variant="outlined" 
            sx={{ 
              minWidth: 180, 
              bgcolor: 'rgba(255, 255, 255, 0.1)', 
              borderRadius: 1,
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              }
            }}
          >
            <Select
              value={sellerFilter}
              onChange={handleSellerFilterChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Filter by seller' }}
              IconComponent={ExpandMoreIcon}
              sx={{ 
                color: 'white',
                '& .MuiSelect-icon': {
                  color: 'white',
                }
              }}
            >
              <MenuItem value="">
                <em>Seller names</em>
              </MenuItem>
              {sellers.map((seller) => (
                <MenuItem key={seller} value={seller}>
                  {seller}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Divider line after header and filter */}
        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.2)', 
          mb: 3 
        }} />

        {filteredItems.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Your cart is empty</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven't added any books to your cart yet.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ 
                px: 3, 
                py: 1.2, 
                borderRadius: 2,
                backgroundColor: '#F15A24',
                '&:hover': {
                  backgroundColor: '#E04613',
                }
              }}
            >
              Browse Books
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              {/* Cart Items List */}

              {filteredItems.map((item) => (
                <Paper 
                  key={item.product_id} 
                  elevation={0} 
                  sx={{ 
                    mb: 2, 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: 'white'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Book Image */}
                    <Grid item xs={3} md={2}>
                      <Box 
                        sx={{ 
                          width: '100%', 
                          height: '120px', 
                          border: '1px solid #eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {item.product.image_url ? (
                          <Box 
                            component="img" 
                            src={item.product.image_url} 
                            alt={item.product.name} 
                            sx={{ maxWidth: '100%', maxHeight: '100%' }} 
                          />
                        ) : (
                          <Box 
                            component="div" 
                            sx={{ 
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '3rem',
                              fontWeight: 'bold',
                              color: '#ccc'
                            }}
                          >
                            +
                          </Box>
                        )}
                      </Box>
                    </Grid>
                    
                    {/* Book Details */}
                    <Grid item xs={6} md={4}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' }
                        }}
                        onClick={() => navigate(`/product/${item.product_id}`)}
                      >
                        {item.product.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.product.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        {item.product.state?.name || "Unknown Condition"}
                      </Typography>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold" 
                        sx={{ mt: 1, color: '#F15A24' }}
                      >
                        {`${Number(item.product.price).toFixed(2)} BAM`}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Quantity: {item.quantity}
                      </Typography>
                    </Grid>

                    {/* Seller Name */}
                    <Grid item xs={3} md={3}>
                      <Typography 
                        variant="body1"
                        fontWeight="bold" 
                        sx={{ mt: 1, color: '#F15A24' }}
                      >
                        {item.product.seller?.full_name || "Unknown"}
                      </Typography>
                    </Grid>
                    
                    {/* Action Buttons */}
                    <Grid item xs={3} md={3} sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton 
                          onClick={() => handleAddToWishlist(item)}
                          sx={{ 
                            p: 1,
                            color: '#F15A24'
                          }}
                        >
                          <Box 
                            component="img" 
                            src="wishlist_button.png" 
                            alt="Add to Wishlist" 
                            sx={{ width: 24, height: 24 }}
                          />
                        </IconButton>
                        <IconButton 
                          onClick={() => handleRemoveItem(item.product_id)}
                          sx={{ 
                            p: 1,
                            color: '#F15A24'
                          }}
                        >
                          <Box 
                            component="img" 
                            src="remove_item.png" 
                            alt="Remove Item" 
                            sx={{ width: 24, height: 24 }}
                          />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}

            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 2,
                  height: 'fit-content'
                }}
              >
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                  Order Summary
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 3,
                  mb: 2
                }}>
                  <Typography variant="h6" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {`${subtotal.toFixed(2)} BAM`}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 2
                }}>
                  <Typography variant="h6" color="text.secondary">Tax:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {`${tax.toFixed(2)} BAM`}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mb: 4
                }}>
                  <Typography variant="h6" color="text.secondary">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {`${total.toFixed(2)} BAM`}
                  </Typography>
                </Box>
                
                <Button 
                  variant="contained" 
                  fullWidth 
                  size="large" 
                  onClick={handleCheckout}
                  sx={{ 
                    py: 2,
                    backgroundColor: '#F15A24',
                    color: 'white',
                    borderRadius: 1,
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: '#E04613',
                    }
                  }}
                >
                  Proceed to Payment
                </Button>
                
                <Box sx={{ mt: 3 }}>
                  <Typography 
                    variant="body1" 
                    component="div" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      mb: 1
                    }}
                  >
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Suggestion: buy as many books from the same seller.
                  </Typography>
                  <Typography 
                    variant="body1" 
                    component="div" 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start'
                    }}
                  >
                    <Box component="span" sx={{ mr: 1 }}>•</Box>
                    Keep in mind that you have to pay shipping price for every distinct seller you ordered the book from.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default CartPage;