import React, { useState } from "react";
import { 
  Box, Typography, Button, Container, Paper, 
  useTheme, Grid, useMediaQuery, Card, CardContent,
  List, ListItem, ListItemIcon, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, InputAdornment, IconButton, Snackbar, Alert
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BookIcon from "@mui/icons-material/Book";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';

const HeroPage = () => {
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
    
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State for payment dialog
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // Payment form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [formErrors, setFormErrors] = useState({
    cardName: '',
    cardNumber: '',
    cardCVC: '',
    cardExpiry: ''
  });

  const features = [
    {
      title: "Extensive Book Selection",
      description: "Browse through thousands of educational books, textbooks, and resources for all academic levels."
    },
    {
      title: "Easy Checkout",
      description: "Simple and secure checkout process with multiple payment options for your convenience."
    },
    {
      title: "Personal Account",
      description: "Track your orders, manage your wishlist, and receive personalized recommendations."
    }
  ];

  // Plans data with features
  const plans = [
    {
      title: "Free",
      price: "0 BAM",
      defaultBgColor: "#943415", // Dark brown background by default
      hoverBgColor: "#FFFFFF", // White background on hover
      defaultTextColor: "#FFFFFF", // White text by default
      hoverTextColor: "#333333", // Dark text on hover
      defaultBtnBgColor: "#FFFFFF", // White button by default
      hoverBtnBgColor: "#F15A24", // Orange button on hover
      defaultBtnTextColor: "#F15A24", // Orange text by default
      hoverBtnTextColor: "#FFFFFF", // White text on hover
      features: [
        "access to books that are listed for sale",
        "find books you are interested in",
        "buy books you are interested in having",
        "act as a seller",
        "get rid of unwanted books",
        "make profit",
        "publish up to 20 books",
        "publish up to 50 books"
      ],
      unlockedFeatures: 3, // First 3 features are unlocked in Free
    },
    {
      title: "Premium",
      price: "10 BAM",
      defaultBgColor: "#943415", // Dark brown background by default
      hoverBgColor: "#FFFFFF", // White background on hover
      defaultTextColor: "#FFFFFF", // White text by default
      hoverTextColor: "#333333", // Dark text on hover
      defaultBtnBgColor: "#FFFFFF", // White button by default
      hoverBtnBgColor: "#F15A24", // Orange button on hover
      defaultBtnTextColor: "#F15A24", // Orange text by default
      hoverBtnTextColor: "#FFFFFF", // White text on hover
      features: [
        "access to books that are listed for sale",
        "find books you are interested in",
        "buy books you are interested in having",
        "act as a seller",
        "get rid of unwanted books",
        "make profit",
        "publish up to 20 books",
        "publish up to 50 books"
      ],
      unlockedFeatures: 7, // First 7 features are unlocked in Premium
    },
    {
      title: "Premium +",
      price: "20 BAM",
      defaultBgColor: "#943415", // Dark brown background by default
      hoverBgColor: "#FFFFFF", // White background on hover
      defaultTextColor: "#FFFFFF", // White text by default
      hoverTextColor: "#333333", // Dark text on hover
      defaultBtnBgColor: "#FFFFFF", // White button by default
      hoverBtnBgColor: "#F15A24", // Orange button on hover
      defaultBtnTextColor: "#F15A24", // Orange text by default
      hoverBtnTextColor: "#FFFFFF", // White text on hover
      features: [
        "access to books that are listed for sale",
        "find books you are interested in",
        "buy books you are interested in having",
        "act as a seller",
        "get rid of unwanted books",
        "make profit",
        "publish up to 20 books",
        "publish up to 50 books"
      ],
      unlockedFeatures: 8, // All features are unlocked in Premium+
    }
  ];

  const handleActivatePlan = (planTitle: string) => {
    if (planTitle === "Free") {
      // Free plan doesn't need payment
      setSelectedPlan("Free");
      setShowSuccessAlert(true);
      return;
    }
    
    setSelectedPlan(planTitle);
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    // Reset form
    setCardName('');
    setCardNumber('');
    setCardCVC('');
    setCardExpiry('');
    setFormErrors({
      cardName: '',
      cardNumber: '',
      cardCVC: '',
      cardExpiry: ''
    });
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Format card number with spaces after every 4 digits
    const value = e.target.value.replace(/\D/g, '').substring(0, 16);
    const formattedValue = value.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    setCardNumber(formattedValue);
    
    // Validate
    if (value.length < 16) {
      setFormErrors({...formErrors, cardNumber: 'Card number must be 16 digits'});
    } else {
      setFormErrors({...formErrors, cardNumber: ''});
    }
  };

  const handleCardCVCChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCVC(value);
    
    // Validate
    if (value.length < 3) {
      setFormErrors({...formErrors, cardCVC: 'CVC must be 3 digits'});
    } else {
      setFormErrors({...formErrors, cardCVC: ''});
    }
  };

  const handleCardExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format MM/YY
    if (value.length > 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    setCardExpiry(value);
    
    // Validate
    if (value.replace('/', '').length < 4) {
      setFormErrors({...formErrors, cardExpiry: 'Enter a valid expiry date'});
    } else {
      setFormErrors({...formErrors, cardExpiry: ''});
    }
  };

  const handleCardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCardName(value);
    
    // Validate
    if (value.trim().length < 3) {
      setFormErrors({...formErrors, cardName: 'Enter the name on your card'});
    } else {
      setFormErrors({...formErrors, cardName: ''});
    }
  };

  const isPaymentFormValid = () => {
    return (
      cardName.trim().length > 2 &&
      cardNumber.replace(/\s/g, '').length === 16 &&
      cardCVC.length === 3 &&
      cardExpiry.replace('/', '').length === 4
    );
  };

  const handleSubmitPayment = () => {
    if (isPaymentFormValid()) {
      // In a real app, you would process payment here
      handleClosePaymentDialog();
      setShowSuccessAlert(true);
    } else {
      // Highlight all errors
      setFormErrors({
        cardName: cardName.trim().length < 3 ? 'Enter the name on your card' : '',
        cardNumber: cardNumber.replace(/\s/g, '').length < 16 ? 'Card number must be 16 digits' : '',
        cardCVC: cardCVC.length < 3 ? 'CVC must be 3 digits' : '',
        cardExpiry: cardExpiry.replace('/', '').length < 4 ? 'Enter a valid expiry date' : ''
      });
    }
  };

  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
    navigate('/');  // Redirect to home or dashboard
  };

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: "100vh",
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 16 },
          position: "relative",
          overflow: "hidden"
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: "relative", zIndex: 2 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  sx={{
                    mb: 2,
                    color: "#fff",
                    fontSize: { xs: "2.5rem", md: "3.5rem" }
                  }}
                >
                  SchoolBooks application
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 3, 
                    color: "#000",
                    fontWeight: "bold",
                    fontSize: { xs: "1.5rem", md: "2rem" }
                  }}
                >
                  "Find. Sell. Buy"
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 2, 
                    color: "#fff",
                    maxWidth: "90%",
                    lineHeight: 1.6
                  }}
                >
                  SchoolBooks is a web and mobile application where users can find, sell,
                  and buy books for primary, secondary school as well as universities.
                  It's done in a way that people resell books they no longer want or need.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 2, 
                    color: "#fff",
                    maxWidth: "90%",
                    lineHeight: 1.6
                  }}
                >
                  It makes the job of street booksellers more simple and easier because
                  they do not need to spend a great amount of time on the streets especially
                  when the demand isn't that high.
                </Typography>
                <Typography
                  variant="body1"
                  sx={{ 
                    mb: 4, 
                    color: "#fff",
                    maxWidth: "90%",
                    lineHeight: 1.6
                  }}
                >
                  In that manner, target groups can make profit and get rid of books others
                  can benefit from.
                </Typography>

                <Box sx={{ display: "flex", gap: 2, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/register"
                    sx={{ 
                      borderRadius: 1, 
                      px: 4,
                      py: 1,
                      fontWeight: "bold",
                      backgroundColor: "#8B2B11",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#6B1B01",
                      },
                      width: { xs: "100%", sm: "auto" }
                    }}
                  >
                    Sign Up
                  </Button>
                  
                  <Button
                    variant="contained"
                    size="large"
                    component={RouterLink}
                    to="/login"
                    sx={{ 
                      borderRadius: 1, 
                      px: 4,
                      py: 1,
                      fontWeight: "bold",
                      backgroundColor: "#F15A24",
                      color: "#fff",
                      "&:hover": {
                        backgroundColor: "#D34A14",
                      },
                      width: { xs: "100%", sm: "auto" }
                    }}
                  >
                    Sign In
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: "none", md: "block" } }}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center"
                }}
              >
                <Box
                  component="img"
                  src="phones.png"
                  alt="SchoolBooks Mobile"
                  sx={{
                    width: "180%",
                    maxWidth: 1500,
                    height: "auto",
                    filter: "drop-shadow(0px 10px 20px rgba(0,0,0,0.15))",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Plans Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 1, color: "#fff" }}
          >
            Choose your plan
          </Typography>
          
          <Typography
            variant="h5"
            textAlign="center"
            fontWeight="bold"
            sx={{ mb: 6, color: "#000" }}
          >
            Find a plan that suits you and your needs!
          </Typography>
          
          <Box sx={{ 
            display: "flex", 
            justifyContent: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: 3
          }}>
            {plans.map((plan, index) => (
              <Paper 
                key={index} 
                sx={{ 
                  maxWidth: 350, 
                  width: "100%",
                  backgroundColor: plan.defaultBgColor,
                  color: plan.defaultTextColor,
                  borderRadius: 2,
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 8,
                    backgroundColor: plan.hoverBgColor,
                    color: plan.hoverTextColor,
                    "& .activateBtn": {
                      backgroundColor: plan.hoverBtnBgColor,
                      color: plan.hoverBtnTextColor,
                    }
                  }
                }}
                elevation={3}
              >
                <Box sx={{ p: 3 }}>
                  <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                    {plan.title}
                  </Typography>
                  
                  <Typography variant="h3" component="div" fontWeight="bold" sx={{ mb: 0.5 }}>
                    {plan.price}
                  </Typography>
                  
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                    per user / month
                  </Typography>
                  
                  <Button 
                    variant="contained" 
                    fullWidth
                    className="activateBtn"
                    onClick={() => handleActivatePlan(plan.title)}
                    sx={{ 
                      mb: 3, 
                      backgroundColor: plan.defaultBtnBgColor,
                      color: plan.defaultBtnTextColor,
                      fontWeight: "bold",
                      borderRadius: 2,
                      py: 1.5
                    }}
                  >
                    Activate Plan
                  </Button>
                  
                  <Box component="ul" sx={{ p: 0, listStyleType: "none" }}>
                    {plan.features.map((feature, featureIndex) => {
                      // Determine if the feature is locked based on plan type
                      const isLocked = 'unlockedFeatures' in plan && 
                                      featureIndex >= (plan.unlockedFeatures as number);
                      
                      return (
                        <Box 
                          component="li" 
                          key={featureIndex} 
                          sx={{ 
                            display: "flex", 
                            alignItems: "flex-start",
                            mb: 1.5,
                            opacity: isLocked ? 0.5 : 1, // Fade out locked features
                            color: isLocked ? "inherit" : "inherit"
                          }}
                        >
                          <Typography component="span" sx={{ mr: 1, fontSize: 16 }}>•</Typography>
                          <Typography variant="body2" sx={{ fontSize: 14 }}>
                            {feature}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            component="h2"
            fontWeight="bold"
            textAlign="center"
            sx={{ mb: 6, color: "#fff" }}
          >
            Why Choose SchoolBooks?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    height: "100%",
                    borderRadius: 2,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    border: "1px solid #f0f0f0",
                    backgroundColor: "#fff"
                  }}
                >
                  <Box sx={{ mb: 3, color: "#F15A24" }}>
                    {index === 0 ? (
                      <SchoolIcon fontSize="large" />
                    ) : index === 1 ? (
                      <ShoppingBasketIcon fontSize="large" />
                    ) : (
                      <PersonAddIcon fontSize="large" />
                    )}
                  </Box>
                  <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: "#333" }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: "#666" }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}>
        <Container>
          <Typography variant="body2" color="white" textAlign="center">
            © {new Date().getFullYear()} SchoolBooks. All rights reserved.
          </Typography>
        </Container>
      </Box>

      {/* Payment Dialog */}
      <Dialog
        open={openPaymentDialog}
        onClose={handleClosePaymentDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src="schoolbooks_logo.png"
              alt="SchoolBooks Logo"
              sx={{ 
                height: 40,
                width: 'auto',
                mr: 2
              }}
            />
            <Typography variant="h6">Complete payment</Typography>
          </Box>
          <IconButton edge="end" onClick={handleClosePaymentDialog}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="cardName"
              label="Name on Card"
              name="cardName"
              autoComplete="cc-name"
              value={cardName}
              onChange={handleCardNameChange}
              error={!!formErrors.cardName}
              helperText={formErrors.cardName}
              sx={{ mb: 3 }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="cardNumber"
              label="Card Number"
              name="cardNumber"
              autoComplete="cc-number"
              value={cardNumber}
              onChange={handleCardNumberChange}
              error={!!formErrors.cardNumber}
              helperText={formErrors.cardNumber}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CreditCardIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="cardCVC"
                  label="CCV"
                  name="cardCVC"
                  autoComplete="cc-csc"
                  value={cardCVC}
                  onChange={handleCardCVCChange}
                  error={!!formErrors.cardCVC}
                  helperText={formErrors.cardCVC}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  id="cardExpiry"
                  label="EXP Date"
                  name="cardExpiry"
                  placeholder="MM/YY"
                  autoComplete="cc-exp"
                  value={cardExpiry}
                  onChange={handleCardExpiryChange}
                  error={!!formErrors.cardExpiry}
                  helperText={formErrors.cardExpiry}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EventIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmitPayment}
            sx={{
              py: 1.5,
              backgroundColor: "#F15A24",
              '&:hover': {
                backgroundColor: "#E04613",
              },
              borderRadius: 1
            }}
          >
            Complete Payment
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Alert */}
      <Snackbar
        open={showSuccessAlert}
        autoHideDuration={6000}
        onClose={handleCloseSuccessAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSuccessAlert}
          severity="success"
          variant="filled"
          icon={<CheckCircleIcon />}
          sx={{ width: '100%', mb: 2 }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Congratulations!
          </Typography>
          <Typography variant="body2">
            You are now a {selectedPlan} user. Enjoy your benefits!
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default HeroPage;