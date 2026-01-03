import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Paper,
  Snackbar,
  Alert,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  List as MUIList,
  ListItemText as MUIListItemText,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Slideshow,
  PlayCircle,
  Search,
  Settings,
  Navigation as NavigationIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Visibility as VisibilityIcon,
  Folder,
  VideoLibrary,
  Devices,
  Palette,
  Save,
  FolderOpen,
  CreateNewFolder,
  Timer,
  Schedule,
  LibraryMusic,
  MenuBook,
  Undo as UndoIcon,
  Redo as RedoIcon,
  ContentCut as CutIcon,
  ContentCopy as CopyIcon,
  ContentPaste as PasteIcon,
  StyleRounded,
  SearchRounded,
  AddIcon,
  AutoAwesomeRounded,
  RemoveRedEyeRounded,
  CreateRounded,
  SyncRounded,
  BookRounded,
  SettingsSuggestRounded,
  TheaterComedyRounded,
  PermMediaRounded,
  ViewModuleRounded,
  PlayArrowRounded,
  HelpRounded,
  MoreHorizRounded,
  TheaterComedy,
  PermMedia,
  ViewModule,
  PlayCircleFilled,
  NavigationRounded,
  InsertDriveFileRounded,
  EditRounded as EditRoundedIcon,
  SlideshowRounded as SlideshowRoundedIcon,
  VisibilityRounded as VisibilityRoundedIcon,
  PlayCircleRounded,
  HelpRounded,
  LibraryMusicRounded,
  MenuBookRounded,
  TimerRounded,
  ScheduleRounded,
  DevicesRounded,
  SettingsRounded
} from '@mui/icons-material';
import ShortcutsProvider from '../contexts/ShortcutsProvider';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { alpha } from '@mui/material/styles';
import FontDropdown from './FontDropdown';
import ThemeDropdown from './ThemeDropdown';
import TemplateDesigner from './TemplateDesigner';
import ServicePlanner from './ServicePlanner';
import ProPresenterSidebar from './ProPresenterSidebar';
import NavigationSidebar from './NavigationSidebar';

const drawerWidth = 240;

export default function ProPresenterLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Menu states
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState(null);
  const [presentationMenuAnchor, setPresentationMenuAnchor] = useState(null);
  const [screensMenuAnchor, setScreensMenuAnchor] = useState(null);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);
  const [windowMenuAnchor, setWindowMenuAnchor] = useState(null);
  const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);
  const [libraryMenuAnchor, setLibraryMenuAnchor] = useState(null);
  const [liveMenuAnchor, setLiveMenuAnchor] = useState(null);
  const [toolsMenuAnchor, setToolsMenuAnchor] = useState(null);

  // Other states
  const [selectedFont, setSelectedFont] = useState('Arial');
  const [effectsDialogOpen, setEffectsDialogOpen] = useState(false);
  const [servicePlannerOpen, setServicePlannerOpen] = useState(false);
  const [displayMode, setDisplayMode] = useState('audio');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const showSnackbar = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Menu handlers
  const handleFileMenuClick = (event) => setFileMenuAnchor(event.currentTarget);
  const handleFileMenuClose = () => setFileMenuAnchor(null);
  const handleEditMenuClick = (event) => setEditMenuAnchor(event.currentTarget);
  const handleEditMenuClose = () => setEditMenuAnchor(null);
  const handlePresentationMenuClick = (event) => setPresentationMenuAnchor(event.currentTarget);
  const handlePresentationMenuClose = () => setPresentationMenuAnchor(null);
  const handleScreensMenuClick = (event) => setScreensMenuAnchor(event.currentTarget);
  const handleScreensMenuClose = () => setScreensMenuAnchor(null);
  const handleViewMenuClick = (event) => setViewMenuAnchor(event.currentTarget);
  const handleViewMenuClose = () => setViewMenuAnchor(null);
  const handleWindowMenuClick = (event) => setWindowMenuAnchor(event.currentTarget);
  const handleWindowMenuClose = () => setWindowMenuAnchor(null);
  const handleHelpMenuClick = (event) => setHelpMenuAnchor(event.currentTarget);
  const handleHelpMenuClose = () => setHelpMenuAnchor(null);

  const drawer = <NavigationSidebar />;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#1a1a1a' }}>
      <ShortcutsProvider />
      {/* App Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: '#252526',
          boxShadow: 'none',
          borderBottom: '1px solid #333',
          zIndex: 1200
        }}
      >
        <Toolbar
          variant="dense"
          disableGutters
          sx={{
            minHeight: 40,
            px: 1,
            color: '#cccccc'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{
                mr: 1,
                display: { md: 'none' },
                borderRadius: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              onClick={handleFileMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              File
            </Typography>
            <Menu
              anchorEl={fileMenuAnchor}
              open={Boolean(fileMenuAnchor)}
              onClose={handleFileMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/presentations'); handleFileMenuClose(); }}>New Presentation</MenuItem>
              <MenuItem onClick={() => { navigate('/presentations'); handleFileMenuClose(); }}>Open Presentation</MenuItem>
              <MenuItem onClick={handleFileMenuClose}>Save</MenuItem>
              <Divider />
              <MenuItem onClick={handleFileMenuClose}>Exit</MenuItem>
            </Menu>

            <Typography
              onClick={handleEditMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Edit
            </Typography>
            <Menu
              anchorEl={editMenuAnchor}
              open={Boolean(editMenuAnchor)}
              onClose={handleEditMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={handleEditMenuClose}>Undo</MenuItem>
              <MenuItem onClick={handleEditMenuClose}>Redo</MenuItem>
              <Divider />
              <MenuItem onClick={handleEditMenuClose}>Cut</MenuItem>
              <MenuItem onClick={handleEditMenuClose}>Copy</MenuItem>
              <MenuItem onClick={handleEditMenuClose}>Paste</MenuItem>
            </Menu>

            <Typography
              onClick={handlePresentationMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Presentation
            </Typography>
            <Menu
              anchorEl={presentationMenuAnchor}
              open={Boolean(presentationMenuAnchor)}
              onClose={handlePresentationMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/presentations'); handlePresentationMenuClose(); }}>New Presentation</MenuItem>
              <MenuItem onClick={() => { navigate('/presentations'); handlePresentationMenuClose(); }}>Open Presentation</MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate('/settings'); handlePresentationMenuClose(); }}>Presentation Settings</MenuItem>
            </Menu>

            <Typography
              onClick={handleScreensMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Screens
            </Typography>
            <Menu
              anchorEl={screensMenuAnchor}
              open={Boolean(screensMenuAnchor)}
              onClose={handleScreensMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={handleScreensMenuClose}>Main Output</MenuItem>
              <MenuItem onClick={handleScreensMenuClose}>Stage Display</MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate('/settings'); handleScreensMenuClose(); }}>Configure Screens</MenuItem>
            </Menu>

            <Typography
              onClick={handleViewMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              View
            </Typography>
            <Menu
              anchorEl={viewMenuAnchor}
              open={Boolean(viewMenuAnchor)}
              onClose={handleViewMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={handleViewMenuClose}>Zoom In</MenuItem>
              <MenuItem onClick={handleViewMenuClose}>Zoom Out</MenuItem>
              <Divider />
              <MenuItem onClick={handleViewMenuClose}>Toggle Thumbnails</MenuItem>
              <MenuItem onClick={handleViewMenuClose}>Toggle Grid</MenuItem>
            </Menu>

            <Typography
              onClick={handleWindowMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Window
            </Typography>
            <Menu
              anchorEl={windowMenuAnchor}
              open={Boolean(windowMenuAnchor)}
              onClose={handleWindowMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={handleWindowMenuClose}>Toggle Fullscreen</MenuItem>
              <MenuItem onClick={handleWindowMenuClose}>Minimize</MenuItem>
              <Divider />
              <MenuItem onClick={handleWindowMenuClose}>Arrange Windows</MenuItem>
            </Menu>

            <Typography
              onClick={handleHelpMenuClick}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Help
            </Typography>
            <Menu
              anchorEl={helpMenuAnchor}
              open={Boolean(helpMenuAnchor)}
              onClose={handleHelpMenuClose}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/docs'); handleHelpMenuClose(); }}>Documentation</MenuItem>
              <MenuItem onClick={handleHelpMenuClose}>Keyboard Shortcuts</MenuItem>
              <Divider />
              <MenuItem onClick={handleHelpMenuClose}>About</MenuItem>
            </Menu>

            <Typography
              onClick={(e) => setLibraryMenuAnchor(e.currentTarget)}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Library ▾
            </Typography>
            <Menu
              anchorEl={libraryMenuAnchor}
              open={Boolean(libraryMenuAnchor)}
              onClose={() => setLibraryMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/songs'); setLibraryMenuAnchor(null); }}>Songs</MenuItem>
              <MenuItem onClick={() => { navigate('/scripture'); setLibraryMenuAnchor(null); }}>Scripture</MenuItem>
              <MenuItem onClick={() => { navigate('/media'); setLibraryMenuAnchor(null); }}>Media</MenuItem>
              <MenuItem onClick={() => { navigate('/templates'); setLibraryMenuAnchor(null); }}>Templates</MenuItem>
            </Menu>

            <Typography
              onClick={(e) => setLiveMenuAnchor(e.currentTarget)}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Live ▾
            </Typography>
            <Menu
              anchorEl={liveMenuAnchor}
              open={Boolean(liveMenuAnchor)}
              onClose={() => setLiveMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/live'); setLiveMenuAnchor(null); }}>Live Control</MenuItem>
              <MenuItem onClick={() => { navigate('/presenter'); setLiveMenuAnchor(null); }}>Presenter View</MenuItem>
              <MenuItem onClick={() => { setServicePlannerOpen(true); setLiveMenuAnchor(null); }}>Service Planner</MenuItem>
              <MenuItem onClick={() => { navigate('/timer'); setLiveMenuAnchor(null); }}>Timer</MenuItem>
            </Menu>

            <Typography
              onClick={(e) => setToolsMenuAnchor(e.currentTarget)}
              sx={{
                cursor: 'pointer',
                color: '#cccccc',
                px: 1,
                py: 0.25,
                borderRadius: 0,
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Tools ▾
            </Typography>
            <Menu
              anchorEl={toolsMenuAnchor}
              open={Boolean(toolsMenuAnchor)}
              onClose={() => setToolsMenuAnchor(null)}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/devices'); setToolsMenuAnchor(null); }}>Devices</MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); setToolsMenuAnchor(null); }}>Settings</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0, px: 1, pointerEvents: 'none' }}>
            <Typography
              variant="body2"
              sx={{
                color: '#cccccc',
                fontSize: '0.8rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                opacity: 0.9
              }}
            >
              WorshipRess
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => {}}
              sx={{
                borderRadius: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              <Search fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              color="inherit"
              onClick={() => navigate('/settings')}
              sx={{
                borderRadius: 1,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              <Settings fontSize="small" />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Second Toolbar */}
      <Toolbar
        variant="dense"
        disableGutters
        sx={{
          minHeight: 52,
          px: 1.5,
          background: 'linear-gradient(180deg, #1a1a1f 0%, #141418 100%)',
          borderBottom: '1px solid #1f1f24',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: '#b0b0b8',
          justifyContent: 'flex-start',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}
      >
        {/* Service Planner Button */}
        <Button
          size="small"
          onClick={() => setServicePlannerOpen(true)}
          sx={{
            minWidth: 56,
            height: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 0.5,
            px: 1,
            color: '#8855ff',
            backgroundColor: 'rgba(136,85,255,0.08)',
            border: 'none',
            borderRadius: '8px',
            textTransform: 'none',
            fontSize: '0.65rem',
            fontWeight: 600,
            transition: 'all 0.15s ease',
            '&:hover': { 
              backgroundColor: 'rgba(136,85,255,0.15)',
              color: '#9966ff',
              transform: 'scale(1.02)'
            }
          }}
        >
          <TheaterComedyRounded sx={{ fontSize: 22, mb: 0.25 }} />
          Services
        </Button>
      </Toolbar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          backgroundColor: '#1a1a1a',
          overflow: 'auto'
        }}
      >
        <Outlet />

        {/* Feedback UI */}
        <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleSnackbarClose} severity="info" sx={{ width: '100%' }}>{snackbarMsg}</Alert>
        </Snackbar>
      </Box>

      {/* Service Planner */}
      <ServicePlanner
        open={servicePlannerOpen}
        onClose={() => setServicePlannerOpen(false)}
        onGoLive={(service, items) => {
          console.log('Going live with service:', service, items);
          showSnackbar(`Service "${service.name}" is now live`);
        }}
      />

      {/* Mobile Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
