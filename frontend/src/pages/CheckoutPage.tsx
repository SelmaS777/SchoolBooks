import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import {
  Button, TextField, Typography, Box, Grid, List, ListItem, ListItemText,
  Stepper, Step, StepLabel, Divider, Paper, Container, Card, CardContent,
  useTheme, InputAdornment, MenuItem, Avatar, ListItemAvatar, Alert, IconButton,
  FormControlLabel, Checkbox
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCart } from '../store/cartSlice';
import PersonIcon from '@mui/icons-material/Person';
import HomeIcon from '@mui/icons-material/Home';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SecurityIcon from '@mui/icons-material/Security';
import BookIcon from '@mui/icons-material/Book';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';

const steps = ['Shipping Information', 'Payment Details', 'Review Your Order'];

const CheckoutPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardHolder: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [saveInfo, setSaveInfo] = useState(false);
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      console.log("Finalize Purchase with:", { shippingDetails, paymentDetails });
      dispatch(clearCart());
      navigate('/purchase-confirmation');
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total: number, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  // Form validation logic
  const isShippingFormValid = () => {
    const { firstName, lastName, email, phone, address1, city, state, zip, country } = shippingDetails;
    return firstName && lastName && email && phone && address1 && city && state && zip && country;
  };

  const isPaymentFormValid = () => {
    const { cardHolder, cardNumber, expiryDate, cvv } = paymentDetails;
    return cardHolder && cardNumber && expiryDate && cvv;
  };

  const canProceed = () => {
    if (activeStep === 0) return isShippingFormValid();
    if (activeStep === 1) return isPaymentFormValid();
    return true;
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <LocalShippingIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Shipping Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.firstName}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, firstName: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.lastName}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, lastName: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  fullWidth
                  required
                  type="email"
                  variant="outlined"
                  value={shippingDetails.email}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, email: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.phone}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, phone: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Address Line 1"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.address1}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address1: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 2 (Optional)"
                  fullWidth
                  variant="outlined"
                  value={shippingDetails.address2}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, address2: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <HomeIcon color="action" sx={{ opacity: 0.7 }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.city}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, city: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State/Province"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.state}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, state: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="ZIP / Postal Code"
                  fullWidth
                  required
                  variant="outlined"
                  value={shippingDetails.zip}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, zip: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  fullWidth
                  required
                  variant="outlined"
                  select
                  value={shippingDetails.country}
                  onChange={(e) => setShippingDetails({ ...shippingDetails, country: e.target.value })}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                >
                  <MenuItem value="USA">United States</MenuItem>
                  <MenuItem value="Canada">Canada</MenuItem>
                  <MenuItem value="Mexico">Mexico</MenuItem>
                  <MenuItem value="UK">United Kingdom</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={saveInfo} onChange={(e) => setSaveInfo(e.target.checked)} />}
                  label="Save this information for next time"
                />
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <PaymentIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Payment Details
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Cardholder Name"
                  fullWidth
                  required
                  variant="outlined"
                  value={paymentDetails.cardHolder}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardHolder: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  label="Card Number"
                  fullWidth
                  required
                  variant="outlined"
                  value={paymentDetails.cardNumber}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CreditCardIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Expiry Date (MM/YY)"
                  fullWidth
                  required
                  variant="outlined"
                  placeholder="MM/YY"
                  value={paymentDetails.expiryDate}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarTodayIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  label="CVV"
                  fullWidth
                  required
                  variant="outlined"
                  value={paymentDetails.cvv}
                  onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SecurityIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                />
              </Grid>
            </Grid>
            
            <Alert severity="info" sx={{ mt: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                Your payment information is secure. We use encryption to protect your data.
              </Typography>
            </Alert>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ShoppingBasketIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              Order Review
            </Typography>
            
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Shipping Information
              </Typography>
              <Typography variant="body2">
                {`${shippingDetails.firstName} ${shippingDetails.lastName}`}
              </Typography>
              <Typography variant="body2">
                {shippingDetails.email}
              </Typography>
              <Typography variant="body2">
                {shippingDetails.phone}
              </Typography>
              <Typography variant="body2">
                {shippingDetails.address1}
                {shippingDetails.address2 && `, ${shippingDetails.address2}`}
              </Typography>
              <Typography variant="body2">
                {`${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zip}`}
              </Typography>
              <Typography variant="body2">
                {shippingDetails.country}
              </Typography>
            </Paper>
            
            <Paper elevation={1} sx={{ p: 2, mb: 3, borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Payment Information
              </Typography>
              <Typography variant="body2">
                Card Holder: {paymentDetails.cardHolder}
              </Typography>
              <Typography variant="body2">
                Card Number: **** **** **** {paymentDetails.cardNumber.slice(-4)}
              </Typography>
              <Typography variant="body2">
                Expiry Date: {paymentDetails.expiryDate}
              </Typography>
            </Paper>
            
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
              Order Items
            </Typography>
            
            <List sx={{ mb: 3 }}>
              {cartItems.map((item) => (
                <ListItem key={item.productId}>
                  <ListItemAvatar>
                    <Avatar 
                      variant="rounded" 
                      src={item.image}
                      sx={{ width: 60, height: 60, mr: 1 }}
                    >
                      <BookIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Quantity: ${item.quantity} × $${Number(item.price).toFixed(2)}`}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
              <Typography variant="body2">
                Please review your order details before confirming the purchase.
              </Typography>
            </Alert>
          </Box>
        );
      default:
        throw new Error('Unknown step');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" sx={{ mb: 4 }}>
        Checkout
      </Typography>

      <Paper elevation={3} sx={{ p: { xs: 2, md: 3 }, borderRadius: 2, mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            {getStepContent(activeStep)}
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <Button
                startIcon={<NavigateBeforeIcon />}
                onClick={handleBack}
                disabled={activeStep === 0}
                sx={{ borderRadius: 2 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                color="primary"
                endIcon={activeStep === steps.length - 1 ? null : <NavigateNextIcon />}
                onClick={handleNext}
                disabled={!canProceed()}
                sx={{ 
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                }}
              >
                {activeStep === steps.length - 1 ? 'Place Order' : 'Continue'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <List disablePadding>
              {cartItems.map((item) => (
                <ListItem key={item.productId} disablePadding sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>
                          {item.name} 
                          <Typography variant="body2" component="span" color="text.secondary">
                            {` × ${item.quantity}`}
                          </Typography>
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Subtotal</Typography>
              <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Shipping</Typography>
              <Typography variant="body1">${shipping.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1">Tax (7%)</Typography>
              <Typography variant="body1">${tax.toFixed(2)}</Typography>
            </Box>
            
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight="bold">Total</Typography>
              <Typography variant="h6" fontWeight="bold" color="primary">
                ${total.toFixed(2)}
              </Typography>
            </Box>
            
            {activeStep === steps.length - 1 && (
              <Button 
                variant="contained" 
                color="primary"
                fullWidth
                size="large"
                onClick={handleNext}
                disabled={!canProceed()}
                sx={{ 
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 'bold',
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  '&:hover': { background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})` }
                }}
              >
                Complete Purchase
              </Button>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;