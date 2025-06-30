import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { login } from '../store/authSlice';
import PasswordResetModal from '../components/PasswordResetModal';
import { 
  Button, TextField, Box, Typography, Container, Paper, 
  InputAdornment, IconButton, Divider, Link, useTheme,
  Alert, CircularProgress
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LoginIcon from '@mui/icons-material/Login';
import SchoolIcon from '@mui/icons-material/School';

const LoginPage = () => {
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
      
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const { userToken, error, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (userToken) {
      navigate('/');
    }
  }, [userToken, navigate]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    dispatch(login({  email, password }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPasswordClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setResetModalOpen(true);
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
      <Container component="main" maxWidth="sm">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
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
                Welcome Back
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

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                label="Password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
              
              <Box sx={{ textAlign: 'right', mb: 2 }}>
                <Link 
                  href="#"
                  onClick={handleForgotPasswordClick}
                  underline="hover"
                  sx={{ 
                    color: theme.palette.text.secondary,
                    cursor: 'pointer'
                  }}
                >
                  Forgot password?
                </Link>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                sx={{ 
                  mt: 1, 
                  mb: 3,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  backgroundColor: "#F15A24",
                  color: "#fff",
                  "&:hover": {
                    backgroundColor: "#D34A14",
                  },
                }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  OR
                </Typography>
              </Divider>
              
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Don't have an account?
                </Typography>
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="outlined"
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
                  Create Account
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>

      <PasswordResetModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
      />
    </Box>
  );
};

export default LoginPage;