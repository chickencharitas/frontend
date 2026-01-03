import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  IconButton, 
  Tooltip, 
  Divider, 
  Button, 
  TextField,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  AppBar,
  Toolbar,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Slider,
  InputAdornment,
  Stack,
  Chip,
  Alert,
  useTheme,
  useMediaQuery,
  CssBaseline
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  PlayArrow as PlayArrowIcon,
  Pause as PauseIcon,
  SkipNext as NextIcon,
  SkipNext as SkipNextIcon,
  SkipPrevious as PreviousIcon,
  SkipPrevious as SkipPreviousIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  DragIndicator as DragIndicatorIcon,
  ContentCopy as DuplicateIcon,
  MoreVert as MoreIcon,
  Visibility as PreviewIcon,
  SwapVert as ReorderIcon,
  Timer as TimerIcon,
  Notes as NotesIcon,
  Settings as SettingsIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  Menu as MenuIcon,
  Videocam as VideoIcon,
  Image as ImageIcon,
  TextFields as TextIcon,
  Web as WebIcon,
  MusicNote as AudioIcon,
  GridOn as GridIcon,
  ViewModule as ModuleIcon,
  SwapHoriz as SwapIcon,
  Airplay as StageDisplayIcon,
  Tv as StageDisplayScreenIcon,
  Tv as TvIcon,
  Cast as StageDisplayOutputIcon,
  CastConnected as StageDisplayConnectedIcon,
  SettingsInputComponent as InputsIcon,
  SettingsInputHdmi as HdmiIcon,
  SettingsInputAntenna as NdiIcon,
  SettingsInputSvideo as SdiIcon,
  Link as LinkIcon,
  LinkOff as LinkOffIcon,
  CloudUpload as CloudUploadIcon,
  CloudDownload as CloudDownloadIcon,
  CloudSync as CloudSyncIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
  PlaylistAdd as PlaylistAddIcon,
  PlaylistAddCheck as PlaylistAddCheckIcon,
  PlaylistPlay as PlaylistPlayIcon,
  PlaylistRemove as PlaylistRemoveIcon,
  PlaylistAddCircle as PlaylistAddCircleIcon,
  PlaylistAddCheckCircle as PlaylistAddCheckCircleIcon,
  PlaylistPlayCircle as PlaylistPlayCircleIcon,
  PlaylistRemoveCircle as PlaylistRemoveCircleIcon,
  PlayCircle as PlayCircleIcon,
  FormatAlignLeft as AlignLeftIcon,
  FormatAlignCenter as AlignCenterIcon,
  FormatAlignRight as AlignRightIcon,
  FormatAlignJustify as AlignJustifyIcon,
  FormatBold as BoldIcon,
  FormatItalic as ItalicIcon,
  FormatUnderlined as UnderlineIcon,
  FormatColorFill as FillColorIcon,
  FormatColorText as TextColorIcon,
  FormatSize as FontSizeIcon,
  FormatLineSpacing as LineSpacingIcon,
  FormatListBulleted as BulletedListIcon,
  FormatListNumbered as NumberedListIcon,
  FormatQuote as QuoteIcon,
  FormatIndentIncrease as IndentIncreaseIcon,
  FormatIndentDecrease as IndentDecreaseIcon,
  FormatClear as ClearFormattingIcon,
  BorderAll as BorderAllIcon,
  BorderClear as BorderClearIcon,
  BorderTop as BorderTopIcon,
  BorderBottom as BorderBottomIcon,
  BorderLeft as BorderLeftIcon,
  BorderRight as BorderRightIcon,
  BorderInner as BorderInnerIcon,
  BorderOuter as BorderOuterIcon,
  BorderVertical as BorderVerticalIcon,
  BorderHorizontal as BorderHorizontalIcon,
  BorderStyle as BorderStyleIcon,
  BorderColor as BorderColorIcon,
  Opacity as OpacityIcon,
  Colorize as ColorizeIcon,
  Gradient as GradientIcon,
  InvertColors as InvertColorsIcon,
  InvertColorsOff as InvertColorsOffIcon,
  Palette as PaletteIcon,
  Style as StyleIcon,
  TextFormat as TextFormatIcon,
  Title as TitleIcon,
  Subtitles as SubtitlesIcon,
  ClosedCaption as ClosedCaptionIcon,
  FeaturedVideo as FeaturedVideoIcon,
  VideoLibrary as VideoLibraryIcon,
  VideoLabel as VideoLabelIcon,
  VideoSettings as VideoSettingsIcon,
  VideoStable as VideoStableIcon,
  ViewStream as ViewStreamIcon,
  ViewWeek as ViewWeekIcon,
  ViewDay as ViewDayIcon,
  ViewAgenda as ViewAgendaIcon,
  ViewArray as ViewArrayIcon,
  ViewCarousel as ViewCarouselIcon,
  ViewColumn as ViewColumnIcon,
  ViewComfy as ViewComfyIcon,
  ViewCompact as ViewCompactIcon,
  ViewHeadline as ViewHeadlineIcon,
  ViewInAr as ViewInArIcon,
  ViewList as ViewListIcon,
  ViewModule as ViewModuleIcon,
  ViewQuilt as ViewQuiltIcon,
  ViewSidebar as ViewSidebarIcon,
  ViewTimeline as ViewTimelineIcon,
  ViewWeekend as ViewWeekendIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  VoiceOverOff as VoiceOverOffIcon,
  Voicemail as VoicemailIcon,
  VolumeDown as VolumeDownIcon,
  VolumeMute as VolumeMuteIcon,
  VolumeOff as VolumeOffIcon,
  VolumeUp as VolumeUpIcon,
  VpnKey as VpnKeyIcon,
  VpnLock as VpnLockIcon,
  Wallpaper as WallpaperIcon,
  Warning as WarningIcon,
  Watch as WatchIcon,
  WatchLater as WatchLaterIcon,
  WebAsset as WebAssetIcon,
  WebAssetOff as WebAssetOffIcon,
  Weekend as WeekendIcon,
  West as WestIcon,
  Whatshot as WhatshotIcon,
  Widgets as WidgetsIcon,
  Wifi as WifiIcon,
  WifiOff as WifiOffIcon,
  Window as WindowIcon,
  Work as WorkIcon,
  WorkOff as WorkOffIcon,
  WorkOutline as WorkOutlineIcon,
  Wysiwyg as WysiwygIcon,
  YoutubeSearchedFor as YoutubeSearchedForIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  ZoomOutMap as ZoomOutMapIcon,
  ZoomInMap as ZoomInMapIcon
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import StageDisplayManager from '../StageDisplayManager';
import SettingsPanel from '../SettingsPanel';
import AutoSaveManager from '../AutoSaveManager';
import AudienceFeedback from '../AudienceFeedback';
import PerformanceMonitoring from '../PerformanceMonitoring';
import Teleprompter from '../Teleprompter';
import { v4 as uuidv4 } from 'uuid';
import CueList from './components/CueList';
import CueEditor from './components/CueEditor';
import useCues from './hooks/useCues';
import useTimers from './hooks/useTimers';
import { createProPresenterTheme } from './theme/theme';

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Sidebar = styled(Box)(({ theme }) => ({
  width: '300px',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const MainContent = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
});

const PreviewArea = styled(Paper)(({ theme }) => ({
  flex: 1,
  margin: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[3],
}));


const CueItem = styled(Paper, { shouldForwardProp: (prop) => prop !== 'isActive' && prop !== 'isNext' })(
  ({ theme, isActive, isNext }) => ({
    padding: theme.spacing(1.5, 2),
    marginBottom: theme.spacing(1),
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: isActive 
      ? theme.palette.primary.main 
      : isNext 
        ? theme.palette.action.selected 
        : theme.palette.background.paper,
    color: isActive ? theme.palette.primary.contrastText : 'inherit',
    '&:hover': {
      backgroundColor: isActive 
        ? theme.palette.primary.dark 
        : theme.palette.action.hover,
    },
    transition: 'all 0.2s ease-in-out',
  })
);

const ToolbarContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

const PreviewHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.background.default,
}));

const PreviewContent = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(4),
  overflow: 'auto',
}));

const Controls = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  backgroundColor: theme.palette.background.paper,
}));

const CueActions = styled(Box)({
  marginLeft: 'auto',
  display: 'flex',
  gap: '4px',
  opacity: 0,
  transition: 'opacity 0.2s',
  'div:hover &': {
    opacity: 1,
  },
});

const CueContent = styled(Box)({
  flex: 1,
  minWidth: 0,
  '& > *': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

const CueTitle = styled(Typography)({
  fontWeight: 500,
  lineHeight: 1.2,
});

const CueSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  color: theme.palette.text.secondary,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const ProPresenter = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const [cues, setCues] = useState([
    { 
      id: '1', 
      type: 'text', 
      title: 'Welcome', 
      content: 'Welcome to our service', 
      duration: 0, 
      notes: 'Welcome everyone and introduce the service.',
      style: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        fontSize: '48px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }
    },
    { 
      id: '2', 
      type: 'song', 
      title: 'Amazing Grace', 
      content: 'Amazing grace, how sweet the sound...', 
      duration: 180, 
      notes: 'Key: G, Tempo: 75\n\nVerse 1:\nAmazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now I\'m found\nWas blind, but now I see',
      style: {
        backgroundColor: '#000033',
        textColor: '#ffffff',
        fontSize: '42px',
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif'
      }
    },
    { 
      id: '3', 
      type: 'bible', 
      title: 'John 3:16', 
      content: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.', 
      duration: 0, 
      notes: 'ESV Translation\n\nKey points:\n- God\'s love is universal\n- The gift of Jesus\n- The promise of eternal life',
      style: {
        backgroundColor: '#0a2e36',
        textColor: '#ffffff',
        fontSize: '36px',
        textAlign: 'center',
        fontFamily: 'Georgia, serif'
      }
    },
    { 
      id: '4', 
      type: 'media', 
      title: 'Announcements', 
      content: 'Upcoming events and announcements', 
      duration: 0, 
      notes: '1. Bible Study - Wednesday at 7pm\n2. Youth Group - Friday at 6:30pm\n3. Community Outreach - Saturday 9am-12pm',
      style: {
        backgroundColor: '#1a1a1a',
        textColor: '#ffffff',
        fontSize: '32px',
        textAlign: 'left',
        fontFamily: 'Arial, sans-serif'
      }
    },
  ]);
  
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [editingCue, setEditingCue] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showStageDisplay, setShowStageDisplay] = useState(false);
  const [presenterMode, setPresenterMode] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [presentationTime, setPresentationTime] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newCueType, setNewCueType] = useState('text');

  // Cue editor states (for keyboard 'edit cue')
  const [editingCueIndex, setEditingCueIndex] = useState(null);
  const [showCueEditor, setShowCueEditor] = useState(false);
  const [editingCueDraft, setEditingCueDraft] = useState({ title: '', content: '', type: 'text' });

  // Menu states
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [editMenuAnchor, setEditMenuAnchor] = useState(null);
  const [viewMenuAnchor, setViewMenuAnchor] = useState(null);
  const [presentationMenuAnchor, setPresentationMenuAnchor] = useState(null);
  const [helpMenuAnchor, setHelpMenuAnchor] = useState(null);

  // Additional UI states
  const [showProperties, setShowProperties] = useState(false);
  const [showInspector, setShowInspector] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showStageDisplayManager, setShowStageDisplayManager] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [showAutoSaveManager, setShowAutoSaveManager] = useState(false);
  const [showAudienceFeedback, setShowAudienceFeedback] = useState(false);
  const [showPerformanceMonitoring, setShowPerformanceMonitoring] = useState(false);
  const [showTeleprompter, setShowTeleprompter] = useState(false);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(cues);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setCues(items);
  };

  const addCue = () => {
    const newCue = {
      id: uuidv4(),
      type: newCueType,
      title: 'New Cue',
      content: 'Enter content here',
      duration: 0,
      notes: '',
    };
    
    setCues([...cues, newCue]);
    setActiveCueIndex(cues.length);
    setEditingCue(newCue);
  };

  const deleteCue = (index) => {
    const newCues = cues.filter((_, i) => i !== index);
    setCues(newCues);
    
    if (activeCueIndex >= index) {
      setActiveCueIndex(Math.max(0, activeCueIndex - 1));
    }
  };

  const playPause = () => {
    setIsPlaying(!isPlaying);
  };

  const nextCue = () => {
    if (activeCueIndex < cues.length - 1) {
      setActiveCueIndex(activeCueIndex + 1);
    }
  };

  const previousCue = () => {
    if (activeCueIndex > 0) {
      setActiveCueIndex(activeCueIndex - 1);
    }
  };

  const startEditing = (cue, index) => {
    setEditingCue({ ...cue, index });
  };

  const saveCue = () => {
    if (editingCue) {
      const updatedCues = [...cues];
      const { index, ...cueData } = editingCue;
      updatedCues[index] = cueData;
      setCues(updatedCues);
      setEditingCue(null);
    }
  };

  const duplicateCue = (index) => {
    const cueToDuplicate = cues[index];
    const newCue = {
      ...cueToDuplicate,
      id: uuidv4(),
      title: `${cueToDuplicate.title} (Copy)`,
    };
    
    const newCues = [...cues];
    newCues.splice(index + 1, 0, newCue);
    setCues(newCues);
  };

  const filteredCues = cues.filter(cue => 
    cue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cue.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCueIcon = (type) => {
    switch (type) {
      case 'song':
        return '🎵';
      case 'bible':
        return '📖';
      case 'media':
        return '🖼️';
      case 'video':
        return '🎥';
      default:
        return '📝';
    }
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (isPlaying) {
        setPresentationTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  // Replace local keydown handling with centralized event-based shortcuts
  useEffect(() => {
    const onNext = () => nextCue();
    const onPrev = () => previousCue();
    const onTogglePlay = () => setIsPlaying((s) => !s);
    const onToggleStage = () => setShowStageDisplay((s) => !s);
    const onShowShortcuts = () => setShowKeyboardShortcuts(true);
    const onToggleFullscreen = () => toggleFullscreen();
    const onStop = () => {
      setIsPlaying(false);
      setActiveCueIndex(0);
    };

    window.addEventListener('presentation:next', onNext);
    window.addEventListener('presentation:previous', onPrev);
    window.addEventListener('presentation:toggle-play', onTogglePlay);
    window.addEventListener('presentation:toggle-stage', onToggleStage);
    window.addEventListener('app:show-shortcuts', onShowShortcuts);
    window.addEventListener('app:toggle-fullscreen', onToggleFullscreen);
    window.addEventListener('presentation:stop', onStop);

    // Cue management actions
    const onAddCue = () => {
      setCues((prev) => [...prev, { id: Date.now(), title: 'New Cue', content: '' }]);
    };
    const onDuplicateCue = () => {
      setCues((prev) => {
        const current = prev[activeCueIndex];
        if (!current) return prev;
        const copy = { ...current, id: Date.now() };
        const next = [...prev];
        next.splice(activeCueIndex + 1, 0, copy);
        return next;
      });
    };
    const onDeleteCue = () => {
      setCues((prev) => {
        if (!prev[activeCueIndex]) return prev;
        const next = prev.filter((_, i) => i !== activeCueIndex);
        setActiveCueIndex(Math.max(0, activeCueIndex - 1));
        return next;
      });
    };
    const onEditCue = () => {
      // open edit dialog for the current cue
      setEditingCueIndex(activeCueIndex);
      setShowCueEditor(true);
    };

    window.addEventListener('presentation:add-cue', onAddCue);
    window.addEventListener('presentation:duplicate-cue', onDuplicateCue);
    window.addEventListener('presentation:delete-cue', onDeleteCue);
    window.addEventListener('presentation:edit-cue', onEditCue);

    return () => {
      window.removeEventListener('presentation:next', onNext);
      window.removeEventListener('presentation:previous', onPrev);
      window.removeEventListener('presentation:toggle-play', onTogglePlay);
      window.removeEventListener('presentation:toggle-stage', onToggleStage);
      window.removeEventListener('app:show-shortcuts', onShowShortcuts);
      window.removeEventListener('app:toggle-fullscreen', onToggleFullscreen);
      window.removeEventListener('presentation:stop', onStop);
      window.removeEventListener('presentation:add-cue', onAddCue);
      window.removeEventListener('presentation:duplicate-cue', onDuplicateCue);
      window.removeEventListener('presentation:delete-cue', onDeleteCue);
      window.removeEventListener('presentation:edit-cue', onEditCue);
    };
  }, [activeCueIndex]);

  // Sync editing draft when the editor opens
  useEffect(() => {
    if (showCueEditor && editingCueIndex != null) {
      const c = cues[editingCueIndex] || { title: '', content: '', type: 'text' };
      setEditingCueDraft({ title: c.title || '', content: c.content || '', type: c.type || 'text' });
    }
  }, [showCueEditor, editingCueIndex, cues]);

  const saveEditingCue = () => {
    if (editingCueIndex == null) return setShowCueEditor(false);
    setCues((prev) => prev.map((c, i) => (i === editingCueIndex ? { ...c, ...editingCueDraft } : c)));
    setShowCueEditor(false);
  };

  const cancelEditingCue = () => {
    setShowCueEditor(false);
    setEditingCueIndex(null);
  };



  // Menu handlers
  const handleFileMenuClick = (event) => setFileMenuAnchor(event.currentTarget);
  const handleEditMenuClick = (event) => setEditMenuAnchor(event.currentTarget);
  const handleViewMenuClick = (event) => setViewMenuAnchor(event.currentTarget);
  const handlePresentationMenuClick = (event) => setPresentationMenuAnchor(event.currentTarget);
  const handleHelpMenuClick = (event) => setHelpMenuAnchor(event.currentTarget);

  const handleMenuClose = () => {
    setFileMenuAnchor(null);
    setEditMenuAnchor(null);
    setViewMenuAnchor(null);
    setPresentationMenuAnchor(null);
    setHelpMenuAnchor(null);
  };

  const handleShowKeyboardShortcuts = () => {
    setShowKeyboardShortcuts(true);
    handleMenuClose();
  };

  const handleUserGuide = () => {
    // Open user guide documentation
    window.open('https://github.com/worshipress/docs', '_blank');
    handleMenuClose();
  };

  const handleAbout = () => {
    // Show about dialog
    alert('Worshipress Presenter\nVersion 1.0.0\nProfessional Worship Presentation Software');
    handleMenuClose();
  };

  // Menu action handlers
  const handleNewPresentation = () => {
    // Reset to empty presentation
    setCues([]);
    setActiveCueIndex(0);
    setIsPlaying(false);
    handleMenuClose();
  };

  const handleOpenPresentation = () => {
    // Navigate to presentations page to open existing
    navigate('/presentations');
    handleMenuClose();
  };

  const handleSavePresentation = () => {
    // Save presentation logic
    console.log('Saving presentation...');
    handleMenuClose();
  };

  const handleExportPresentation = () => {
    // Export presentation logic
    console.log('Exporting presentation...');
    handleMenuClose();
  };

  const handleImportPresentation = () => {
    // Import presentation logic
    console.log('Importing presentation...');
    handleMenuClose();
  };

  const handleRecentPresentations = () => {
    // Show recent presentations
    navigate('/presentations');
    handleMenuClose();
  };

  const handleToggleProperties = () => {
    setShowProperties(!showProperties);
    handleMenuClose();
  };

  const handleToggleInspector = () => {
    setShowInspector(!showInspector);
    handleMenuClose();
  };

  const handleToggleTimeline = () => {
    setShowTimeline(!showTimeline);
    handleMenuClose();
  };

  const handleAudienceLook = () => {
    // Open audience view in new window
    window.open('/projection/audience', '_blank');
    handleMenuClose();
  };

  const handleShowStageDisplayManager = () => {
    setShowStageDisplayManager(true);
    handleMenuClose();
  };

  const handleShowSettingsPanel = () => {
    setShowSettingsPanel(true);
    handleMenuClose();
  };

  const handleShowAutoSaveManager = () => {
    setShowAutoSaveManager(true);
    handleMenuClose();
  };

  const handleShowAudienceFeedback = () => {
    setShowAudienceFeedback(true);
    handleMenuClose();
  };

  const handleShowPerformanceMonitoring = () => {
    setShowPerformanceMonitoring(true);
    handleMenuClose();
  };

  const handleShowTeleprompter = () => {
    setShowTeleprompter(true);
    handleMenuClose();
  };

  const handleUndo = () => {
    console.log('Undo action');
    handleMenuClose();
  };

  const handleRedo = () => {
    console.log('Redo action');
    handleMenuClose();
  };

  const handleCut = () => {
    console.log('Cut action');
    handleMenuClose();
  };

  const handleCopy = () => {
    console.log('Copy action');
    handleMenuClose();
  };

  const handlePaste = () => {
    console.log('Paste action');
    handleMenuClose();
  };

  const handleSelectAll = () => {
    console.log('Select all cues');
    handleMenuClose();
  };

  const handleFind = () => {
    console.log('Find/Replace');
    handleMenuClose();
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderCueContent = (cue, isPreview = false) => {
    if (!cue) return null;
    
    const style = {
      ...cue.style,
      padding: '20px',
      borderRadius: '8px',
      height: isPreview ? '100%' : 'auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
      overflow: 'hidden',
      wordBreak: 'break-word',
      whiteSpace: 'pre-line',
      lineHeight: 1.4,
    };

    return (
      <Box sx={style}>
        {cue.content.split('\n').map((line, i) => (
          <div key={i} style={{ margin: '10px 0' }}>{line}</div>
        ))}
      </Box>
    );
  };

  return (
    <Container>
      {/* Toolbar */}
      <AppBar position="static" color="default" elevation={1}>
        <ToolbarContainer>
          {/* Menu Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mr: 2 }}>
            <Button size="small" onClick={handleFileMenuClick} sx={{ textTransform: 'none', fontSize: '0.875rem' }}>
              File
            </Button>
            <Button size="small" onClick={handleEditMenuClick} sx={{ textTransform: 'none', fontSize: '0.875rem' }}>
              Edit
            </Button>
            <Button size="small" onClick={handleViewMenuClick} sx={{ textTransform: 'none', fontSize: '0.875rem' }}>
              View
            </Button>
            <Button size="small" onClick={handlePresentationMenuClick} sx={{ textTransform: 'none', fontSize: '0.875rem' }}>
              Presentation
            </Button>
            <Button size="small" onClick={handleHelpMenuClick} sx={{ textTransform: 'none', fontSize: '0.875rem' }}>
              Help
            </Button>
          </Box>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {cues.length > 0 ? cues[activeCueIndex]?.title || 'Untitled Presentation' : 'New Presentation'}
          </Typography>
          
          {/* Presentation Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 60 }}>
              {formatTime(presentationTime)}
            </Typography>
            <Tooltip title={isPlaying ? 'Pause Presentation' : 'Play Presentation'}>
            <IconButton
              size="small"
              color={isPlaying ? 'primary' : 'default'}
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
            </IconButton>
            </Tooltip>

            {/* Go Live button */}
            <Tooltip title="Go Live">
              <IconButton
                size="small"
                color="secondary"
                onClick={() => {
                  // signal go-live intent and navigate to presentations to pick one
                  window.dispatchEvent(new CustomEvent('app:go-live'));
                  navigate('/presentations');
                }}
              >
                <PlayCircleIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />

          {/* Cue Navigation */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mr: 2 }}>
            <Tooltip title="Previous Cue">
              <IconButton
                size="small"
                onClick={previousCue}
                disabled={activeCueIndex === 0}
                sx={{ color: activeCueIndex === 0 ? 'text.disabled' : 'inherit' }}
              >
                <SkipPreviousIcon />
              </IconButton>
            </Tooltip>

            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 40, textAlign: 'center' }}>
              {activeCueIndex + 1} / {cues.length}
            </Typography>

            <Tooltip title="Next Cue">
              <IconButton
                size="small"
                onClick={nextCue}
                disabled={activeCueIndex >= cues.length - 1}
                sx={{ color: activeCueIndex >= cues.length - 1 ? 'text.disabled' : 'inherit' }}
              >
                <SkipNextIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />

          {/* View Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
              <IconButton onClick={toggleFullscreen} size="small">
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Stage Display">
              <IconButton 
                onClick={() => setShowStageDisplay(!showStageDisplay)} 
                color={showStageDisplay ? 'primary' : 'default'}
                size="small"
              >
                <TvIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Properties Panel">
              <IconButton
                onClick={() => setShowProperties(!showProperties)}
                color={showProperties ? 'primary' : 'default'}
                size="small"
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />

          {/* Additional Controls */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Zoom In">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <AddIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 40, textAlign: 'center' }}>
              100%
            </Typography>
            <Tooltip title="Zoom Out">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <Typography variant="caption" sx={{ fontSize: '18px', lineHeight: 1 }}>−</Typography>
              </IconButton>
            </Tooltip>
          </Box>

          <Divider orientation="vertical" flexItem sx={{ mx: 1, height: 32 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Text Formatting">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <TextIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Media Browser">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <ImageIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Cue Actions">
              <IconButton size="small" sx={{ color: 'text.secondary' }}>
                <PlaylistPlayIcon />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Settings">
              <IconButton 
                onClick={handleShowSettingsPanel}
                size="small"
                sx={{ color: 'text.secondary' }}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </ToolbarContainer>
      </AppBar>

      {/* File Menu */}
      <Menu
        anchorEl={fileMenuAnchor}
        open={Boolean(fileMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleNewPresentation}>
          <Typography variant="body2">New Presentation</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+N</Typography>
        </MenuItem>
        <MenuItem onClick={handleOpenPresentation}>
          <Typography variant="body2">Open Presentation...</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+O</Typography>
        </MenuItem>
        <MenuItem onClick={handleSavePresentation}>
          <Typography variant="body2">Save Presentation</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+S</Typography>
        </MenuItem>
        <MenuItem onClick={handleExportPresentation}>
          <Typography variant="body2">Export Presentation...</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleShowAutoSaveManager}>
          <Typography variant="body2">Auto-Save & Backup Manager</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleImportPresentation}>
          <Typography variant="body2">Import Presentation...</Typography>
        </MenuItem>
        <MenuItem onClick={handleRecentPresentations}>
          <Typography variant="body2">Recent Presentations</Typography>
        </MenuItem>
      </Menu>

      {/* Edit Menu */}
      <Menu
        anchorEl={editMenuAnchor}
        open={Boolean(editMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleUndo}>
          <Typography variant="body2">Undo</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+Z</Typography>
        </MenuItem>
        <MenuItem onClick={handleRedo}>
          <Typography variant="body2">Redo</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+Y</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleCut}>
          <Typography variant="body2">Cut</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+X</Typography>
        </MenuItem>
        <MenuItem onClick={handleCopy}>
          <Typography variant="body2">Copy</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+C</Typography>
        </MenuItem>
        <MenuItem onClick={handlePaste}>
          <Typography variant="body2">Paste</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+V</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSelectAll}>
          <Typography variant="body2">Select All</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+A</Typography>
        </MenuItem>
        <MenuItem onClick={handleFind}>
          <Typography variant="body2">Find...</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Ctrl+F</Typography>
        </MenuItem>
      </Menu>

      {/* View Menu */}
      <Menu
        anchorEl={viewMenuAnchor}
        open={Boolean(viewMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleToggleProperties}>
          <Typography variant="body2">Properties Panel</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {showProperties ? '✓' : ''}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleToggleInspector}>
          <Typography variant="body2">Inspector</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {showInspector ? '✓' : ''}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleToggleTimeline}>
          <Typography variant="body2">Timeline</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {showTimeline ? '✓' : ''}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleShowStageDisplayManager}>
          <Typography variant="body2">Stage Display Manager</Typography>
        </MenuItem>
        <MenuItem onClick={handleShowAudienceFeedback}>
          <Typography variant="body2">Audience Feedback</Typography>
        </MenuItem>
        <MenuItem onClick={handleShowPerformanceMonitoring}>
          <Typography variant="body2">Performance Monitoring</Typography>
        </MenuItem>
        <MenuItem onClick={handleShowTeleprompter}>
          <Typography variant="body2">Teleprompter</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={toggleFullscreen}>
          <Typography variant="body2">Fullscreen</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>F11</Typography>
        </MenuItem>
      </Menu>

      {/* Presentation Menu */}
      <Menu
        anchorEl={presentationMenuAnchor}
        open={Boolean(presentationMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={() => setIsPlaying(!isPlaying)}>
          <Typography variant="body2">{isPlaying ? 'Pause' : 'Play'} Presentation</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Space</Typography>
        </MenuItem>
        <MenuItem onClick={() => setIsPlaying(false)}>
          <Typography variant="body2">Stop Presentation</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>Esc</Typography>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setShowStageDisplay(!showStageDisplay)}>
          <Typography variant="body2">Stage Display</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
            {showStageDisplay ? '✓' : ''}
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleAudienceLook}>
          <Typography variant="body2">Audience Look</Typography>
        </MenuItem>
      </Menu>

      {/* Help Menu */}
      <Menu
        anchorEl={helpMenuAnchor}
        open={Boolean(helpMenuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: { minWidth: 200 }
        }}
      >
        <MenuItem onClick={handleUserGuide}>
          <Typography variant="body2">User Guide</Typography>
        </MenuItem>
        <MenuItem onClick={handleShowKeyboardShortcuts}>
          <Typography variant="body2">Keyboard Shortcuts</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>F1</Typography>
        </MenuItem>
        <MenuItem onClick={handleAbout}>
          <Typography variant="body2">About</Typography>
        </MenuItem>
      </Menu>

      {/* Keyboard Shortcuts Dialog */}
      <Dialog
        open={showKeyboardShortcuts}
        onClose={() => setShowKeyboardShortcuts(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: 'background.paper',
            color: 'text.primary'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          Keyboard Shortcuts
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use these keyboard shortcuts to control your presentation efficiently.
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
            {/* Presentation Control */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Presentation Control
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Play/Pause</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="Space" size="small" variant="outlined" />
                    <Chip label="P" size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Next Cue</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip label="→" size="small" variant="outlined" />
                    <Chip label="Space" size="small" variant="outlined" />
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Previous Cue</Typography>
                  <Chip label="←" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Stop Presentation</Typography>
                  <Chip label="Esc" size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>

            {/* View Controls */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                View Controls
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Toggle Fullscreen</Typography>
                  <Chip label="F11" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Stage Display</Typography>
                  <Chip label="S" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Properties Panel</Typography>
                  <Chip label="F" size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>

            {/* Menu Shortcuts */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Menu Shortcuts
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">New Presentation</Typography>
                  <Chip label="Ctrl+N" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Save Presentation</Typography>
                  <Chip label="Ctrl+S" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Undo</Typography>
                  <Chip label="Ctrl+Z" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Redo</Typography>
                  <Chip label="Ctrl+Y" size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>

            {/* Cue Management */}
            <Box>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
                Cue Management
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Add New Cue</Typography>
                  <Chip label="Ctrl+A" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Duplicate Cue</Typography>
                  <Chip label="Ctrl+D" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Delete Cue</Typography>
                  <Chip label="Del" size="small" variant="outlined" />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2">Edit Cue</Typography>
                  <Chip label="F2" size="small" variant="outlined" />
                </Box>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Tip:</strong> You can customize these shortcuts in the Settings menu.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowKeyboardShortcuts(false)} sx={{ color: 'text.secondary' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cue Editor Dialog */}
      <Dialog open={showCueEditor} onClose={cancelEditingCue} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Cue</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editingCueDraft.title}
              onChange={(e) => setEditingCueDraft((prev) => ({ ...prev, title: e.target.value }))}
            />
            <TextField
              fullWidth
              label="Content"
              value={editingCueDraft.content}
              onChange={(e) => setEditingCueDraft((prev) => ({ ...prev, content: e.target.value }))}
              multiline
              rows={6}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelEditingCue}>Cancel</Button>
          <Button onClick={saveEditingCue} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Stage Display Manager Dialog */}
      <Dialog
        open={showStageDisplayManager}
        onClose={() => setShowStageDisplayManager(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white'
          }
        }}
      >
        <StageDisplayManager onClose={() => setShowStageDisplayManager(false)} />
      </Dialog>

      {/* Settings Panel Dialog */}
      <Dialog
        open={showSettingsPanel}
        onClose={() => setShowSettingsPanel(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white'
          }
        }}
      >
        <SettingsPanel onClose={() => setShowSettingsPanel(false)} />
      </Dialog>

      {/* Auto-Save Manager Dialog */}
      <Dialog
        open={showAutoSaveManager}
        onClose={() => setShowAutoSaveManager(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white'
          }
        }}
      >
        <AutoSaveManager onClose={() => setShowAutoSaveManager(false)} />
      </Dialog>

      {/* Audience Feedback Dialog */}
      <Dialog
        open={showAudienceFeedback}
        onClose={() => setShowAudienceFeedback(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white'
          }
        }}
      >
        <AudienceFeedback onClose={() => setShowAudienceFeedback(false)} />
      </Dialog>

      {/* Performance Monitoring Dialog */}
      <Dialog
        open={showPerformanceMonitoring}
        onClose={() => setShowPerformanceMonitoring(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white'
          }
        }}
      >
        <PerformanceMonitoring onClose={() => setShowPerformanceMonitoring(false)} />
      </Dialog>

      {/* Teleprompter Dialog */}
      <Dialog
        open={showTeleprompter}
        onClose={() => setShowTeleprompter(false)}
        maxWidth="lg"
        fullWidth
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: '#1a1a1a',
            color: 'white'
          }
        }}
      >
        <Teleprompter onClose={() => setShowTeleprompter(false)} />
      </Dialog>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Cue List */}
        <Sidebar
          sx={{
            width: showProperties ? '280px' : '320px',
            transition: 'width 0.3s ease'
          }}
        >
          <Box sx={{ p: 2, pb: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
              Cue List
            </Typography>
          </Box>

          <Box sx={{ px: 2, py: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search cues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="outlined"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: 'primary.main' }
                },
                '& .MuiInputBase-input::placeholder': {
                  color: '#b0b0b0'
                }
              }}
            />
          </Box>

          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <CueList
              cues={filteredCues.map(cue => ({
                ...cue,
                name: cue.title,
                type: cue.type
              }))}
              activeCueId={cues[activeCueIndex]?.id}
              onCueSelect={(cueId) => {
                const index = cues.findIndex(c => c.id === cueId);
                setActiveCueIndex(index);
              }}
              onCueDelete={(cueId) => {
                const index = cues.findIndex(c => c.id === cueId);
                deleteCue(index);
              }}
              onCueDuplicate={(cueId) => {
                const index = cues.findIndex(c => c.id === cueId);
                duplicateCue(index);
              }}
              onCuesReorder={handleDragEnd}
              onCuePlay={(cueId) => {
                const index = cues.findIndex(c => c.id === cueId);
                setActiveCueIndex(index);
              }}
              onCueEdit={(cue) => {
                const index = cues.findIndex(c => c.id === cue.id);
                startEditing(cue, index);
              }}
              height="100%"
            />
          </Box>

          <Controls>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<PlayArrowIcon />}
            onClick={playPause}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Previous Cue">
              <IconButton onClick={previousCue} disabled={activeCueIndex === 0}>
                <SkipPreviousIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Next Cue">
              <IconButton onClick={nextCue} disabled={activeCueIndex >= cues.length - 1}>
                <SkipNextIcon />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Typography variant="body2" color="textSecondary">
            {activeCueIndex + 1} / {cues.length}
          </Typography>
        </Controls>
      </Sidebar>
      
      <MainContent>
        <PreviewArea>
          <PreviewHeader>
            <Typography variant="h6">
              {cues[activeCueIndex]?.title || 'No Cue Selected'}
            </Typography>
            <Box>
              <Tooltip title="Notes">
                <IconButton size="small">
                  <NotesIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Timer">
                <IconButton size="small">
                  <TimerIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </PreviewHeader>
          
          <PreviewContent>
            {editingCue ? (
              <Box sx={{ width: '100%', maxWidth: 800, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Edit Cue</Typography>
                  <Box>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      size="small" 
                      startIcon={<SaveIcon />}
                      onClick={saveCue}
                      sx={{ mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<CloseIcon />}
                      onClick={() => setEditingCue(null)}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
                <TextField
                  label="Title"
                  fullWidth
                  margin="normal"
                  value={editingCue.title || ''}
                  onChange={(e) => {
                    const updated = {...editingCue, title: e.target.value};
                    setEditingCue(updated);
                  }}
                />
                <TextField
                  label="Content"
                  fullWidth
                  multiline
                  rows={6}
                  margin="normal"
                  value={editingCue.content || ''}
                  onChange={(e) => {
                    const updated = {...editingCue, content: e.target.value};
                    setEditingCue(updated);
                  }}
                />
                
                <TextField
                  label="Notes"
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  value={editingCue.notes || ''}
                  onChange={(e) => {
                    const updated = {...editingCue, notes: e.target.value};
                    setEditingCue(updated);
                  }}
                />
                
                <TextField
                  label="Duration (seconds)"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={editingCue.duration || 0}
                  onChange={(e) => {
                    const updated = {...editingCue, duration: parseInt(e.target.value) || 0};
                    setEditingCue(updated);
                  }}
                />
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h3" sx={{ mb: 3, fontWeight: 'bold' }}>
                  {cues[activeCueIndex]?.content || 'Select a cue to begin'}
                </Typography>
                
                {cues[activeCueIndex]?.notes && (
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      display: 'inline-block', 
                      p: 2, 
                      mt: 3, 
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      textAlign: 'left',
                      maxWidth: '80%',
                    }}
                  >
                    <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 1 }}>
                      Notes
                    </Typography>
                    <Typography variant="body2">
                      {cues[activeCueIndex].notes}
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}
          </PreviewContent>
          
          <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Tooltip title={`Slide ${activeCueIndex + 1} of ${cues.length}`}>
                <Typography variant="caption" color="textSecondary">
                  {activeCueIndex + 1} / {cues.length}
                </Typography>
              </Tooltip>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Previous">
                <IconButton size="small" onClick={previousCue} disabled={activeCueIndex === 0}>
                  <SkipPreviousIcon />
                </IconButton>
              </Tooltip>
              
              <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
                <IconButton 
                  size="small" 
                  color="primary" 
                  onClick={playPause}
                >
                  {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Next">
                <IconButton 
                  size="small" 
                  onClick={nextCue} 
                  disabled={activeCueIndex >= cues.length - 1}
                >
                  <SkipNextIcon />
                </IconButton>
              </Tooltip>
            </Box>
            
            <Box>
              <Tooltip title="Edit Cue">
                <IconButton 
                  size="small" 
                  onClick={() => startEditing(cues[activeCueIndex], activeCueIndex)}
                  disabled={!cues[activeCueIndex]}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </PreviewArea>
      </MainContent>

      {/* Right Properties Panel */}
      {showProperties && (
        <Box
          sx={{
            width: '300px',
            backgroundColor: 'background.paper',
            borderLeft: `1px solid ${theme.palette.divider}`,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Properties</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Current Cue</Typography>
            {cues[activeCueIndex] && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Title:</strong> {cues[activeCueIndex].title}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Type:</strong> {cues[activeCueIndex].type}
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Duration:</strong> {formatTime(cues[activeCueIndex].duration || 0)}
                </Typography>
              </Box>
            )}

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ mb: 2 }}>Presentation Info</Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Total Cues:</strong> {cues.length}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Current Cue:</strong> {activeCueIndex + 1}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Status:</strong> {isPlaying ? 'Playing' : 'Paused'}
            </Typography>
          </Box>
        </Box>
      )}
      </Box>

      {/* Status Bar */}
      <Box
        sx={{
          height: '24px',
          backgroundColor: 'background.paper',
          borderTop: `1px solid ${theme.palette.divider}`,
          display: 'flex',
          alignItems: 'center',
          px: 2,
          fontSize: '0.75rem',
          color: 'text.secondary'
        }}
      >
        <Typography variant="caption" sx={{ flex: 1 }}>
          Ready - {cues.length} cues loaded
        </Typography>
        <Typography variant="caption">
          {showStageDisplay ? 'Stage Display: ON' : 'Stage Display: OFF'} |
          {isFullscreen ? 'Fullscreen: ON' : 'Fullscreen: OFF'} |
          Presentation Time: {formatTime(presentationTime)}
        </Typography>
      </Box>
    </Container>
  );
};

export default ProPresenter;
