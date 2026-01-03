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
  Chip,
  Grid,
  Stack,
  InputAdornment
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
  Edit as EditIcon,
  StyleRounded,
  SearchRounded,
  Add as AddIcon,
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
import { ScreenManagerProvider, useScreenManager } from './ScreenManager';

const drawerWidth = 240;

function ProPresenterLayoutInner() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const screenManager = useScreenManager();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  // Menu states
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState(null);
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
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const [newPresentationModalOpen, setNewPresentationModalOpen] = useState(false);
  const [newPresentationTitle, setNewPresentationTitle] = useState('');
  const [outputMessageDialogOpen, setOutputMessageDialogOpen] = useState(false);
  const [outputMessageValue, setOutputMessageValue] = useState('');
  const [outputLogoDialogOpen, setOutputLogoDialogOpen] = useState(false);
  const [outputLogoValue, setOutputLogoValue] = useState('');
  const commandInputRef = useRef(null);

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

  // Actions (dispatch events so page-specific components can handle them)
  const dispatchAppEvent = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  };


  // Menu handlers
  const handleFileMenuClick = (event) => setFileMenuAnchor(event.currentTarget);
  const handleFileMenuClose = () => setFileMenuAnchor(null);
  const handleEditMenuClick = (event) => setEditMenuAnchor(event.currentTarget);
  const handleEditMenuClose = () => setEditMenuAnchor(null);
  const handleScreensMenuClick = (event) => setScreensMenuAnchor(event.currentTarget);
  const handleScreensMenuClose = () => setScreensMenuAnchor(null);
  const handleViewMenuClick = (event) => setViewMenuAnchor(event.currentTarget);
  const handleViewMenuClose = () => setViewMenuAnchor(null);
  const handleWindowMenuClick = (event) => setWindowMenuAnchor(event.currentTarget);
  const handleWindowMenuClose = () => setWindowMenuAnchor(null);
  const handleHelpMenuClick = (event) => setHelpMenuAnchor(event.currentTarget);
  const handleHelpMenuClose = () => setHelpMenuAnchor(null);
  const handleLibraryMenuClick = (event) => setLibraryMenuAnchor(event.currentTarget);
  const handleLibraryMenuClose = () => setLibraryMenuAnchor(null);
  const handleLiveMenuClick = (event) => setLiveMenuAnchor(event.currentTarget);
  const handleLiveMenuClose = () => setLiveMenuAnchor(null);
  const handleToolsMenuClick = (event) => setToolsMenuAnchor(event.currentTarget);
  const handleToolsMenuClose = () => setToolsMenuAnchor(null);

  // Action handlers from backup
  const handleSave = async () => {
    try {
      // Dispatch save event to current active component
      dispatchAppEvent('app:save');
      
      // 1. Save current presentation if available
      const currentPresentation = window.currentPresentation;
      if (currentPresentation && currentPresentation.id) {
        const response = await api.put(`/api/presentations/${currentPresentation.id}`, currentPresentation);
        if (response.data) {
          window.currentPresentation = response.data;
        }
      }
      
      // 2. Save user settings/preferences
      const userSettings = window.userSettings;
      if (userSettings) {
        try {
          await api.put('/api/user/settings', userSettings);
        } catch (err) {
          console.warn('Settings save failed:', err);
        }
      }
      
      // 3. Save current theme if modified
      const currentTheme = window.currentTheme;
      if (currentTheme && currentTheme.modified) {
        try {
          await api.put('/api/themes/' + currentTheme.id, currentTheme);
          currentTheme.modified = false;
        } catch (err) {
          console.warn('Theme save failed:', err);
        }
      }
      
      // 4. Save current template if modified
      const currentTemplate = window.currentTemplate;
      if (currentTemplate && currentTemplate.modified) {
        try {
          await api.put('/api/templates/' + currentTemplate.id, currentTemplate);
          currentTemplate.modified = false;
        } catch (err) {
          console.warn('Template save failed:', err);
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
    handleFileMenuClose();
  };

  const handleSaveAs = async () => {
    try {
      const currentPresentation = window.currentPresentation;
      if (!currentPresentation) {
        handleFileMenuClose();
        return;
      }

      // Prompt for new title
      const newTitle = window.prompt('Enter new presentation title:', `${currentPresentation.title} (Copy)`);
      if (!newTitle) {
        handleFileMenuClose();
        return;
      }

      // Create new presentation with current data
      const newPresentation = {
        ...currentPresentation,
        title: newTitle,
        id: undefined // Let server generate new ID
      };

      const response = await api.post('/api/presentations', newPresentation);
      if (response.data) {
        window.currentPresentation = response.data;
        
        // Navigate to the new presentation
        navigate(`/editor?id=${response.data.id}`);
      }
    } catch (error) {
      console.error('Save As failed:', error);
    }
    handleFileMenuClose();
  };

  const handleSaveAll = async () => {
    try {
      // Dispatch save all event to all components
      dispatchAppEvent('app:saveAll');
      
      // 1. Save current presentation if available
      const currentPresentation = window.currentPresentation;
      if (currentPresentation && currentPresentation.id) {
        try {
          await api.put(`/api/presentations/${currentPresentation.id}`, currentPresentation);
        } catch (err) {
          console.warn('Current presentation save failed:', err);
        }
      }
      
      // 2. Save all other open presentations/drafts
      const openPresentations = window.openPresentations || [];
      const presentationPromises = openPresentations.map(async (presentation) => {
        if (presentation.id && presentation.modified) {
          try {
            await api.put(`/api/presentations/${presentation.id}`, presentation);
            return { success: true, name: presentation.title || 'Untitled Presentation' };
          } catch (err) {
            return { success: false, name: presentation.title || 'Untitled Presentation' };
          }
        }
        return null;
      });
      
      await Promise.all(presentationPromises);
      
      // 3. Save user settings/preferences
      const userSettings = window.userSettings;
      if (userSettings) {
        try {
          await api.put('/api/user/settings', userSettings);
        } catch (err) {
          console.warn('Settings save failed:', err);
        }
      }
      
      // 4. Save all modified themes
      const modifiedThemes = window.modifiedThemes || [];
      const themePromises = modifiedThemes.map(async (theme) => {
        try {
          await api.put('/api/themes/' + theme.id, theme);
          return { success: true, name: `Theme: ${theme.name}` };
        } catch (err) {
          return { success: false, name: `Theme: ${theme.name}` };
        }
      });
      
      await Promise.all(themePromises);
      
      // 5. Save all modified templates
      const modifiedTemplates = window.modifiedTemplates || [];
      const templatePromises = modifiedTemplates.map(async (template) => {
        try {
          await api.put('/api/templates/' + template.id, template);
          return { success: true, name: `Template: ${template.name}` };
        } catch (err) {
          return { success: false, name: `Template: ${template.name}` };
        }
      });
      
      await Promise.all(templatePromises);
      
      // 6. Save media library changes
      const mediaLibraryChanges = window.mediaLibraryChanges;
      if (mediaLibraryChanges && mediaLibraryChanges.length > 0) {
        try {
          await api.post('/api/media/batch-update', { changes: mediaLibraryChanges });
          window.mediaLibraryChanges = []; // Clear after save
        } catch (err) {
          console.warn('Media library save failed:', err);
        }
      }
    } catch (error) {
      console.error('Save All failed:', error);
    }
    handleFileMenuClose();
  };

  const handleExit = async () => {
    try {
      // Check if there are unsaved changes across all data types
      const currentPresentation = window.currentPresentation;
      const openPresentations = window.openPresentations || [];
      const userSettings = window.userSettings;
      const currentTheme = window.currentTheme;
      const currentTemplate = window.currentTemplate;
      const modifiedThemes = window.modifiedThemes || [];
      const modifiedTemplates = window.modifiedTemplates || [];
      const mediaLibraryChanges = window.mediaLibraryChanges || [];
      
      const hasUnsavedChanges = 
        currentPresentation?.modified ||
        openPresentations.some(p => p.modified) ||
        userSettings?.modified ||
        currentTheme?.modified ||
        currentTemplate?.modified ||
        modifiedThemes.length > 0 ||
        modifiedTemplates.length > 0 ||
        mediaLibraryChanges.length > 0;
      
      if (hasUnsavedChanges) {
        // Use window.confirm explicitly to avoid ESLint error
        const shouldSave = window.confirm('You have unsaved changes. Do you want to save before exiting?');
        if (shouldSave) {
          await handleSaveAll();
        }
      }
      
      // Close any open connections, clear timers, etc.
      dispatchAppEvent('app:cleanup');
      
      // For web app, navigate to home/logout
      // For desktop app, this would trigger app close
      if (window.electronAPI) {
        // Desktop app - close the application
        window.electronAPI.quit();
      } else {
        // Web app - logout and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    } catch (error) {
      console.error('Exit failed:', error);
      showSnackbar('Exit failed: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleUndo = () => { 
    dispatchAppEvent('app:undo'); 
    handleEditMenuClose(); 
  };
  
  const handleRedo = () => { 
    dispatchAppEvent('app:redo'); 
    handleEditMenuClose(); 
  };
  
  const handleCut = () => { 
    dispatchAppEvent('app:cut'); 
    handleEditMenuClose(); 
  };
  
  const handleCopy = () => { 
    dispatchAppEvent('app:copy'); 
    handleEditMenuClose(); 
  };
  
  const handlePaste = () => { 
    dispatchAppEvent('app:paste'); 
    handleEditMenuClose(); 
  };

  const createPresentationAndOpen = () => {
    setNewPresentationTitle('New Presentation');
    setNewPresentationModalOpen(true);
    handleFileMenuClose();
  };

  const handleCreatePresentation = async () => {
    if (!newPresentationTitle.trim()) {
      return;
    }

    try {
      const response = await api.post('/presentations', {
        title: newPresentationTitle.trim(),
        description: '',
        type: 'custom'
      });
      const newPresentation = response.data;
      setNewPresentationModalOpen(false);
      navigate(`/presentations/${newPresentation.id}/edit`);
    } catch (err) {
      console.error('Failed to create presentation:', err);
    }
  };

  const handleCancelNewPresentation = () => {
    setNewPresentationModalOpen(false);
    setNewPresentationTitle('');
  };

  // Command palette functions
  const openCommandPalette = useCallback(() => {
    setCommandPaletteOpen(true);
    setCommandQuery('');
    setCommandIndex(0);
  }, []);

  const closeCommandPalette = useCallback(() => {
    setCommandPaletteOpen(false);
    setCommandQuery('');
    setCommandIndex(0);
  }, []);

  const handleShowShortcuts = useCallback(() => { 
    setShortcutsOpen(true); 
    handleHelpMenuClose();
    closeCommandPalette();
  }, [handleHelpMenuClose, closeCommandPalette]);
  const handleCloseShortcuts = () => setShortcutsOpen(false);

  const handleToggleFullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Command categories and commands
  const commandCategories = useMemo(() => ({
    file: {
      label: 'File',
      icon: <InsertDriveFileIcon fontSize="small" />,
      commands: [
        { id: 'new-presentation', label: 'New Presentation', shortcut: 'Ctrl+N', run: () => createPresentationAndOpen() },
        { id: 'open-recent', label: 'Open Recent', shortcut: 'Ctrl+O', run: () => { showSnackbar('Opening recent presentations...'); } },
        { id: 'save', label: 'Save', shortcut: '', run: () => handleSave() },
        { id: 'save-as', label: 'Save As...', shortcut: '', run: () => handleSaveAs() },
        { id: 'save-all', label: 'Save All', shortcut: '', run: () => handleSaveAll() },
        { id: 'export', label: 'Export...', shortcut: 'Ctrl+E', run: () => { dispatchAppEvent('app:export'); showSnackbar('Exporting presentation...'); } },
        { id: 'print', label: 'Print...', shortcut: 'Ctrl+P', run: () => { window.print(); showSnackbar('Opening print dialog...'); } },
        { id: 'exit', label: 'Exit', shortcut: 'Alt+F4', run: () => handleExit() }
      ]
    },
    edit: {
      label: 'Edit',
      icon: <EditIcon fontSize="small" />,
      commands: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', run: () => { dispatchAppEvent('app:undo'); } },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', run: () => { dispatchAppEvent('app:redo'); } },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', run: () => { document.execCommand('cut'); } },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', run: () => { document.execCommand('copy'); } },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', run: () => { document.execCommand('paste'); } },
        { id: 'delete', label: 'Delete', shortcut: 'Del', run: () => { document.execCommand('delete'); } },
        { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A', run: () => { document.execCommand('selectAll'); } },
        { id: 'find', label: 'Find...', shortcut: 'Ctrl+F', run: () => { dispatchAppEvent('app:find'); } },
        { id: 'replace', label: 'Replace...', shortcut: 'Ctrl+H', run: () => { dispatchAppEvent('app:replace'); } }
      ]
    },
    slide: {
      label: 'Slide',
      icon: <Slideshow fontSize="small" />,
      commands: [
        { id: 'new-slide', label: 'New Slide', shortcut: 'Ctrl+M', run: () => { dispatchAppEvent('slide:new'); showSnackbar('New slide created'); } },
        { id: 'duplicate-slide', label: 'Duplicate Slide', shortcut: 'Ctrl+D', run: () => { dispatchAppEvent('slide:duplicate'); showSnackbar('Slide duplicated'); } },
        { id: 'delete-slide', label: 'Delete Slide', shortcut: 'Ctrl+Shift+D', run: () => { dispatchAppEvent('slide:delete'); showSnackbar('Slide deleted'); } },
        { id: 'go-to-slide', label: 'Go to Slide...', shortcut: 'Ctrl+G', run: () => { dispatchAppEvent('slide:go-to'); showSnackbar('Go to slide...'); } },
        { id: 'toggle-notes', label: 'Show/Hide Slide Notes', shortcut: 'Alt+N', run: () => { dispatchAppEvent('slide:toggle-notes'); showSnackbar('Toggled slide notes'); } },
        { id: 'toggle-presenter', label: 'Show/Hide Presenter View', shortcut: 'Alt+P', run: () => { dispatchAppEvent('view:toggle-presenter'); showSnackbar('Toggled presenter view'); } }
      ]
    },
    view: {
      label: 'View',
      icon: <VisibilityIcon fontSize="small" />,
      commands: [
        { id: 'toggle-grid', label: 'Show/Hide Grid', shortcut: 'Ctrl+\'', run: () => { dispatchAppEvent('view:toggle-grid'); showSnackbar('Toggled grid'); } },
        { id: 'toggle-rulers', label: 'Show/Hide Rulers', shortcut: 'Ctrl+R', run: () => { dispatchAppEvent('view:toggle-rulers'); showSnackbar('Toggled rulers'); } },
        { id: 'zoom-in', label: 'Zoom In', shortcut: 'Ctrl++', run: () => { dispatchAppEvent('view:zoom-in'); showSnackbar('Zoomed in'); } },
        { id: 'zoom-out', label: 'Zoom Out', shortcut: 'Ctrl+-', run: () => { dispatchAppEvent('view:zoom-out'); showSnackbar('Zoomed out'); } },
        { id: 'reset-zoom', label: 'Reset Zoom', shortcut: 'Ctrl+0', run: () => { dispatchAppEvent('view:reset-zoom'); showSnackbar('Zoom reset'); } },
        { id: 'toggle-fullscreen', label: 'Toggle Fullscreen', shortcut: 'F11', run: () => handleToggleFullscreen() },
        { id: 'show-shortcuts', label: 'Show Keyboard Shortcuts', shortcut: 'Ctrl+/', run: () => { setShortcutsOpen(true); closeCommandPalette(); } }
      ]
    },
    presentation: {
      label: 'Presentation',
      icon: <PlayCircle fontSize="small" />,
      commands: [
        { id: 'play-pause', label: 'Play/Pause', shortcut: 'Space', run: () => { dispatchAppEvent('presentation:play-pause'); showSnackbar('Play/Pause'); } },
        { id: 'next-slide', label: 'Next Slide', shortcut: '→', run: () => { dispatchAppEvent('presentation:next-slide'); showSnackbar('Next slide'); } },
        { id: 'previous-slide', label: 'Previous Slide', shortcut: '←', run: () => { dispatchAppEvent('presentation:previous-slide'); showSnackbar('Previous slide'); } },
        { id: 'first-slide', label: 'First Slide', shortcut: 'Home', run: () => { dispatchAppEvent('presentation:first-slide'); showSnackbar('First slide'); } },
        { id: 'last-slide', label: 'Last Slide', shortcut: 'End', run: () => { dispatchAppEvent('presentation:last-slide'); showSnackbar('Last slide'); } },
        { id: 'black-screen', label: 'Black Screen', shortcut: 'B', run: () => { dispatchAppEvent('presentation:black-screen'); showSnackbar('Black screen'); } },
        { id: 'white-screen', label: 'White Screen', shortcut: 'W', run: () => { dispatchAppEvent('presentation:white-screen'); showSnackbar('White screen'); } },
        { id: 'hide-show', label: 'Hide/Show', shortcut: 'H', run: () => { dispatchAppEvent('presentation:toggle-visibility'); showSnackbar('Toggled slide visibility'); } },
        { id: 'toggle-loop', label: 'Toggle Loop', shortcut: 'L', run: () => { dispatchAppEvent('presentation:toggle-loop'); showSnackbar('Toggled loop'); } },
        { id: 'toggle-mirror', label: 'Toggle Mirror', shortcut: 'M', run: () => { dispatchAppEvent('presentation:toggle-mirror'); showSnackbar('Toggled mirror'); } }
      ]
    },
    help: {
      label: 'Help',
      icon: <HelpRounded fontSize="small" />,
      commands: [
        { id: 'documentation', label: 'Documentation', shortcut: 'F1', run: () => { window.open('https://docs.worshipress.com', '_blank'); showSnackbar('Opening documentation...'); } },
        { id: 'keyboard-shortcuts', label: 'Keyboard Shortcuts', shortcut: 'Ctrl+/', run: () => { setShortcutsOpen(true); closeCommandPalette(); } },
        { id: 'check-updates', label: 'Check for Updates', run: () => { dispatchAppEvent('app:check-updates'); showSnackbar('Checking for updates...'); } },
        { id: 'about', label: 'About WorshipRess', run: () => { dispatchAppEvent('app:about'); showSnackbar('About WorshipRess'); } }
      ]
    }
  }), [createPresentationAndOpen, dispatchAppEvent, showSnackbar, handleToggleFullscreen, closeCommandPalette, handleSave, handleSaveAs, handleSaveAll, handleExit]);

  // Keyboard shortcuts for save operations
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Only handle shortcuts when not in input fields
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl+S - Save
      if (event.ctrlKey && event.key === 's' && !event.shiftKey && !event.altKey) {
        event.preventDefault();
        handleSave();
      }
      // Ctrl+Shift+S - Save As
      else if (event.ctrlKey && event.shiftKey && event.key === 'S' && !event.altKey) {
        event.preventDefault();
        handleSaveAs();
      }
      // Ctrl+Alt+S - Save All
      else if (event.ctrlKey && event.altKey && event.key === 's' && !event.shiftKey) {
        event.preventDefault();
        handleSaveAll();
      }
      // Alt+F4 - Exit
      else if (event.altKey && event.key === 'F4') {
        event.preventDefault();
        handleExit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSave, handleSaveAs, handleSaveAll, handleExit]);

  const [allCommands, categories] = useMemo(() => {
    const commandsList = [];
    const categoryList = [];
    
    Object.entries(commandCategories).forEach(([id, category]) => {
      categoryList.push({ id, ...category });
      category.commands.forEach(cmd => {
        commandsList.push({
          ...cmd,
          category: id,
          categoryLabel: category.label,
          searchText: `${category.label.toLowerCase()} ${cmd.label.toLowerCase()}`
        });
      });
    });
    
    return [commandsList, categoryList];
  }, [commandCategories]);

  const filteredCommands = useMemo(() => {
    const q = commandQuery.toLowerCase();
    const categoryFilter = q.startsWith('@') ? q.slice(1) : null;
    
    return allCommands.filter((c) => {
      if (categoryFilter) {
        return c.searchText.includes(categoryFilter);
      }
      return c.searchText.includes(q);
    });
  }, [allCommands, commandQuery]);

  const runCommand = useCallback((cmd) => {
    if (!cmd) return;
    closeCommandPalette();
    cmd.run();
  }, [closeCommandPalette]);

  // Command palette effects
  useEffect(() => {
    if (!commandPaletteOpen) return;
    setCommandIndex(0);
  }, [commandQuery, commandPaletteOpen]);

  useEffect(() => {
    if (!commandPaletteOpen) return;
    const t = setTimeout(() => {
      commandInputRef.current?.focus?.();
    }, 0);
    return () => clearTimeout(t);
  }, [commandPaletteOpen]);

  // Keyboard shortcuts support
  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.metaKey || e.ctrlKey;
      const tag = e.target.tagName.toLowerCase();
      const isEditable = tag === 'input' || tag === 'textarea' || Boolean(e.target?.isContentEditable);

      if (mod && (e.key === 'p' || e.key === 'P')) {
        if (!commandPaletteOpen && isEditable) return;
        e.preventDefault();
        openCommandPalette();
        return;
      }

      if (commandPaletteOpen) {
        if (e.key === 'Escape') {
          e.preventDefault();
          closeCommandPalette();
          return;
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setCommandIndex((prev) => (prev + 1) % filteredCommands.length);
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCommandIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          runCommand(filteredCommands[commandIndex]);
          return;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    commandPaletteOpen,
    commandIndex,
    filteredCommands,
    openCommandPalette,
    closeCommandPalette,
    runCommand
  ]);

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

            <Button
              onClick={handleFileMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              File
            </Button>
            <Menu
              anchorEl={fileMenuAnchor}
              open={Boolean(fileMenuAnchor)}
              onClose={handleFileMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { createPresentationAndOpen(); }}>New Presentation</MenuItem>
              <MenuItem onClick={() => { navigate('/presentations'); handleFileMenuClose(); }}>Open Presentation</MenuItem>
              <MenuItem onClick={handleSave}>Save</MenuItem>
              <MenuItem onClick={handleSaveAs}>Save As...</MenuItem>
              <MenuItem onClick={handleSaveAll}>Save All</MenuItem>
              <Divider />
              <MenuItem onClick={handleExit}>Exit</MenuItem>
            </Menu>

            <Button
              onClick={handleEditMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Edit
            </Button>
            <Menu
              anchorEl={editMenuAnchor}
              open={Boolean(editMenuAnchor)}
              onClose={handleEditMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={handleUndo}>Undo</MenuItem>
              <MenuItem onClick={handleRedo}>Redo</MenuItem>
              <Divider />
              <MenuItem onClick={handleCut}>Cut</MenuItem>
              <MenuItem onClick={handleCopy}>Copy</MenuItem>
              <MenuItem onClick={handlePaste}>Paste</MenuItem>
            </Menu>

            <Button
              onClick={handleScreensMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Screens
            </Button>
            <Menu
              anchorEl={screensMenuAnchor}
              open={Boolean(screensMenuAnchor)}
              onClose={handleScreensMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { screenManager.toggleMainOutput(); handleScreensMenuClose(); }}>
                {screenManager.mainOutputActive ? '✓ ' : ''}Main Output
              </MenuItem>
              <MenuItem onClick={() => { screenManager.toggleStageDisplay(); handleScreensMenuClose(); }}>
                {screenManager.stageDisplayActive ? '✓ ' : ''}Stage Display
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setOutputMessageDialogOpen(true); handleScreensMenuClose(); }}>
                Set Output Message…
              </MenuItem>
              <MenuItem onClick={() => { screenManager.setOverlayMessage(''); handleScreensMenuClose(); }}>
                Clear Output Message
              </MenuItem>
              <MenuItem onClick={() => { setOutputLogoDialogOpen(true); handleScreensMenuClose(); }}>
                Set Logo URL…
              </MenuItem>
              <MenuItem onClick={() => { screenManager.setLogoUrl(''); handleScreensMenuClose(); }}>
                Clear Logo
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { screenManager.openConfigureDialog(); handleScreensMenuClose(); }}>Configure Screens</MenuItem>
            </Menu>

            <Dialog
              open={outputMessageDialogOpen}
              onClose={() => setOutputMessageDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{ sx: { backgroundColor: '#2d2d30', color: '#cccccc' } }}
            >
              <DialogTitle>Output Message</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  fullWidth
                  margin="dense"
                  label="Message"
                  value={outputMessageValue}
                  onChange={(e) => setOutputMessageValue(e.target.value)}
                  helperText="Shows on Main Output as a banner overlay"
                  InputLabelProps={{ sx: { color: '#999' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' }
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOutputMessageDialogOpen(false)} sx={{ color: '#999' }}>Cancel</Button>
                <Button
                  onClick={() => {
                    screenManager.setOverlayMessage(outputMessageValue || '');
                    setOutputMessageDialogOpen(false);
                  }}
                  variant="contained"
                  sx={{ backgroundColor: '#0e639c' }}
                >
                  Apply
                </Button>
              </DialogActions>
            </Dialog>

            <Dialog
              open={outputLogoDialogOpen}
              onClose={() => setOutputLogoDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{ sx: { backgroundColor: '#2d2d30', color: '#cccccc' } }}
            >
              <DialogTitle>Logo URL</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  fullWidth
                  margin="dense"
                  label="Logo Image URL"
                  value={outputLogoValue}
                  onChange={(e) => setOutputLogoValue(e.target.value)}
                  helperText="PNG/SVG recommended. Shows in bottom-left of Main Output"
                  InputLabelProps={{ sx: { color: '#999' } }}
                  sx={{
                    '& .MuiOutlinedInput-root': { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#555' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#777' }
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOutputLogoDialogOpen(false)} sx={{ color: '#999' }}>Cancel</Button>
                <Button
                  onClick={() => {
                    screenManager.setLogoUrl(outputLogoValue || '');
                    setOutputLogoDialogOpen(false);
                  }}
                  variant="contained"
                  sx={{ backgroundColor: '#0e639c' }}
                >
                  Apply
                </Button>
              </DialogActions>
            </Dialog>

            <Button
              onClick={handleViewMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              View
            </Button>
            <Menu
              anchorEl={viewMenuAnchor}
              open={Boolean(viewMenuAnchor)}
              onClose={handleViewMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={handleViewMenuClose}>Zoom In</MenuItem>
              <MenuItem onClick={handleViewMenuClose}>Zoom Out</MenuItem>
              <Divider />
              <MenuItem onClick={handleViewMenuClose}>Toggle Thumbnails</MenuItem>
              <MenuItem onClick={handleViewMenuClose}>Toggle Grid</MenuItem>
            </Menu>

            <Button
              onClick={() => { navigate('/integrations'); }}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Integrations
            </Button>

            <Button
              onClick={handleWindowMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Window
            </Button>
            <Menu
              anchorEl={windowMenuAnchor}
              open={Boolean(windowMenuAnchor)}
              onClose={handleWindowMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem
                onClick={() => {
                  screenManager.requestFullscreenForWindow('main');
                  handleWindowMenuClose();
                }}
              >
                Toggle Fullscreen (Main Output)
              </MenuItem>
              <MenuItem
                onClick={() => {
                  screenManager.requestFullscreenForWindow('stage');
                  handleWindowMenuClose();
                }}
              >
                Toggle Fullscreen (Stage Display)
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  screenManager.focusOutputWindow('main');
                  handleWindowMenuClose();
                }}
              >
                Focus Main Output
              </MenuItem>
              <MenuItem
                onClick={() => {
                  screenManager.focusOutputWindow('stage');
                  handleWindowMenuClose();
                }}
              >
                Focus Stage Display
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  if (!screenManager.mainOutputActive) screenManager.toggleMainOutput();
                  if (!screenManager.stageDisplayActive) screenManager.toggleStageDisplay();
                  handleWindowMenuClose();
                }}
              >
                Reopen Output Windows
              </MenuItem>
              <Divider />
              <MenuItem
                onClick={() => {
                  showSnackbar('Minimize is not supported in the browser version.');
                  handleWindowMenuClose();
                }}
              >
                Minimize
              </MenuItem>
              <MenuItem
                onClick={() => {
                  showSnackbar('Arrange Windows is not supported in the browser version.');
                  handleWindowMenuClose();
                }}
              >
                Arrange Windows
              </MenuItem>
            </Menu>

            <Button
              onClick={handleHelpMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Help
            </Button>
            <Menu
              anchorEl={helpMenuAnchor}
              open={Boolean(helpMenuAnchor)}
              onClose={handleHelpMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { window.open('https://github.com/worshipress/docs', '_blank'); handleHelpMenuClose(); }}>Documentation</MenuItem>
              <MenuItem onClick={handleHelpMenuClose}>Keyboard Shortcuts</MenuItem>
              <Divider />
              <MenuItem onClick={handleHelpMenuClose}>About</MenuItem>
            </Menu>

            <Button
              onClick={handleLibraryMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Library ▾
            </Button>
            <Menu
              anchorEl={libraryMenuAnchor}
              open={Boolean(libraryMenuAnchor)}
              onClose={handleLibraryMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/worship'); handleLibraryMenuClose(); }}>
                <VideoLibrary sx={{ mr: 1, fontSize: 20 }} />
                Worship Workspace
              </MenuItem>
              <MenuItem onClick={() => { navigate('/presentations'); handleLibraryMenuClose(); }}>
                <InsertDriveFileIcon sx={{ mr: 1, fontSize: 20 }} />
                Presentations
              </MenuItem>
              <MenuItem onClick={() => { navigate('/media'); handleLibraryMenuClose(); }}>
                <VideoLibrary sx={{ mr: 1, fontSize: 20 }} />
                Media Library
              </MenuItem>
              <MenuItem onClick={() => { navigate('/templates'); handleLibraryMenuClose(); }}>
                <Palette sx={{ mr: 1, fontSize: 20 }} />
                Templates
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { navigate('/songs'); handleLibraryMenuClose(); }}>
                <LibraryMusic sx={{ mr: 1, fontSize: 20 }} />
                Songs
              </MenuItem>
              <MenuItem onClick={() => { navigate('/scripture'); handleLibraryMenuClose(); }}>
                <MenuBook sx={{ mr: 1, fontSize: 20 }} />
                Scripture
              </MenuItem>
            </Menu>

            <Button
              onClick={handleLiveMenuClick}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Live ▾
            </Button>
            <Menu
              anchorEl={liveMenuAnchor}
              open={Boolean(liveMenuAnchor)}
              onClose={handleLiveMenuClose}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/live'); handleLiveMenuClose(); }}>
                <PlayArrowRounded sx={{ mr: 1, fontSize: 20 }} />
                Live Control
              </MenuItem>
              <MenuItem onClick={() => { navigate('/timer'); handleLiveMenuClose(); }}>
                <TimerRounded sx={{ mr: 1, fontSize: 20 }} />
                Service Timer
              </MenuItem>
              <MenuItem onClick={() => { navigate('/planner'); handleLiveMenuClose(); }}>
                <ScheduleRounded sx={{ mr: 1, fontSize: 20 }} />
                Service Planner
              </MenuItem>
            </Menu>

            <Button
              onClick={(e) => setToolsMenuAnchor(e.currentTarget)}
              size="small"
              sx={{
                color: '#cccccc',
                px: 1,
                py: 0.25,
                minWidth: 'auto',
                textTransform: 'none',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
              }}
            >
              Tools ▾
            </Button>
            <Menu
              anchorEl={toolsMenuAnchor}
              open={Boolean(toolsMenuAnchor)}
              onClose={() => setToolsMenuAnchor(null)}
              sx={{ zIndex: 9999 }}
              PaperProps={{
                sx: {
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  borderRadius: 0,
                  mt: 0.5
                }
              }}
            >
              <MenuItem onClick={() => { navigate('/devices'); setToolsMenuAnchor(null); }}>Devices</MenuItem>
              <MenuItem onClick={() => { navigate('/settings'); setToolsMenuAnchor(null); }}>Settings</MenuItem>
            </Menu>
          </Box>

          <Box sx={{ flex: 1 }} />

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
          minHeight: 64,
          px: 1.5,
          backgroundColor: '#252526',
          borderBottom: '1px solid #333',
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: '#cccccc',
          justifyContent: 'flex-start'
        }}
      >
          {/* Search Button */}
          <Button
            size="small"
            onClick={openCommandPalette}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <SearchRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Search
          </Button>

          {/* Theme Dropdown */}
          <ThemeDropdown />

          {/* Effects/Motion Button */}
          <Button
            size="small"
            onClick={() => setEffectsDialogOpen(true)}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <AutoAwesomeRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Effects
          </Button>

          {/* Font Dropdown */}
          <FontDropdown
            onFontSelect={(font) => {
              setSelectedFont(font);
              // Dispatch font selection event for other components (using original method)
              dispatchAppEvent('font:selected', { font });
            }}
            selectedFont={selectedFont}
          />

          {/* Show Button */}
          <Button
            size="small"
            onClick={() => {}}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <RemoveRedEyeRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Show
          </Button>

          {/* Edit Button */}
          <Button
            size="small"
            onClick={() => dispatchAppEvent('app:edit')}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <CreateRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Edit
          </Button>

          {/* Reflow Button */}
          <Button
            size="small"
            onClick={() => {}}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <SyncRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Reflow
          </Button>

          {/* Worship Workspace Button */}
          <Button
            size="small"
            onClick={() => navigate('/worship')}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <TheaterComedyRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Worship
          </Button>

          {/* More Dropdown */}
          <Button
            size="small"
            onClick={() => navigate('/settings')}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <SettingsSuggestRounded sx={{ fontSize: 22, mb: 0.25 }} />
            More
          </Button>

          <Divider orientation="vertical" variant="middle" sx={{ my: 1, mx: 1, bgcolor: '#2a2a30', height: '28px' }} />

          
          {/* Media Button */}
          <Button
            size="small"
            onClick={() => navigate('/media')}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <PermMediaRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Media
          </Button>

          {/* Default Button */}
          <Button
            size="small"
            onClick={() => navigate('/templates')}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#b0b0b8',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(255,255,255,0.06)',
                color: '#ffffff'
              }
            }}
          >
            <ViewModuleRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Default
          </Button>

          {/* Live Button */}
          <Button
            size="small"
            onClick={() => navigate('/live')}
            sx={{
              minWidth: 56,
              height: 44,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 0.5,
              px: 1,
              color: '#00cc88',
              backgroundColor: 'rgba(0,204,136,0.08)',
              border: 'none',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.65rem',
              fontWeight: 600,
              transition: 'all 0.15s ease',
              '&:hover': { 
                backgroundColor: 'rgba(0,204,136,0.15)',
                color: '#00dd99',
                transform: 'scale(1.02)'
              }
            }}
          >
            <PlayArrowRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Live
          </Button>

          <Divider orientation="vertical" variant="middle" sx={{ my: 1, mx: 1, bgcolor: '#2a2a30', height: '28px' }} />

          {/* Radio Buttons for Audio and Stage */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto', mr: 1 }}>
            <RadioGroup
              value={displayMode}
              onChange={(e) => setDisplayMode(e.target.value)}
              row
            >
              <FormControlLabel
                value="audio"
                control={<Radio sx={{ color: '#b0b0b8', '&.Mui-checked': { color: '#0088ff' } }} />}
                label="Audio"
                sx={{ color: '#b0b0b8', '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
              />
              <FormControlLabel
                value="stage"
                control={<Radio sx={{ color: '#b0b0b8', '&.Mui-checked': { color: '#0088ff' } }} />}
                label="Stage"
                sx={{ color: '#b0b0b8', '& .MuiFormControlLabel-label': { fontSize: '0.75rem' } }}
              />
            </RadioGroup>
          </Box>
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

      {/* Effects Dialog */}
      <Dialog
        open={effectsDialogOpen}
        onClose={() => setEffectsDialogOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d30',
            color: '#cccccc',
            border: '1px solid #3e3e42'
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #3e3e42' }}>
          <Typography variant="h6">Motion Effects & Transitions</Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 3 }}>
            Add professional motion effects and transitions to your presentations
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, background: '#3c3c3d', border: '1px solid #555555' }}>
                <Typography variant="h6" sx={{ color: '#cccccc', mb: 2 }}>Transitions</Typography>
                <Stack spacing={1}>
                  {['Fade', 'Slide', 'Zoom', 'Flip', 'Dissolve'].map(effect => (
                    <Button
                      key={effect}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        color: '#cccccc', 
                        borderColor: '#555555',
                        justifyContent: 'flex-start',
                        '&:hover': { borderColor: '#81c784', bgcolor: 'rgba(129, 199, 132, 0.1)' }
                      }}
                    >
                      {effect}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Paper sx={{ p: 2, background: '#3c3c3d', border: '1px solid #555555' }}>
                <Typography variant="h6" sx={{ color: '#cccccc', mb: 2 }}>Motion Backgrounds</Typography>
                <Stack spacing={1}>
                  {['Gradient Waves', 'Particle Flow', 'Light Rays', 'Abstract Shapes', 'Nature Scenes'].map(effect => (
                    <Button
                      key={effect}
                      fullWidth
                      variant="outlined"
                      sx={{ 
                        color: '#cccccc', 
                        borderColor: '#555555',
                        justifyContent: 'flex-start',
                        '&:hover': { borderColor: '#81c784', bgcolor: 'rgba(129, 199, 132, 0.1)' }
                      }}
                    >
                      {effect}
                    </Button>
                  ))}
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #3e3e42', p: 2 }}>
          <Button onClick={() => setEffectsDialogOpen(false)} sx={{ color: '#cccccc' }}>
            Close
          </Button>
          <Button variant="contained" sx={{ bgcolor: '#81c784', '&:hover': { bgcolor: '#66bb6a' } }}>
            Apply Effects
          </Button>
        </DialogActions>
      </Dialog>

      {/* Command Palette */}
      <Dialog
        open={commandPaletteOpen}
        onClose={closeCommandPalette}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d30',
            color: '#cccccc',
            border: '1px solid #3e3e42',
            borderRadius: 1
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #3e3e42', p: 2 }}>
          <TextField
            inputRef={commandInputRef}
            fullWidth
            placeholder="Type a command or search..."
            value={commandQuery}
            onChange={(e) => setCommandQuery(e.target.value)}
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#cccccc', pl: 1 }}>
                  <Search fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiInputBase-root': {
                backgroundColor: 'transparent',
                color: '#cccccc',
                fontSize: '1rem'
              },
              '& .MuiInputBase-input': {
                p: 1
              }
            }}
          />
        </DialogTitle>
        <DialogContent sx={{ p: 0, maxHeight: 400 }}>
          {filteredCommands.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: '#888' }}>
                No commands found
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {filteredCommands.map((cmd, index) => (
                <ListItem
                  key={cmd.id}
                  button
                  selected={index === commandIndex}
                  onClick={() => runCommand(cmd)}
                  sx={{
                    '&:hover': { backgroundColor: 'rgba(255,255,255,0.05)' },
                    '&.Mui-selected': { backgroundColor: 'rgba(129, 199, 132, 0.15)' },
                    px: 2,
                    py: 1
                  }}
                >
                  <ListItemIcon sx={{ color: '#888', minWidth: 40 }}>
                    {commandCategories[cmd.category]?.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={cmd.label}
                    secondary={cmd.shortcut}
                    primaryTypographyProps={{ sx: { color: '#cccccc' } }}
                    secondaryTypographyProps={{ sx: { color: '#888' } }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>

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
        
        {/* New Presentation Modal */}
        <Dialog
          open={newPresentationModalOpen}
          onClose={handleCancelNewPresentation}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              backgroundColor: '#3c3c3d',
              color: '#cccccc'
            }
          }}
        >
          <DialogTitle sx={{ color: '#cccccc' }}>New Presentation</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Presentation Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newPresentationTitle}
              onChange={(e) => setNewPresentationTitle(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleCreatePresentation();
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#555',
                  },
                  '&:hover fieldset': {
                    borderColor: '#777',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#1976d2',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#888',
                  '&.Mui-focused': {
                    color: '#1976d2',
                  },
                },
                '& .MuiInputBase-input': {
                  color: '#cccccc',
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={handleCancelNewPresentation}
              sx={{ color: '#888' }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePresentation}
              variant="contained"
              disabled={!newPresentationTitle.trim()}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                '&:disabled': {
                  backgroundColor: '#555',
                  color: '#888',
                }
              }}
            >
              Create
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

// Wrapper component with ScreenManagerProvider
export default function ProPresenterLayout() {
  return (
    <ScreenManagerProvider>
      <ProPresenterLayoutInner />
    </ScreenManagerProvider>
  );
}
