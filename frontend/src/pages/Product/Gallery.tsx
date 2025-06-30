import React, { useState } from 'react';
import { Box, Grid, Paper } from '@mui/material';

interface GalleryProps {
  images: string[];
}

const Gallery: React.FC<GalleryProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(images[0] || '');

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
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
    );
  }

  // If there's only one image, just display it without thumbnails
  if (images.length === 1) {
    return (
      <Box
        component="img"
        src={images[0]}
        alt="Product"
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
    );
  }

  return (
    <Box>
      {/* Main image display */}
      <Box
        component="img"
        src={mainImage}
        alt="Product main view"
        sx={{
          width: '100%',
          height: 'auto',
          borderRadius: 2,
          mb: 2,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        }}
      />
      
      {/* Thumbnail gallery */}
      <Grid container spacing={1}>
        {images.map((img, index) => (
          <Grid item xs={3} key={index}>
            <Paper
              elevation={mainImage === img ? 3 : 1}
              sx={{
                p: 0.5,
                borderRadius: 1,
                cursor: 'pointer',
                border: mainImage === img ? '2px solid #F15A24' : '2px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => setMainImage(img)}
            >
              <Box
                component="img"
                src={img}
                alt={`Product view ${index + 1}`}
                sx={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: 0.5,
                  opacity: mainImage === img ? 1 : 0.7,
                }}
              />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Gallery;