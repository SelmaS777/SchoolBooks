import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadButton } from '@bytescale/upload-widget-react';
import { 
  Box, Typography, TextField, Button, Select, MenuItem, 
  FormControl, CircularProgress, Snackbar, Alert,
  Container, Grid, Breadcrumbs, Link
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchCategories, addProduct, fetchProducts, fetchStates } from '../../store/productSlice';
import { NewProduct } from '../../utils/type';
import { getUserFromToken } from '../../utils/getUserFromToken';

// Bytescale configuration
const options = {
  apiKey: "public_G22nhprGBqME5J5rLwfnaBXqFMN7", // Your public API key
  maxFileCount: 1,
  styles: {
    colors: {
      primary: "#F15A24" // Match your app theme
    }
  }
};

const AddProductPage = () => {
  const userData = getUserFromToken();
  const user = userData?.user;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.categories);
  const { states, loading: statesLoading } = useSelector((state: RootState) => state.states);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Additional form fields
  const [author, setAuthor] = useState('');
  const [yearOfPublication, setYearOfPublication] = useState<number | string>('');
  const [stateId, setStateId] = useState<number | string>('');

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
      }
    }
  }
};

  // Fetch categories and states when component mounts
  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
    if (states.length === 0) {
      dispatch(fetchStates());
    }
  }, [dispatch, categories.length, states.length]);

  const handleUploadComplete = (files: { fileUrl: string }[]) => {
    setImages(files.map(file => file.fileUrl));
  };

  const handleSubmit = async () => {
    // Add a check for authentication
    if (!userInfo) {
      // Redirect to login if not authenticated
      navigate('/login?redirect=add-product');
      return;
    }
    
    if (!productName || !price || !description || !selectedCategory || !author || !yearOfPublication || !stateId || images.length === 0) {
      return; // Don't submit if fields are missing
    }
    
    setIsSubmitting(true);
    
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numericYear = typeof yearOfPublication === 'string' ? parseInt(yearOfPublication) : yearOfPublication;

    const newProduct: NewProduct = {
      name: productName,
      description,
      price: numericPrice,
      image_url: images[0],
      category_id: Number(selectedCategory),
      seller_id: userInfo.id, // Get seller_id from Redux store
      author,
      year_of_publication: numericYear,
      state_id: Number(stateId)
    };

    try {
      const resultAction = await dispatch(addProduct(newProduct));
      
      if (addProduct.fulfilled.match(resultAction)) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          setShowSuccessAlert(false);
          dispatch(fetchProducts({ page: 1 }));
          navigate('/');
        }, 1500);
      } else if (addProduct.rejected.match(resultAction)) {
        throw new Error(resultAction.payload as string || 'Failed to add product');
      }
    } catch (error) {
      console.error('Failed to add product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (categoriesLoading || statesLoading) {
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
          Loading...
        </Typography>
      </Box>
    );
  }

  if (categoriesError) {
    return (
      <Container maxWidth="md" sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error: {categoriesError}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/')}
          sx={{ backgroundColor: '#F15A24' }}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Breadcrumbs navigation */}
        <Breadcrumbs 
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'white' }} />}
          aria-label="breadcrumb"
          sx={{ mb: 4, color: 'white' }}
        >
          <Link 
            sx={{ display: 'flex', alignItems: 'center', color: 'white', textDecoration: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/')}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography sx={{ display: 'flex', alignItems: 'center', color: 'white' }}>
            Add New Product
          </Typography>
        </Breadcrumbs>

        <Grid container spacing={4}>
{/* Left side - Image upload */}
<Grid item xs={12} md={5}>
  <UploadButton
    options={options}
    onComplete={handleUploadComplete}
  >
    {({ onClick }) => (
      images.length > 0 ? (
        <Box
          onClick={onClick}
          sx={{
            position: 'relative',
            cursor: 'pointer',
            maxWidth: '100%',
            borderRadius: 2,
            overflow: 'hidden',
            backgroundColor: 'rgba(139, 52, 21, 0.8)',
            mb: 2,
            '&:hover::after': {
              content: '"Change Image"',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }
          }}
        >
          <Box
            component="img"
            src={images[0]}
            alt="Product preview"
            sx={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          />
        </Box>
      ) : (
        <Box 
          onClick={onClick}
          sx={{ 
            width: '100%',
            aspectRatio: '1/1',
            borderRadius: 2,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            mb: 2,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
            }
          }}
        >
          <Box sx={{
            color: 'white',
            fontSize: 80,
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            +
          </Box>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'white', 
              mt: 1 
            }}
          >
            Click to upload image
          </Typography>
        </Box>
      )
    )}
  </UploadButton>
</Grid>
          {/* Right side - Form fields */}
          <Grid item xs={12} md={7}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
    fullWidth
    placeholder="Title"
    variant="filled"
    value={productName}
    onChange={(e) => setProductName(e.target.value)}
    required
    InputProps={{ 
        disableUnderline: true,
        sx: {
          display: 'flex',
          alignItems: 'center',
        }
    }}
    sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 2,
        '& .MuiFilledInput-root': {
          backgroundColor: 'transparent',
          color: 'white',
          borderRadius: 2,
          '&:hover': {
              backgroundColor: 'transparent',
          },
          '&.Mui-focused': {
              backgroundColor: 'transparent',
          }
        },
        '& .MuiFilledInput-input': {
          paddingTop: '16px',
          paddingBottom: '16px',
          height: '24px',
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'white',
          opacity: 1,
          lineHeight: '24px'
        }
    }}
/>              
              {/* Author */}
              <TextField
    fullWidth
    placeholder="Author"
    variant="filled"
    value={author}
    onChange={(e) => setAuthor(e.target.value)}
    required
    InputProps={{ 
        disableUnderline: true,
        sx: {
          display: 'flex',
          alignItems: 'center',
        }
    }}
    sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 2,
        '& .MuiFilledInput-root': {
          backgroundColor: 'transparent',
          color: 'white',
          borderRadius: 2,
          '&:hover': {
              backgroundColor: 'transparent',
          },
          '&.Mui-focused': {
              backgroundColor: 'transparent',
          }
        },
        '& .MuiFilledInput-input': {
          paddingTop: '16px',
          paddingBottom: '16px',
          height: '24px',
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'white',
          opacity: 1,
          lineHeight: '24px'
        }
    }}
/>

              
              {/* Year of Publication */}
              <TextField
    fullWidth
    placeholder="Year of Publication"
    variant="filled"
    type="number"
    value={yearOfPublication}
    onChange={(e) => setYearOfPublication(e.target.value)}
    required
    InputProps={{ 
        disableUnderline: true,
        sx: {
          display: 'flex',
          alignItems: 'center',
        }
    }}
    sx={{
        backgroundColor: 'rgba(0, 0, 0, 0.15)',
        borderRadius: 2,
        '& .MuiFilledInput-root': {
          backgroundColor: 'transparent',
          color: 'white',
          borderRadius: 2,
          '&:hover': {
              backgroundColor: 'transparent',
          },
          '&.Mui-focused': {
              backgroundColor: 'transparent',
          }
        },
        '& .MuiFilledInput-input': {
          paddingTop: '16px',
          paddingBottom: '16px',
          height: '24px',
          '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
            '-webkit-appearance': 'none',
            margin: 0,
          },
          '&[type=number]': {
            '-moz-appearance': 'textfield',
          },
        },
        '& .MuiInputBase-input::placeholder': {
          color: 'white',
          opacity: 1,
          lineHeight: '24px'
        }
    }}
/>

              
              {/* Price */}
              <TextField
  fullWidth
  placeholder="Price"
  variant="filled"
  value={price}
  onChange={(e) => {
    // Only allow numbers and a single decimal point
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setPrice(value);
    }
  }}
  required
  InputProps={{ 
    disableUnderline: true,
    sx: {
      display: 'flex',
      alignItems: 'center',
    }
  }}
  sx={{
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 2,
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent',
      color: 'white',
      borderRadius: 2,
      '&:hover': {
        backgroundColor: 'transparent',
      },
      '&.Mui-focused': {
        backgroundColor: 'transparent',
      }
    },
    '& .MuiFilledInput-input': {
      paddingTop: '16px',
      paddingBottom: '16px',
      height: '24px',
    },
    '& .MuiInputBase-input::placeholder': {
      color: 'white',
      opacity: 1,
      lineHeight: '24px'
    }
  }}
/>
              

<Grid container spacing={2}>
  <Grid item xs={12} sm={6}>
    {/* Category dropdown */}
    <FormControl 
      variant="filled" 
      fullWidth
      sx={{
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
        displayEmpty
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(Number(e.target.value))}
        IconComponent={ExpandMoreIcon}
        MenuProps={MenuProps}
        renderValue={
          selectedCategory !== '' 
            ? undefined 
            : () => <Typography sx={{ color: 'white' }}>Category</Typography>
        }
      >
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  </Grid>
  
  <Grid item xs={12} sm={6}>
    {/* State/Quality dropdown */}
    <FormControl 
  variant="filled" 
  fullWidth
  sx={{
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
    displayEmpty
    value={stateId}
    onChange={(e) => setStateId(Number(e.target.value))}
    IconComponent={ExpandMoreIcon}
    MenuProps={MenuProps}
    renderValue={
      stateId !== '' 
        ? undefined 
        : () => <Typography sx={{ color: 'white' }}>State of the Book</Typography>
    }
  >
    {states.map((state) => (
      <MenuItem key={state.id} value={state.id}>
        {state.name}
      </MenuItem>
    ))}
  </Select>
</FormControl>
  </Grid>
</Grid>              
              {/* Description */}
              <TextField
                fullWidth
                multiline
                rows={5}
                placeholder="Description"
                variant="filled"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                InputProps={{ disableUnderline: true }}
                sx={{
                  backgroundColor: 'rgba(0, 0, 0, 0.15)',
                  borderRadius: 2,
                  '& .MuiFilledInput-root': {
                    backgroundColor: 'transparent',
                    color: 'white',
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'transparent',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'transparent',
                    }
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'white',
                    opacity: 1
                  }
                }}
              />
              
              {/* Publish button */}
              <Button
                fullWidth
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  isSubmitting || 
                  !productName || 
                  !price || 
                  !description || 
                  !selectedCategory || 
                  !author ||
                  !yearOfPublication ||
                  !stateId ||
                  images.length === 0
                }
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: '#FF6838',
                  color: 'white',
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#E04613',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(255, 104, 56, 0.6)',
                    color: 'rgba(255, 255, 255, 0.7)'
                  }
                }}
              >
                {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Publish'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
      
      {/* Success Message */}
      <Snackbar 
        open={showSuccessAlert} 
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ backgroundColor: '#F15A24' }}>
          Product added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AddProductPage;