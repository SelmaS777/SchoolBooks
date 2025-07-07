import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Typography, Grid, Card, CardActionArea,
  CardMedia, CardContent, TextField, FormControl, InputLabel, Select, MenuItem, OutlinedInput, Checkbox, ListItemText,
  Button, CircularProgress, Container, Box, Paper, Chip, InputAdornment,
  Pagination, Snackbar, Alert, useTheme
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchProducts, fetchCategories, ProductQueryParams, setCurrentPage, fetchStates, fetchCities } from '../store/productSlice';
import { fetchUserProfile } from '../store/profileSlice';
//import { Product } from '../utils/type';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '../hooks/useAuth';
import { debounce } from 'lodash';
import SaveSearchButton from '../components/SaveSearchButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RefreshIcon from '@mui/icons-material/Refresh';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    },
  },
  MenuListProps: {
    sx: {
      '& .MuiMenuItem-root': {
        color: '#F15A24', // Orange text color
        '&:hover': {
          backgroundColor: '#FFFFFF', // Solid white on hover
        },
        '& .MuiTypography-root': {
          color: '#F15A24', // Orange text for ListItemText
        },
        '& .MuiCheckbox-root': {
          color: '#F15A24', // Orange checkbox
        },
      }
    }
  }
};

// Define price sort options
const priceSortOptions = [
  { id: 'asc', name: 'Price: Low to High' },
  { id: 'desc', name: 'Price: High to Low' }
];

const MainPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  
  // Get data from Redux store
  const { 
    products, 
    loading: productsLoading, 
    error: productsError,
    currentPage,
    totalPages,
    totalItems,
    perPage
  } = useSelector((state: RootState) => state.products);
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useSelector((state: RootState) => state.categories);

  // Get cities from Redux store
  const {
    cities,
    loading: citiesLoading,
    error: citiesError
  } = useSelector((state: RootState) => state.cities);

  // Get user profile from Redux store
  const { userProfile } = useSelector((state: RootState) => state.profile);

  // Local state for filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [priceSort, setPriceSort] = useState('');
  const [minPrice, setMinPrice] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  
  // Success/error notifications
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'info' as 'success' | 'info' | 'warning' | 'error'
  });

  const { user, isAuthenticated } = useAuth();
  
  // Use proper null checks and default values
  const fullName = user?.full_name || 'User';
  const userName = fullName.split(' ')[0];
  
  // Check if user can add products based on tier
  const canAddProducts = () => {
    if (!userProfile?.tier) return false;
    
    // Free tier (id: 1) has max_listings: 0, so they cannot add products
    return userProfile.tier.max_listings > 0;
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Initial data load
  useEffect(() => {
    fetchInitialData();
    dispatch(fetchCategories());
    dispatch(fetchStates());
    dispatch(fetchCities());
    
    // Fetch user profile to get tier information
    if (isAuthenticated) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  const fetchProductsWithFilters = useCallback((pageToFetch) => {
    console.log("Fetching products for page:", pageToFetch);
    
    const params: ProductQueryParams = {
      search: searchTerm || undefined,
      category_id: selectedCategories.length === 1 ? selectedCategories[0] : undefined,
      sort_price: priceSort === 'asc' || priceSort === 'desc' ? priceSort : undefined,
      min_price: minPrice !== '' ? minPrice : undefined,
      max_price: maxPrice !== '' ? maxPrice : undefined,
      city_id: selectedCities.length === 1 ? selectedCities[0] : undefined,
      per_page: perPage,
      page: pageToFetch
    };
    
    dispatch(fetchProducts(params));
  }, [
    dispatch, 
    searchTerm, 
    selectedCategories, 
    selectedCities,
    priceSort,
    minPrice,
    maxPrice,
    perPage
  ]);
  
  useEffect(() => {
    // Skip the initial render
    //const isInitialRender = useRef(true);
    
   
    
    // When any filter changes, fetch page 1 with the new filters
    fetchProductsWithFilters(1);
  }, [
    searchTerm,
    selectedCategories,
    selectedCities,
    priceSort,
    minPrice,
    maxPrice
  ]);
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchTerm(value);
      dispatch(setCurrentPage(1)); // Reset to page 1 when search changes
    }, 500),
    [dispatch]
  );

    const location = useLocation();
  const [searchInputValue, setSearchInputValue] = useState('');
  
  // Parse query params from URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryFromUrl = params.get('query');
    
    if (queryFromUrl) {
      setSearchInputValue(queryFromUrl);
      setSearchTerm(queryFromUrl);
    }
  }, [location.search]);

    const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInputValue(event.target.value);
    debouncedSearch(event.target.value);
  };
  
  const handleSaveComplete = () => {
    setNotification({
      open: true,
      message: 'Search saved successfully!',
      severity: 'success'
    });
  };

  const fetchInitialData = () => {
    const params: ProductQueryParams = {
      per_page: perPage,
      page: 1
    };
    dispatch(fetchProducts(params));
  };

  const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
  };

  const handleCategoryChange = (event) => {
    const { target: { value } } = event;
    const newCategories = typeof value === 'string' 
      ? value.split(',').map(Number) 
      : value;
    
    setSelectedCategories(newCategories);
    dispatch(setCurrentPage(1)); // Reset to page 1 when categories change
  };

  const handleCityChange = (event) => {
    const { target: { value } } = event;
    setSelectedCities(
      typeof value === 'string' ? value.split(',').map(Number) : value
    );
    dispatch(setCurrentPage(1)); // Reset to page 1 when city changes
  };

  const handlePriceSortChange = (event) => {
    setPriceSort(event.target.value);
    dispatch(setCurrentPage(1)); // Reset to page 1 when sort changes
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    console.log("Changing to page:", page); // Debug log
    dispatch(setCurrentPage(page));
    window.scrollTo(0, 0);
    
    // Force fetch with new page - this helps ensure the data refresh
    fetchProductsWithFilters(page);
  };
      
  const handleSaveSearch = () => {
    setNotification({
      open: true,
      message: 'Search saved successfully!',
      severity: 'success'
    });
  };

  const handleRefresh = () => {
    // Clear all filters
    setSearchTerm('');
    setSelectedCategories([]);
    setSelectedCities([]);
    setPriceSort('');
    setMinPrice('');
    setMaxPrice('');
    dispatch(setCurrentPage(1));
    
    // Refetch data
    fetchInitialData();
    dispatch(fetchCategories());
  };
  
  // Modal state and handlers
  const [openProductModal, setOpenProductModal] = useState(false);

  const handleOpenProductModal = () => {
    // Check if user can add products
    if (!canAddProducts()) {
      // Show notification and redirect to premium page
      setNotification({
        open: true,
        message: 'Upgrade to a premium tier to add products!',
        severity: 'warning'
      });
      
      // Redirect to premium page after a short delay
      setTimeout(() => {
        navigate('/premium');
      }, 1500);
      return;
    }
    
    navigate('/product/add'); // Navigate to the add product page
  };

  const handleCloseProductModal = () => {
    setOpenProductModal(false);
  };

  // Function to get category name by id
  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Close notification handler
  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  // Error state
  if (productsError || categoriesError) {
    return (
      <Container maxWidth="xl" sx={{ 
        mt: 4,
        background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
        minHeight: '100vh',
        py: 4
      }}>
        <Paper elevation={3} sx={{ p: 3, backgroundColor: '#FBFBFB' }}>
          <Typography variant="h5" color="error">
            Error: {productsError || categoriesError}
          </Typography>
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            sx={{ mt: 2, backgroundColor: '#F15A24' }}
          >
            Try Again
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      width: '100%'
    }}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Page Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          {/* Add data-testid attributes for testing */}
          <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', mb: 1, color: '#FBFBFB' }} data-testid="welcome-message">
            Welcome back, {userName}!
          </Typography>
          <Typography variant="h6" sx={{ mb: 3, color: '#FBFBFB' }}>
            Find educational books for all levels
          </Typography>
        </Box>

{/* Filters */}
<Box sx={{ 
  mb: 4, 
  p: 2, 
  borderRadius: 2, 
  display: 'flex',
  flexDirection: { xs: 'column', md: 'row' },
  gap: 2,
  alignItems: 'center',
  justifyContent: 'space-between'
}}>
  {/* Search bar */}
          <TextField
            placeholder="Search"
            variant="filled"
            onChange={handleSearchInputChange}
            value={searchInputValue}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: '40px', paddingBottom: '15px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.15)',
              borderRadius: '8px',
              width: { xs: '100%', md: '30%' },
              '& .MuiFilledInput-root': {
                bgcolor: 'transparent',
                color: 'white',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
              },
              '& .MuiInputAdornment-root': {
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                margin: 0,
                paddingLeft: '4px',
                alignSelf: 'center',
              },
              '& .MuiFilledInput-input': {
                paddingTop: '16px',
                paddingBottom: '16px',
                paddingLeft: '8px',
                height: '24px',
              },
              '& .MuiInputBase-input::placeholder': {
                color: 'white',
                opacity: 1,
                lineHeight: '24px'
              }
            }}
          />
  
  {/* Bookmark button */}
   <SaveSearchButton searchQuery={searchInputValue} onSaveComplete={handleSaveComplete} />
  
  {/* Price dropdown */}
  <FormControl
  variant="filled"
  sx={{
    width: { xs: '100%', md: '16%' },
    bgcolor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    '& .MuiFilledInput-root': {
      bgcolor: 'transparent',
      color: 'white',
      borderRadius: '8px',
      '&:before, &:after': {
        display: 'none'
      },
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSelect-select': {
      paddingTop: '14px',
      paddingBottom: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSvgIcon-root': {
      color: 'white'
    }
  }}
>
    <Select
      value={priceSort}
      onChange={handlePriceSortChange}
      displayEmpty
      IconComponent={ExpandMoreIcon}
      MenuProps={MenuProps}
    >
      <MenuItem value="">Price</MenuItem>
      {priceSortOptions.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  
  {/* City dropdown */}
<FormControl
  variant="filled"
  sx={{
    width: { xs: '100%', md: '16%' },
    bgcolor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    '& .MuiFilledInput-root': {
      bgcolor: 'transparent',
      color: 'white',
      borderRadius: '8px',
      '&:before, &:after': {
        display: 'none'
      },
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSelect-select': {
      paddingTop: '14px',
      paddingBottom: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSvgIcon-root': {
      color: 'white'
    }
  }}
>
<Select
        multiple
        value={selectedCities}
        onChange={handleCityChange}
        displayEmpty
        IconComponent={props => <ExpandMoreIcon {...props} sx={{ color: 'white' }} />}
        renderValue={(selected) => selected.length === 0 ? 'City' : `${selected.length} selected`}
        MenuProps={MenuProps}
      >
        {/* Map over cities from the API */}
        {Object.entries(cities).map(([id, name]) => (
          <MenuItem key={id} value={Number(id)}>
            <Checkbox checked={selectedCities.indexOf(Number(id)) > -1} />
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
  </FormControl>
  
  {/* Category dropdown */}
<FormControl
  variant="filled"
  sx={{
    width: { xs: '100%', md: '16%' },
    bgcolor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: '8px',
    '& .MuiFilledInput-root': {
      bgcolor: 'transparent',
      color: 'white',
      borderRadius: '8px',
      '&:before, &:after': {
        display: 'none'
      },
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSelect-select': {
      paddingTop: '14px',
      paddingBottom: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    '& .MuiSvgIcon-root': {
      color: 'white'
    }
  }}
>
    <Select
      multiple
      value={selectedCategories}
      onChange={handleCategoryChange}
      displayEmpty
      IconComponent={props => <ExpandMoreIcon {...props} sx={{ color: 'white' }} />}
      renderValue={(selected) => selected.length === 0 ? 'Category' : `${selected.length} selected`}
      MenuProps={MenuProps}
    >
      {categories.map((category) => (
        <MenuItem key={category.id} value={category.id}>
          <Checkbox checked={selectedCategories.indexOf(category.id) > -1} />
          <ListItemText primary={category.name} />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
  
  {/* Refresh button */}
  <Button
    onClick={handleRefresh}
    variant="contained"
    sx={{
      bgcolor: 'rgba(0, 0, 0, 0.15)',
      color: 'white',
      borderRadius: '50%',
      minWidth: '38px',
      height: '50px',
    }}
  >
    <RefreshIcon />
  </Button>
</Box>

        {/* Results Summary */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ color: '#FBFBFB' }}>
            <FilterListIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
            {totalItems} {totalItems === 1 ? 'Product' : 'Products'} Found
          </Typography>
        </Box>

         {/* Loading Spinner or Products Grid */}
      {productsLoading || categoriesLoading ? (
       <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        flexDirection: 'column',
        minHeight: '300px',
        width: '100%'
      }}>
        <CircularProgress size={40} thickness={4} sx={{ color: '#FBFBFB' }} />
        <Typography variant="body1" sx={{ mt: 2, color: '#FBFBFB' }}>
          Loading products...
        </Typography>
      </Box>
      ) : (
        <>

        {/* Products Grid */}
        {products.length > 0 ? (
          <>
            <Grid container spacing={3}>
              {/* Add Product Card - Always first item */}
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card 
                  sx={{ 
                    position: 'relative',
                    width: '100%',
                    height: { xs: '200px', sm: '176px' }, // Same height as product cards
                    borderRadius: '10px', // Same border radius
                    filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))', // Same shadow
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: canAddProducts() ? 'translateY(-5px)' : 'none',
                    },
                    backgroundColor: '#FBFBFB',
                    overflow: 'hidden',
                    border: canAddProducts() ? '2px dashed #F15A24' : '2px dashed #cccccc',
                    cursor: canAddProducts() ? 'pointer' : 'default',
                    opacity: canAddProducts() ? 1 : 0.6
                  }}
                  onClick={handleOpenProductModal}
                >
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'center', 
                      alignItems: 'center', 
                      height: '100%',
                      p: 4
                    }}
                  >
                    {canAddProducts() ? (
                      <>
                        <AddIcon sx={{ fontSize: 60, color: '#F15A24', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#F15A24', fontWeight: 'bold', textAlign: 'center' }}>
                          Add Your Product
                        </Typography>
                      </>
                    ) : (
                      <>
                        <LockIcon sx={{ fontSize: 60, color: '#cccccc', mb: 2 }} />
                        <Typography variant="h6" sx={{ color: '#cccccc', fontWeight: 'bold', textAlign: 'center', mb: 1 }}>
                          Premium Feature
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#666666', textAlign: 'center' }}>
                          Upgrade to add products
                        </Typography>
                      </>
                    )}
                  </Box>
                </Card>
              </Grid>

              {/* Regular Product Cards */}
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card 
                    sx={{ 
                      position: 'relative',
                      width: '100%',
                      height: { xs: '200px', sm: '176px' }, // Slightly taller on mobile
                      borderRadius: '10px',
                      filter: 'drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.25))',
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                      },
                      backgroundColor: '#FBFBFB',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Category chip removed */}
                    
                    <CardActionArea 
                      onClick={() => navigate(`/product/${product.id}`)}
                      sx={{ 
                        display: 'flex',
                        flexDirection: 'row',
                        height: '100%',
                        width: '100%',
                        padding: 0
                      }}
                    >
                      {/* Left side - Image with padding */}
                      <Box sx={{ 
                        
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center', 
                        justifyContent: 'center',
                        padding: '3%'
                      }}>
                        <Box sx={{
                          width: '100%',
                          height: '85%',
                          border: '1px solid #E0E0E0',
                          borderRadius: '8px',
                          overflow: 'hidden'
                        }}>
                          <CardMedia
                            component="img"
                            sx={{ 
                              height: '100%', 
                              width: '100%',
                              objectFit: 'cover'
                            }}
                            image={product.image_url}
                            alt={product.name}
                          />
                        </Box>
                      </Box>
                      
                      {/* Content Container - Evenly spaced content */}
                      <Box sx={{ 
                        width: { xs: '65%', sm: '75%' }, 
                        height: '100%', 
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '3% 3% 3% 0'
                      }}>
                        {/* Book Title */}
                        <Typography 
                          variant="h6" 
                          component="div" 
                          sx={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '16px', sm: '18px', md: '21px' },
                            lineHeight: '24px',
                            color: '#000000',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {product.name}
                        </Typography>
                        
                        {/* Author */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 400,
                            fontSize: { xs: '11px', sm: '12px', md: '13px' },
                            lineHeight: '16px',
                            color: '#000000'
                          }}
                        >
                          by {product.author} ({product.year_of_publication})
                        </Typography>
                        
                        {/* Condition as text instead of chip */}
                        <Box sx={{ 
                          display: 'flex',
                          alignItems: 'center'
                        }}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 400,
                              fontSize: { xs: '11px', sm: '12px', md: '13px' },
                              lineHeight: '16px',
                              color: '#000000',
                              marginRight: '8px'
                            }}
                          >
                            Condition:
                          </Typography>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontFamily: 'Inter, sans-serif',
                              fontWeight: 500,
                              fontSize: { xs: '11px', sm: '12px', md: '13px' },
                              lineHeight: '16px',
                             color: '#000000'
                            }}
                          >
                            {product.state?.name || "Unknown"}
                          </Typography>
                        </Box>
                        
                        {/* Price */}
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontFamily: 'Inter, sans-serif',
                            fontWeight: 700,
                            fontSize: { xs: '16px', sm: '18px', md: '21px' },
                            lineHeight: '24px',
                            color: '#F15A24'
                          }}
                        >
                          {parseFloat(product.price.toString()).toFixed(2)} BAM
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
          </Grid>
            
           {/* Pagination Controls */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 4 }}>
                <Pagination 
                  count={totalPages} 
                  page={currentPage} 
                  onChange={handlePageChange}
                  variant="outlined"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: '#FBFBFB',
                      borderColor: '#FBFBFB'
                    },
                    '& .Mui-selected': {
                      backgroundColor: '#F15A24 !important',
                      borderColor: '#F15A24',
                      color: '#FBFBFB'
                    },
                    '& .MuiPaginationItem-ellipsis': {
                      color: '#FBFBFB'
                    }
                  }}
                />
              </Box>
            )}
          </>
        ) : (
          <Paper elevation={2} sx={{ p: 4, textAlign: 'center', borderRadius: 2, backgroundColor: '#FBFBFB' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>No products found</Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your search or filters to find what you're looking for.
            </Typography>
            <Button 
              variant="contained" 
              onClick={handleRefresh}
              sx={{ mt: 3, backgroundColor: '#F15A24' }}
            >
              Clear Filters
            </Button>
          </Paper>
              )}
          </>
        )}
      </Container>
      
      
      {/* Notification Snackbar */}
      <Snackbar 
        open={notification.open} 
        autoHideDuration={6000} 
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainPage;