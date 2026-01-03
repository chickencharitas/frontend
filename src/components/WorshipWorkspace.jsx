import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Snackbar,
  Alert,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Menu,
  Fade,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Tabs,
  Tab,
  InputAdornment,
} from '@mui/material';
import {
  Add,
  Remove,
  Edit,
  Save,
  Cancel,
  Search,
  MusicNote,
  MenuBook,
  Image,
  VideoLibrary,
  Slideshow,
  Close,
  PlayArrow,
  Pause,
  Stop,
  Visibility,
  VisibilityOff,
  Tv,
  TvOff,
  ArrowBack,
  ArrowForward,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVert,
  Delete,
  DragIndicator,
  Timer as TimerIcon,
  AccessTime as AccessTimeIcon,
  RestartAlt as RestartIcon,
  Edit as EditIcon,
  SkipPrevious,
  SkipNext,
  Fullscreen,
  ExpandMore,
  ExpandLess,
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useNavigate } from 'react-router-dom';
import { usePresentation } from '../context/PresentationContext';
import { songsApi } from '../services/songsApi';
import { serviceApi } from '../services/serviceApi';

// === SLIDE THUMBNAIL COMPONENT ===
const SlideThumbnail = ({ slide, index, isActive, isLive, onClick, onDoubleClick }) => (
  <Box
    onClick={() => onClick(index)}
    onDoubleClick={() => onDoubleClick(index)}
    sx={{
      width: 160,
      height: 90,
      bgcolor: isActive ? 'primary.main' : '#2a2a2a',
      border: isLive ? '3px solid #f44336' : isActive ? '2px solid #2196f3' : '1px solid #404040',
      borderRadius: 1,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      flexShrink: 0,
      transition: 'all 0.2s',
      '&:hover': {
        borderColor: 'primary.main',
        transform: 'scale(1.02)',
      },
    }}
  >
    <Box sx={{ flex: 1, p: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography
        variant="caption"
        sx={{
          color: 'white',
          textAlign: 'center',
          fontSize: '0.65rem',
          lineHeight: 1.3,
          overflow: 'hidden',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
        }}
      >
        {slide.content}
      </Typography>
    </Box>
    <Box sx={{ bgcolor: 'rgba(0,0,0,0.5)', px: 1, py: 0.5 }}>
      <Typography variant="caption" sx={{ color: '#b0b0b0', fontSize: '0.6rem' }}>
        {slide.label || `Slide ${index + 1}`}
      </Typography>
    </Box>
  </Box>
);

// === SERVICE ITEM COMPONENT ===
const ServiceItem = ({ item, index, isSelected, isLive, onClick, onDoubleClick, onRemove, provided }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'song': return <MusicNote sx={{ color: '#4fc3f7' }} />;
      case 'scripture': return <MenuBook sx={{ color: '#81c784' }} />;
      case 'media': return <Image sx={{ color: '#ffb74d' }} />;
      case 'video': return <VideoLibrary sx={{ color: '#e57373' }} />;
      default: return <Slideshow sx={{ color: '#b0b0b0' }} />;
    }
  };

  return (
    <Box
      ref={provided.innerRef}
      {...provided.draggableProps}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        mb: 0.5,
        bgcolor: isSelected ? 'primary.dark' : isLive ? 'error.dark' : '#2a2a2a',
        border: isLive ? '2px solid #f44336' : isSelected ? '1px solid #2196f3' : '1px solid #404040',
        borderRadius: 1,
        cursor: 'pointer',
        '&:hover': { bgcolor: '#3a3a3a' },
      }}
    >
      <Box {...provided.dragHandleProps} sx={{ mr: 1, display: 'flex', cursor: 'grab' }}>
        <DragIndicator sx={{ color: '#666', fontSize: 18 }} />
      </Box>
      <ListItemIcon sx={{ minWidth: 32 }}>{getIcon()}</ListItemIcon>
      <ListItemText
        primary={<Typography variant="body2" sx={{ color: 'white', fontWeight: isLive ? 'bold' : 'normal' }}>{item.title}</Typography>}
        secondary={<Typography variant="caption" sx={{ color: '#888' }}>{item.artist || item.reference || ''}</Typography>}
      />
      {isLive && <Chip label="LIVE" size="small" color="error" sx={{ height: 20, fontSize: '0.6rem' }} />}
      <IconButton size="small" onClick={(e) => { e.stopPropagation(); onRemove(); }} sx={{ ml: 1, color: '#666' }}>
        <Delete fontSize="small" />
      </IconButton>
    </Box>
  );
};

// === LIBRARY ITEM COMPONENT ===
const LibraryItem = ({ item, onAdd, onGoLive, onEdit }) => {
  const getIcon = () => {
    switch (item.type) {
      case 'song': return <MusicNote sx={{ color: '#4fc3f7' }} />;
      case 'scripture': return <MenuBook sx={{ color: '#81c784' }} />;
      case 'image': return <Image sx={{ color: '#ffb74d' }} />;
      case 'video': return <VideoLibrary sx={{ color: '#e57373' }} />;
      default: return <Slideshow sx={{ color: '#b0b0b0' }} />;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        p: 1,
        mb: 0.5,
        bgcolor: '#2a2a2a',
        border: '1px solid #404040',
        borderRadius: 1,
        '&:hover': { bgcolor: '#3a3a3a', borderColor: 'primary.main' },
      }}
    >
      <ListItemIcon sx={{ minWidth: 32 }}>{getIcon()}</ListItemIcon>
      <ListItemText
        primary={<Typography variant="body2" sx={{ color: 'white' }}>{item.title}</Typography>}
        secondary={<Typography variant="caption" sx={{ color: '#888' }}>{item.artist || item.reference || ''}</Typography>}
      />
      <Tooltip title="Edit">
        <IconButton size="small" onClick={() => onEdit && onEdit(item)} sx={{ color: '#ffa726' }}>
          <EditIcon fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add to Service">
        <IconButton size="small" onClick={() => onAdd(item)} sx={{ color: '#4fc3f7' }}>
          <Add fontSize="small" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Go Live">
        <IconButton size="small" onClick={() => onGoLive(item)} sx={{ color: '#f44336' }}>
          <PlayArrow fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

// Load songs from localStorage
const loadSongsFromStorage = () => {
  try {
    const stored = localStorage.getItem('worshipress_songs');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load songs from storage:', error);
  }
  return [];
};

// Load scriptures from localStorage
const loadScripturesFromStorage = () => {
  try {
    const stored = localStorage.getItem('worshipress_scriptures');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load scriptures from storage:', error);
  }
  return [];
};

// Load media from localStorage
const loadMediaFromStorage = () => {
  try {
    const stored = localStorage.getItem('worshipress_media');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load media from storage:', error);
  }
  return [];
};

// === MAIN WORKSPACE COMPONENT ===
export default function WorshipWorkspace() {
  const {
    serviceItems,
    addToService,
    removeFromService,
    reorderService,
    selectedServiceIndex,
    setSelectedServiceIndex,
    liveOutput,
    goLive,
    goToSlide,
    nextSlide,
    prevSlide,
    toggleBlack,
    toggleClear,
    stopLive,
    quickGoLive,
    songs,
    scriptures,
    media,
    activeLibraryPanel,
    setActiveLibraryPanel,
    updateSong,
    updateScripture,
    updateMedia,
  } = usePresentation();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSlidePanel, setShowSlidePanel] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Library modal states
  const [addSongDialogOpen, setAddSongDialogOpen] = useState(false);
  const [addScriptureDialogOpen, setAddScriptureDialogOpen] = useState(false);
  const [addMediaDialogOpen, setAddMediaDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  
  // Library search states
  const [songLibrarySearch, setSongLibrarySearch] = useState('');
  const [scriptureLibrarySearch, setScriptureLibrarySearch] = useState('');
  const [mediaLibrarySearch, setMediaLibrarySearch] = useState('');
  
  // Timer states
  const [timerOpen, setTimerOpen] = useState(false);
  const [timerMinutes, setTimerMinutes] = useState(5);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerTotalSeconds, setTimerTotalSeconds] = useState(0);
  
  // Load library data from localStorage (same as Songs page)
  const [librarySongs, setLibrarySongs] = useState(() => {
    try {
      const stored = localStorage.getItem('worshipress_songs');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load songs from storage:', error);
    }
    return [];
  });
  
  const [libraryScriptures, setLibraryScriptures] = useState(() => {
    try {
      const stored = localStorage.getItem('worshipress_scriptures');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load scriptures from storage:', error);
    }
    return [];
  });
  
  const [libraryMedia, setLibraryMedia] = useState(() => {
    try {
      const stored = localStorage.getItem('worshipress_media');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load media from storage:', error);
    }
    return [];
  });

  // Refresh library data from API
  const refreshLibraryData = async () => {
    try {
      console.log('Loading songs from API...');
      const songs = await songsApi.getAll();
      console.log('Songs loaded from API:', songs);
      console.log('Songs count:', songs.length);
      setLibrarySongs(songs);
    } catch (error) {
      console.warn('Failed to load songs from API, falling back to localStorage:', error);
      // Fallback to localStorage if API fails
      try {
        const storedSongs = localStorage.getItem('worshipress_songs');
        if (storedSongs) {
          const songs = JSON.parse(storedSongs);
          setLibrarySongs(songs);
        }
      } catch (localStorageError) {
        console.warn('Failed to load songs from localStorage:', localStorageError);
        // Add sample songs if both API and localStorage fail
        const sampleSongs = [
          {
            id: 1,
            title: 'Amazing Grace',
            artist: 'John Newton',
            album: 'Traditional Hymns',
            key: 'G',
            tempo: 120,
            timeSignature: '4/4',
            lyrics: `Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind but now I see

'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed!`,
            chords: 'G - C - G - D',
            tags: ['hymn', 'grace', 'traditional'],
            ccliNumber: '22047',
            addedDate: '2024-01-01',
            isFavorite: true
          },
          {
            id: 2,
            title: 'Here I Am to Worship',
            artist: 'Tim Hughes',
            album: 'Here I Am to Worship',
            key: 'E',
            tempo: 140,
            timeSignature: '4/4',
            lyrics: `Light of the world
You stepped down into darkness
Opened my eyes, let me see
Beauty that made
This heart adore You
Hope of a life
Spent with You

Here I am to worship
Here I am to bow down
Here I am to say that You're my God
You're altogether lovely
Altogether worthy
Altogether wonderful to me`,
            chords: 'E - A - B - C#m',
            tags: ['worship', 'contemporary', 'commitment'],
            ccliNumber: '4708251',
            addedDate: '2024-01-01',
            isFavorite: false
          }
        ];
        setLibrarySongs(sampleSongs);
        console.log('Added sample songs:', sampleSongs);
      }
    }
    
    try {
      const storedScriptures = localStorage.getItem('worshipress_scriptures');
      if (storedScriptures) {
        const scriptures = JSON.parse(storedScriptures);
        setLibraryScriptures(scriptures);
      }
    } catch (error) {
      console.warn('Failed to refresh scriptures:', error);
    }
    
    try {
      const storedMedia = localStorage.getItem('worshipress_media');
      if (storedMedia) {
        const media = JSON.parse(storedMedia);
        setLibraryMedia(media);
      }
    } catch (error) {
      console.warn('Failed to refresh media:', error);
    }
  };

  // Refresh library data on component mount and when dialogs open
  useEffect(() => {
    refreshLibraryData();
  }, [addSongDialogOpen, addScriptureDialogOpen, addMediaDialogOpen]);

  // Debug service items changes
  useEffect(() => {
    console.log('Service items updated:', serviceItems);
  }, [serviceItems]);

  // Get current service item
  const selectedItem = serviceItems[selectedServiceIndex];
  const currentSlides = selectedItem?.slides || [];

  // Get live slide
  const liveSlide = liveOutput.currentItem?.slides?.[liveOutput.currentSlideIndex];

  // Filter library items based on search
  const filterItems = (items, query) => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(item =>
      item.title.toLowerCase().includes(q) ||
      (item.artist && item.artist.toLowerCase().includes(q)) ||
      (item.reference && item.reference.toLowerCase().includes(q)) ||
      (item.description && item.description.toLowerCase().includes(q))
    );
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

  // Convert library items to presentation format
  const convertSongToPresentation = (song) => {
    const sections = song.lyrics.split(/\n\n|\[(?:Verse|Chorus|Bridge|Pre-Chorus|Outro|Intro)[^\]]*\]/i).filter(s => s.trim());
    const slides = sections.map((content, index) => ({
      id: `${song.id}-slide-${index}`,
      content: content.trim(),
      label: `Slide ${index + 1}`
    }));

    return {
      id: `song-lib-${song.id}`,
      type: 'song',
      title: song.title,
      artist: song.artist,
      key: song.key,
      slides: slides.length > 0 ? slides : [{ id: `${song.id}-slide-0`, content: song.title, label: 'Title' }]
    };
  };

  const convertScriptureToPresentation = (scripture) => {
    const verses = scripture.text.split('\n').filter(v => v.trim());
    const slides = verses.map((verse, index) => ({
      id: `${scripture.id}-slide-${index}`,
      content: verse.trim(),
      label: `${scripture.reference} v${index + 1}`
    }));

    return {
      id: `scripture-lib-${scripture.id}`,
      type: 'scripture',
      title: scripture.reference,
      reference: scripture.reference,
      slides: slides.length > 0 ? slides : [{ id: `${scripture.id}-slide-0`, content: scripture.text, label: scripture.reference }]
    };
  };

  const convertMediaToPresentation = (media) => {
    return {
      id: `media-lib-${media.id}`,
      type: media.type,
      title: media.title,
      url: media.url,
      duration: media.duration,
      description: media.description,
      slides: [{ id: `${media.id}-slide-0`, content: media.title, label: media.title }]
    };
  };

  // Handle drag end for service reorder
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    reorderService(result.source.index, result.destination.index);
  };

  // Handle service item selection
  const handleSelectServiceItem = (index) => {
    setSelectedServiceIndex(index);
  };

  // Handle double-click to go live
  const handleGoLiveFromService = (index) => {
    const item = serviceItems[index];
    setSelectedServiceIndex(index);
    goLive(item, 0);
  };

  // Handle edit item
  const handleEditItem = (item) => {
    setEditingItem(item);
    setEditDialogOpen(true);
  };

  // Handle save edited item
  const handleSaveEditedItem = () => {
    if (!editingItem) return;
    
    // Update the appropriate library
    if (editingItem.type === 'song') {
      updateSong(editingItem.id, editingItem);
    } else if (editingItem.type === 'scripture') {
      updateScripture(editingItem.id, editingItem);
    } else if (editingItem.type === 'media') {
      updateMedia(editingItem.id, editingItem);
    }
    
    setEditDialogOpen(false);
    setEditingItem(null);
  };

  // Handle slide click (preview) and double-click (go live)
  const handleSlideClick = (slideIndex) => {
    // Just select the slide for preview
  };

  const handleSlideDoubleClick = (slideIndex) => {
    if (selectedItem) {
      goLive(selectedItem, slideIndex);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#121212', overflow: 'hidden' }}>
      {/* === LEFT PANEL: SERVICE PLAYLIST === */}
      <Paper sx={{ width: 280, bgcolor: '#1a1a1a', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #333' }}>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>Service</Typography>
        </Box>
        
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="service-playlist">
              {(provided) => (
                <Box ref={provided.innerRef} {...provided.droppableProps}>
                  {serviceItems.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided) => (
                        <ServiceItem
                          item={item}
                          index={index}
                          isSelected={index === selectedServiceIndex}
                          isLive={liveOutput.currentItem?.id === item.id}
                          onClick={() => handleSelectServiceItem(index)}
                          onDoubleClick={() => handleGoLiveFromService(index)}
                          onRemove={() => removeFromService(item.id)}
                          provided={provided}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>

          {serviceItems.length === 0 && (
            <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
              <Typography variant="body2">No items in service</Typography>
              <Typography variant="caption">Add songs, scriptures, or media from the library</Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* === CENTER PANEL: OUTPUT & SLIDES === */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Control Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', p: 1, bgcolor: '#1a1a1a', borderBottom: '1px solid #333', gap: 1 }}>
          <Tooltip title="Previous Slide">
            <IconButton onClick={prevSlide} sx={{ color: 'white' }}><SkipPrevious /></IconButton>
          </Tooltip>
          <Tooltip title="Next Slide">
            <IconButton onClick={nextSlide} sx={{ color: 'white' }}><SkipNext /></IconButton>
          </Tooltip>
          <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: '#444' }} />
          
          <Tooltip title={liveOutput.isLive ? "Stop Live" : "Go Live"}>
            <IconButton onClick={liveOutput.isLive ? stopLive : () => selectedItem && goLive(selectedItem, 0)} sx={{ color: liveOutput.isLive ? '#f44336' : '#4caf50' }}>
              {liveOutput.isLive ? <Stop /> : <PlayArrow />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Black Screen (B)">
            <IconButton onClick={toggleBlack} sx={{ color: liveOutput.isBlacked ? '#f44336' : 'white' }}>
              {liveOutput.isBlacked ? <TvOff /> : <Tv />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Clear Text (C)">
            <IconButton onClick={toggleClear} sx={{ color: liveOutput.isCleared ? '#ff9800' : 'white' }}>
              {liveOutput.isCleared ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </Tooltip>

          <Box sx={{ flex: 1 }} />
          
          {/* Timer Display */}
          {timerRunning && (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1, 
              mr: 2,
              px: 2, 
              py: 1, 
              bgcolor: '#1a1a1a', 
              border: '1px solid #404040', 
              borderRadius: 1 
            }}>
              <TimerIcon sx={{ fontSize: 16, color: '#ff9800' }} />
              <Typography variant="body2" sx={{ color: '#ff9800', fontFamily: 'monospace', minWidth: '50px' }}>
                {formatTime(timerTotalSeconds)}
              </Typography>
              <IconButton 
                size="small" 
                onClick={stopTimer}
                sx={{ color: '#f44336', ml: 1 }}
              >
                <Stop sx={{ fontSize: 16 }} />
              </IconButton>
            </Box>
          )}
          
          <Tooltip title="Set Timer">
            <IconButton onClick={() => setTimerOpen(true)} sx={{ color: 'white', mr: 1 }}>
              <TimerIcon />
            </IconButton>
          </Tooltip>
          
          {liveOutput.isLive && (
            <Chip 
              label="● LIVE" 
              sx={{ bgcolor: '#f44336', color: 'white', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }} 
            />
          )}
          
          <Typography variant="body2" sx={{ color: '#888', mx: 2 }}>
            {liveOutput.currentItem?.title || 'No item selected'}
            {liveOutput.currentItem && ` — Slide ${liveOutput.currentSlideIndex + 1}/${liveOutput.currentItem.slides?.length || 0}`}
          </Typography>
        </Box>

        {/* Output Preview */}
        <Box sx={{ flex: 1, display: 'flex', p: 2, gap: 2, overflow: 'hidden' }}>
          {/* Preview Output */}
          <Paper sx={{ flex: 1, bgcolor: '#000', display: 'flex', flexDirection: 'column', border: '2px solid #333' }}>
            <Box sx={{ p: 1, bgcolor: '#1a1a1a', borderBottom: '1px solid #333' }}>
              <Typography variant="caption" sx={{ color: '#888' }}>PREVIEW</Typography>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3 }}>
              {selectedItem ? (
                <Typography variant="h5" sx={{ color: 'white', textAlign: 'center', whiteSpace: 'pre-line' }}>
                  {currentSlides[0]?.content || selectedItem.title}
                </Typography>
              ) : (
                <Typography sx={{ color: '#666' }}>Select an item from the service</Typography>
              )}
            </Box>
          </Paper>

          {/* Live Output */}
          <Paper sx={{ flex: 1, bgcolor: '#000', display: 'flex', flexDirection: 'column', border: liveOutput.isLive ? '2px solid #f44336' : '2px solid #333' }}>
            <Box sx={{ p: 1, bgcolor: liveOutput.isLive ? '#b71c1c' : '#1a1a1a', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="caption" sx={{ color: 'white', fontWeight: liveOutput.isLive ? 'bold' : 'normal' }}>
                {liveOutput.isLive ? '● LIVE OUTPUT' : 'LIVE OUTPUT'}
              </Typography>
              <Tooltip title="Fullscreen">
                <IconButton size="small" sx={{ color: 'white' }}><Fullscreen fontSize="small" /></IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, bgcolor: liveOutput.isBlacked ? '#000' : 'transparent' }}>
              {liveOutput.isBlacked ? (
                <Typography sx={{ color: '#333' }}>BLACK</Typography>
              ) : liveOutput.isCleared ? (
                <Typography sx={{ color: '#666' }}>CLEAR</Typography>
              ) : liveSlide ? (
                <Typography variant="h5" sx={{ color: 'white', textAlign: 'center', whiteSpace: 'pre-line' }}>
                  {liveSlide.content}
                </Typography>
              ) : (
                <Typography sx={{ color: '#666' }}>Not Live</Typography>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Slide Thumbnails */}
        {showSlidePanel && selectedItem && (
          <Box sx={{ bgcolor: '#1a1a1a', borderTop: '1px solid #333', p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: '#888', flex: 1 }}>
                {selectedItem.title} — {currentSlides.length} slides
              </Typography>
              <IconButton size="small" onClick={() => setShowSlidePanel(false)} sx={{ color: '#666' }}>
                <ExpandMore />
              </IconButton>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
              {currentSlides.map((slide, index) => (
                <SlideThumbnail
                  key={slide.id}
                  slide={slide}
                  index={index}
                  isActive={index === 0} // Would track preview slide index
                  isLive={liveOutput.currentItem?.id === selectedItem.id && liveOutput.currentSlideIndex === index}
                  onClick={handleSlideClick}
                  onDoubleClick={handleSlideDoubleClick}
                />
              ))}
            </Box>
          </Box>
        )}

        {!showSlidePanel && (
          <Box sx={{ bgcolor: '#1a1a1a', borderTop: '1px solid #333', p: 0.5, display: 'flex', justifyContent: 'center' }}>
            <IconButton size="small" onClick={() => setShowSlidePanel(true)} sx={{ color: '#666' }}>
              <ExpandLess />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* === RIGHT PANEL: LIBRARY === */}
      <Paper sx={{ width: 320, bgcolor: '#1a1a1a', borderLeft: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <Tabs
          value={activeLibraryPanel}
          onChange={(e, v) => setActiveLibraryPanel(v)}
          variant="fullWidth"
          sx={{ borderBottom: '1px solid #333', minHeight: 48 }}
        >
          <Tab icon={<MusicNote sx={{ fontSize: 18 }} />} value="songs" sx={{ minHeight: 48, color: '#888', '&.Mui-selected': { color: '#4fc3f7' } }} />
          <Tab icon={<MenuBook sx={{ fontSize: 18 }} />} value="scriptures" sx={{ minHeight: 48, color: '#888', '&.Mui-selected': { color: '#81c784' } }} />
          <Tab icon={<Image sx={{ fontSize: 18 }} />} value="media" sx={{ minHeight: 48, color: '#888', '&.Mui-selected': { color: '#ffb74d' } }} />
        </Tabs>

        <Box sx={{ p: 1, borderBottom: '1px solid #333' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <InputAdornment position="start"><Search sx={{ color: '#666', fontSize: 18 }} /></InputAdornment>,
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#2a2a2a',
                color: 'white',
                '& fieldset': { borderColor: '#404040' },
              },
            }}
          />
        </Box>

        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
          {activeLibraryPanel === 'songs' && filterItems(songs).map(song => (
            <LibraryItem key={song.id} item={song} onAdd={addToService} onGoLive={quickGoLive} onEdit={handleEditItem} />
          ))}
          
          {activeLibraryPanel === 'scriptures' && filterItems(scriptures).map(scripture => (
            <LibraryItem key={scripture.id} item={scripture} onAdd={addToService} onGoLive={quickGoLive} onEdit={handleEditItem} />
          ))}
          
          {activeLibraryPanel === 'media' && filterItems(media).map(mediaItem => (
            <LibraryItem key={mediaItem.id} item={mediaItem} onAdd={addToService} onGoLive={quickGoLive} onEdit={handleEditItem} />
          ))}
        </Box>

        {/* Quick Add Section */}
        <Box sx={{ p: 1, borderTop: '1px solid #333' }}>
          <Button 
            fullWidth 
            variant="outlined" 
            startIcon={<Add />} 
            sx={{ borderColor: '#404040', color: '#888' }}
            onClick={() => {
              if (activeLibraryPanel === 'songs') {
                setAddSongDialogOpen(true);
              } else if (activeLibraryPanel === 'scriptures') {
                setAddScriptureDialogOpen(true);
              } else if (activeLibraryPanel === 'media') {
                setAddMediaDialogOpen(true);
              }
            }}
          >
            Add New {activeLibraryPanel === 'songs' ? 'Song' : activeLibraryPanel === 'scriptures' ? 'Scripture' : 'Media'}
          </Button>
        </Box>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit {editingItem?.type}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editingItem?.title || ''}
              onChange={(e) => setEditingItem(prev => prev ? {...prev, title: e.target.value} : null)}
            />
            
            {editingItem?.type === 'song' && (
              <TextField
                fullWidth
                label="Artist"
                value={editingItem?.artist || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, artist: e.target.value} : null)}
              />
            )}
            
            {editingItem?.type === 'scripture' && (
              <TextField
                fullWidth
                label="Reference"
                value={editingItem?.reference || ''}
                onChange={(e) => setEditingItem(prev => prev ? {...prev, reference: e.target.value} : null)}
              />
            )}
            
            <TextField
              fullWidth
              label="Content"
              value={editingItem?.slides?.[0]?.content || ''}
              onChange={(e) => setEditingItem(prev => prev ? {
                ...prev,
                slides: prev.slides ? [{
                  ...prev.slides[0],
                  content: e.target.value
                }] : [{id: 'edited-slide', content: e.target.value}]
              } : null)}
              multiline
              rows={6}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEditedItem} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Song Library Dialog */}
      <Dialog open={addSongDialogOpen} onClose={() => setAddSongDialogOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: 'white' } }}>
        <DialogTitle sx={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Select Song from Library</span>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => window.location.href = '/songs'}
            sx={{ borderColor: '#404040', color: '#b0b0b0' }}
          >
            Add New Song
          </Button>
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search songs..."
              value={songLibrarySearch}
              onChange={(e) => setSongLibrarySearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#b0b0b0' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                }
              }}
            />
          </Box>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {filterItems(librarySongs, songLibrarySearch).map((song) => (
                <ListItem
                  key={song.id}
                  button
                  onClick={async () => {
                    console.log('Song clicked:', song);
                    const presentationItem = convertSongToPresentation(song);
                    console.log('Presentation item created:', presentationItem);
                    console.log('Current service items before:', serviceItems.length);
                    
                    try {
                      // Try to add via API first
                      await serviceApi.addToService(presentationItem);
                      console.log('Song added to service via API');
                    } catch (apiError) {
                      console.warn('Failed to add via API, using context:', apiError);
                      // Fallback to context
                      addToService(presentationItem);
                    }
                    
                    console.log('Current service items after:', serviceItems.length);
                    setAddSongDialogOpen(false);
                    setSongLibrarySearch('');
                    setSnackbarMessage(`"${song.title}" added to service!`);
                    setSnackbarOpen(true);
                  }}
                  sx={{
                    borderBottom: '1px solid #404040',
                    '&:hover': { bgcolor: '#333' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <MusicNote sx={{ color: '#4fc3f7' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>{song.title}</Typography>}
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {song.artist} • {song.key} • {song.ccliNumber ? `CCLI: ${song.ccliNumber}` : ''}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton sx={{ color: '#4fc3f7' }}>
                    <Add />
                  </IconButton>
                </ListItem>
              ))}
              {filterItems(librarySongs, songLibrarySearch).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                  <Typography variant="body2">No songs found</Typography>
                  <Typography variant="caption">Add songs from the Songs page first</Typography>
                </Box>
              )}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSongDialogOpen(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Scripture Library Dialog */}
      <Dialog open={addScriptureDialogOpen} onClose={() => setAddScriptureDialogOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: 'white' } }}>
        <DialogTitle sx={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Select Scripture from Library</span>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => window.location.href = '/scripture'}
            sx={{ borderColor: '#404040', color: '#b0b0b0' }}
          >
            Add New Scripture
          </Button>
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search scriptures..."
              value={scriptureLibrarySearch}
              onChange={(e) => setScriptureLibrarySearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#b0b0b0' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                }
              }}
            />
          </Box>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {filterItems(libraryScriptures, scriptureLibrarySearch).map((scripture) => (
                <ListItem
                  key={scripture.id}
                  button
                  onClick={() => {
                    const presentationItem = convertScriptureToPresentation(scripture);
                    addToService(presentationItem);
                    setAddScriptureDialogOpen(false);
                    setScriptureLibrarySearch('');
                    setSnackbarMessage(`"${scripture.reference}" added to service!`);
                    setSnackbarOpen(true);
                  }}
                  sx={{
                    borderBottom: '1px solid #404040',
                    '&:hover': { bgcolor: '#333' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <MenuBook sx={{ color: '#81c784' }} />
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>{scripture.reference}</Typography>}
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {scripture.version} • {scripture.addedDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton sx={{ color: '#81c784' }}>
                    <Add />
                  </IconButton>
                </ListItem>
              ))}
              {filterItems(libraryScriptures, scriptureLibrarySearch).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                  <Typography variant="body2">No scriptures found</Typography>
                  <Typography variant="caption">Add scriptures from the Scripture page first</Typography>
                </Box>
              )}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddScriptureDialogOpen(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Media Library Dialog */}
      <Dialog open={addMediaDialogOpen} onClose={() => setAddMediaDialogOpen(false)} maxWidth="lg" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: 'white' } }}>
        <DialogTitle sx={{ color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Select Media from Library</span>
          <Button 
            variant="outlined" 
            size="small"
            onClick={() => window.location.href = '/media'}
            sx={{ borderColor: '#404040', color: '#b0b0b0' }}
          >
            Add New Media
          </Button>
        </DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search media..."
              value={mediaLibrarySearch}
              onChange={(e) => setMediaLibrarySearch(e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: '#b0b0b0' }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: 'primary.main' },
                  '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                }
              }}
            />
          </Box>
          <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
            <List>
              {filterItems(libraryMedia, mediaLibrarySearch).map((media) => (
                <ListItem
                  key={media.id}
                  button
                  onClick={() => {
                    const presentationItem = convertMediaToPresentation(media);
                    addToService(presentationItem);
                    setAddMediaDialogOpen(false);
                    setMediaLibrarySearch('');
                    setSnackbarMessage(`"${media.title}" added to service!`);
                    setSnackbarOpen(true);
                  }}
                  sx={{
                    borderBottom: '1px solid #404040',
                    '&:hover': { bgcolor: '#333' }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {media.type === 'image' ? <Image sx={{ color: '#ffb74d' }} /> : 
                     media.type === 'video' ? <VideoLibrary sx={{ color: '#e57373' }} /> : 
                     <Slideshow sx={{ color: '#b0b0b0' }} />}
                  </ListItemIcon>
                  <ListItemText
                    primary={<Typography sx={{ color: 'white', fontWeight: 'bold' }}>{media.title}</Typography>}
                    secondary={
                      <Box>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          {media.type} • {media.duration}s • {media.addedDate}
                        </Typography>
                      </Box>
                    }
                  />
                  <IconButton sx={{ color: '#ffb74d' }}>
                    <Add />
                  </IconButton>
                </ListItem>
              ))}
              {filterItems(libraryMedia, mediaLibrarySearch).length === 0 && (
                <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                  <Typography variant="body2">No media found</Typography>
                  <Typography variant="caption">Add media from the Media page first</Typography>
                </Box>
              )}
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddMediaDialogOpen(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Timer Dialog */}
      <Dialog open={timerOpen} onClose={() => setTimerOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: '#ffffff' } }}>
        <DialogTitle sx={{ color: '#ffffff', display: 'flex', alignItems: 'center', gap: 1 }}>
          <TimerIcon sx={{ color: '#ff9800' }} />
          Set Timer
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, my: 3 }}>
            <TextField
              label="Minutes"
              type="number"
              value={timerMinutes}
              onChange={(e) => setTimerMinutes(Math.max(0, parseInt(e.target.value) || 0))}
              inputProps={{ min: 0, max: 99 }}
              sx={{ width: 100 }}
              InputProps={{
                sx: {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: '#555555' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                }
              }}
              InputLabelProps={{ sx: { color: '#b0b0b0' } }}
            />
            
            <Typography variant="h4" sx={{ color: '#ffffff' }}>:</Typography>
            
            <TextField
              label="Seconds"
              type="number"
              value={timerSeconds}
              onChange={(e) => setTimerSeconds(Math.max(0, Math.min(59, parseInt(e.target.value) || 0)))}
              inputProps={{ min: 0, max: 59 }}
              sx={{ width: 100 }}
              InputProps={{
                sx: {
                  color: '#ffffff',
                  '& fieldset': { borderColor: '#404040' },
                  '&:hover fieldset': { borderColor: '#555555' },
                  '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                }
              }}
              InputLabelProps={{ sx: { color: '#b0b0b0' } }}
            />
          </Box>
          
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h3" sx={{ color: '#ff9800', fontFamily: 'monospace' }}>
              {formatTime(timerMinutes * 60 + timerSeconds)}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimerOpen(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
          <Button 
            onClick={resetTimer} 
            variant="outlined" 
            startIcon={<RestartIcon />}
            sx={{ borderColor: '#404040', color: '#b0b0b0', mr: 1 }}
          >
            Reset
          </Button>
          <Button 
            onClick={startTimer} 
            variant="contained" 
            startIcon={<TimerIcon />}
            disabled={timerMinutes === 0 && timerSeconds === 0}
          >
            Start Timer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ bgcolor: '#4caf50', color: 'white' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Pulse animation for LIVE indicator */}
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
}
