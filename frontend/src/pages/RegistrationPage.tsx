import React, { useEffect, useState } from 'react';
import { useAppDispatch, RootState } from '../store';
import { registerUser } from '../store/authSlice';
import { useSelector } from 'react-redux';
import { RegistrationFormData } from '../utils/type';
import { 
  Button, TextField, Box, Typography, Container, Paper, 
  InputAdornment, IconButton, Divider, Link, useTheme,
  Alert, CircularProgress, Grid, Stepper, Step, StepLabel
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PhoneIcon from '@mui/icons-material/Phone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const RegistrationPage = () => {
      // Hide navbar when on hero page
      React.useEffect(() => {
        // Get the navbar element
        const navbar = document.querySelector("nav") || document.querySelector("header");
        
        // Store original display value
        const originalDisplay = navbar?.style.display;
        
        // Hide navbar
        if (navbar) {
          navbar.style.display = "none";
        }
        
        // Restore navbar when component unmounts
        return () => {
          if (navbar) {
            navbar.style.display = originalDisplay || "";
          }
        };
      }, []);
        
    const [formData, setFormData] = useState<RegistrationFormData>({
        fullName: '',
        email: '',
        password: '',
        password_confirmation: '',
        phoneNumber: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [formErrors, setFormErrors] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
    });
    
    const dispatch = useAppDispatch();
    const { error, loading, success } = useSelector((state: RootState) => state.auth);
    const theme = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (success) {
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        }
    }, [success, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Create updated form data
    const updatedFormData = {
        ...formData,
        [name]: value
    };
    
    // If password field is being changed, automatically update password_confirmation
    if (name === 'password') {
        updatedFormData.password_confirmation = value;
    }
    
    setFormData(updatedFormData);
    
    // Basic validation
    validateField(name, value);
    };
    
    const validateField = (name: string, value: string) => {
        let error = '';
        
        switch (name) {
            case 'fullName':
                error = value.length < 3 ? 'Full name must be at least 3 characters' : '';
                break;
            case 'email':
                error = !/\S+@\S+\.\S+/.test(value) ? 'Email address is invalid' : '';
                break;
            case 'password':
                error = value.length < 6 ? 'Password must be at least 6 characters' : '';
                break;
            case 'phoneNumber':
                error = !/^\d{10,}$/.test(value.replace(/\D/g, '')) ? 'Phone number must have at least 10 digits' : '';
                break;
            default:
                break;
        }
        
        setFormErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const isFormValid = () => {
        return (
            formData.fullName.trim() !== '' &&
            formData.email.trim() !== '' &&
            formData.password.trim() !== '' &&
            formData.phoneNumber.trim() !== '' &&
            Object.values(formErrors).every(error => error === '')
        );
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (isFormValid()) {
            dispatch(registerUser(formData));
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box sx={{ 
            background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 4,
            pb: 4
        }}>
            <Container component="main" maxWidth="md">
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center' 
                }}>
                    <Paper 
                        elevation={3} 
                        sx={{ 
                            p: 4, 
                            width: '100%', 
                            borderRadius: 3,
                            bgcolor: theme.palette.background.paper,
                        }}
                    >
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                            <Box
                                component="img"
                                src="schoolbooks_logo.png"
                                alt="SchoolBooks Logo"
                                sx={{ 
                                    height: 80,
                                    width: 'auto',
                                    mb: 2
                                }}
                            />
                            <Typography 
                                component="h1" 
                                variant="h4" 
                                fontWeight="bold"
                                sx={{ 
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent'
                                }}
                            >
                                Create Your Account
                            </Typography>
                        </Box>

                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ mb: 3, borderRadius: 2 }}
                            >
                                {error}
                            </Alert>
                        )}
                        
                        {success && (
                            <Alert 
                                icon={<CheckCircleIcon fontSize="inherit" />}
                                severity="success" 
                                sx={{ mb: 3, borderRadius: 2 }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Registration successful!
                                </Typography>
                                <Typography variant="body2">
                                    You will be redirected to the login page shortly...
                                </Typography>
                            </Alert>
                        )}

                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="fullName"
                                        label="Full Name"
                                        name="fullName"
                                        autoComplete="name"
                                        autoFocus
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        error={!!formErrors.fullName}
                                        helperText={formErrors.fullName}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Grid>
                                
                           
                                
                                <Grid item xs={12}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email Address"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={!!formErrors.email}
                                        helperText={formErrors.email}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Password"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        error={!!formErrors.password}
                                        helperText={formErrors.password}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockIcon color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={togglePasswordVisibility}
                                                        edge="end"
                                                    >
                                                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="phoneNumber"
                                        label="Phone Number"
                                        id="phoneNumber"
                                        autoComplete="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        error={!!formErrors.phoneNumber}
                                        helperText={formErrors.phoneNumber}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2,
                                            }
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={loading || !isFormValid()}
                                startIcon={loading ? <CircularProgress size={20} /> : <HowToRegIcon />}
                                sx={{ 
                                    mt: 3, 
                                    mb: 2,
                                    py: 1.5,
                                    borderRadius: 2,
                                    fontWeight: 'bold',
                                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                                    transition: 'transform 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: 3,
                                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                                    }
                                }}
                            >
                                {loading ? 'Creating Account...' : 'Register'}
                            </Button>
                            
                            <Divider sx={{ my: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    OR
                                </Typography>
                            </Divider>
                            
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                    Already have an account?
                                </Typography>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    variant="outlined"
                                    startIcon={<ArrowBackIcon />}
                                    fullWidth
                                    sx={{ 
                                        borderRadius: 2,
                                        py: 1.5,
                                        fontWeight: 'bold',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: 1
                                        }
                                    }}
                                >
                                    Back to Login
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
};

export default RegistrationPage;