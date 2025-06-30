import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../store/cartSlice';
import { fetchProductById, fetchCategories, clearCurrentProduct } from '../../store/productSlice';
import { RootState, AppDispatch } from '../../store';
import { 
  Container, Box, Grid, Typography, Button, IconButton, Divider,
  Paper, Chip, Card, CardContent, Rating, Skeleton, CircularProgress,
  Alert, Snackbar, useTheme, useMediaQuery, Breadcrumbs, Link, Avatar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import HomeIcon from '@mui/icons-material/Home';
import CategoryIcon from '@mui/icons-material/Category';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { currentProduct, loading, error } = useSelector((state: RootState) => state.products);
  const { categories } = useSelector((state: RootState) => state.categories);
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const [addedToCart, setAddedToCart] = useState(false);

  const [isNavigating, setIsNavigating] = useState(false);

  const isCurrentUserSeller = userInfo && currentProduct && userInfo.id === currentProduct.seller_id;

  useEffect(() => {
    if (id) {
      setIsNavigating(true);
      dispatch(clearCurrentProduct());
      dispatch(fetchProductById(id))
        .finally(() => {
          setIsNavigating(false);
        });
      dispatch(fetchCategories());
    }
    window.scrollTo(0, 0);
  }, [dispatch, id]);

  // Get category name
  const getCategoryName = (categoryId) => {
    // First check if the product has a nested category object
    if (currentProduct?.category) {
      return currentProduct.category.name;
    }
    
    // Otherwise look it up from the categories list
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  const handleAddToCart = () => {
  if (currentProduct) {
    dispatch(addToCart(currentProduct.id));
    setAddedToCart(true);
  }
};

const handleBuyNow = () => {
  if (currentProduct) {
    // Create the checkout item format expected by PayPage
    const checkoutItem = {
      product_id: currentProduct.id,
      product: {
        id: currentProduct.id,
        name: currentProduct.name,
        author: currentProduct.author,
        price: currentProduct.price.toString(),
        image_url: currentProduct.image_url,
        seller_id: currentProduct.seller_id
      },
      quantity: 1 
    };

    navigate('/paypage', { 
      state: { 
        items: [checkoutItem],
        isSingleItem: true
      }
    });
  }
};
  const handleCloseSnackbar = () => {
    setAddedToCart(false);
  };

  if (loading || isNavigating) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2
      }}>
        <CircularProgress sx={{ color: 'white' }} />
        <Typography color="white" variant="body1">
          Loading product details...
        </Typography>
        <Typography color="white" variant="caption">
          This may take a moment on first load
        </Typography>
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  if (!currentProduct) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>Product Not Found</Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            The product you're looking for doesn't exist or has been removed.
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<ArrowBackIcon />} 
            onClick={() => navigate('/')}
          >
            Browse Other Products
          </Button>
        </Paper>
      </Container>
    );
  }

  // Get images - check if product has multiple_images, otherwise use image_url
  const imageUrl = currentProduct.image_url || '';

  const categoryName = getCategoryName(currentProduct.category_id);
  
  // Get product state name
  const condition = currentProduct.state?.name || "Good";
  
  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      pb: 4
    }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Breadcrumbs navigation */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'white' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 3, color: 'white' }}
        >
          <Link 
            sx={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            sx={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none' }}
            onClick={() => navigate('/?category_id=' + currentProduct.category_id)}
          >
            <CategoryIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            {categoryName}
          </Link>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            {currentProduct.name}
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
         {/* Product Image */}
          <Grid item xs={12} md={5}>
            <Box
              component="img"
              src={imageUrl}
              alt={currentProduct.name}
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                backgroundColor: 'white',
                padding: '12px',
              }}
            />
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} md={7}>
            <Box sx={{ color: 'white' }}>
              <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
                {currentProduct.name}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  {currentProduct.author}
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ ml: 10 }}>
                  {currentProduct.year_of_publication}
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" component="div" gutterBottom>
                  <Box component="span" sx={{ fontWeight: 'bold' }}>Category:</Box> {categoryName}
                </Typography>
              </Box>
              
                          {/* Condition and Seller in one row */}
                          <Grid container spacing={12} sx={{ mb: 3 }}>
                {/* Condition */}
                <Grid item>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      borderRadius: 2,
                      maxWidth: 180,
                    }}
                  >
                    <StarIcon sx={{ 
                      height: 45, 
                      width: 45, 
                      color: '#FFD700', 
                      mr: 2
                    }} />
                    <Typography 
                      color="white" 
                      variant="subtitle1" 
                      sx={{ 
                        fontWeight: 'medium',
                        display: 'flex',
                        alignItems: 'center',
                        flexGrow: 1,
                        justifyContent: 'center'
                      }}
                    >
                      {condition}
                    </Typography>
                  </Paper>
                </Grid>

                {/* Seller Information */}
                <Grid item>
                  <Paper
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      borderRadius: 2,
                      maxWidth: 250,
                    }}
                  >
                    <Avatar 
                      src={currentProduct.seller?.image_url} 
                      alt={currentProduct.seller?.full_name}
                      sx={{ 
                        height: 45, 
                        width: 45, 
                        mr: 2,
                        border: '2px solid #F15A24' 
                      }} 
                    />
                    <Box>
                      <Typography 
                        color="white" 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'medium',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        {currentProduct.seller?.full_name || 'Unknown Seller'}
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
                            
              <Typography fontWeight="bold" sx={{ mb: 2 }}>
                Description:
              </Typography>
              
              <Typography variant="body1" sx={{ mb: 4 }}>
                {currentProduct.description}
              </Typography>
              
              <Box sx={{ 
                display: 'flex', 
                gap: 2, 
                flexWrap: { xs: 'wrap', md: 'nowrap' },
                mt: 4
              }}>
                {/* Only show buttons if user is not the seller */}
                {!isCurrentUserSeller && (
                  <>
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={handleBuyNow}
                      sx={{ 
                        py: 2,
                        backgroundColor: '#F15A24',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: '#E04613',
                        }
                      }}
                    >
                      <Box component="span" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography component="span">Buy Now for</Typography>
                        <Typography component="span" sx={{ fontWeight: 'bold', ml: 1 }}>
                          {parseFloat(currentProduct.price.toString()).toFixed(2)} BAM
                        </Typography>
                      </Box>
                    </Button>
                    
                    <Button 
                      variant="contained" 
                      fullWidth
                      onClick={handleAddToCart}
                      sx={{ 
                        py: 2,
                        backgroundColor: '#F15A24',
                        color: '#FFFFFF',
                        borderRadius: 1,
                        '&:hover': {
                          backgroundColor: '#E04613',
                        }
                      }}
                    >
                      Add To Cart
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Success message after adding to cart */}
      <Snackbar 
        open={addedToCart} 
        autoHideDuration={3000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          variant="filled"
          sx={{ width: '100%' }}
        >
          Product added to your cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ProductPage;