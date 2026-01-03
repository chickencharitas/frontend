import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Tooltip,
  Fab,
  Switch,
  FormControlLabel,
  Alert,
  Rating,
  Avatar,
  Snackbar
} from '@mui/material';
import {
  Search,
  Add,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Edit,
  Delete,
  Favorite,
  FavoriteBorder,
  Share,
  Copy,
  ExpandMore,
  LibraryMusic,
  QueueMusic,
  Album,
  Person,
  AccessTime,
  Star,
  StarBorder,
  Save,
  Clear,
  Keyboard,
  VolumeUp,
  Tv,
  PlaylistAdd
} from '@mui/icons-material';
import { usePresentation } from '../context/PresentationContext';

// Local storage key for songs
const SONGS_STORAGE_KEY = 'worshipress_songs';

// Load songs from localStorage on initial load
const loadSongsFromStorage = () => {
  try {
    const stored = localStorage.getItem(SONGS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Failed to load songs from storage:', error);
  }
  return mockSongs; // Fallback to mock data
};

// Save songs to localStorage
const saveSongsToStorage = (songs) => {
  try {
    localStorage.setItem(SONGS_STORAGE_KEY, JSON.stringify(songs));
  } catch (error) {
    console.warn('Failed to save songs to storage:', error);
  }
};

// Mock song data (as fallback)
const mockSongs = [
  {
    id: 1,
    title: 'Amazing Grace',
    artist: 'Traditional',
    album: 'Hymns of Worship',
    key: 'G',
    tempo: 120,
    timeSignature: '4/4',
    lyrics: `[Verse 1]
Amazing grace, how sweet the sound
That saved a wretch like me
I once was lost, but now am found
Was blind, but now I see

[Chorus]
'Twas grace that taught my heart to fear
And grace my fears relieved
How precious did that grace appear
The hour I first believed

[Verse 2]
Through many dangers, toils and snares
I have already come
'Tis grace that brought me safe thus far
And grace will lead me home`,
    chords: `[Verse 1]
G        C      G
Amazing grace, how sweet the sound
D        G
That saved a wretch like me
G        C      G
I once was lost, but now am found
D        G
Was blind, but now I see

[Chorus]
G        C      G
'Twas grace that taught my heart to fear
D        G
And grace my fears relieved
G        C      G
How precious did that grace appear
D        G
The hour I first believed`,
    tags: ['hymn', 'traditional', 'grace', 'salvation'],
    duration: 245,
    rating: 4.8,
    plays: 1250,
    addedDate: '2024-01-01',
    lastPlayed: '2024-01-15',
    ccliNumber: 'CCLI-12345'
  },
  {
    id: 2,
    title: 'Build My Life',
    artist: 'Pat Barrett',
    album: 'Build My Life',
    key: 'D',
    tempo: 136,
    timeSignature: '4/4',
    lyrics: `[Verse 1]
Worthy of every song we could ever sing
Worthy of all the praise we could ever bring
Worthy of every breath we could ever breathe
We live for You

[Chorus]
Holy, there is no one like You
There is none beside You
Open up my eyes in wonder
Show me who You are
And fill me with Your heart
And lead me in Your love to those around me

[Verse 2]
And I will build my life upon Your love
It is a firm foundation
And I will put my trust in You alone
And I will not be shaken`,
    chords: `[Verse 1]
G     D     Em     C
Worthy of every song we could ever sing
G     D     Em     C
Worthy of all the praise we could ever bring
G     D     Em     C
Worthy of every breath we could ever breathe
G     D
We live for You

[Chorus]
G     D     Em     C
Holy, there is no one like You
G     D     Em     C
There is none beside You
G     D     Em     C
Open up my eyes in wonder
G     D     Em     C
Show me who You are
G     D     Em     C
And fill me with Your heart
G     D     Em     C
And lead me in Your love to those around me`,
    tags: ['modern', 'worship', 'praise', 'foundation'],
    duration: 312,
    rating: 4.9,
    plays: 2100,
    addedDate: '2024-01-05',
    lastPlayed: '2024-01-14',
    ccliNumber: 'CCLI-67890'
  },
  {
    id: 3,
    title: 'Way Maker',
    artist: 'Sinach',
    album: 'Way Maker',
    key: 'C',
    tempo: 132,
    timeSignature: '4/4',
    lyrics: `[Verse 1]
You are here, moving in our midst
You are here, working in this place
You are here, healing every heart
You are here, turning lives around
You are here, turning lives around

[Chorus]
Way maker, miracle worker, promise keeper
Light in the darkness, my God
That is who You are
Way maker, miracle worker, promise keeper
Light in the darkness, my God
That is who You are

[Verse 2]
You are here, touching every life
You are here, healing every heart
You are here, mending every broken place
You are here`,
    chords: `[Verse 1]
F     C     G     Am
You are here, moving in our midst
F     C     G     Am
You are here, working in this place
F     C     G     Am
You are here, healing every heart
F     C     G     Am
You are here, turning lives around
F     C     G
You are here, turning lives around

[Chorus]
F     C     G     Am
Way maker, miracle worker, promise keeper
F     C     G     Am
Light in the darkness, my God
F     C     G     Am
That is who You are
F     C     G     Am
Way maker, miracle worker, promise keeper
F     C     G     Am
Light in the darkness, my God
F     C     G
That is who You are`,
    tags: ['modern', 'worship', 'healing', 'miracle'],
    duration: 285,
    rating: 4.7,
    plays: 1800,
    addedDate: '2024-01-08',
    lastPlayed: '2024-01-13',
    ccliNumber: 'CCLI-54321'
  }
];

// Safe hook to use presentation context without throwing errors
function usePresentationSafe() {
  try {
    return usePresentation();
  } catch (e) {
    return null;
  }
}

export default function SongLibrary() {
  // Get presentation context for integration (safe call)
  const presentationContext = usePresentationSafe();
  const { addToService, quickGoLive } = presentationContext || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSong, setSelectedSong] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showLyrics, setShowLyrics] = useState(true);
  const [showChords, setShowChords] = useState(false);
  const [favorites, setFavorites] = useState(new Set([1, 2]));
  const [recentSongs, setRecentSongs] = useState([1, 2, 3]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [addSongDialogOpen, setAddSongDialogOpen] = useState(false);
  const [newSong, setNewSong] = useState({
    title: '',
    artist: '',
    album: '',
    key: 'C',
    tempo: 120,
    timeSignature: '4/4',
    lyrics: '',
    chords: '',
    tags: [],
    ccliNumber: ''
  });

  // Load songs from localStorage on component mount
  const [songs, setSongs] = useState(() => loadSongsFromStorage());

  const filteredSongs = songs.filter(song =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    song.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSongSelect = (song) => {
    setSelectedSong(song);
    setActiveTab(1); // Switch to lyrics tab
  };

  // Convert song to presentation format with slides
  const convertSongToPresentation = (song) => {
    // Parse lyrics into slides (split by verse/chorus markers or double newlines)
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

  const handleAddToPresentation = () => {
    if (!selectedSong) return;
    
    if (addToService) {
      const presentationItem = convertSongToPresentation(selectedSong);
      addToService(presentationItem);
      setSnackbarMessage(`"${selectedSong.title}" added to service!`);
      setSnackbarOpen(true);
      
      // Navigate to worship workspace to see it in the service
      setTimeout(() => {
        window.location.href = '/worship';
      }, 1500);
    } else {
      alert(`"${selectedSong.title}" added to current presentation!`);
    }
  };

  const handleGoLive = () => {
    if (!selectedSong) return;
    
    if (quickGoLive) {
      const presentationItem = convertSongToPresentation(selectedSong);
      quickGoLive(presentationItem, 0);
      setSnackbarMessage(`"${selectedSong.title}" is now LIVE!`);
      setSnackbarOpen(true);
      
      // Navigate to worship workspace to see live output
      setTimeout(() => {
        window.location.href = '/worship';
      }, 1500);
    } else {
      alert(`Go to /worship to use live output`);
    }
  };

  const handleToggleFavorite = (songId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(songId)) {
        newFavorites.delete(songId);
      } else {
        newFavorites.add(songId);
      }
      return newFavorites;
    });
  };

  const handlePlaySong = (songId) => {
    if (currentSongId === songId && isPlaying) {
      setIsPlaying(false);
    } else {
      setCurrentSongId(songId);
      setIsPlaying(true);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAddNewSong = () => {
    // Create new song object
    const songToAdd = {
      id: Date.now(), // Temporary ID
      title: newSong.title,
      artist: newSong.artist,
      album: newSong.album,
      key: newSong.key,
      tempo: newSong.tempo,
      timeSignature: newSong.timeSignature,
      lyrics: newSong.lyrics,
      chords: newSong.chords,
      tags: newSong.tags,
      ccliNumber: newSong.ccliNumber,
      duration: 180, // Default duration
      rating: 0,
      plays: 0,
      addedDate: new Date().toISOString().split('T')[0],
      lastPlayed: null
    };

    // Add to songs state and save to localStorage
    const updatedSongs = [...songs, songToAdd];
    setSongs(updatedSongs);
    saveSongsToStorage(updatedSongs);
    
    // Reset form and close dialog
    setNewSong({
      title: '',
      artist: '',
      album: '',
      key: 'C',
      tempo: 120,
      timeSignature: '4/4',
      lyrics: '',
      chords: '',
      tags: [],
      ccliNumber: ''
    });
    setAddSongDialogOpen(false);
    
    // Show success message
    setSnackbarMessage(`"${songToAdd.title}" added to song library!`);
    setSnackbarOpen(true);
    
    // Select the new song
    setSelectedSong(songToAdd);
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
            Song Library
          </Typography>
          <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
            Worship songs with lyrics, chords, and presentation integration
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setAddSongDialogOpen(true)}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Add New Song
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Song List */}
        <Grid item xs={12} lg={5}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1, p: 0 }}>
              {/* Search */}
              <Box sx={{ p: 2, borderBottom: '1px solid #404040' }}>
                <TextField
                  fullWidth
                  placeholder="Search songs, artists, or themes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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

              {/* Song List */}
              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List>
                  {filteredSongs.map((song) => (
                    <ListItem
                      key={song.id}
                      button
                      onClick={() => handleSongSelect(song)}
                      sx={{
                        borderBottom: '1px solid #404040',
                        '&:hover': { bgcolor: '#333' },
                        bgcolor: selectedSong?.id === song.id ? 'primary.main' : 'transparent'
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                          <LibraryMusic sx={{ fontSize: 16 }} />
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                            {song.title}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                              {song.artist} • {song.key} • {formatDuration(song.duration)}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                              {song.tags.slice(0, 2).map(tag => (
                                <Chip
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  sx={{ height: 16, fontSize: '0.6rem', bgcolor: '#404040', color: '#b0b0b0' }}
                                />
                              ))}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleFavorite(song.id);
                            }}
                            sx={{ color: favorites.has(song.id) ? '#ffb74d' : '#666' }}
                          >
                            {favorites.has(song.id) ? <Star /> : <StarBorder />}
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlaySong(song.id);
                            }}
                            sx={{ color: currentSongId === song.id && isPlaying ? 'primary.main' : '#b0b0b0' }}
                          >
                            {currentSongId === song.id && isPlaying ? <Pause /> : <PlayArrow />}
                          </IconButton>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Song Details */}
        <Grid item xs={12} lg={7}>
          {selectedSong ? (
            <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', height: '70vh', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Song Header */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box>
                      <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 0.5 }}>
                        {selectedSong.title}
                      </Typography>
                      <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
                        {selectedSong.artist} • {selectedSong.album}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton
                        onClick={() => handleToggleFavorite(selectedSong.id)}
                        sx={{ color: favorites.has(selectedSong.id) ? '#ffb74d' : '#b0b0b0' }}
                      >
                        {favorites.has(selectedSong.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                      <IconButton sx={{ color: '#b0b0b0' }}>
                        <Share />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Song Metadata */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={`Key: ${selectedSong.key}`} sx={{ bgcolor: 'primary.main', color: 'white' }} />
                    <Chip label={`Tempo: ${selectedSong.tempo} BPM`} sx={{ bgcolor: '#81c784', color: 'white' }} />
                    <Chip label={`Time: ${selectedSong.timeSignature}`} sx={{ bgcolor: '#ffb74d', color: 'black' }} />
                    <Chip label={`Duration: ${formatDuration(selectedSong.duration)}`} sx={{ bgcolor: '#e57373', color: 'white' }} />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Rating value={selectedSong.rating} readOnly size="small" sx={{ color: '#ffb74d' }} />
                    <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                      {selectedSong.plays} plays • CCLI: {selectedSong.ccliNumber}
                    </Typography>
                  </Box>

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      startIcon={<Add />}
                      onClick={handleAddToPresentation}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      Add to Service
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Tv />}
                      onClick={handleGoLive}
                      sx={{ bgcolor: '#f44336', '&:hover': { bgcolor: '#d32f2f' } }}
                    >
                      Go Live
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<PlayArrow />}
                      onClick={() => handlePlaySong(selectedSong.id)}
                      sx={{ borderColor: '#81c784', color: '#81c784' }}
                    >
                      {currentSongId === selectedSong.id && isPlaying ? 'Pause' : 'Preview'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Edit />}
                      sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
                    >
                      Edit
                    </Button>
                  </Box>
                </Box>

                {/* Content Tabs */}
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ minHeight: 40 }}>
                    <Tab
                      label="Lyrics"
                      sx={{ color: '#b0b0b0', '&.Mui-selected': { color: 'primary.main' } }}
                    />
                    <Tab
                      label="Chords"
                      sx={{ color: '#b0b0b0', '&.Mui-selected': { color: 'primary.main' } }}
                    />
                    <Tab
                      label="Details"
                      sx={{ color: '#b0b0b0', '&.Mui-selected': { color: 'primary.main' } }}
                    />
                  </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={{ flex: 1, overflow: 'auto' }}>
                  {activeTab === 0 && (
                    <Paper sx={{ p: 2, bgcolor: '#1a1a1a', border: '1px solid #404040', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'white' }}>
                      {selectedSong.lyrics}
                    </Paper>
                  )}

                  {activeTab === 1 && (
                    <Paper sx={{ p: 2, bgcolor: '#1a1a1a', border: '1px solid #404040', fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: 'primary.main' }}>
                      {selectedSong.chords}
                    </Paper>
                  )}

                  {activeTab === 2 && (
                    <Box sx={{ p: 2 }}>
                      <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>Song Details</Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Artist</Typography>
                          <Typography sx={{ color: 'white' }}>{selectedSong.artist}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Album</Typography>
                          <Typography sx={{ color: 'white' }}>{selectedSong.album}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Key</Typography>
                          <Typography sx={{ color: 'white' }}>{selectedSong.key}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Tempo</Typography>
                          <Typography sx={{ color: 'white' }}>{selectedSong.tempo} BPM</Typography>
                        </Grid>
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>Tags</Typography>
                          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {selectedSong.tags.map(tag => (
                              <Chip key={tag} label={tag} sx={{ bgcolor: '#404040', color: '#e0e0e0' }} />
                            ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <LibraryMusic sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Select a song to view details
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Choose a song from the library to see lyrics, chords, and add to your presentation
                </Typography>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>

      {/* Add Song Dialog */}
      <Dialog 
        open={addSongDialogOpen} 
        onClose={() => setAddSongDialogOpen(false)}
        maxWidth="md" 
        fullWidth
        PaperProps={{ sx: { bgcolor: '#2a2a2a', color: 'white' } }}
      >
        <DialogTitle sx={{ color: 'white' }}>Add New Song</DialogTitle>
        <DialogContent sx={{ color: 'white' }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Song Title"
                value={newSong.title}
                onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Artist"
                value={newSong.artist}
                onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Album"
                value={newSong.album}
                onChange={(e) => setNewSong(prev => ({ ...prev, album: e.target.value }))}
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Key</InputLabel>
                <Select
                  value={newSong.key}
                  onChange={(e) => setNewSong(prev => ({ ...prev, key: e.target.value }))}
                  sx={{ color: 'white', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' } }}
                >
                  {['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].map(key => (
                    <MenuItem key={key} value={key}>{key}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Tempo"
                type="number"
                value={newSong.tempo}
                onChange={(e) => setNewSong(prev => ({ ...prev, tempo: parseInt(e.target.value) || 120 }))}
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lyrics"
                multiline
                rows={4}
                value={newSong.lyrics}
                onChange={(e) => setNewSong(prev => ({ ...prev, lyrics: e.target.value }))}
                placeholder="Enter song lyrics with verse/chorus markers..."
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chords"
                multiline
                rows={3}
                value={newSong.chords}
                onChange={(e) => setNewSong(prev => ({ ...prev, chords: e.target.value }))}
                placeholder="Enter chord progressions..."
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="CCLI Number"
                value={newSong.ccliNumber}
                onChange={(e) => setNewSong(prev => ({ ...prev, ccliNumber: e.target.value }))}
                sx={{ '& .MuiInputLabel-root': { color: '#b0b0b0' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddSongDialogOpen(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddNewSong} 
            variant="contained"
            disabled={!newSong.title || !newSong.artist}
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Add Song
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' }
        }}
        onClick={() => setAddSongDialogOpen(true)}
      >
        <Add />
      </Fab>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbarOpen(false)} 
          severity="success" 
          sx={{ bgcolor: '#4caf50', color: 'white' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}