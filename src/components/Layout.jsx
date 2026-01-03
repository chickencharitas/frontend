import React, { useState, useContext } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  Typography,
  Tooltip,
  useTheme,
  Button,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  LayoutDashboard,
  Clapperboard,
  Music,
  Image as ImageIcon,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Zap,
  Monitor,
  Moon,
  Sun,
  X,
  Wand2,
  CalendarDays,
  MessageCircle,
  GitBranch,
  UserCheck,
  Radio,
  Video,
  Tv,
  ChevronDown,Store, BookOpen, Share2
} from 'lucide-react';

import { useAuthStore } from '../context/authStore';
import { ThemeContext } from '../context/ThemeContext';

const drawerWidth = 280;

const MotionBox = motion(Box);
const MotionListItem = motion(ListItem);
const MotionButton = motion(Button);

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    devices: false
  });
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const { user, logout } = useAuthStore();
  const themeContext = useContext(ThemeContext);
  const { mode, toggleTheme } = themeContext;

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const mainMenuItems = [
    { text: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { text: 'Presentations', icon: Clapperboard, path: '/presentations' },
    { text: 'Playlists', icon: Music, path: '/playlists' },
    { text: 'Media Library', icon: ImageIcon, path: '/media' },
    { text: 'Templates', icon: Wand2, path: '/templates' },
    { text: 'Editor', icon: Wand2, path: '/editor' },
    { text: 'Devices', icon: Monitor, path: '/devices/camera' },
    { text: 'ProPresenter', icon: Tv, path: '/presenter' },
    { text: 'Comments', icon: MessageCircle, path: '/comments' },
    { text: 'Approvals', icon: UserCheck, path: '/approvals' },
    { text: 'Versions', icon: GitBranch, path: '/versions' },
    { text: 'Calendar', icon: CalendarDays, path: '/calendar' },
    { text: 'Live Streams', icon: Radio, path: '/streaming' },
    { text: 'Settings', icon: Settings, path: '/settings' }
  ];

  const deviceMenuItems = [
    { text: 'All Devices', icon: Monitor, path: '/devices' },
    { text: 'Camera Control', icon: Video, path: '/devices/camera' },
    { text: 'Lighting (DMX)', icon: Zap, path: '/devices/lighting' },
    { text: 'Audio Mixer', icon: Music, path: '/devices/mixer' },
    { text: 'Video Router', icon: Monitor, path: '/devices/router' }
  ];

 const contentMenuItems = [
  { text: 'Marketplace', icon: Store, path: '/marketplace' },
  { text: 'Sermon Series', icon: BookOpen, path: '/marketplace/sermon-series' },
  { text: 'Captions & AI', icon: Wand2, path: '/captions' },
  { text: 'Community Share', icon: Share2, path: '/marketplace/community' }
   
  ];

  const adminMenuItems = [
    { text: 'Analytics', icon: BarChart3, path: '/analytics' },
    { text: 'Reports', icon: BarChart3, path: '/reports' },
    ...(user?.role === 'admin' ? [{ text: 'Users', icon: Users, path: '/users' }] : [])
  ];

  const externalItems = [
    { text: 'Projection View', icon: Monitor, path: '/projection' },
    { text: 'Stage Monitor', icon: Monitor, path: '/stage-monitor' }
  ];

  const isActive = (path) => location.pathname === path;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  const MenuSection = ({ title, items, isExpanded, onToggle }) => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ListItem
        button
        onClick={onToggle}
        sx={{
          px: 2,
          py: 1.5,
          mb: 0.5,
          borderRadius: 1.5,
          '&:hover': {
            backgroundColor: `${theme.palette.primary.main}08`
          }
        }}
      >
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 700, 
            fontSize: '0.8rem',
            textTransform: 'uppercase', 
            letterSpacing: 0.5,
            color: theme.palette.text.secondary,
            flex: 1
          }}
        >
          {title}
        </Typography>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </ListItem>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <List disablePadding sx={{ pl: 1, mb: 1 }}>
              {items.map((item) => {
                const active = isActive(item.path);
                const Icon = item.icon;
                
                return (
                  <MotionListItem
                    button
                    key={item.text}
                    onClick={() => {
                      navigate(item.path);
                      setMobileOpen(false);
                    }}
                    variants={itemVariants}
                    whileHover={{ x: 8 }}
                    whileTap={{ scale: 0.98 }}
                    sx={{
                      borderRadius: 1.5,
                      mb: 0.5,
                      px: 2,
                      py: 1,
                      ml: 1,
                      transition: 'all 0.2s ease',
                      backgroundColor: active ? `${theme.palette.primary.main}15` : 'transparent',
                      borderLeft: active ? `3px solid ${theme.palette.primary.main}` : 'none',
                      pl: active ? 'calc(1rem - 3px)' : '1rem',
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}10`
                      },
                      '& .MuiListItemIcon-root': {
                        color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                        minWidth: 36,
                        transition: 'color 0.2s ease'
                      },
                      '& .MuiListItemText-root': {
                        '& .MuiTypography-root': {
                          fontWeight: active ? 600 : 500,
                          fontSize: '0.85rem',
                          color: active ? theme.palette.primary.main : theme.palette.text.primary
                        }
                      }
                    }}
                  >
                    <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Icon size={18} strokeWidth={2} />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </MotionListItem>
                );
              })}
            </List>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );

  const drawer = (
    <MotionBox 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        backgroundColor: theme.palette.background.paper 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo Section */}
      <MotionBox 
        sx={{ 
          p: 2.5, 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`, 
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Box sx={{
              backgroundColor: 'rgba(255,255,255,0.2)',
              p: 1,
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clapperboard size={24} />
            </Box>
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.25 }}>
                Worshipress
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                Church Presentation
              </Typography>
            </Box>
          </motion.div>
        </Box>
        <IconButton
          size="small"
          onClick={() => setMobileOpen(false)}
          sx={{ display: { sm: 'none' }, color: 'white' }}
        >
          <X size={18} />
        </IconButton>
      </MotionBox>

      {/* Scrollable Menu */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}
      >
        {/* Main Menu */}
        <Box sx={{ py: 1.5, px: 1 }}>
          <List sx={{ p: 0 }}>
            {mainMenuItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              if (!Icon) return null;
              
              return (
                <MotionListItem
                  button
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    px: 2,
                    py: 1.2,
                    transition: 'all 0.2s ease',
                    backgroundColor: active ? `${theme.palette.primary.main}15` : 'transparent',
                    borderLeft: active ? `3px solid ${theme.palette.primary.main}` : 'none',
                    pl: active ? 'calc(1rem - 3px)' : '1rem',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`
                    },
                    '& .MuiListItemIcon-root': {
                      color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                      minWidth: 40,
                      transition: 'color 0.2s ease'
                    },
                    '& .MuiListItemText-root': {
                      '& .MuiTypography-root': {
                        fontWeight: active ? 600 : 500,
                        fontSize: '0.9rem',
                        color: active ? theme.palette.primary.main : theme.palette.text.primary
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon size={20} strokeWidth={2} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </MotionListItem>
              );
            })}
          </List>
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Content Section - Collapsible */}
        <Box sx={{ px: 1, py: 1.5 }}>
          <MenuSection 
            title="Content & Community" 
            items={contentMenuItems}
            isExpanded={expandedSections.content}
            onToggle={() => toggleSection('content')}
          />
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Device Control Section - Collapsible */}
        <Box sx={{ px: 1, py: 1.5 }}>
          <MenuSection 
            title="Device Control" 
            items={deviceMenuItems}
            isExpanded={expandedSections.devices}
            onToggle={() => toggleSection('devices')}
          />
        </Box>

        <Divider sx={{ my: 0.5 }} />

        {/* Admin Section */}
        <Box sx={{ px: 1, py: 1.5 }}>
          <List sx={{ p: 0 }}>
            {adminMenuItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              
              if (!Icon) return null;
              
              return (
                <MotionListItem
                  button
                  key={item.text}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  variants={itemVariants}
                  whileHover={{ x: 8 }}
                  whileTap={{ scale: 0.98 }}
                  sx={{
                    borderRadius: 1.5,
                    mb: 0.5,
                    px: 2,
                    py: 1.2,
                    transition: 'all 0.2s ease',
                    backgroundColor: active ? `${theme.palette.primary.main}15` : 'transparent',
                    borderLeft: active ? `3px solid ${theme.palette.primary.main}` : 'none',
                    pl: active ? 'calc(1rem - 3px)' : '1rem',
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}10`
                    },
                    '& .MuiListItemIcon-root': {
                      color: active ? theme.palette.primary.main : theme.palette.text.secondary,
                      minWidth: 40,
                      transition: 'color 0.2s ease'
                    },
                    '& .MuiListItemText-root': {
                      '& .MuiTypography-root': {
                        fontWeight: active ? 600 : 500,
                        fontSize: '0.9rem',
                        color: active ? theme.palette.primary.main : theme.palette.text.primary
                      }
                    }
                  }}
                >
                  <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Icon size={20} strokeWidth={2} />
                  </ListItemIcon>
                  <ListItemText primary={item.text} />
                </MotionListItem>
              );
            })}
          </List>
        </Box>
      </motion.div>

      <Divider sx={{ my: 1 }} />

      {/* External Links */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Box sx={{ px: 1.5, py: 2 }}>
          <Typography 
            variant="caption" 
            sx={{ 
              fontWeight: 700, 
              color: theme.palette.text.secondary, 
              mb: 1, 
              px: 1, 
              textTransform: 'uppercase', 
              letterSpacing: 0.5,
              display: 'block',
              fontSize: '0.75rem'
            }}
          >
            Displays
          </Typography>
          {externalItems.map((item) => {
            const Icon = item.icon;
            
            if (!Icon) return null;
            
            return (
              <MotionListItem
                button
                key={item.text}
                onClick={() => {
                  window.open(item.path, item.text, 'width=1920,height=1080');
                  setMobileOpen(false);
                }}
                variants={itemVariants}
                whileHover={{ x: 8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                sx={{
                  borderRadius: 1.5,
                  mb: 0.75,
                  px: 2,
                  py: 1.2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}20 0%, ${theme.palette.secondary.main}20 100%)`,
                  border: `1px solid ${theme.palette.primary.main}30`,
                  color: theme.palette.primary.main,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}30 0%, ${theme.palette.secondary.main}30 100%)`,
                    border: `1px solid ${theme.palette.primary.main}50`,
                    transform: 'translateY(-1px)'
                  },
                  '& .MuiListItemIcon-root': {
                    color: theme.palette.primary.main,
                    minWidth: 40
                  },
                  '& .MuiListItemText-root': {
                    '& .MuiTypography-root': {
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }
                  }
                }}
              >
                <ListItemIcon sx={{ display: 'flex', justifyContent: 'center' }}>
                  <Icon size={20} strokeWidth={2} />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </MotionListItem>
            );
          })}
        </Box>
      </motion.div>

      {/* Theme Toggle Button */}
      <MotionBox 
        sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <MotionButton
          fullWidth
          variant="outlined"
          startIcon={mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          onClick={() => {
            console.log('Current mode:', mode);
            toggleTheme();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            borderRadius: 1.5,
            textTransform: 'none',
            fontWeight: 600,
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}10`
            }
          }}
        >
          {mode === 'light' ? 'Dark Mode' : 'Light Mode'}
        </MotionButton>
      </MotionBox>
    </MotionBox>
  );

  return (
    <MotionBox 
      sx={{ 
        display: 'flex', 
        backgroundColor: theme.palette.background.default, 
        minHeight: '100vh',
        color: theme.palette.text.primary
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* AppBar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ 
          width: '100%',
          position: 'fixed',
          top: 0,
          zIndex: 1100
        }}
      >
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            boxShadow: `0 4px 20px ${theme.palette.primary.main}25`,
            border: 'none'
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ display: { sm: 'none' } }}
              >
                <MenuIcon size={24} />
              </IconButton>
            </Box>

            {/* User Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
                <Typography 
                  variant="body2" 
                  sx={{ fontWeight: 600, fontSize: '0.9rem', color: 'white' }}
                >
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ opacity: 0.9, fontSize: '0.75rem', color: 'white' }}
                >
                  {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
                </Typography>
              </Box>
              <Tooltip title="Account">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <IconButton 
                    onClick={handleMenuOpen}
                    sx={{
                      p: 0,
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    <Avatar 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        background: 'rgba(255,255,255,0.2)',
                        fontWeight: 700,
                        border: '2px solid rgba(255,255,255,0.3)',
                        fontSize: '0.9rem',
                        color: 'white'
                      }}
                    >
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </Avatar>
                  </IconButton>
                </motion.div>
              </Tooltip>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                  sx: {
                    backgroundColor: theme.palette.background.paper,
                    color: theme.palette.text.primary
                  }
                }}
              >
                <MenuItem 
                  onClick={() => { 
                    navigate('/settings'); 
                    handleMenuClose(); 
                  }}
                  sx={{ py: 1.5 }}
                >
                  <Settings size={18} style={{ marginRight: 12 }} /> 
                  <span>Settings</span>
                </MenuItem>
                <Divider />
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ py: 1.5, color: theme.palette.error.main }}
                >
                  <LogOut size={18} style={{ marginRight: 12 }} /> 
                  <span>Logout</span>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </motion.div>

      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          position: { sm: 'fixed' },
          height: '100vh',
          top: 0,
          left: 0
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 10px 30px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.2)'}`
            }
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              boxShadow: `0 4px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.08)'}`,
              border: 'none'
            }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <MotionBox
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
          marginTop: '64px',
          marginLeft: { xs: 0, sm: `${drawerWidth}px` },
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          minHeight: '100vh'
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Outlet />
      </MotionBox>
    </MotionBox>
  );
}