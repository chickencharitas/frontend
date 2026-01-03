import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  InputAdornment,
  Tooltip,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Grid,
  useTheme
} from '@mui/material';
import {
  Search,
  Add,
  Edit,
  Delete,
  PlayArrow,
  FavoriteBorder,
  Favorite,
  Share
} from '@mui/icons-material';

const SongManagement = ({ onSongSelect }) => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [selectedSong, setSelectedSong] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [favorites, setFavorites] = useState(new Set());

  // Sample song database
  const [songs, setSongs] = useState([
    {
      id: 1,
      title: 'Amazing Grace',
      artist: 'John Newton',
      ccli: '27712',
      key: 'G',
      bpm: 72,
      lyrics: 'Amazing grace, how sweet the sound...',
      tags: ['hymn', 'classic'],
      category: 'Hymns'
    },
    {
      id: 2,
      title: 'Great Is Thy Faithfulness',
      artist: 'Thomas Chisholm',
      ccli: '27711',
      key: 'D',
      bpm: 80,
      lyrics: 'Great is thy faithfulness...',
      tags: ['hymn', 'faith'],
      category: 'Hymns'
    },
    {
      id: 3,
      title: 'Holy, Holy, Holy',
      artist: 'Reginald Heber',
      ccli: '27713',
      key: 'G',
      bpm: 76,
      lyrics: 'Holy, holy, holy...',
      tags: ['hymn', 'worship'],
      category: 'Hymns'
    },
    {
      id: 4,
      title: 'What A Beautiful Name',
      artist: 'Brooke Ligertwood, Hillsong',
      ccli: '7105605',
      key: 'E',
      bpm: 92,
      lyrics: 'You were the word at the beginning...',
      tags: ['modern', 'worship', 'contemporary'],
      category: 'Contemporary'
    }
  ]);

  // Filter songs based on search
  const filteredSongs = useMemo(() => {
    return songs.filter(song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery, songs]);

  const handleOpenSong = (song) => {
    setSelectedSong(song);
    setOpenDialog(true);
  };

  const handleToggleFavorite = (songId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
    } else {
      newFavorites.add(songId);
    }
    setFavorites(newFavorites);
  };

  const handleAddToPresentation = (song) => {
    if (onSongSelect) {
      onSongSelect(song);
    }
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a1a1a', color: '#cccccc' }}>
      {/* Header */}
      <Paper
        sx={{
          backgroundColor: '#252526',
          borderBottom: '1px solid #333',
          p: 2,
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Search songs by title, artist, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#808080' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#cccccc',
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#555' }
              }
            }}
          />
          <Tooltip title="Add New Song">
            <IconButton sx={{ color: '#81c784' }}>
              <Add />
            </IconButton>
          </Tooltip>
        </Box>
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid #333', backgroundColor: '#2d2d2e' }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{
            '& .MuiTab-root': { color: '#cccccc' },
            '& .Mui-selected': { color: '#81c784' }
          }}
        >
          <Tab label="All Songs" />
          <Tab label="Favorites" />
          <Tab label="By Category" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tabValue === 0 && (
          /* All Songs Table */
          <TableContainer component={Paper} sx={{ backgroundColor: '#2d2d2e', borderRadius: 0 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#1a1a1a' }}>
                  <TableCell sx={{ color: '#b0b0b0' }}>Title</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>Artist</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>Key</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>BPM</TableCell>
                  <TableCell sx={{ color: '#b0b0b0' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredSongs.map((song) => (
                  <TableRow key={song.id} sx={{ backgroundColor: '#252526', '&:hover': { backgroundColor: '#2d2d2e' } }}>
                    <TableCell sx={{ color: '#cccccc' }}>{song.title}</TableCell>
                    <TableCell sx={{ color: '#cccccc' }}>{song.artist}</TableCell>
                    <TableCell sx={{ color: '#cccccc' }}>{song.key}</TableCell>
                    <TableCell sx={{ color: '#cccccc' }}>{song.bpm}</TableCell>
                    <TableCell>
                      <Tooltip title="Play">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenSong(song)}
                          sx={{ color: '#81c784' }}
                        >
                          <PlayArrow fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={favorites.has(song.id) ? 'Remove Favorite' : 'Add Favorite'}>
                        <IconButton
                          size="small"
                          onClick={() => handleToggleFavorite(song.id)}
                          sx={{ color: favorites.has(song.id) ? '#ff6b6b' : '#cccccc' }}
                        >
                          {favorites.has(song.id) ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {tabValue === 1 && (
          /* Favorites */
          <Grid container spacing={2}>
            {filteredSongs.filter(s => favorites.has(s.id)).map((song) => (
              <Grid item xs={12} sm={6} md={4} key={song.id}>
                <Card sx={{ backgroundColor: '#2d2d2e', borderRadius: 0 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#cccccc', mb: 1 }}>
                      {song.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 1 }}>
                      {song.artist}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
                      {song.tags.map(tag => (
                        <Chip key={tag} label={tag} size="small" variant="outlined" />
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button size="small" variant="contained">
                        <PlayArrow fontSize="small" />
                      </Button>
                      <Button size="small" variant="outlined">
                        <Share fontSize="small" />
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {tabValue === 2 && (
          /* By Category */
          <Box>
            {['Hymns', 'Contemporary', 'Gospel', 'Seasonal'].map(category => (
              <Box key={category} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ color: '#cccccc', mb: 1 }}>
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {filteredSongs
                    .filter(s => s.category === category)
                    .map(song => (
                      <Grid item xs={12} key={song.id}>
                        <Paper
                          sx={{
                            p: 1.5,
                            backgroundColor: '#252526',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            borderRadius: 0,
                            '&:hover': { backgroundColor: '#2d2d2e' }
                          }}
                          onClick={() => handleOpenSong(song)}
                        >
                          <Box>
                            <Typography sx={{ color: '#cccccc', fontWeight: 500 }}>
                              {song.title}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                              {song.artist}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                              Key: {song.key}
                            </Typography>
                            <Tooltip title="Add to Presentation">
                              <IconButton
                                size="small"
                                onClick={() => handleAddToPresentation(song)}
                                sx={{ color: '#81c784' }}
                              >
                                <Add fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Song Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {selectedSong && (
          <>
            <DialogTitle>{selectedSong.title}</DialogTitle>
            <DialogContent>
              <Box sx={{ mb: 2, mt: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Artist</Typography>
                <Typography variant="body2">{selectedSong.artist}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>CCLI</Typography>
                <Typography variant="body2">{selectedSong.ccli}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Key: {selectedSong.key} | BPM: {selectedSong.bpm}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>Lyrics</Typography>
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {selectedSong.lyrics}
                </Typography>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Button
                onClick={() => handleAddToPresentation(selectedSong)}
                variant="contained"
                sx={{ backgroundColor: '#81c784' }}
              >
                Add to Presentation
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SongManagement;
