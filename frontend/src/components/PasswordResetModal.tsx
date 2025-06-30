import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../store';
import { forgotPassword, resetPassword, clearResetPasswordState } from '../store/authSlice';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({ open, onClose }) => {
  const [step, setStep] = useState(0); // 0: email, 1: reset form, 2: success
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const dispatch = useAppDispatch();
  const { resetPasswordLoading, resetPasswordSuccess, resetPasswordError } = useSelector(
    (state: RootState) => state.auth
  );

  const steps = ['Enter Email', 'Reset Password', 'Complete'];

  useEffect(() => {
    if (resetPasswordSuccess) {
      setStep(2);
    }
  }, [resetPasswordSuccess]);

  useEffect(() => {
    if (!open) {
      // Reset form when modal closes
      setTimeout(() => {
        setStep(0);
        setEmail('');
        setToken('');
        setPassword('');
        setPasswordConfirmation('');
        setEmailSent(false);
        dispatch(clearResetPasswordState());
      }, 300);
    }
  }, [open, dispatch]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    try {
      await dispatch(forgotPassword(email)).unwrap();
      setEmailSent(true);
      setStep(1);
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !password || !passwordConfirmation) return;

    if (password !== passwordConfirmation) {
      // Handle password mismatch
      return;
    }

    try {
      await dispatch(resetPassword({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation
      })).unwrap();
    } catch (error) {
      // Error is handled by the reducer
    }
  };

  const handleClose = () => {
    onClose();
  };

  const renderEmailStep = () => (
    <Box component="form" onSubmit={handleForgotPassword}>
      <DialogContent>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>
        
        {resetPasswordError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {resetPasswordError}
          </Alert>
        )}

        <TextField
          autoFocus
          margin="dense"
          id="email"
          label="Email Address"
          type="email"
          fullWidth
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={resetPasswordLoading || !email}
          startIcon={resetPasswordLoading ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: "#F15A24",
            "&:hover": {
              backgroundColor: "#D34A14",
            },
          }}
        >
          {resetPasswordLoading ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </DialogActions>
    </Box>
  );

  const renderResetStep = () => (
    <Box component="form" onSubmit={handleResetPassword}>
      <DialogContent>
        {emailSent && (
          <Alert severity="success" sx={{ mb: 3 }}>
            We have emailed your password reset link! Check your inbox and enter the token below.
          </Alert>
        )}

        {resetPasswordError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {resetPasswordError}
          </Alert>
        )}

        <TextField
          margin="dense"
          id="token"
          label="Reset Token"
          fullWidth
          variant="outlined"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          required
          sx={{
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
        />

        <TextField
          margin="dense"
          id="password"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
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
          margin="dense"
          id="passwordConfirmation"
          label="Confirm New Password"
          type={showPasswordConfirmation ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          error={password !== passwordConfirmation && passwordConfirmation !== ''}
          helperText={
            password !== passwordConfirmation && passwordConfirmation !== ''
              ? 'Passwords do not match'
              : ''
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                  edge="end"
                >
                  {showPasswordConfirmation ? <VisibilityOffIcon /> : <VisibilityIcon />}
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
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={() => setStep(0)} color="inherit">
          Back
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={
            resetPasswordLoading ||
            !token ||
            !password ||
            !passwordConfirmation ||
            password !== passwordConfirmation
          }
          startIcon={resetPasswordLoading ? <CircularProgress size={20} /> : null}
          sx={{
            backgroundColor: "#F15A24",
            "&:hover": {
              backgroundColor: "#D34A14",
            },
          }}
        >
          {resetPasswordLoading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </DialogActions>
    </Box>
  );

  const renderSuccessStep = () => (
    <>
      <DialogContent sx={{ textAlign: 'center', py: 4 }}>
        <CheckCircleIcon
          sx={{ fontSize: 64, color: 'success.main', mb: 2 }}
        />
        <Typography variant="h6" sx={{ mb: 2 }}>
          Password Reset Successfully!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Your password has been reset successfully. You can now login with your new password.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: 'center' }}>
        <Button
          variant="contained"
          onClick={handleClose}
          sx={{
            backgroundColor: "#F15A24",
            "&:hover": {
              backgroundColor: "#D34A14",
            },
            px: 4
          }}
        >
          Continue to Login
        </Button>
      </DialogActions>
    </>
  );

  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          Reset Password
        </Typography>
        <Stepper activeStep={step} sx={{ mt: 2 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </DialogTitle>

      {step === 0 && renderEmailStep()}
      {step === 1 && renderResetStep()}
      {step === 2 && renderSuccessStep()}
    </Dialog>
  );
};

export default PasswordResetModal;