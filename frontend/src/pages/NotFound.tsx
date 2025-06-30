import React from "react";
import { 
  Box, Typography, Button, Container, Paper, 
  useTheme, Grid, Divider, SvgIcon
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import BookIcon from "@mui/icons-material/Book";

// Custom 404 SVG icon
const NotFoundSvg = (props) => (
  <SvgIcon {...props} viewBox="0 0 24 24" sx={{ width: 300, height: 300 }}>
    <path
      d="M19.5 3L12 7.5L4.5 3L1.5 4.5V15.5L12 21L22.5 15.5V4.5L19.5 3Z"
      fill="#f5f5f5"
      stroke="#2196f3"
      strokeWidth="0.4"
    />
    <text
      x="12"
      y="14"
      textAnchor="middle"
      fill="#f44336"
      fontWeight="bold"
      fontSize="6"
    >
      404
    </text>
    <path
      d="M15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z"
      fill="#e0e0e0"
    />
  </SvgIcon>
);

const NotFound = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="md" sx={{ height: "100vh", display: "flex", alignItems: "center" }}>
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          p: 4,
          borderRadius: 3,
          textAlign: "center",
          overflow: "hidden",
          position: "relative",
          boxShadow: 3
        }}
      >
        {/* Error banner */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "8px",
            background: `linear-gradient(90deg, ${theme.palette.error.main} 0%, ${theme.palette.error.light} 50%, ${theme.palette.error.main} 100%)`
          }}
        />

        <Box sx={{ py: 3, display: "flex", justifyContent: "center" }}>
          <ErrorOutlineIcon
            sx={{
              fontSize: 80,
              color: theme.palette.error.main,
              animation: "pulse 2s infinite",
              "@keyframes pulse": {
                "0%": { opacity: 0.7, transform: "scale(0.95)" },
                "50%": { opacity: 1, transform: "scale(1.05)" },
                "100%": { opacity: 0.7, transform: "scale(0.95)" }
              }
            }}
          />
        </Box>

        <Typography
          variant="h2"
          component="h1"
          fontWeight="bold"
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.error.dark}, ${theme.palette.error.main})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography variant="h5" fontWeight="medium" gutterBottom>
          <span style={{ color: theme.palette.error.main }}>Oops!</span> Page Not Found
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: "auto" }}>
          The page you are looking for might have been removed, had its name changed, 
          or is temporarily unavailable.
        </Typography>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={3} sx={{ mb: 4, px: 2 }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                <SearchIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Looking for educational books?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Head back to our homepage to browse our collection of textbooks and educational resources.
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ p: 2, bgcolor: "rgba(0,0,0,0.02)", borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                <BookIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                Need assistance?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                If you're having trouble finding what you need, our support team is ready to help.
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/"
            startIcon={<HomeIcon />}
            sx={{ 
              borderRadius: 2, 
              py: 1.2, 
              px: 3,
              fontWeight: "bold",
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
              }
            }}
          >
            Back to Home
          </Button>
          
          <Button
            variant="outlined"
            component={RouterLink}
            to="/contact"
            sx={{ 
              borderRadius: 2, 
              py: 1.2, 
              px: 3,
              fontWeight: "bold",
              transition: "transform 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: 1
              }
            }}
          >
            Contact Support
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;