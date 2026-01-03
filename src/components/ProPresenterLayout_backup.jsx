import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
  Radio,
  RadioGroup,
  FormControlLabel,
  List as MUIList,
  ListItemText as MUIListItemText
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
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Fullscreen as FullscreenIcon,
  GridView as GridIcon,
  Tune as TuneIcon,
  Edit as EditIcon,
  HelpOutline as HelpOutlineIcon,
  Add as AddIcon,
  FileCopy as FileCopyIcon,
  Delete as DeleteIcon,
  FindInPage as FindInPageIcon,
  FindReplace as FindReplaceIcon,
  NoteAdd as NoteAddIcon,
  Notes as NotesIcon,
  Person as PersonIcon,
  Loop as LoopIcon,
  Flip as FlipIcon,
  Pause as PauseIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as SkipPreviousIcon,
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  Brightness2 as Brightness2Icon,
  Brightness7 as Brightness7Icon,
  VisibilityOff as VisibilityOffIcon,
  Refresh as RefreshIcon,
  Print as PrintIcon,
  GetApp as GetAppIcon,
  Update as UpdateIcon,
  Info as InfoIcon,
  PlayArrow as PlayArrowIcon,
  Tv as TvIcon,
  // Sleek rounded icons
  SearchRounded,
  PaletteRounded,
  TextFieldsRounded,
  VisibilityRounded,
  EditRounded,
  RefreshRounded,
  LibraryBooksRounded,
  MoreHorizRounded,
  TheaterComedyRounded,
  PermMediaRounded,
  ViewModuleRounded,
  PlayArrowRounded,
  StyleRounded,
  ArticleRounded,
  RemoveRedEyeRounded,
  CreateRounded,
  SyncRounded,
  BookRounded,
  SettingsSuggestRounded,
  SlideshowRounded,
  VideoLibraryRounded,
  GridViewRounded,
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
  SettingsRounded,
  AutoAwesomeRounded
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

  const getPageTitle = (pathname) => {
    if (pathname === '/' || pathname === '') return 'Home';
    if (pathname.startsWith('/presenter')) return 'Presenter';
    if (pathname.startsWith('/presentations')) return 'Presentations';
    if (pathname.startsWith('/editor')) return 'Editor';
    if (pathname.startsWith('/live')) return 'Live';
    if (pathname.startsWith('/media')) return 'Media Library';
    if (pathname.startsWith('/songs')) return 'Songs';
    if (pathname.startsWith('/scripture')) return 'Scripture';
    if (pathname.startsWith('/timer')) return 'Timer';
    if (pathname.startsWith('/planner')) return 'Planner';
    if (pathname.startsWith('/templates')) return 'Templates';
    if (pathname.startsWith('/devices')) return 'Devices';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'Worshipress';
  };

  const pageTitle = getPageTitle(location.pathname);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Theme-based colors for accents
  const primaryMain = theme.palette.primary.main;
  const primaryHover = alpha(primaryMain, 0.06);
  const primaryActiveBg = alpha(primaryMain, 0.14);

  // Top bar menus
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState(null);

  // Additional menus: Presentation, Screens, View, Window, Help
  const [presentationMenuAnchor, setPresentationMenuAnchor] = useState(null);
  const [screensMenuAnchor, setScreensMenuAnchor] = useState(null);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);
  const [windowMenuAnchor, setWindowMenuAnchor] = useState(null);
  const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);

  // Display mode state for Audio/Stage radio buttons
  const [displayMode, setDisplayMode] = useState('audio');

  // Selected font state
  const [selectedFont, setSelectedFont] = useState('Arial');
  
  // Effects/Motion dialog state
  const [effectsDialogOpen, setEffectsDialogOpen] = useState(false);
  
  // Service Planner dialog state
  const [servicePlannerOpen, setServicePlannerOpen] = useState(false);
  
  // Additional menu states
  const [libraryMenuAnchor, setLibraryMenuAnchor] = useState(null);
  const [liveMenuAnchor, setLiveMenuAnchor] = useState(null);
  const [toolsMenuAnchor, setToolsMenuAnchor] = useState(null);

  const handleFileMenuClick = (event) => setFileMenuAnchor(event.currentTarget);
  const handleEditMenuClick = (event) => setEditMenuAnchor(event.currentTarget);
  const handlePresentationMenuClick = (event) => setPresentationMenuAnchor(event.currentTarget);
  const handleScreensMenuClick = (event) => setScreensMenuAnchor(event.currentTarget);
  const handleViewMenuClick = (event) => setViewMenuAnchor(event.currentTarget);
  const handleWindowMenuClick = (event) => setWindowMenuAnchor(event.currentTarget);
  const handleHelpMenuClick = (event) => setHelpMenuAnchor(event.currentTarget);

  const handleFileMenuClose = () => setFileMenuAnchor(null);
  const handleEditMenuClose = () => setEditMenuAnchor(null);
  const handlePresentationMenuClose = () => setPresentationMenuAnchor(null);
  const handleScreensMenuClose = () => setScreensMenuAnchor(null);
  const handleViewMenuClose = () => setViewMenuAnchor(null);
  const handleWindowMenuClose = () => setWindowMenuAnchor(null);
  const handleHelpMenuClose = () => setHelpMenuAnchor(null);

  // Feedback UI
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [commandQuery, setCommandQuery] = useState('');
  const [commandIndex, setCommandIndex] = useState(0);
  const commandInputRef = useRef(null);

  const showSnackbar = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  // Actions (dispatch events so page-specific components can handle them)
  const dispatchAppEvent = (name, detail = {}) => {
    window.dispatchEvent(new CustomEvent(name, { detail }));
  };

  const handleSave = () => {
    dispatchAppEvent('app:save');
    showSnackbar('Save requested');
    handleFileMenuClose();
  };

  const createPresentationAndOpen = async () => {
    showSnackbar('Creating presentation...');
    try {
      const res = await api.post('/presentations', { title: 'Untitled Presentation' });
      const created = res.data || res.data?.data || res.data?.rows?.[0];
      const id = created?.id || created?.data?.id;
      if (id) {
        navigate(`/presentations/${id}/edit`);
      } else {
        showSnackbar('Failed to create presentation');
        console.error('Unexpected create response', res);
      }
    } catch (err) {
      showSnackbar('Failed to create presentation');
      console.error(err);
    } finally {
      handleFileMenuClose();
      handlePresentationMenuClose();
    }
  };

  const handleUndo = () => { dispatchAppEvent('app:undo'); showSnackbar('Undo'); handleEditMenuClose(); };
  const handleRedo = () => { dispatchAppEvent('app:redo'); showSnackbar('Redo'); handleEditMenuClose(); };
  const handleCut = () => { dispatchAppEvent('app:cut'); showSnackbar('Cut'); handleEditMenuClose(); };
  const handleCopy = () => { dispatchAppEvent('app:copy'); showSnackbar('Copy'); handleEditMenuClose(); };
  const handlePaste = () => { dispatchAppEvent('app:paste'); showSnackbar('Paste'); handleEditMenuClose(); };

  const handleToggleFullscreen = () => {
    const el = document.documentElement;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
      showSnackbar('Entered fullscreen');
    } else {
      document.exitFullscreen?.();
      showSnackbar('Exited fullscreen');
    }
    handleWindowMenuClose();
  };

  const handleZoomIn = () => { dispatchAppEvent('app:zoom-in'); showSnackbar('Zoom in'); handleViewMenuClose(); };
  const handleZoomOut = () => { dispatchAppEvent('app:zoom-out'); showSnackbar('Zoom out'); handleViewMenuClose(); };
  const handleToggleThumbnails = () => { dispatchAppEvent('app:toggle-thumbnails'); showSnackbar('Toggled thumbnails'); handleViewMenuClose(); };

  const handleDisplayModeChange = async (event) => {
    const newMode = event.target.value;
    console.log('Display mode change:', newMode);
    setDisplayMode(newMode);

    // Get all presentations to find one that's currently live
    try {
      const presentationsRes = await api.get('/presentations');
      const presentations = presentationsRes.data?.data || presentationsRes.data?.rows || [];

      if (!Array.isArray(presentations)) {
        console.error('Presentations is not an array:', presentations);
        showSnackbar('Error: Could not load presentations');
        return;
      }

      // Find a live presentation
      let livePresentation = null;
      for (const presentation of presentations) {
        try {
          const liveRes = await api.get(`/presentations/${presentation.id}/live`);
          if (liveRes.data?.is_active) {
            livePresentation = presentation;
            break;
          }
        } catch (err) {
          // Continue checking other presentations
          continue;
        }
      }

      if (livePresentation) {
        const displayType = newMode === 'audio' ? 'audience' : 'stage_monitor';
        // Open new window for display
        const displayUrl = `${window.location.origin}/projection/${livePresentation.id}/${displayType}`;
        window.open(displayUrl, `worshipress-display-${displayType}`, 'width=1200,height=800,menubar=no,toolbar=no,location=no,status=no');
        showSnackbar(`Opened ${newMode === 'audio' ? 'Audience' : 'Stage'} display`);
      } else {
        showSnackbar('No live presentation found. Please start a live presentation first.');
      }
    } catch (err) {
      console.error('Error checking for live presentation:', err);
      showSnackbar('Error opening display. Please try again.');
    }
  };

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

  const commandCategories = useMemo(() => ({
    navigation: {
      label: 'Navigation',
      icon: <NavigationRounded fontSize="small" />,
      commands: [
        { id: 'nav-presentations', label: 'Presentations', shortcut: 'Ctrl+1', run: () => navigate('/presentations') },
        { id: 'nav-presenter', label: 'Presenter', shortcut: 'Ctrl+2', run: () => navigate('/presenter') },
        { id: 'nav-live', label: 'Live', shortcut: 'Ctrl+3', run: () => navigate('/live') },
        { id: 'nav-media', label: 'Media Library', shortcut: 'Ctrl+4', run: () => navigate('/media') },
        { id: 'nav-songs', label: 'Songs', shortcut: 'Ctrl+5', run: () => navigate('/songs') },
        { id: 'nav-scripture', label: 'Scripture', shortcut: 'Ctrl+6', run: () => navigate('/scripture') },
        { id: 'nav-timer', label: 'Timer', shortcut: 'Ctrl+7', run: () => navigate('/timer') },
        { id: 'nav-planner', label: 'Planner', shortcut: 'Ctrl+8', run: () => navigate('/planner') },
        { id: 'nav-settings', label: 'Settings', shortcut: 'Ctrl+,', run: () => navigate('/settings') }
      ]
    },
    file: {
      label: 'File',
      icon: <InsertDriveFileRounded fontSize="small" />,
      commands: [
        { id: 'new-presentation', label: 'New Presentation', shortcut: 'Ctrl+N', run: () => createPresentationAndOpen() },
        { id: 'open-recent', label: 'Open Recent', shortcut: 'Ctrl+O', run: () => { showSnackbar('Opening recent presentations...'); } },
        { id: 'save', label: 'Save', shortcut: 'Ctrl+S', run: () => { dispatchAppEvent('app:save'); showSnackbar('Presentation saved'); } },
        { id: 'save-as', label: 'Save As...', shortcut: 'Ctrl+Shift+S', run: () => { dispatchAppEvent('app:save-as'); showSnackbar('Save as...'); } },
        { id: 'export', label: 'Export...', shortcut: 'Ctrl+E', run: () => { dispatchAppEvent('app:export'); showSnackbar('Exporting presentation...'); } },
        { id: 'print', label: 'Print...', shortcut: 'Ctrl+P', run: () => { window.print(); showSnackbar('Opening print dialog...'); } }
      ]
    },
    edit: {
      label: 'Edit',
      icon: <EditRoundedIcon fontSize="small" />,
      commands: [
        { id: 'undo', label: 'Undo', shortcut: 'Ctrl+Z', run: () => { dispatchAppEvent('app:undo'); showSnackbar('Undo'); } },
        { id: 'redo', label: 'Redo', shortcut: 'Ctrl+Y', run: () => { dispatchAppEvent('app:redo'); showSnackbar('Redo'); } },
        { id: 'cut', label: 'Cut', shortcut: 'Ctrl+X', run: () => { document.execCommand('cut'); showSnackbar('Cut'); } },
        { id: 'copy', label: 'Copy', shortcut: 'Ctrl+C', run: () => { document.execCommand('copy'); showSnackbar('Copied'); } },
        { id: 'paste', label: 'Paste', shortcut: 'Ctrl+V', run: () => { document.execCommand('paste'); showSnackbar('Pasted'); } },
        { id: 'delete', label: 'Delete', shortcut: 'Del', run: () => { document.execCommand('delete'); showSnackbar('Deleted'); } },
        { id: 'select-all', label: 'Select All', shortcut: 'Ctrl+A', run: () => { document.execCommand('selectAll'); showSnackbar('Selected all'); } },
        { id: 'find', label: 'Find...', shortcut: 'Ctrl+F', run: () => { dispatchAppEvent('app:find'); showSnackbar('Find'); } },
        { id: 'replace', label: 'Replace...', shortcut: 'Ctrl+H', run: () => { dispatchAppEvent('app:replace'); showSnackbar('Replace'); } }
      ]
    },
    slide: {
      label: 'Slide',
      icon: <SlideshowRoundedIcon fontSize="small" />,
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
      icon: <VisibilityRoundedIcon fontSize="small" />,
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
      icon: <PlayCircleRounded fontSize="small" />,
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
        { id: 'toggle-mirror', label: 'Toggle Mirror', shortcut: 'M', run: () => { dispatchAppEvent('presentation:toggle-mirror'); showSnackbar('Toggled mirror'); } },
        { id: 'toggle-freeze', label: 'Toggle Freeze', shortcut: 'F', run: () => { dispatchAppEvent('presentation:toggle-freeze'); showSnackbar('Toggled freeze'); } },
        { id: 'clear-all', label: 'Clear All', shortcut: 'Esc', run: () => { dispatchAppEvent('presentation:clear-all'); showSnackbar('Cleared all'); } }
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
  }), [navigate, createPresentationAndOpen, dispatchAppEvent, showSnackbar, handleToggleFullscreen, closeCommandPalette]);

  const [commands, categories] = useMemo(() => {
    const allCommands = [];
    const categoryList = [];
    
    Object.entries(commandCategories).forEach(([id, category]) => {
      categoryList.push({ id, ...category });
      allCommands.push(...category.commands.map(cmd => ({
        ...cmd,
        category: id,
        categoryLabel: category.label,
        searchText: `${category.label.toLowerCase()} ${cmd.label.toLowerCase()}`
      })));
    });
    
    return [allCommands, categoryList];
  }, [commandCategories]);

  const filteredCommands = useMemo(() => {
    const q = commandQuery.trim().toLowerCase();
    if (!q) return commands;

    // Check for category filter (e.g., '>nav' or '>file')
    const categoryFilter = q.startsWith('>') ? q.slice(1).trim() : null;
    
    return commands.filter((c) => {
      if (categoryFilter) {
        return c.searchText.includes(categoryFilter);
      }
      return c.searchText.includes(q);
    });
  }, [commands, commandQuery]);

  const runCommand = useCallback((cmd) => {
    if (!cmd) return;
    closeCommandPalette();
    cmd.run();
  }, [closeCommandPalette]);

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

  // Support external shortcut events (from ShortcutsProvider)
  useEffect(() => {
    const onShowShortcuts = () => setShortcutsOpen(true);
    const onNew = () => { createPresentationAndOpen(); };
    const onGoLive = () => navigate('/live');

    window.addEventListener('app:show-shortcuts', onShowShortcuts);
    window.addEventListener('app:new', onNew);
    window.addEventListener('app:go-live', onGoLive);

    return () => {
      window.removeEventListener('app:show-shortcuts', onShowShortcuts);
      window.removeEventListener('app:new', onNew);
      window.removeEventListener('app:go-live', onGoLive);
    };
  }, [navigate]);

  // Keep legacy Ctrl/Cmd handling for save/undo/redo and fullscreen as a fallback
  useEffect(() => {
    const onKeyDown = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      const tag = e.target?.tagName?.toLowerCase?.();
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
          setCommandIndex((prev) => {
            const next = prev + 1;
            return next >= filteredCommands.length ? 0 : next;
          });
          return;
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          setCommandIndex((prev) => {
            const next = prev - 1;
            return next < 0 ? Math.max(filteredCommands.length - 1, 0) : next;
          });
          return;
        }
        if (e.key === 'Enter') {
          e.preventDefault();
          runCommand(filteredCommands[commandIndex]);
          return;
        }
        return;
      }

      if (mod && e.key === 's') {
        if (isEditable) return;
        e.preventDefault();
        handleSave();
      }
      if (mod && (e.key === 'z' || e.key === 'Z')) {
        if (isEditable) return;
        e.preventDefault();
        handleUndo();
      }
      if (mod && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        if (isEditable) return;
        e.preventDefault();
        handleRedo();
      }
      if (e.key === 'F11' || (mod && e.key === 'f')) {
        if (isEditable) return;
        e.preventDefault();
        handleToggleFullscreen();
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
    runCommand,
    handleSave,
    handleUndo,
    handleRedo,
    handleToggleFullscreen
  ]);

  // Navigation menu removed - now using ProPresenterSidebar

  // Conditionally show appropriate sidebar
  const isPresentationPage = location.pathname.includes('/presentations/') ||
                            location.pathname.includes('/live-control/');

  const drawer = isPresentationPage ? <ProPresenterSidebar /> : <NavigationSidebar />;

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
              <MenuItem onClick={() => { createPresentationAndOpen(); }}>New Presentation</MenuItem>
              <MenuItem onClick={() => { navigate('/presentations'); handleFileMenuClose(); }}>Open Presentation</MenuItem>
              <MenuItem onClick={handleSave}>Save</MenuItem>
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
              <MenuItem onClick={handleUndo}>Undo</MenuItem>
              <MenuItem onClick={handleRedo}>Redo</MenuItem>
              <Divider />
              <MenuItem onClick={handleCut}>Cut</MenuItem>
              <MenuItem onClick={handleCopy}>Copy</MenuItem>
              <MenuItem onClick={handlePaste}>Paste</MenuItem>
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
              <MenuItem onClick={() => { createPresentationAndOpen(); }}>New Presentation</MenuItem>
              <MenuItem onClick={() => { navigate('/presentations'); handlePresentationMenuClose(); }}>Duplicate Presentation</MenuItem>
              <MenuItem onClick={handlePresentationMenuClose}>Delete Presentation</MenuItem>
              <Divider />
              <MenuItem onClick={() => { window.dispatchEvent(new CustomEvent('presentation:openThemeDialog')); handlePresentationMenuClose(); }}>Theme &amp; Background...</MenuItem>
              <MenuItem onClick={() => { window.dispatchEvent(new CustomEvent('presentation:openFontDialog')); handlePresentationMenuClose(); }}>Font Settings...</MenuItem>
              <MenuItem onClick={() => { window.dispatchEvent(new CustomEvent('presentation:openTransitionDialog')); handlePresentationMenuClose(); }}>Transitions...</MenuItem>
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
              <MenuItem onClick={handleScreensMenuClose}>Confidence</MenuItem>
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
              <MenuItem onClick={handleZoomIn}>Zoom In</MenuItem>
              <MenuItem onClick={handleZoomOut}>Zoom Out</MenuItem>
              <Divider />
              <MenuItem onClick={handleToggleThumbnails}>Toggle Thumbnails</MenuItem>
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
              <MenuItem onClick={handleToggleFullscreen}>Toggle Fullscreen</MenuItem>
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
              onClick={(e) setPresentationMenuAnchor(e.currentTarget)}
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
              Presentation ▾
            </Typography>

            <Typography
              onClick={(e) setLiveMenuAnchor(e.currentTarget)}
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
              <MenuItem onClick={() => { navigate('/planner'); setLiveMenuAnchor(null); }}>Service Planner</MenuItem>
              <MenuItem onClick={() => { navigate('/timer'); setLiveMenuAnchor(null); }}>Timer</MenuItem>
            </Menu>

            <Typography
              onClick={(e) setToolsMenuAnchor(e.currentTarget)}
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
              <MenuItem onClick={handleShowShortcuts}>Keyboard Shortcuts</MenuItem>
              <Divider />
              <MenuItem onClick={handleHelpMenuClose}>About</MenuItem>
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
              {pageTitle}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <IconButton
              size="small"
              color="inherit"
              onClick={openCommandPalette}
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

        {/* Second Toolbar - Professional Style */}
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
              // Dispatch font selection event for other components
              dispatchAppEvent('font:selected', { font });
            }}
            selectedFont={selectedFont}
          />

          {/* Show Button */}
          <Button
            size="small"
            onClick={handleToggleThumbnails}
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
            onClick={handleEditMenuClick}
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
            onClick={() => dispatchAppEvent('app:reflow')}
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

          {/* Bible Button */}
          <Button
            size="small"
            onClick={() => navigate('/scripture')}
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
            <BookRounded sx={{ fontSize: 22, mb: 0.25 }} />
            Bible
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
              onChange={handleDisplayModeChange}
              row
            >
              <FormControlLabel
                value="audio"
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: '#cccccc',
                      '&.Mui-checked': { color: '#81c784' }
                    }}
                  />
                }
                label={<Typography fontSize="0.7rem">Audio</Typography>}
              />
              <FormControlLabel
                value="stage"
                control={
                  <Radio
                    size="small"
                    sx={{
                      color: '#cccccc',
                      '&.Mui-checked': { color: '#81c784' }
                    }}
                  />
                }
                label={<Typography fontSize="0.7rem">Stage</Typography>}
              />
            </RadioGroup>
          </Box>
        </Toolbar>
      </AppBar>

      <Dialog
        open={commandPaletteOpen}
        onClose={closeCommandPalette}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            backgroundColor: '#252526',
            color: '#cccccc',
            border: '1px solid #333',
            borderRadius: 1,
            overflow: 'hidden'
          }
        }}
      >
        <DialogContent sx={{ p: 1 }}>
          <TextField
            inputRef={commandInputRef}
            fullWidth
            value={commandQuery}
            onChange={(e) => setCommandQuery(e.target.value)}
            placeholder="Type a command"
            variant="standard"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment position="start" sx={{ color: '#cccccc', pl: 1 }}>
                  <Search fontSize="small" />
                </InputAdornment>
              )
            }}
            sx={{
              px: 0.5,
              '& .MuiInputBase-root': {
                backgroundColor: '#1e1e1e',
                border: '1px solid #333',
                borderRadius: 1,
                px: 1,
                py: 0.75
              },
              '& input': {
                color: '#cccccc',
                fontSize: '0.875rem'
              }
            }}
          />

          <Box sx={{ mt: 1, maxHeight: 360, overflowY: 'auto' }}>
            <List dense disablePadding>
              {filteredCommands.length === 0 ? (
                <ListItem sx={{ color: '#9d9d9d', py: 1.5, px: 1.5 }}>
                  <ListItemText 
                    primary={
                      commandQuery.startsWith('>') 
                        ? `No commands in category "${commandQuery.slice(1).trim() || '...'}"` 
                        : 'No matching commands'
                    } 
                  />
                </ListItem>
              ) : (
                Object.entries(commandCategories).map(([catId, category]) => (
                  <React.Fragment key={catId}>
                    <ListItem 
                      sx={{ 
                        color: '#9d9d9d', 
                        fontSize: '0.75rem',
                        py: 0.5, 
                        px: 1.5,
                        mt: 1,
                        '&:first-of-type': { mt: 0 }
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {category.icon}
                        <span>{category.label}</span>
                      </Box>
                    </ListItem>
                    {filteredCommands.filter(cmd => cmd.category === catId).map((cmd) => (
                      <ListItem
                        key={cmd.id}
                        button
                        onClick={() => runCommand(cmd)}
                        sx={{
                          borderRadius: 1,
                          mx: 0.5,
                          my: 0.25,
                          backgroundColor: cmd.originalIndex === commandIndex ? 'rgba(255,255,255,0.08)' : 'transparent',
                          '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: 2 }}>
                          <ListItemText
                            primary={cmd.label}
                            primaryTypographyProps={{ sx: { fontSize: '0.875rem', color: '#cccccc' } }}
                          />
                          {cmd.shortcut ? (
                            <Typography
                              variant="caption"
                              sx={{
                                color: '#9d9d9d',
                                border: '1px solid #3a3a3a',
                                backgroundColor: 'rgba(0,0,0,0.25)',
                                borderRadius: 0.75,
                                px: 0.75,
                                py: 0.25,
                                fontSize: '0.72rem',
                                lineHeight: 1.4,
                                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {cmd.shortcut}
                            </Typography>
                          ) : null}
                        </Box>
                      </ListItem>
                    ))}
                  </React.Fragment>
                ))
              )}
            </List>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Main content with sidebar */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Navigation Drawer */}
        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          {/* Desktop drawer - Always visible */}
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', sm: 'block' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#1a1a1a',
                borderRight: '1px solid #404040',
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100vh'
              },
            }}
            open
          >
            {drawer}
          </Drawer>

          {/* Mobile drawer */}
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: 'block', sm: 'none' },
              '& .MuiDrawer-paper': {
                boxSizing: 'border-box',
                width: drawerWidth,
                backgroundColor: '#1a1a1a',
                borderRight: '1px solid #404040',
                display: 'flex',
                flexDirection: 'column',
                height: '100vh'
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

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

          <Dialog open={shortcutsOpen} onClose={handleCloseShortcuts}>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogContent>
              <MUIList>
                <ListItem>
                  <MUIListItemText primary="Save: Ctrl/Cmd+S" />
                </ListItem>
                <ListItem>
                  <MUIListItemText primary="Undo: Ctrl/Cmd+Z" />
                </ListItem>
                <ListItem>
                  <MUIListItemText primary="Redo: Ctrl/Cmd+Y or Ctrl/Shift+Z" />
                </ListItem>
                <ListItem>
                  <MUIListItemText primary="Toggle Fullscreen: F11 or Ctrl/Cmd+F" />
                </ListItem>
              </MUIList>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseShortcuts}>Close</Button>
            </DialogActions>
          </Dialog>

          {/* Effects/Motion Template Designer */}
          <TemplateDesigner 
            open={effectsDialogOpen} 
            onClose={() => setEffectsDialogOpen(false)} 
            onSave={(template) => {
              const saved = JSON.parse(localStorage.getItem('customTemplates') || '[]');
              localStorage.setItem('customTemplates', JSON.stringify([...saved, template]));
            }}
          />

          {/* Service Planner */}
          <ServicePlanner
            open={servicePlannerOpen}
            onClose={() => setServicePlannerOpen(false)}
            onGoLive={(service, items) => {
              console.log('Going live with service:', service, items);
              showSnackbar(`Service "${service.name}" is now live`);
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}