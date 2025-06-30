import React, { useState, useEffect } from 'react';
import { 
  Box, Typography, Button, Container, Paper, 
  useTheme, Grid, Dialog, DialogContent, 
  DialogTitle, TextField, InputAdornment,
  DialogActions, IconButton, Alert, Snackbar,
  Chip, CircularProgress
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import LockIcon from '@mui/icons-material/Lock';
import EventIcon from '@mui/icons-material/Event';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchUserProfile, updateUserTier, clearTierUpdateState } from '../store/profileSlice';

const PremiumPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux state
  const { userProfile, loading, tierUpdateLoading, tierUpdateSuccess, tierUpdateError } = useSelector(
    (state: RootState) => state.profile
  );
  
  // State for payment dialog
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
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

  // Fetch user profile on component mount
  useEffect(() => {
    dispatch(fetchUserProfile());
  }, [dispatch]);

  // Handle tier update success
  useEffect(() => {
    if (tierUpdateSuccess) {
      setShowSuccessAlert(true);
      dispatch(clearTierUpdateState());
    }
  }, [tierUpdateSuccess, dispatch]);

  // Plans data with features
  const plans = [
    {
        tier_id: 1,
        title: "Free",
        price: "0 BAM",
        defaultBgColor: "#943415",
        hoverBgColor: "#FFFFFF",
        defaultTextColor: "#FFFFFF",
        hoverTextColor: "#333333",
        defaultBtnBgColor: "#FFFFFF",
        hoverBtnBgColor: "#F15A24",
        defaultBtnTextColor: "#F15A24",
        hoverBtnTextColor: "#FFFFFF",
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
        unlockedFeatures: 3,
      },
    {
      tier_id: 2,
      title: "Premium",
      price: "10 BAM",
      defaultBgColor: "#943415",
      hoverBgColor: "#FFFFFF",
      defaultTextColor: "#FFFFFF",
      hoverTextColor: "#333333",
      defaultBtnBgColor: "#FFFFFF",
      hoverBtnBgColor: "#F15A24",
      defaultBtnTextColor: "#F15A24",
      hoverBtnTextColor: "#FFFFFF",
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
      unlockedFeatures: 7,
    },
    {
      tier_id: 3,
      title: "Premium +",
      price: "20 BAM",
      defaultBgColor: "#943415",
      hoverBgColor: "#FFFFFF",
      defaultTextColor: "#FFFFFF",
      hoverTextColor: "#333333",
      defaultBtnBgColor: "#FFFFFF",
      hoverBtnBgColor: "#F15A24",
      defaultBtnTextColor: "#F15A24",
      hoverBtnTextColor: "#FFFFFF",
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
      unlockedFeatures: 8,
    }
  ];

  const getCurrentTierName = () => {
    if (!userProfile?.tier) return null;
    return userProfile.tier.name;
  };

  const isCurrentTier = (tierId: number) => {
    return userProfile?.tier_id === tierId;
  };

  const handleActivatePlan = (tierId: number) => {
    // Don't allow selecting the same tier
    if (isCurrentTier(tierId)) {
      return;
    }

    if (tierId === 1) {
      // Free plan doesn't need payment
      dispatch(updateUserTier({ tier_id: tierId }));
      return;
    }
    
    setSelectedPlan(tierId);
    setOpenPaymentDialog(true);
  };

  const handleClosePaymentDialog = () => {
    setOpenPaymentDialog(false);
    setSelectedPlan(null);
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
    if (isPaymentFormValid() && selectedPlan) {
      // Update tier after successful payment simulation
      dispatch(updateUserTier({ tier_id: selectedPlan }));
      handleClosePaymentDialog();
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
  };

  const getSelectedPlanTitle = () => {
    const plan = plans.find(p => p.tier_id === selectedPlan);
    return plan?.title || '';
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
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      pt: 4,
      pb: 8
    }}>
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          textAlign="center"
          sx={{ mb: 1, color: "#fff" }}
        >
          Choose your plan
        </Typography>
        
        <Typography
          variant="h5"
          textAlign="center"
          sx={{ mb: 2, color: "#000" }}
        >
          Find a plan that suits you and your needs!
        </Typography>

        {/* Current Tier Display */}
        {userProfile?.tier && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
            <Chip
              icon={<StarIcon />}
              label={`Current Plan: ${getCurrentTierName()}`}
              sx={{
                backgroundColor: '#fff',
                color: '#F15A24',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                py: 1
              }}
            />
          </Box>
        )}
        
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center",
          flexWrap: { xs: "wrap", md: "nowrap" },
          gap: 3
        }}>
          {plans.map((plan, index) => {
            const isCurrent = isCurrentTier(plan.tier_id);
            
            return (
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
                  border: isCurrent ? '3px solid #FFD700' : 'none',
                  position: 'relative',
                  "&:hover": {
                    transform: isCurrent ? 'none' : "translateY(-8px)",
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
                {isCurrent && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#FFD700',
                      color: '#333',
                      px: 2,
                      py: 0.5,
                      fontSize: '0.8rem',
                      fontWeight: 'bold',
                      borderBottomLeftRadius: 8
                    }}
                  >
                    CURRENT
                  </Box>
                )}
                
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
                    onClick={() => handleActivatePlan(plan.tier_id)}
                    disabled={isCurrent || tierUpdateLoading}
                    sx={{ 
                      mb: 3, 
                      backgroundColor: isCurrent ? '#ccc' : plan.defaultBtnBgColor,
                      color: isCurrent ? '#666' : plan.defaultBtnTextColor,
                      fontWeight: "bold",
                      borderRadius: 2,
                      py: 1.5
                    }}
                  >
                    {tierUpdateLoading ? (
                      <CircularProgress size={20} />
                    ) : isCurrent ? (
                      'Current Plan'
                    ) : (
                      'Activate Plan'
                    )}
                  </Button>
                  
                  <Box component="ul" sx={{ p: 0, listStyleType: "none" }}>
                    {plan.features.map((feature, featureIndex) => {
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
                            opacity: isLocked ? 0.5 : 1,
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
            );
          })}
        </Box>
      </Container>

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
            <Typography variant="h6">Complete payment for {getSelectedPlanTitle()}</Typography>
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
            disabled={tierUpdateLoading}
            sx={{
              py: 1.5,
              backgroundColor: "#F15A24",
              '&:hover': {
                backgroundColor: "#E04613",
              },
              borderRadius: 1
            }}
          >
            {tierUpdateLoading ? <CircularProgress size={20} /> : 'Complete Payment'}
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
            Your plan has been updated successfully!
          </Typography>
        </Alert>
      </Snackbar>

      {/* Error Alert */}
      <Snackbar
        open={!!tierUpdateError}
        autoHideDuration={6000}
        onClose={() => dispatch(clearTierUpdateState())}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => dispatch(clearTierUpdateState())}
          severity="error"
          variant="filled"
          sx={{ width: '100%', mb: 2 }}
        >
          <Typography variant="body2">
            {tierUpdateError}
          </Typography>
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PremiumPage;