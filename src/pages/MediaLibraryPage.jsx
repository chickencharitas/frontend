import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Alert,
  Snackbar,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  InputAdornment,
  Tooltip,
  Badge,
  Fab,
  Breadcrumbs,
  Link as MuiLink,
  LinearProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  Visibility as PreviewIcon,
  CloudUpload as UploadIcon,
  Image as ImageIcon,
  VideoLibrary as VideoIcon,
  Slideshow as PresentationIcon,
  MusicNote as AudioIcon,
  Search as SearchIcon,
  GridOn as GridIcon,
  ViewList as ListIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Folder as FolderIcon,
  Home as HomeIcon,
  Add as AddIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
  FilterList as FilterIcon,
  Sort as SortIcon,
  Fullscreen as FullscreenIcon,
  VolumeUp as VolumeIcon,
  VolumeOff as VolumeOffIcon,
  Settings as SettingsIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
  FileUpload as FileUploadIcon,
  Timer as TimerIcon,
  AccessTime as AccessTimeIcon,
  Stop as StopIcon,
  RestartAlt as RestartIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const MotionCard = motion(Card);
const MotionBox = motion(Box);

// Local storage key for media
const MEDIA_STORAGE_KEY = 'worshipress_media';

// Load media from localStorage
const loadMediaFromStorage = () => {
  try {
    const stored = localStorage.getItem(MEDIA_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load media from storage:', error);
  }
  return [];
};

// Save media to localStorage
const saveMediaToStorage = (media) => {
  try {
    localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(media));
  } catch (error) {
    console.warn('Failed to save media to storage:', error);
  }
};

// Mock media categories
const MEDIA_CATEGORIES = {
  images: {
    name: 'Images',
    icon: ImageIcon,
    color: '#4fc3f7',
    subcategories: ['Backgrounds', 'Logos', 'Announcements', 'Photos']
  },
  videos: {
    name: 'Videos',
    icon: VideoIcon,
    color: '#e57373',
    subcategories: ['Worship', 'Sermon', 'Countdown', 'Looping']
  },
  presentations: {
    name: 'Presentations',
    icon: PresentationIcon,
    color: '#ffb74d',
    subcategories: ['Slides', 'Sermon Notes', 'Announcements']
  },
  audio: {
    name: 'Audio',
    icon: AudioIcon,
    color: '#81c784',
    subcategories: ['Music', 'Sound Effects', 'Voice']
  }
};

export default function MediaLibraryPage() {
  const navigate = useNavigate();
  
  const [media, setMedia] = useState(() => loadMediaFromStorage());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, detail
  const [sortBy, setSortBy] = useState('dateAdded'); // name, dateAdded, type, size
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  
  // Dialog states
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Upload states
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  // Timer states
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  
  // Form states
  const [newMedia, setNewMedia] = useState({
    title: '',
    type: 'image',
    category: 'Backgrounds',
    subcategory: '',
    url: '',
    duration: 10,
    description: '',
    tags: [],
    isFavorite: false,
    notes: ''
  });
  
  const [editingMedia, setEditingMedia] = useState(null);

  // Filter and sort media
  const filteredMedia = media
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || item.type === selectedCategory;
      const matchesSubcategory = selectedSubcategory === 'all' || item.subcategory === selectedSubcategory;
      
      return matchesSearch && matchesCategory && matchesSubcategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'dateAdded':
          comparison = new Date(a.addedDate) - new Date(b.addedDate);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'size':
          comparison = (a.fileSize || 0) - (b.fileSize || 0);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Handle media operations
  const handleAddMedia = async () => {
    try {
      let finalUrl = newMedia.url;
      
      // If file upload method, upload to S3 first
      if (uploadMethod === 'file' && selectedFile) {
        finalUrl = await uploadToS3(selectedFile);
      }
      
      const mediaToAdd = {
        id: Date.now(),
        ...newMedia,
        url: finalUrl,
        addedDate: new Date().toISOString().split('T')[0],
        lastModified: new Date().toISOString(),
        fileSize: selectedFile ? selectedFile.size : Math.floor(Math.random() * 10000000),
        plays: 0,
        isFavorite: false
      };
      
      const updatedMedia = [...media, mediaToAdd];
      setMedia(updatedMedia);
      saveMediaToStorage(updatedMedia);
      
      // Reset form
      setNewMedia({
        title: '',
        type: 'image',
        category: 'Backgrounds',
        subcategory: '',
        url: '',
        duration: 10,
        description: '',
        tags: [],
        isFavorite: false,
        notes: ''
      });
      setSelectedFile(null);
      setUploadMethod('url');
      
      setUploadDialogOpen(false);
      setSnackbarMessage(`"${mediaToAdd.title}" added to media library!`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage('Upload failed. Please try again.');
      setSnackbarOpen(true);
      console.error('Add media error:', error);
    }
  };

  const handleEditMedia = () => {
    const updatedMedia = media.map(item => 
      item.id === editingMedia.id ? editingMedia : item
    );
    setMedia(updatedMedia);
    saveMediaToStorage(updatedMedia);
    
    setEditDialogOpen(false);
    setEditingMedia(null);
    setSnackbarMessage(`Media updated successfully!`);
    setSnackbarOpen(true);
  };

  const handleDeleteMedia = (id) => {
    const updatedMedia = media.filter(item => item.id !== id);
    setMedia(updatedMedia);
    saveMediaToStorage(updatedMedia);
    
    setSnackbarMessage('Media deleted successfully!');
    setSnackbarOpen(true);
  };

  const handleToggleFavorite = (id) => {
    const updatedMedia = media.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    );
    setMedia(updatedMedia);
    saveMediaToStorage(updatedMedia);
  };

  const handleMenuClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId(null);
  };

  const handleAddToService = (mediaItem) => {
    // Convert media to presentation format
    const presentationItem = {
      id: `media-lib-${mediaItem.id}`,
      type: mediaItem.type,
      title: mediaItem.title,
      url: mediaItem.url,
      duration: mediaItem.duration,
      description: mediaItem.description,
      slides: [{ id: `${mediaItem.id}-slide-0`, content: mediaItem.title, label: mediaItem.title }]
    };
    
    // Get current service from localStorage or initialize empty
    const currentService = JSON.parse(localStorage.getItem('worshipress_service') || '[]');
    currentService.push(presentationItem);
    localStorage.setItem('worshipress_service', JSON.stringify(currentService));
    
    setSnackbarMessage(`"${mediaItem.title}" added to service!`);
    setSnackbarOpen(true);
    
    // Navigate to worship workspace
    navigate('/worship');
  };

  const handleGoLive = (mediaItem) => {
    // Convert media to presentation format
    const presentationItem = {
      id: `media-lib-${mediaItem.id}`,
      type: mediaItem.type,
      title: mediaItem.title,
      url: mediaItem.url,
      duration: mediaItem.duration,
      description: mediaItem.description,
      slides: [{ id: `${mediaItem.id}-slide-0`, content: mediaItem.title, label: mediaItem.title }]
    };
    
    // Get current service from localStorage or initialize empty
    const currentService = JSON.parse(localStorage.getItem('worshipress_service') || '[]');
    currentService.push(presentationItem);
    localStorage.setItem('worshipress_service', JSON.stringify(currentService));
    
    // Set as live output
    const liveOutput = {
      currentItem: presentationItem,
      currentSlideIndex: 0,
      isLive: true,
      isBlacked: false,
      isCleared: false
    };
    localStorage.setItem('worshipress_live_output', JSON.stringify(liveOutput));
    
    setSnackbarMessage(`"${mediaItem.title}" is now LIVE!`);
    setSnackbarOpen(true);
    
    // Navigate to worship workspace
    navigate('/worship');
  };

  // File upload handlers
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Auto-fill title from filename
      const title = file.name.split('.')[0];
      setNewMedia(prev => ({ ...prev, title }));
      
      // Auto-detect type from file
      const fileType = file.type.split('/')[0];
      if (['image', 'video', 'audio'].includes(fileType)) {
        setNewMedia(prev => ({ ...prev, type: fileType }));
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      
      // Auto-fill title from filename
      const title = file.name.split('.')[0];
      setNewMedia(prev => ({ ...prev, title }));
      
      // Auto-detect type from file
      const fileType = file.type.split('/')[0];
      if (['image', 'video', 'audio'].includes(fileType)) {
        setNewMedia(prev => ({ ...prev, type: fileType }));
      }
    }
  };

  const uploadToS3 = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', newMedia.title);
    formData.append('type', newMedia.type);
    formData.append('category', newMedia.category);
    formData.append('description', newMedia.description);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await fetch('/api/media/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      return result.url; // Return S3 URL
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'video': return VideoIcon;
      case 'presentation': return PresentationIcon;
      case 'audio': return AudioIcon;
      default: return ImageIcon;
    }
  };

  const getMediaColor = (type) => {
    switch (type) {
      case 'image': return '#4fc3f7';
      case 'video': return '#e57373';
      case 'presentation': return '#ffb74d';
      case 'audio': return '#81c784';
      default: return '#9e9e9e';
    }
  };

  // Timer functionality
  useEffect(() => {
    let interval;
    if (timerRunning && timerTotalSeconds > 0) {
      interval = setInterval(() => {
        setTimerTotalSeconds(prev => {
          if (prev <= 1) {
            setTimerRunning(false);
            setSnackbarMessage('Timer finished!');
            setSnackbarOpen(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerTotalSeconds]);

  const startTimer = () => {
    const totalSeconds = timerMinutes * 60 + timerSeconds;
    if (totalSeconds > 0) {
      setTimerTotalSeconds(totalSeconds);
      setTimerRunning(true);
      setTimerOpen(false);
    }
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerTotalSeconds(0);
    setTimerMinutes(5);
    setTimerSeconds(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Render media item
  const renderMediaItem = (item) => {
    const Icon = getMediaIcon(item.type);
    const color = getMediaColor(item.type);
    
    if (viewMode === 'grid') {
      return (
        <MotionCard
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          whileHover={{ y: -5, boxShadow: 3 }}
          transition={{ duration: 0.2 }}
          sx={{
            height: 280,
            display: 'flex',
            flexDirection: 'column',
            cursor: 'pointer',
            position: 'relative',
            bgcolor: '#2a2a2a',
            border: '1px solid #404040',
            '&:hover': { bgcolor: '#333333', borderColor: '#555555' },
            '&:hover .media-actions': { opacity: 1 }
          }}
          onClick={() => {
            setSelectedMedia(item);
            setPreviewDialogOpen(true);
          }}
        >
          <Box sx={{ position: 'relative', height: 180, bgcolor: '#1a1a1a' }}>
            {item.type === 'image' ? (
              <CardMedia
                component="img"
                height="180"
                image={item.url || `https://picsum.photos/seed/${item.id}/400/300.jpg`}
                alt={item.title}
              />
            ) : (
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: color + '20'
                }}
              >
                <Icon sx={{ fontSize: 64, color: color }} />
              </Box>
            )}
            
            <Box
              className="media-actions"
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                opacity: 0,
                transition: 'opacity 0.2s'
              }}
            >
              <IconButton
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', mr: 1 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(item.id);
                }}
              >
                {item.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
              </IconButton>
              
              <IconButton
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleMenuClick(e, item.id);
                }}
              >
                <MoreVertIcon />
              </IconButton>
            </Box>
            
            {item.type === 'video' && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  bgcolor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: '0.75rem'
                }}
              >
                {item.duration}s
              </Box>
            )}
          </Box>
          
          <CardContent sx={{ flexGrow: 1, p: 2, bgcolor: '#2a2a2a' }}>
            <Typography variant="h6" noWrap sx={{ fontSize: '1rem', mb: 0.5, color: '#ffffff' }}>
              {item.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Icon sx={{ fontSize: 16, color: color, mr: 1 }} />
              <Typography variant="caption" color="#b0b0b0">
                {item.type} • {item.category}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
              {item.tags.slice(0, 2).map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  size="small"
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              ))}
              {item.tags.length > 2 && (
                <Chip
                  label={`+${item.tags.length - 2}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: '0.65rem', height: 20 }}
                />
              )}
            </Box>
          </CardContent>
        </MotionCard>
      );
    }
    
    if (viewMode === 'list') {
      return (
        <ListItem
          key={item.id}
          button
          sx={{
            borderBottom: '1px solid #404040',
            '&:hover': { bgcolor: '#333333' }
          }}
          onClick={() => {
            setSelectedMedia(item);
            setPreviewDialogOpen(true);
          }}
        >
          <ListItemIcon>
            <Box sx={{ width: 40, height: 40, bgcolor: color + '20', borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon sx={{ color: color }} />
            </Box>
          </ListItemIcon>
          
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="subtitle2" sx={{ color: '#ffffff' }}>{item.title}</Typography>
                {item.isFavorite && <StarIcon color="warning" sx={{ fontSize: 16 }} />}
              </Box>
            }
            secondary={
              <Box>
                <Typography variant="caption" color="#b0b0b0">
                  {item.type} • {item.category} • Added {item.addedDate}
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Chip key={index} label={tag} size="small" sx={{ fontSize: '0.6rem', height: 18 }} />
                  ))}
                </Box>
              </Box>
            }
          />
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(item.id);
            }}
          >
            {item.isFavorite ? <StarIcon color="warning" /> : <StarBorderIcon />}
          </IconButton>
          
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick(e, item.id);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </ListItem>
      );
    }
    
    return null;
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh', color: '#ffffff' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
          Media Library
        </Typography>
        
        <Typography variant="body2" color="text.secondary">
          Manage your images, videos, presentations, and audio files for worship services
        </Typography>
      </Box>

      {/* Toolbar */}
      <Paper sx={{ p: 2, mb: 3, bgcolor: '#2a2a2a', color: '#ffffff', border: '1px solid #404040' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#b0b0b0' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: '#555555' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Category</InputLabel>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                label="Category"
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555555' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                }}
              >
                <MenuItem value="all">All Categories</MenuItem>
                {Object.entries(MEDIA_CATEGORIES).map(([key, category]) => (
                  <MenuItem key={key} value={key}>{category.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: '#b0b0b0' }}>Sort By</InputLabel>
              <Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                label="Sort By"
                sx={{
                  color: '#ffffff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555555' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                }}
              >
                <MenuItem value="dateAdded">Date Added</MenuItem>
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="type">Type</MenuItem>
                <MenuItem value="size">Size</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              <Button
                variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('grid')}
                startIcon={<GridIcon />}
              >
                Grid
              </Button>
              
              <Button
                variant={viewMode === 'list' ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setViewMode('list')}
                startIcon={<ListIcon />}
              >
                List
              </Button>
              
              <Button
                variant="contained"
                startIcon={<UploadIcon />}
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload Media
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Category Tabs */}
      <Paper sx={{ mb: 3, bgcolor: '#2a2a2a', color: '#ffffff', border: '1px solid #404040' }}>
        <Tabs
          value={selectedCategory === 'all' ? 0 : Object.keys(MEDIA_CATEGORIES).indexOf(selectedCategory) + 1}
          onChange={(e, newValue) => {
            if (newValue === 0) {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            } else {
              const categories = Object.keys(MEDIA_CATEGORIES);
              setSelectedCategory(categories[newValue - 1]);
              setSelectedSubcategory('all');
            }
          }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="All Media" icon={<Badge badgeContent={media.length} color="primary"><FolderIcon /></Badge>} />
          {Object.entries(MEDIA_CATEGORIES).map(([key, category]) => (
            <Tab
              key={key}
              label={category.name}
              icon={<category.icon sx={{ color: category.color }} />}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Media Grid/List */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredMedia.map(renderMediaItem)}
          </AnimatePresence>
        </Grid>
      ) : (
        <Paper sx={{ bgcolor: '#2a2a2a', color: '#ffffff', border: '1px solid #404040' }}>
          <List>
            <AnimatePresence>
              {filteredMedia.map(renderMediaItem)}
            </AnimatePresence>
          </List>
        </Paper>
      )}

      {/* Empty State */}
      {filteredMedia.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No media found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Upload your first media file to get started'
            }
          </Typography>
          {!searchQuery && selectedCategory === 'all' && (
            <Button
              variant="contained"
              startIcon={<UploadIcon />}
              onClick={() => setUploadDialogOpen(true)}
            >
              Upload Media
            </Button>
          )}
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const item = media.find(m => m.id === selectedId);
          handleAddToService(item);
          handleMenuClose();
        }}>
          <PlayIcon sx={{ mr: 2 }} /> Add to Service
        </MenuItem>
        
        <MenuItem onClick={() => {
          const item = media.find(m => m.id === selectedId);
          handleGoLive(item);
          handleMenuClose();
        }}>
          <PlayIcon sx={{ mr: 2 }} /> Go Live
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          const item = media.find(m => m.id === selectedId);
          setSelectedMedia(item);
          setPreviewDialogOpen(true);
          handleMenuClose();
        }}>
          <PreviewIcon sx={{ mr: 2 }} /> Preview
        </MenuItem>
        
        <MenuItem onClick={() => {
          const item = media.find(m => m.id === selectedId);
          setEditingMedia(item);
          setEditDialogOpen(true);
          handleMenuClose();
        }}>
          <EditIcon sx={{ mr: 2 }} /> Edit
        </MenuItem>
        
        <MenuItem onClick={() => {
          handleToggleFavorite(selectedId);
          handleMenuClose();
        }}>
          <StarIcon sx={{ mr: 2 }} /> Toggle Favorite
        </MenuItem>
        
        <Divider />
        
        <MenuItem onClick={() => {
          handleDeleteMedia(selectedId);
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <DeleteIcon sx={{ mr: 2 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => setUploadDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: '#ffffff' } }}>
        <DialogTitle sx={{ color: '#ffffff' }}>Add New Media</DialogTitle>
        <DialogContent>
          {/* Upload Method Selection */}
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <Button
              variant={uploadMethod === 'url' ? 'contained' : 'outlined'}
              onClick={() => setUploadMethod('url')}
              startIcon={<LinkIcon />}
              sx={{ flex: 1 }}
            >
              URL Link
            </Button>
            <Button
              variant={uploadMethod === 'file' ? 'contained' : 'outlined'}
              onClick={() => setUploadMethod('file')}
              startIcon={<FileUploadIcon />}
              sx={{ flex: 1 }}
            >
              Upload File
            </Button>
          </Box>

          {/* URL Input Method */}
          {uploadMethod === 'url' && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Title"
                  value={newMedia.title}
                  onChange={(e) => setNewMedia(prev => ({ ...prev, title: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#404040' },
                      '&:hover fieldset': { borderColor: '#555555' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#b0b0b0' }}>Type</InputLabel>
                  <Select
                    value={newMedia.type}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, type: e.target.value }))}
                    label="Type"
                    sx={{
                      color: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555555' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                    }}
                  >
                    <MenuItem value="image">Image</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                    <MenuItem value="presentation">Presentation</MenuItem>
                    <MenuItem value="audio">Audio</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#b0b0b0' }}>Category</InputLabel>
                  <Select
                    value={newMedia.category}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, category: e.target.value }))}
                    label="Category"
                    sx={{
                      color: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555555' },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                    }}
                  >
                    {newMedia.type === 'image' && ['Backgrounds', 'Logos', 'Announcements', 'Photos'].map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                    {newMedia.type === 'video' && ['Worship', 'Sermon', 'Countdown', 'Looping'].map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                    {newMedia.type === 'presentation' && ['Slides', 'Sermon Notes', 'Announcements'].map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                    {newMedia.type === 'audio' && ['Music', 'Sound Effects', 'Voice'].map(cat => (
                      <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (seconds)"
                  type="number"
                  value={newMedia.duration}
                  onChange={(e) => setNewMedia(prev => ({ ...prev, duration: parseInt(e.target.value) || 10 }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#404040' },
                      '&:hover fieldset': { borderColor: '#555555' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL/Path"
                  value={newMedia.url}
                  onChange={(e) => setNewMedia(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="Enter media URL or file path..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#404040' },
                      '&:hover fieldset': { borderColor: '#555555' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={newMedia.description}
                  onChange={(e) => setNewMedia(prev => ({ ...prev, description: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#ffffff',
                      '& fieldset': { borderColor: '#404040' },
                      '&:hover fieldset': { borderColor: '#555555' },
                      '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                    }
                  }}
                />
              </Grid>
            </Grid>
          )}

          {/* File Upload Method */}
          {uploadMethod === 'file' && (
            <Box>
              <Box
                sx={{
                  border: `2px dashed ${dragActive ? '#1976d2' : '#404040'}`,
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: dragActive ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  mb: 3
                }}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input').click()}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*,video/*,audio/*,.ppt,.pptx,.pdf"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                
                <FileUploadIcon sx={{ fontSize: 48, color: '#b0b0b0', mb: 2 }} />
                
                <Typography variant="h6" sx={{ color: '#ffffff', mb: 1 }}>
                  {dragActive ? 'Drop file here' : 'Drag & drop file here'}
                </Typography>
                
                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2 }}>
                  or click to browse
                </Typography>
                
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Supported formats: Images, Videos, Audio, PowerPoint, PDF
                </Typography>
              </Box>

              {selectedFile && (
                <Box sx={{ mb: 3, p: 2, bgcolor: '#333', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ color: '#ffffff', mb: 1 }}>
                    Selected File: {selectedFile.name}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                    Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • Type: {selectedFile.type}
                  </Typography>
                </Box>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Title"
                    value={newMedia.title}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, title: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: '#555555' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel sx={{ color: '#b0b0b0' }}>Category</InputLabel>
                    <Select
                      value={newMedia.category}
                      onChange={(e) => setNewMedia(prev => ({ ...prev, category: e.target.value }))}
                      label="Category"
                      sx={{
                        color: '#ffffff',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#555555' },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#1976d2' }
                      }}
                    >
                      {newMedia.type === 'image' && ['Backgrounds', 'Logos', 'Announcements', 'Photos'].map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                      {newMedia.type === 'video' && ['Worship', 'Sermon', 'Countdown', 'Looping'].map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                      {newMedia.type === 'presentation' && ['Slides', 'Sermon Notes', 'Announcements'].map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                      {newMedia.type === 'audio' && ['Music', 'Sound Effects', 'Voice'].map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Duration (seconds)"
                    type="number"
                    value={newMedia.duration}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, duration: parseInt(e.target.value) || 10 }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: '#555555' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                      }
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={newMedia.description}
                    onChange={(e) => setNewMedia(prev => ({ ...prev, description: e.target.value }))}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: '#ffffff',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: '#555555' },
                        '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: '#ffffff', mb: 1 }}>
                Uploading to S3... {uploadProgress}%
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={uploadProgress}
                sx={{
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#1976d2'
                  }
                }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
          <Button 
            onClick={handleAddMedia} 
            variant="contained" 
            disabled={!newMedia.title || (uploadMethod === 'file' && !selectedFile) || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Media'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onClose={() => setPreviewDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: '#ffffff' } }}>
        <DialogTitle sx={{ color: '#ffffff' }}>
          {selectedMedia?.title}
          <IconButton
            onClick={() => setPreviewDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#ffffff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMedia && (
            <Box>
              {selectedMedia.type === 'image' && (
                <Box
                  component="img"
                  src={selectedMedia.url || `https://picsum.photos/seed/${selectedMedia.id}/800/600.jpg`}
                  alt={selectedMedia.title}
                  sx={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
              )}
              
              {selectedMedia.type === 'video' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <VideoIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6">{selectedMedia.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Duration: {selectedMedia.duration}s
                  </Typography>
                </Box>
              )}
              
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>Description</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedMedia.description || 'No description available'}
                </Typography>
              </Box>
              
              <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Typography variant="subtitle2">Tags:</Typography>
                {selectedMedia.tags.map((tag, index) => (
                  <Chip key={index} label={tag} size="small" />
                ))}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialogOpen(false)} sx={{ color: '#b0b0b0' }}>Close</Button>
          <Button 
            onClick={() => handleAddToService(selectedMedia)} 
            variant="outlined" 
            sx={{ borderColor: '#404040', color: '#b0b0b0', mr: 1 }}
          >
            Add to Service
          </Button>
          <Button 
            onClick={() => handleGoLive(selectedMedia)} 
            variant="contained" 
            startIcon={<PlayIcon />}
          >
            Go Live
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: '#ffffff' } }}>
        <DialogTitle sx={{ color: '#ffffff' }}>Edit Media</DialogTitle>
        <DialogContent>
          {editingMedia && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  value={editingMedia.title}
                  onChange={(e) => setEditingMedia(prev => ({ ...prev, title: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  multiline
                  rows={3}
                  value={editingMedia.description}
                  onChange={(e) => setEditingMedia(prev => ({ ...prev, description: e.target.value }))}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  multiline
                  rows={2}
                  value={editingMedia.notes || ''}
                  onChange={(e) => setEditingMedia(prev => ({ ...prev, notes: e.target.value }))}
                />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditMedia} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="upload"
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          display: { xs: 'flex', sm: 'none' }
        }}
        onClick={() => setUploadDialogOpen(true)}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
