import React, { useState } from 'react';
import { Box, IconButton, MobileStepper } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface MobileGalleryProps {
  images: string[];
}

const MobileGallery: React.FC<MobileGalleryProps> = ({ images }) => {
  const [activeStep, setActiveStep] = useState(0);
  const maxSteps = images.length;

  // If no images are provided, return a placeholder
  if (images.length === 0) {
    return (
      <Box
        component="img"
        src="/placeholder-image.jpg"
        alt="Product"
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: 2,
        }}
      />
    );
  }

  const handleNext = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep + 1) % maxSteps);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => (prevActiveStep - 1 + maxSteps) % maxSteps);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box
        component="img"
        src={images[activeStep]}
        alt={`Product view ${activeStep + 1}`}
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
      
      {maxSteps > 1 && (
        <>
          <IconButton
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            onClick={handleBack}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
              },
            }}
            onClick={handleNext}
          >
            <ArrowForwardIosIcon />
          </IconButton>
          
          <MobileStepper
            steps={maxSteps}
            position="static"
            activeStep={activeStep}
            sx={{
              backgroundColor: 'transparent',
              position: 'absolute',
              bottom: 0,
              width: '100%',
              '& .MuiMobileStepper-dot': {
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
              },
              '& .MuiMobileStepper-dotActive': {
                backgroundColor: '#F15A24',
              },
            }}
            nextButton={<Box />}
            backButton={<Box />}
          />
        </>
      )}
    </Box>
  );
};

export default MobileGallery;