import React, { useState, useEffect } from 'react';
import {
  Typography, Grid, Card, CardMedia, Box, Container, Button,
  CardActionArea, FormControl, Select, MenuItem, SelectChangeEvent,
  CircularProgress, Alert, TextField, Avatar, IconButton, Collapse,
  InputLabel, Paper
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { fetchUserProducts, fetchCities } from '../store/productSlice';
import { updateUserProfile, fetchUserProfile, resetSuccess } from '../store/profileSlice';
import { ProductStatus, Product } from '../utils/type';
import { UploadButton } from '@bytescale/upload-widget-react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import { deleteProduct } from '../store/productSlice';

// Types for filter selection
type FilterType = ProductStatus;

// Configure upload widget
const uploadOptions = {
  apiKey: "public_G22nhprGBqME5J5rLwfnaBXqFMN7",
  maxFileCount: 1,
  styles: {
    colors: {
      primary: "#F15A24"
    }
  }
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    },
  },
  MenuListProps: {
    sx: {
      '& .MuiMenuItem-root': {
        color: '#F15A24', 
        '&:hover': {
          backgroundColor: '#FFFFFF', 
        },
        '& .MuiTypography-root': {
          color: '#F15A24', 
        },
        '& .MuiCheckbox-root': {
          color: '#F15A24', 
        },
      }
    }
  }
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  // Get user info from auth and profile from profile slice
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const { 
    userProfile, 
    loading: profileLoading, 
    error: profileError,
    success: profileSuccess
  } = useSelector((state: RootState) => state.profile);
  
  const { 
    userProducts, 
    userProductsLoading, 
    userProductsError
  } = useSelector((state: RootState) => state.products);
  
  // Add a separate selector for cities
  const {
    cities = {},
    loading: citiesLoading = false
  } = useSelector((state: RootState) => state.cities);
  
  const [filter, setFilter] = useState<FilterType>(ProductStatus.SELLING);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: '',
    phone_number: '',
    city_id: '',
    personal_details: '',
    image_url: ''
  });
  const [saveError, setSaveError] = useState<string | null>(null);

  // Fetch user profile when component mounts
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(fetchUserProfile());
    } else {
      navigate('/login?redirect=profile');
    }
  }, [userInfo, dispatch, navigate]);

  // Fetch user products when component mounts or filter changes
  useEffect(() => {
    if (userInfo?.id) {
      dispatch(fetchUserProducts({ 
        userId: userInfo.id, 
        status: filter 
      }));
    }
  }, [userInfo, filter, dispatch]);



  // Update local state when userProfile changes
  useEffect(() => {
    if (userProfile) {
      setProfileData({
        full_name: userProfile.full_name || '',
        phone_number: userProfile.phone_number || '',
        city_id: userProfile.city_id?.toString() || '',
        personal_details: userProfile.personal_details || '',
        image_url: userProfile.image_url || ''
      });
    }
  }, [userProfile]);

  // Handle profile success
  useEffect(() => {
    if (profileSuccess) {
      setIsEditing(false);
      // Automatically hide success message after a delay
      const timer = setTimeout(() => {
        dispatch(resetSuccess());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [profileSuccess, dispatch]);

  useEffect(() => {
    if (Object.keys(cities).length === 0) {
      dispatch(fetchCities());
    }
  }, [cities, dispatch]);

  // Handle filter change
  const handleFilterChange = (event: SelectChangeEvent<FilterType>) => {
    setFilter(event.target.value as FilterType);
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle city selection
  const handleCityChange = (event: SelectChangeEvent) => {
    setProfileData(prev => ({
      ...prev,
      city_id: event.target.value
    }));
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    if (isEditing) {
      // Cancel editing - reset to original values
      if (userProfile) {
        setProfileData({
          full_name: userProfile.full_name || '',
          phone_number: userProfile.phone_number || '',
          city_id: userProfile.city_id?.toString() || '',
          personal_details: userProfile.personal_details || '',
          image_url: userProfile.image_url || ''
        });
      }
      setSaveError(null);
    }
    setIsEditing(!isEditing);
  };

  // Handle profile image upload
  const handleUploadComplete = (files: any[]) => {
    if (files.length > 0) {
      setProfileData(prev => ({
        ...prev,
        image_url: files[0].fileUrl
      }));
    }
  };

  // Save profile changes
  const handleSaveProfile = () => {
    setSaveError(null);
    dispatch(updateUserProfile(profileData));
  };

  const handleDeleteBook = (bookId: number) => {
    setDeleteBookId(bookId);
    setDeleteConfirmOpen(true);
  };
  
  // Handle actual book deletion
  const confirmDeleteBook = async () => {
    if (deleteBookId) {
      try {
        await dispatch(deleteProduct(deleteBookId));
        // Refresh the user's products list
        if (userInfo?.id) {
          dispatch(fetchUserProducts({ 
            userId: userInfo.id, 
            status: filter 
          }));
        }
      } catch (error) {
        console.error("Error deleting book:", error);
      }
      setDeleteConfirmOpen(false);
      setDeleteBookId(null);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      width: '100%',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Profile Header Section with White Background */}
      <Box sx={{ 
        background: '#FFFFFF',
        py: 1,
        pb: { xs: isEditing ? 4 : 1, md: isEditing ? 4 : 1 },
        position: 'relative',
        zIndex: 10,
        transition: 'padding-bottom 0.3s ease-in-out',
      }}>
        <Container maxWidth="xl">
          {/* Success Message */}
          {profileSuccess && (
            <Alert severity="success" sx={{ mb: 2, mt: 1 }}>
              Profile updated successfully!
            </Alert>
          )}
          
          {/* Error Message */}
          {profileError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {profileError}
            </Alert>
          )}
          
          {/* Custom error message */}
          {saveError && (
            <Alert severity="error" sx={{ mb: 2, mt: 1 }}>
              {saveError}
            </Alert>
          )}
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'center', md: 'flex-start' },
            justifyContent: 'space-between',
            pt: 2,
          }}>
            {/* User Info Area with Profile Picture */}
            <Box sx={{ 
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-start' },
              gap: { xs: 2, md: 3 },
              width: '100%',
              position: 'relative',
            }}>
              {/* Profile Picture with Upload Button if Editing */}
              <Box 
                sx={{ 
                  width: { xs: 150, md: 180 },
                  height: { xs: 150, md: 180 },
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '4px solid #F15A24',
                  backgroundColor: '#F9F8F5',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                  flexShrink: 0,
                  position: { xs: 'static', md: isEditing ? 'static' : 'absolute' },
                  bottom: { md: isEditing ? 'auto' : '-115px' }, // Increased from -90px to -115px to position more between sections
                  zIndex: 20, // Ensure it appears above other elements
                  transition: 'all 0.3s ease-in-out',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {isEditing ? (
                  <Box sx={{ 
                    position: 'relative', 
                    width: '100%', 
                    height: '100%',
                    '&:hover .upload-overlay': {
                      opacity: 1
                    }
                  }}>
                    {profileData.image_url ? (
                      <img 
                        src={profileData.image_url} 
                        alt="Profile" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#F9F8F5',
                        color: '#F15A24',
                        fontSize: { xs: '40px', md: '60px' },
                        fontWeight: 'bold'
                      }}>
                        {profileData.full_name?.charAt(0) || 'U'}
                      </Box>
                    )}
                    <UploadButton
                      options={uploadOptions}
                      onComplete={handleUploadComplete}
                    >
                      {({onClick}) => (
                        <Box 
                          className="upload-overlay"
                          onClick={onClick}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(241, 90, 36, 0.7)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            cursor: 'pointer',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            color: 'white'
                          }}
                        >
                          <PhotoCameraIcon sx={{ fontSize: '2rem', mb: 1 }} />
                          <Typography variant="body2" sx={{ textAlign: 'center', px: 1 }}>
                            Change Photo
                          </Typography>
                        </Box>
                      )}
                    </UploadButton>
                  </Box>
                ) : (
                  userProfile?.image_url ? (
                    <img 
                      src={userProfile.image_url} 
                      alt="Profile" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <Box sx={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      backgroundColor: '#F9F8F5',
                      color: '#F15A24',
                      fontSize: { xs: '40px', md: '60px' },
                      fontWeight: 'bold'
                    }}>
                      {userProfile?.full_name?.charAt(0) || 'U'}
                    </Box>
                  )
                )}
              </Box>

              {/* User Info - Name and Phone */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center',
                alignItems: { xs: 'center', md: isEditing ? 'flex-start' : 'flex-start' },
                ml: { xs: 0, md: isEditing ? 0 : '200px' },
                transition: 'margin-left 0.3s ease-in-out',
                width: { xs: '100%', md: 'auto' }
              }}>
                {isEditing ? (
                  <>
                    <TextField
                      label="Full Name"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#F15A24',
                          },
                          '&:hover fieldset': {
                            borderColor: '#F15A24',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#F15A24',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#F15A24'
                        }
                      }}
                    />
                    <TextField
                      label="Phone Number"
                      name="phone_number"
                      value={profileData.phone_number}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#F15A24',
                          },
                          '&:hover fieldset': {
                            borderColor: '#F15A24',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#F15A24',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#F15A24'
                        }
                      }}
                    />
                    <FormControl fullWidth margin="normal" variant="outlined" sx={{ mb: 2 }}>
                      <InputLabel id="city-select-label" sx={{ color: '#F15A24' }}>City</InputLabel>
                      <Select
                        labelId="city-select-label"
                        id="city-select"
                        value={profileData.city_id?.toString() || ''}
                        onChange={handleCityChange}
                        label="City"
                        sx={{
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F15A24',
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F15A24',
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#F15A24',
                          },
                        }}
                      >
                        <MenuItem value="">
                          <em>Select a city</em>
                        </MenuItem>
                        {Object.entries(cities).map(([id, name]) => (
                          <MenuItem key={id} value={id}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      label="Personal Details"
                      name="personal_details"
                      value={profileData.personal_details}
                      onChange={handleInputChange}
                      fullWidth
                      margin="normal"
                      multiline
                      rows={4}
                      variant="outlined"
                      sx={{ 
                        mb: 2,
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: '#F15A24',
                          },
                          '&:hover fieldset': {
                            borderColor: '#F15A24',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#F15A24',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#F15A24'
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    <Typography variant="h4" component="h1" sx={{ 
                      fontWeight: 'bold', 
                      color: '#F15A24', 
                      textTransform: 'uppercase',
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      {userProfile?.full_name || 'User Name'}
                    </Typography>
                    <Typography variant="h6" sx={{ 
                      color: '#333333', 
                      mt: 1,
                      textAlign: { xs: 'center', md: 'left' }
                    }}>
                      {userProfile?.phone_number || '+38761111111'}
                    </Typography>
                    {userProfile?.city_id && cities[userProfile.city_id] && (
                      <Typography variant="body1" sx={{ 
                        color: '#555555', 
                        mt: 0.5,
                        textAlign: { xs: 'center', md: 'left' }
                      }}>
                        {cities[userProfile.city_id]}
                      </Typography>
                    )}
                  </>
                )}
              </Box>
            </Box>

            {/* Edit/Save/Cancel Buttons */}
            <Box sx={{ 
              display: 'flex', 
              mt: { xs: 2, md: 0 },
              gap: 1
            }}>
              {isEditing ? (
                <>
                  <Button 
                    variant="contained" 
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                    disabled={profileLoading}
                    sx={{
                      backgroundColor: '#4CAF50',
                      color: 'white',
                      fontWeight: 'bold',
                      '&:hover': {
                        backgroundColor: '#388E3C'
                      }
                    }}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<CancelIcon />}
                    onClick={toggleEditMode}
                    sx={{
                      borderColor: '#F44336',
                      color: '#F44336',
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#D32F2F',
                        backgroundColor: 'rgba(244, 67, 54, 0.04)'
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button 
                  variant="contained" 
                  startIcon={<EditIcon />}
                  onClick={toggleEditMode}
                  sx={{
                    backgroundColor: '#FF5722',
                    color: 'white',
                    fontWeight: 'bold',
                    py: 1.5,
                    px: 4,
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: '#E64A19'
                    }
                  }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>
          </Box>
          
          {/* Show personal details when not editing */}
          <Collapse in={!isEditing && !!userProfile?.personal_details}>
            <Paper elevation={0} sx={{ 
              mt: 2, 
              p: 2, 
              bgcolor: 'rgba(241, 90, 36, 0.05)',
              borderRadius: 2,
              ml: { md: '200px' } // Align with the name
            }}>
              <Typography variant="body1" sx={{ color: '#555555' }}>
                {userProfile?.personal_details}
              </Typography>
            </Paper>
          </Collapse>
        </Container>
      </Box>
    
      {/* Books Filter and Grid with Orange Background */}
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #F15A24, #8B3415)', 
        py: 4,
        height: '100%',  // Changed from minHeight to height
        flexGrow: 1,     // Make it grow to fill available space
        position: 'relative',
        zIndex: 1
      }}>
        <Container maxWidth="xl" sx={{ pt: { xs: 4, md: 6 } }}> {/* Increased top padding for desktop to accommodate profile picture overlap */}
          {/* Filter Dropdown */}
          <Box sx={{ 
            mb: 4, 
            display: 'flex', 
            justifyContent: 'flex-end' // Align to the right side
          }}>
            <FormControl
              variant="filled"
              sx={{
                width: { xs: '100%', sm: '300px' },
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
                value={filter}
                onChange={handleFilterChange}
                displayEmpty
                IconComponent={ExpandMoreIcon}
                MenuProps={MenuProps}
              >
                <MenuItem value={ProductStatus.SELLING}>Selling</MenuItem>
                <MenuItem value={ProductStatus.SOLD}>Sold</MenuItem>
                <MenuItem value={ProductStatus.BOUGHT}>Bought</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Loading Indicator */}
          {userProductsLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress sx={{ color: 'white' }} />
            </Box>
          )}

          {/* Error Message */}
          {userProductsError && (
            <Alert severity="error" sx={{ mb: 4 }}>
              {userProductsError}
            </Alert>
          )}

          {/* No Products Message */}
          {!userProductsLoading && userProducts.length === 0 && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '200px' 
            }}>
              <Typography variant="h5" sx={{ color: 'white' }}>
                {filter === ProductStatus.SELLING 
                  ? "You don't have any products for sale."
                  : filter === ProductStatus.SOLD 
                  ? "You haven't sold any products yet."
                  : "You haven't bought any products yet."}
              </Typography>
            </Box>
          )}
          
          {/* Books Grid */}
          <Grid container spacing={3} sx={{ mb: 6 }}>
            {userProducts.map((book: Product) => (
             <Grid item xs={12} sm={6} md={4} lg={3} key={book.id}>
             <Card 
               sx={{ 
                 position: 'relative',
                 width: '100%',
                 height: { xs: '200px', sm: '176px' },
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
               {/* Edit/Delete buttons overlay - only shown when editing */}
               {isEditing && (
                 <Box sx={{
                   position: 'absolute',
                   top: 0,
                   right: 0,
                   zIndex: 10,
                   display: 'flex',
                   gap: 0.5,
                   p: 0.5,
                   backgroundColor: 'rgba(0,0,0,0.5)',
                   borderBottomLeftRadius: '8px'
                 }}>
                   <IconButton 
                     size="small" 
                     onClick={(e) => {
                       e.stopPropagation();
                       navigate(`/product/edit/${book.id}`);
                     }}
                     sx={{ 
                       color: 'white', 
                       bgcolor: '#4CAF50',
                       '&:hover': { bgcolor: '#388E3C' },
                       width: 30,
                       height: 30
                     }}
                   >
                     <EditIcon fontSize="small" />
                   </IconButton>
                   <IconButton 
                     size="small" 
                     onClick={(e) => {
                       e.stopPropagation();
                       handleDeleteBook(book.id);
                     }}
                     sx={{ 
                       color: 'white', 
                       bgcolor: '#F44336',
                       '&:hover': { bgcolor: '#D32F2F' },
                       width: 30,
                       height: 30
                     }}
                   >
                     <DeleteIcon fontSize="small" />
                   </IconButton>
                 </Box>
               )}
               
               <CardActionArea 
                 onClick={() => navigate(`/product/${book.id}`)}
                 sx={{ 
                   display: 'flex',
                   flexDirection: 'row',
                   height: '100%',
                   width: '100%',
                   padding: 0
                 }}
               >
                 {/* Rest of your existing card content... */}
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
                          image={book.image_url}
                          alt={book.name}
                        />
                      </Box>
                    </Box>
                    
                    {/* Content Container */}
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
                        {book.name}
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
                        {book.author}
                      </Typography>
                      
                      {/* Condition as text */}
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
                          {book.state?.name || "Unknown"}
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
                        {typeof book.price === 'string' 
                          ? parseFloat(book.price).toFixed(2) 
                          : book.price.toFixed(2)} BAM
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Delete Confirmation Dialog */}
<Dialog
  open={deleteConfirmOpen}
  onClose={() => setDeleteConfirmOpen(false)}
>
  <DialogTitle>Confirm Deletion</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this book? This action cannot be undone.
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setDeleteConfirmOpen(false)} color="primary">
      Cancel
    </Button>
    <Button onClick={confirmDeleteBook} color="error" autoFocus>
      Delete
    </Button>
  </DialogActions>
</Dialog>
    </Box>

    
  );
};

export default ProfilePage;