import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Box,
  InputBase,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  Typography,
  Divider,
} from '@mui/material';
import {
  Sun,
  Moon,
  User,
  Search as SearchIcon,
  LayoutGrid,
  Bell,
  Users as UsersIcon,
  CreditCard,
  BadgeCheck,
  ShieldCheck,
  BarChart2,
  Ticket,
  MapPin
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import Logo from './Logo';

const Header = ({ currentVenue, currentSection }) => {
  const { toggleTheme, mode } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [businessAnchorEl, setBusinessAnchorEl] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleBusinessMenuOpen = (e) => setBusinessAnchorEl(e.currentTarget);
  const handleBusinessMenuClose = () => setBusinessAnchorEl(null);

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  // Navigation handlers for admin venue module
  const gotoVenues = () => {
    handleBusinessMenuClose();
    navigate('/venues');
  };
  const gotoVenueSections = () => {
    handleBusinessMenuClose();
    if (currentVenue?.id) {
      navigate(`/venues/${currentVenue.id}/sections`);
    } else {
      alert("Please select a venue first.");
    }
  };
  const gotoSeatDesigner = () => {
    handleBusinessMenuClose();
    if (currentVenue?.id && currentSection?.id) {
      navigate(`/venues/${currentVenue.id}/sections/${currentSection.id}/seats`);
    } else {
      alert("Please select a venue and section first.");
    }
  };

  return (
    <Paper
      elevation={2}
      square
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.drawer + 1,
        bgcolor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }}
    >
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          boxShadow: 'none',
          color: theme.palette.text.primary,
        }}
      >
        <Toolbar sx={{ minHeight: 56, px: { xs: 1, sm: 3 }, justifyContent: 'space-between', gap: 2 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <Logo size={80} />
          </Box>

          {/* Search */}
          {!isSmallScreen && (
            <Box
              sx={{
                flex: 1,
                maxWidth: 400,
                mx: 2,
                display: 'flex',
                alignItems: 'center',
                bgcolor: '#eef3f8',
                borderRadius: 2,
                px: 2,
                py: 0.5,
              }}
            >
              <SearchIcon size={20} style={{ marginRight: 8, color: '#666' }} />
              <InputBase
                placeholder="Search"
                inputProps={{ 'aria-label': 'search' }}
                sx={{ width: '100%', color: '#333', fontSize: 15 }}
              />
            </Box>
          )}

          {/* Right Side */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
            {user && !isSmallScreen && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  sx={buttonStyles}
                  onClick={() => navigate('/dashboard')}
                  startIcon={<User size={18} />}
                >
                  Dashboard
                </Button>
                
                <Button
                  sx={buttonStyles}
                  onClick={() => navigate('/venues')}
                  startIcon={<Ticket size={18} />}
                >
                  Venues
                </Button>

                {/* Business Menu */}
                <Tooltip title="For Business">
                  <IconButton onClick={handleBusinessMenuOpen} sx={iconButtonStyle(theme)}>
                    <LayoutGrid size={22} />
                  </IconButton>
                </Tooltip>

                {/* Notifications */}
                <Tooltip title="Notifications">
                  <IconButton sx={iconButtonStyle(theme)}>
                    <Bell size={20} />
                  </IconButton>
                </Tooltip>
              </Box>
            )}

            {/* Theme Toggle */}
            <Tooltip title={mode === 'dark' ? 'Light Mode' : 'Dark Mode'}>
              <IconButton onClick={toggleTheme} sx={iconButtonStyle(theme)}>
                {mode === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </IconButton>
            </Tooltip>

            {/* Profile Menu */}
            {user && (
              <>
                <Tooltip title="Account">
                  <IconButton onClick={handleMenuOpen}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
                      {user?.name?.[0]?.toUpperCase() || <User size={16} />}
                    </Avatar>
                  </IconButton>
                </Tooltip>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  PaperProps={{ sx: { mt: 1 } }}
                >
                  <MenuItem onClick={handleProfile}>View Profile</MenuItem>
                  <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
              </>
            )}

            {/* Business Menu Content */}
            <Menu
              anchorEl={businessAnchorEl}
              open={Boolean(businessAnchorEl)}
              onClose={handleBusinessMenuClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 500,
                  maxWidth: 700,
                  p: 2,
                  bgcolor: theme.palette.background.paper,
                  boxShadow: 3,
                  borderRadius: 3,
                  color: theme.palette.text.primary,
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3 }}>
                <Box sx={{ minWidth: 220 }}>
                  <Typography variant="subtitle2" sx={menuTitleStyles(theme)}>Manage Users</Typography>
                  <MenuItem onClick={() => { handleBusinessMenuClose(); navigate('/users'); }}>
                    <UsersIcon size={18} style={{ marginRight: 8 }} /> Users
                  </MenuItem>
                  <MenuItem onClick={() => { handleBusinessMenuClose(); navigate('/user-role-matrix'); }}>
                    <BarChart2 size={18} style={{ marginRight: 8 }} /> User-Role Matrix
                  </MenuItem>
                  <Typography variant="subtitle2" sx={{ ...menuTitleStyles(theme), mt: 2 }}>Manage RBAC</Typography>
                  <MenuItem onClick={() => { handleBusinessMenuClose(); navigate('/roles'); }}>
                    <BadgeCheck size={18} style={{ marginRight: 8 }} /> Roles
                  </MenuItem>
                  <MenuItem onClick={() => { handleBusinessMenuClose(); navigate('/permissions'); }}>
                    <ShieldCheck size={18} style={{ marginRight: 8 }} /> Permissions
                  </MenuItem>
                  <MenuItem onClick={() => { handleBusinessMenuClose(); navigate('/rbac-matrix'); }}>
                    <BarChart2 size={18} style={{ marginRight: 8 }} /> RBAC Matrix
                  </MenuItem>
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: theme.palette.divider }} />
                <Box sx={{ minWidth: 220 }}>
                  <Typography variant="subtitle2" sx={menuTitleStyles(theme)}>Venue Module</Typography>
                  {/* VENUE MANAGEMENT MODULE */}
                  <MenuItem onClick={gotoVenues}>
                    <Ticket size={18} style={{ marginRight: 8 }} /> Venues
                  </MenuItem>
                  <MenuItem onClick={gotoVenueSections}>
                    <MapPin size={18} style={{ marginRight: 8 }} /> Venue Sections
                  </MenuItem>
                  <MenuItem onClick={gotoSeatDesigner}>
                    <Ticket size={18} style={{ marginRight: 8 }} /> Seat Designer
                  </MenuItem>
                </Box>
              </Box>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </Paper>
  );
};

const buttonStyles = {
  color: 'text.secondary',
  fontWeight: 500,
  textTransform: 'none',
  fontSize: 15,
  px: 1.5,
  borderRadius: 2,
  minWidth: 0,
  '&:hover': {
    bgcolor: 'action.hover',
    color: 'text.primary',
  },
};

const iconButtonStyle = (theme) => ({
  color: theme.palette.text.secondary,
  borderRadius: 2,
  '&:hover': {
    bgcolor: theme.palette.action.hover,
    color: theme.palette.text.primary,
  },
});

const menuTitleStyles = (theme) => ({
  mb: 1,
  color: theme.palette.text.secondary,
  fontWeight: 700,
});

export default Header;