import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { 
  fetchSavedSearches, 
  deleteSavedSearch, 
  clearSavedSearches 
} from '../store/savedSearchesSlice';
import { 
  Container, Typography, Box, Button, IconButton, Paper, Grid, Divider, 
  useTheme, useMediaQuery, CircularProgress, Dialog, DialogActions, 
  DialogContent, DialogContentText, DialogTitle, Tooltip
} from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { format } from 'date-fns';

const SavedSearchesPage = () => {
  const { items, loading } = useSelector((state: RootState) => state.savedSearches);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [clearDialogOpen, setClearDialogOpen] = React.useState(false);
  const [selectedSearchId, setSelectedSearchId] = React.useState<number | null>(null);

  // Fetch saved searches on component mount
  useEffect(() => {
    dispatch(fetchSavedSearches());
  }, [dispatch]);

  const handleDeleteSearch = (id: number) => {
    dispatch(deleteSavedSearch(id));
  };

  const handleClearAllSearches = () => {
    dispatch(clearSavedSearches());
    setClearDialogOpen(false);
  };

  const handleOpenClearDialog = () => {
    setClearDialogOpen(true);
  };

  const handleCloseClearDialog = () => {
    setClearDialogOpen(false);
  };

  const handleSearchClick = (query: string) => {
    navigate(`/?query=${encodeURIComponent(query)}`);
  };

  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return dateString;
    }
  };

  if (loading && items.length === 0) {
    return (
      <Box sx={{ 
        background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(to bottom, #F15A24, #8B3415)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header with title and actions */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}>
          <Typography 
            variant="h3" 
            component="h1" 
            fontWeight="bold" 
            sx={{ color: 'white' }}
          >
            Saved Searches
          </Typography>
          
          {items.length > 0 && (
            <Button 
              variant="outlined"
              startIcon={<DeleteSweepIcon />}
              onClick={handleOpenClearDialog}
              sx={{ 
                color: 'white', 
                borderColor: 'white',
                '&:hover': {
                  borderColor: 'rgba(255, 255, 255, 0.7)',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Clear All
            </Button>
          )}
        </Box>

        {/* Divider line after header */}
        <Divider sx={{ 
          borderColor: 'rgba(255, 255, 255, 0.2)', 
          mb: 3 
        }} />

        {items.length === 0 ? (
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom>No saved searches</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your saved search queries will appear here.
            </Typography>
            <Button 
              variant="contained" 
              onClick={() => navigate('/')}
              sx={{ 
                px: 3, 
                py: 1.2, 
                borderRadius: 2,
                backgroundColor: '#F15A24',
                '&:hover': {
                  backgroundColor: '#E04613',
                }
              }}
            >
              Search Books
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              {items.map((item) => (
                <Paper 
                  key={item.id} 
                  elevation={0} 
                  sx={{ 
                    mb: 2, 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: 'white',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    {/* Search Query */}
                    <Grid item xs={12} md={6}>
                      <Typography 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                          color: '#333'
                        }}
                        onClick={() => handleSearchClick(item.search_query)}
                      >
                        {item.search_query}
                      </Typography>
                
                    </Grid>
                    
                    {/* Date */}
                    <Grid item xs={6} md={3}>
                      <Typography variant="body2" color="text.secondary">
                        Saved on: {formatDate(item.created_at)}
                      </Typography>
                    </Grid>
                    
                    {/* Action Buttons */}
                    <Grid item xs={6} md={3} sx={{ textAlign: 'right' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Tooltip title="Search">
                          <IconButton 
                            onClick={() => handleSearchClick(item.search_query)}
                            sx={{ 
                              p: 1,
                              color: '#F15A24'
                            }}
                          >
                            <SearchIcon />
                          </IconButton>
                        </Tooltip>
                        
                        <Tooltip title="Delete">
                          <IconButton 
                            onClick={() => handleDeleteSearch(item.id)}
                            sx={{ 
                              p: 1,
                              color: '#F15A24'
                            }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </Grid>
          </Grid>
        )}
      </Container>

      {/* Confirmation Dialog for Clear All */}
      <Dialog
        open={clearDialogOpen}
        onClose={handleCloseClearDialog}
      >
        <DialogTitle>Clear all saved searches?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove all your saved search queries. This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseClearDialog} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={handleClearAllSearches} 
            color="error" 
            variant="contained"
            startIcon={<DeleteSweepIcon />}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SavedSearchesPage;