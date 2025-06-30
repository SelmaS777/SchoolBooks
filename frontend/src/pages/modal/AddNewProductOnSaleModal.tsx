import React, { useState, useEffect } from 'react';
import { UploadButton } from '@bytescale/upload-widget-react';
import { 
  Box, Typography, Modal, TextField, Button, Select, MenuItem, 
  FormControl, InputLabel, CircularProgress, Snackbar, Alert,
  Paper, IconButton, Divider, Grid, Chip, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import CategoryIcon from '@mui/icons-material/Category';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TitleIcon from '@mui/icons-material/Title';
import DescriptionIcon from '@mui/icons-material/Description';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import DateRangeIcon from '@mui/icons-material/DateRange';
import GradeIcon from '@mui/icons-material/Grade';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store';
import { fetchCategories, addProduct, fetchProducts, fetchStates } from '../../store/productSlice';
import { AddNewProductOnSaleModalProps, NewProduct } from '../../utils/type';
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
  // No editor property = no image editing
};

const AddNewProductOnSaleModal: React.FC<AddNewProductOnSaleModalProps> = ({ open, handleClose }) => {
  const userData = getUserFromToken();
  const user = userData?.user;
  const dispatch = useAppDispatch();
  const { categories, loading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.categories);
  const { states, loading: statesLoading } = useSelector((state: RootState) => state.states);

  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState<number | string>('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | string>('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // New form fields
  const [author, setAuthor] = useState('');
  const [yearOfPublication, setYearOfPublication] = useState<number | string>('');
  const [stateId, setStateId] = useState<number | string>(1); // Default to "New" state

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setProductName('');
      setPrice('');
      setDescription('');
      setImages([]);
      setSelectedCategory('');
      setAuthor('');
      setYearOfPublication('');
      setStateId(1);
    }
  }, [open]);

  useEffect(() => {
    if (open && categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, open, categories.length]);

  useEffect(() => {
    if (open) {
      if (categories.length === 0) {
        dispatch(fetchCategories());
      }
      if (states.length === 0) {
        dispatch(fetchStates());
      }
    }
  }, [dispatch, open, categories.length, states.length]);

  const handleUploadComplete = (files: { fileUrl: string }[]) => {
    setImages(files.map(file => file.fileUrl));
  };

  const handleSubmit = async () => {
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
      seller_id: user?.id || 1,
      author,
      year_of_publication: numericYear,
      state_id: Number(stateId)
    };

    try {
      // Dispatch addProduct action to send data to backend
      const resultAction = await dispatch(addProduct(newProduct));
      
      if (addProduct.fulfilled.match(resultAction)) {
        setShowSuccessAlert(true);
        setTimeout(() => {
          handleClose();
          setShowSuccessAlert(false);
          // Refresh product list after adding new product
          dispatch(fetchProducts({ page: 1 }));
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

  if (categoriesLoading) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <CircularProgress size={40} sx={{ color: '#F15A24' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>Loading categories...</Typography>
        </Box>
      </Modal>
    );
  }

  if (categoriesError) {
    return (
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}>
          <Typography variant="h6" color="error">Error loading categories</Typography>
          <Typography>{categoriesError}</Typography>
          <Button 
            variant="contained" 
            onClick={handleClose} 
            sx={{ 
              mt: 2, 
              backgroundColor: '#F15A24',
              '&:hover': {
                backgroundColor: '#E04613',
              }
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="add-new-product-modal-title"
      aria-describedby="add-new-product-modal-description"
    >
      <Paper sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: 500 },
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
      }}>
        {/* Header */}
        <Box sx={{ 
          p: 2, 
          background: 'linear-gradient(to bottom, #F15A24, #F15A24)',
          borderTopLeftRadius: 12, 
          borderTopRightRadius: 12,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography id="add-new-product-modal-title" variant="h6" component="h2" sx={{ color: 'white', fontWeight: 'bold' }}>
            Add New Product
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider />
        
        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Grid container spacing={2}>
            {/* Product Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Product Name"
                variant="outlined"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                InputProps={{
                  startAdornment: <TitleIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            {/* Author - New field */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Author"
                variant="outlined"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                InputProps={{
                  startAdornment: <AutoStoriesIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            {/* Price and Year of Publication */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                variant="outlined"
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
                  startAdornment: <AttachMoneyIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            {/* Year of Publication - New field */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Year of Publication"
                variant="outlined"
                type="number"
                value={yearOfPublication}
                onChange={(e) => setYearOfPublication(e.target.value)}
                required
                InputProps={{
                  startAdornment: <DateRangeIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            {/* Category */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel id="category-select-label">Category</InputLabel>
                <Select
                  labelId="category-select-label"
                  id="category-select"
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(Number(e.target.value))}
                  startAdornment={<CategoryIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* State - New field */}
            <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="state-select-label">Condition</InputLabel>
              <Select
                labelId="state-select-label"
                id="state-select"
                value={stateId}
                label="Condition"
                onChange={(e) => setStateId(Number(e.target.value))}
                startAdornment={<GradeIcon sx={{ mr: 1, color: 'text.secondary' }} />}
              >
                {states.length > 0 ? (
                  states.map((state) => (
                    <MenuItem key={state.id} value={state.id}>
                      {state.name}
                    </MenuItem>
                  ))
                ) : (
                  <>
                    <MenuItem value={1}>Good</MenuItem>
                    <MenuItem value={2}>Very Good</MenuItem>
                    <MenuItem value={3}>Excellent</MenuItem>
                  </>
                )}
              </Select>
            </FormControl>
          </Grid>
            
            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                variant="outlined"
                multiline
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                InputProps={{
                  startAdornment: <DescriptionIcon sx={{ mr: 1, mt: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
            
            {/* Image Upload - Using Bytescale */}
            <Grid item xs={12}>
              <Box sx={{ 
                border: '2px dashed #ccc', 
                borderRadius: 2, 
                p: 3, 
                textAlign: 'center',
                backgroundColor: 'rgba(0,0,0,0.02)',
                mb: 2
              }}>
                <Typography variant="subtitle1" sx={{ mb: 2 }}>Upload Product Image</Typography>
                
                <UploadButton
                  options={options}
                  onComplete={handleUploadComplete}
                >
                  {({ onClick }) => (
                    <Button 
                      variant="outlined" 
                      onClick={onClick} 
                      startIcon={<AddPhotoAlternateIcon />}
                      sx={{ 
                        borderRadius: 2, 
                        px: 3,
                        color: '#F15A24',
                        borderColor: '#F15A24',
                        '&:hover': { 
                          bgcolor: 'rgba(241, 90, 36, 0.08)',
                          borderColor: '#E04613'
                        }
                      }}
                    >
                      Upload Product Image
                    </Button>
                  )}
                </UploadButton>
                
                {images.length > 0 && (
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ position: 'relative' }}>
                      <Avatar 
                        src={images[0]} 
                        variant="rounded" 
                        sx={{ width: 100, height: 100, borderRadius: 2 }} 
                      />
                      <Chip 
                        label="Uploaded" 
                        color="success" 
                        size="small" 
                        sx={{ position: 'absolute', bottom: -10, right: -10 }} 
                      />
                    </Box>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
        
        {/* Actions */}
        <Box sx={{ p: 2, bgcolor: 'rgba(0,0,0,0.03)', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={handleClose}
            sx={{ 
              borderRadius: 2,
              color: '#F15A24',
              borderColor: '#F15A24',
              '&:hover': {
                borderColor: '#E04613',
                color: '#E04613'
              }
            }}
          >
            Cancel
          </Button>
          <Button 
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
              borderRadius: 2,
              px: 3,
              backgroundColor: '#F15A24',
              '&:hover': {
                backgroundColor: '#E04613',
              },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(241, 90, 36, 0.5)',
              }
            }}
          >
            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Add Product'}
          </Button>
        </Box>
        
        {/* Success Message */}
        <Snackbar 
          open={showSuccessAlert} 
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert severity="success" variant="filled" sx={{ backgroundColor: '#F15A24' }}>
            Product added successfully!
          </Alert>
        </Snackbar>
      </Paper>
    </Modal>
  );
};

export default AddNewProductOnSaleModal;