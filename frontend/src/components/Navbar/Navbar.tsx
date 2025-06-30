import * as React from 'react';
import { AppBar, Box, Toolbar, Typography, Button, IconButton, MenuItem, Menu, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/authSlice';
import './Navbar.css';
import { useNotifications } from '../../contexts/NotificationContext';

const Navbar = () => {
    const { userToken, userInfo } = useSelector((state: RootState) => state.auth);
    const { unreadCount } = useNotifications();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        handleClose();  
    };

    return (
        <Box sx={{ flexGrow: 1 }} className="navbar">
            <AppBar 
                position="sticky" 
                sx={{ 
                    backgroundColor: '#FBFBFB',
                    boxShadow: '0px 6px 15px 2px rgba(0, 0, 0, 0.25)'
                }}
            >
                <Toolbar>
                    {/* Logo on the left */}
                    <Box 
                        component="img"
                        src="schoolbooks_logo.png"
                        alt="SchoolBooks Logo"
                        sx={{ 
                            height: 40,
                            mr: 2,
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate(userToken ? '/' : '/hero')}
                    />
                    
                    {/* Navigation Links */}
                    <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Button 
                            component={Link} 
                            to="/"
                            sx={{ 
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: '#F15A24',
                                fontWeight: 'medium',
                                mr: 2
                            }}
                        >
                            Home
                        </Button>
                        
                        <Button 
                            component={Link} 
                            to="/profile"
                            sx={{ 
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: '#F15A24',
                                fontWeight: 'medium',
                                mr: 2
                            }}
                        >
                            Profile
                        </Button>
                        
                        <Button 
                            component={Link} 
                            to="/orders"
                            sx={{ 
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: '#F15A24',
                                fontWeight: 'medium',
                                mr: 2
                            }}
                        >
                            Orders
                        </Button>
                        
                        <Button 
                            component={Link} 
                            to="/premium"
                            sx={{ 
                                textTransform: 'none',
                                fontSize: '1rem',
                                color: '#F15A24',
                                fontWeight: 'medium'
                            }}
                        >
                            Premium
                        </Button>
                    </Box>
                    
                    {/* Right-side icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        {/* Saved Search Button */}
                        <IconButton 
                            color="inherit" 
                            sx={{ p: 1 }}
                            onClick={() => navigate('/saved')}
                        >
                            <Box 
                                component="img"
                                src="saved_seach_button.png"
                                alt="Saved Searches"
                                sx={{ width: 24, height: 24 }}
                            />
                        </IconButton>
                        
                        {/* Wishlist Button */}
                        <IconButton 
                            color="inherit" 
                            sx={{ p: 1 }}
                            onClick={() => navigate('/wishlist')}
                        >
                            <Box 
                                component="img"
                                src="wishlist_button.png"
                                alt="Wishlist"
                                sx={{ width: 24, height: 24 }}
                            />
                        </IconButton>
                        
                        {/* Cart Button */}
                        <IconButton 
                            color="inherit" 
                            sx={{ p: 1 }}
                            onClick={() => navigate('/cart')}
                        >
                            <Box 
                                component="img"
                                src="cart_button.png"
                                alt="Cart"
                                sx={{ width: 24, height: 24 }}
                            />
                        </IconButton>
                        
                        {/* Notifications Button with Badge */}
                        <IconButton 
                            color="inherit" 
                            sx={{ p: 1 }}
                            onClick={() => navigate('/notifications')}
                        >
                            <Badge 
                                badgeContent={unreadCount} 
                                color="error"
                                sx={{
                                    '& .MuiBadge-badge': {
                                        backgroundColor: '#F15A24',
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        minWidth: '18px',
                                        height: '18px'
                                    }
                                }}
                            >
                                <Box 
                                    component="img"
                                    src="notifications_button.png"
                                    alt="Notifications"
                                    sx={{ width: 24, height: 24 }}
                                />
                            </Badge>
                        </IconButton>
                        
                        {/* Sign Out Button */}
                        <Button 
                            variant="contained"
                            onClick={handleLogout}
                            sx={{ 
                                ml: 1.5,
                                backgroundColor: '#F15A24',
                                color: 'white',
                                fontWeight: 'medium',
                                '&:hover': {
                                    backgroundColor: '#E04613',
                                },
                                borderRadius: 1,
                                textTransform: 'none'
                            }}
                        >
                            Sign Out
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;