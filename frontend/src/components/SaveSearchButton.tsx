import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { saveSearch } from '../store/savedSearchesSlice';
import { AppDispatch } from '../store';
import { 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

interface SaveSearchButtonProps {
  searchQuery: string;
  onSaveComplete?: () => void;
}

const SaveSearchButton: React.FC<SaveSearchButtonProps> = ({ searchQuery, onSaveComplete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchName, setSearchName] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [error, setError] = useState('');

  const handleClick = () => {
    if (!searchQuery.trim()) {
      setError("Can't save an empty search query");
      setSnackbarOpen(true);
      return;
    }
    setDialogOpen(true);
    // Default name based on query
    setSearchName('Search: ' + searchQuery);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setError('');
  };

  const handleSave = async () => {
    if (!searchName.trim()) {
      setError("Please provide a name for your search");
      return;
    }
    
    try {
      await dispatch(saveSearch({
        search_query: searchQuery,
        search_name: searchName
      })).unwrap();
      setDialogOpen(false);
      setSnackbarOpen(true);
      
      // Call the callback if provided
      if (onSaveComplete) {
        onSaveComplete();
      }
    } catch (err: any) {
      setError(err.toString());
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        variant="contained"
        sx={{
          bgcolor: 'rgba(0, 0, 0, 0.15)',
          color: 'white',
          borderRadius: '50%',
          minWidth: '38px',
          height: '50px',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
          }
        }}
        aria-label="Save search"
      >
        <BookmarkBorderIcon />
      </Button>
      
      <Dialog open={dialogOpen} onClose={handleClose}>
        <DialogTitle>Save Search Query</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Search Query"
            type="text"
            fullWidth
            variant="outlined"
            value={searchQuery}
            disabled
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Name your search"
            type="text"
            fullWidth
            variant="outlined"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            error={!!error && !searchName.trim()}
            helperText={(!searchName.trim() && error) ? "Name is required" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSave} 
            variant="contained"
            sx={{
              backgroundColor: '#F15A24',
              '&:hover': {
                backgroundColor: '#E04613',
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={error ? "error" : "success"} 
          sx={{ width: '100%' }}
        >
          {error || "Search saved successfully!"}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SaveSearchButton;