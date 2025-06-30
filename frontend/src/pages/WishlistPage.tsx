import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchWishlist, removeFromWishlist } from '../store/wishlistSlice';
import { addToCart } from '../store/cartSlice';
import { 
  Container, Typography, Box, Button, IconButton, Paper, Grid, Divider, 
  useTheme, useMediaQuery, CircularProgress, FormControl, Select, MenuItem, SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const WishlistPage = () => {
  const { items, loading } = useSelector((state: RootState) => state.wishlist);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State for seller filter
  const [sellerFilter, setSellerFilter] = useState('');

  // Fetch wishlist on component mount
  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

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

  const handleRemoveItem = (productId: number) => {
    dispatch(removeFromWishlist(productId));
  };

  const handleAddToCart = (productId: number) => {
    dispatch(addToCart(productId));
  };

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
            Your Wishlist
          </Typography>
          
          {/* Seller Filter */}
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

        {/* Divider line after header */}
        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.2)', 
          mb: 3 
        }} />

        {filteredItems.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>Your wishlist is empty</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Books you save to your wishlist will appear here.
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
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
      
      {/* Book Details - Reduced width to make room for seller name */}
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
      </Grid>

      {/* Seller Name - Added */}
      <Grid item xs={3} md={3}>
        <Typography 
          variant="body1"
          sx={{ fontWeight: 'bold',color: '#F15A24' }}
        >
          {item.product.seller?.full_name || "Unknown"}
        </Typography>
      </Grid>
      
      {/* Action Buttons */}
      <Grid item xs={3} md={3} sx={{ textAlign: 'right' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button 
            variant="contained"
            startIcon={<ShoppingCartIcon />}
            onClick={() => handleAddToCart(item.product_id)}
            sx={{ 
              backgroundColor: '#F15A24',
              '&:hover': {
                backgroundColor: '#E04613',
              }
            }}
          >
            Add to Cart
          </Button>
          <IconButton 
            onClick={() => handleRemoveItem(item.product_id)}
            sx={{ 
              p: 1,
              color: '#F15A24'
            }}
          >
            <DeleteOutlineIcon />
          </IconButton>
        </Box>
      </Grid>
    </Grid>
  </Paper>
))}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default WishlistPage;