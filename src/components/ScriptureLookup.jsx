import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useBible from '../hooks/useBible';
import { installBibleVersion } from '../services/bibleApi';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
  Fab,
  Snackbar,
  Autocomplete
} from '@mui/material';
import {
  Search,
  Add,
  MenuBook,
  ContentCopy,
  Share,
  Favorite,
  FavoriteBorder,
  ExpandMore,
  Clear,
  Save,
  PlayArrow,
  Visibility,
  Edit,
  History,
  Bookmark,
  BookmarkBorder,
  ArrowBack,
  ArrowForward,
  Fullscreen,
  Settings,
  FormatSize,
  FormatAlignCenter,
  FormatAlignLeft,
  FormatAlignRight
} from '@mui/icons-material';

const ScriptureLookup = () => {
  const [reference, setReference] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('ESV');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedVerse, setSelectedVerse] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [fontSize, setFontSize] = useState(16);
  const [textAlign, setTextAlign] = useState('center');
  const [showVerseNumbers, setShowVerseNumbers] = useState(true);
  const [showFullscreen, setShowFullscreen] = useState(false);

  const {
    books,
    chapters,
    verses,
    currentVerse,
    loading,
    error,
    searchResults,
    fetchVerse,
    searchScripture,
    getChapter,
    clearResults
  } = useBible(selectedVersion);

  // Load saved data from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('scripture_favorites');
    const savedRecent = localStorage.getItem('scripture_recent');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecent(JSON.parse(savedRecent));
  }, []);

  const handleReferenceSubmit = () => {
    if (reference.trim()) {
      fetchVerse(reference.trim());
      addToRecent(reference.trim());
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      searchScripture(searchQuery.trim());
      setTabValue(2); // Switch to search results tab
    }
  };

  const addToRecent = (ref) => {
    const newRecent = [ref, ...recent.filter(r => r !== ref)].slice(0, 10);
    setRecent(newRecent);
    localStorage.setItem('scripture_recent', JSON.stringify(newRecent));
  };

  const toggleFavorite = (ref) => {
    const isFavorite = favorites.includes(ref);
    const newFavorites = isFavorite 
      ? favorites.filter(f => f !== ref)
      : [...favorites, ref];
    setFavorites(newFavorites);
    localStorage.setItem('scripture_favorites', JSON.stringify(newFavorites));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Show snackbar or notification
  };

  const renderVerse = (verse, verseNumber = null) => (
    <Box sx={{ mb: 1.5, position: 'relative' }}>
      {showVerseNumbers && verseNumber && (
        <Typography
          component="span"
          sx={{
            position: 'absolute',
            left: textAlign === 'center' ? '20px' : textAlign === 'right' ? 'auto' : '20px',
            right: textAlign === 'right' ? '20px' : 'auto',
            top: 0,
            fontSize: `${fontSize * 0.7}px`,
            color: '#888888',
            fontWeight: 600,
            lineHeight: 1
          }}
        >
          {verseNumber}
        </Typography>
      )}
      <Typography
        variant="body1"
        sx={{
          fontSize: `${fontSize}px`,
          lineHeight: 1.6,
          color: '#ffffff',
          textAlign: textAlign,
          pl: showVerseNumbers && verseNumber && (textAlign === 'left' || textAlign === 'center') ? '35px' : 0,
          pr: showVerseNumbers && verseNumber && textAlign === 'right' ? '35px' : 0
        }}
      >
        {verse}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: '#141418',
      color: '#ffffff'
    }}>
      {/* Header */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid #2a2a30',
        background: 'linear-gradient(180deg, #1a1a1f 0%, #141418 100%)'
      }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Enter reference (e.g., John 3:16)"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleReferenceSubmit()}
                sx={{
                  '& .MuiInputBase-root': {
                    bgcolor: '#1f1f24',
                    color: '#fff',
                    borderRadius: '8px',
                    '&:hover': { bgcolor: '#25252a' },
                    '&.Mui-focused': { bgcolor: '#25252a' }
                  },
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' }
                }}
              />
              <Button
                variant="contained"
                onClick={handleReferenceSubmit}
                sx={{
                  bgcolor: '#0088ff',
                  borderRadius: '8px',
                  textTransform: 'none',
                  px: 3,
                  '&:hover': { bgcolor: '#0099ff' }
                }}
              >
                <Search />
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <FormControl fullWidth size="small">
              <Select
                value={selectedVersion}
                onChange={(e) => setSelectedVersion(e.target.value)}
                sx={{
                  bgcolor: '#1f1f24',
                  color: '#fff',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
                  '& .MuiSvgIcon-root': { color: '#fff' }
                }}
              >
                <MenuItem value="ESV">ESV</MenuItem>
                <MenuItem value="KJV">KJV</MenuItem>
                <MenuItem value="NIV">NIV</MenuItem>
                <MenuItem value="NLT">NLT</MenuItem>
                <MenuItem value="NASB">NASB</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Tooltip title="Text Size">
                <IconButton
                  size="small"
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  sx={{ color: '#b0b0b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  <FormatSize sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Text Alignment">
                <IconButton
                  size="small"
                  onClick={() => setTextAlign(textAlign === 'left' ? 'center' : textAlign === 'center' ? 'right' : 'left')}
                  sx={{ color: '#b0b0b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  {textAlign === 'left' ? <FormatAlignLeft /> : textAlign === 'center' ? <FormatAlignCenter /> : <FormatAlignRight />}
                </IconButton>
              </Tooltip>
              <Tooltip title="Verse Numbers">
                <IconButton
                  size="small"
                  onClick={() => setShowVerseNumbers(!showVerseNumbers)}
                  sx={{ 
                    color: showVerseNumbers ? '#0088ff' : '#b0b0b8', 
                    '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } 
                  }}
                >
                  <span style={{ fontSize: '12px', fontWeight: 'bold' }}>#</span>
                </IconButton>
              </Tooltip>
              <Tooltip title="Fullscreen">
                <IconButton
                  size="small"
                  onClick={() => setShowFullscreen(!showFullscreen)}
                  sx={{ color: '#b0b0b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                >
                  <Fullscreen />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Navigation */}
        <Box sx={{ 
          width: 280, 
          borderRight: '1px solid #2a2a30',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}>
          <Tabs 
            value={tabValue} 
            onChange={(e, v) => setTabValue(v)}
            sx={{
              '& .MuiTabs-indicator': { bgcolor: '#0088ff' },
              '& .MuiTab-root': { color: '#b0b0b8', '&.Mui-selected': { color: '#0088ff' } }
            }}
          >
            <Tab label="Books" />
            <Tab label="Favorites" />
            <Tab label="Recent" />
            <Tab label="Search" />
          </Tabs>

          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {tabValue === 0 && (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search books..."
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      bgcolor: '#1f1f24',
                      color: '#fff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' }
                    }
                  }}
                />
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {books.map(book => (
                    <Box
                      key={book}
                      onClick={() => setSelectedBook(book)}
                      sx={{
                        p: 1.5,
                        mb: 0.5,
                        bgcolor: selectedBook === book ? 'rgba(0,136,255,0.15)' : '#1a1a1f',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#25252a' },
                        border: selectedBook === book ? '1px solid #0088ff' : '1px solid transparent'
                      }}
                    >
                      <Typography sx={{ fontSize: '0.9rem', fontWeight: 500 }}>{book}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {tabValue === 1 && (
              <Box>
                {favorites.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', color: '#707078', mt: 4 }}>
                    No favorites yet
                  </Typography>
                ) : (
                  favorites.map(fav => (
                    <Box
                      key={fav}
                      sx={{
                        p: 1.5,
                        mb: 0.5,
                        bgcolor: '#1a1a1f',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#25252a' },
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      <Typography sx={{ fontSize: '0.85rem' }}>{fav}</Typography>
                      <IconButton size="small" onClick={() => toggleFavorite(fav)}>
                        <Favorite sx={{ fontSize: 16, color: '#ff6b6b' }} />
                      </IconButton>
                    </Box>
                  ))
                )}
              </Box>
            )}

            {tabValue === 2 && (
              <Box>
                {recent.length === 0 ? (
                  <Typography sx={{ textAlign: 'center', color: '#707078', mt: 4 }}>
                    No recent verses
                  </Typography>
                ) : (
                  recent.map(rec => (
                    <Box
                      key={rec}
                      onClick={() => {
                        setReference(rec);
                        fetchVerse(rec);
                      }}
                      sx={{
                        p: 1.5,
                        mb: 0.5,
                        bgcolor: '#1a1a1f',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: '#25252a' }
                      }}
                    >
                      <Typography sx={{ fontSize: '0.85rem' }}>{rec}</Typography>
                    </Box>
                  ))
                )}
              </Box>
            )}

            {tabValue === 3 && (
              <Box>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search scripture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  sx={{ mb: 2 }}
                  InputProps={{
                    sx: {
                      bgcolor: '#1f1f24',
                      color: '#fff',
                      borderRadius: '8px',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' }
                    }
                  }}
                />
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleSearch}
                  sx={{ mb: 2, bgcolor: '#0088ff', '&:hover': { bgcolor: '#0099ff' } }}
                >
                  Search
                </Button>
                {searchResults.map((result, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      p: 1.5,
                      mb: 0.5,
                      bgcolor: '#1a1a1f',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      '&:hover': { bgcolor: '#25252a' }
                    }}
                    onClick={() => {
                      setReference(result.reference);
                      fetchVerse(result.reference);
                    }}
                  >
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#0088ff', mb: 0.5 }}>
                      {result.reference}
                    </Typography>
                    <Typography sx={{ fontSize: '0.8rem', color: '#b0b0b8' }}>
                      {result.text.substring(0, 100)}...
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>

        {/* Main Display Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          {currentVerse ? (
            <>
              {/* Verse Header */}
              <Box sx={{
                p: 3,
                borderBottom: '1px solid #2a2a30',
                background: 'linear-gradient(180deg, #1a1a1f 0%, #141418 100%)'
              }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h5" sx={{ fontWeight: 600, color: '#0088ff' }}>
                    {currentVerse.reference}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Add to Favorites">
                      <IconButton
                        size="small"
                        onClick={() => toggleFavorite(currentVerse.reference)}
                        sx={{ color: '#b0b0b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                      >
                        {favorites.includes(currentVerse.reference) ? 
                          <Favorite sx={{ color: '#ff6b6b' }} /> : 
                          <FavoriteBorder />
                        }
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy">
                      <IconButton
                        size="small"
                        onClick={() => copyToClipboard(currentVerse.text)}
                        sx={{ color: '#b0b0b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                      >
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton
                        size="small"
                        sx={{ color: '#b0b0b8', '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.08)' } }}
                      >
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ color: '#707078' }}>
                  {selectedVersion} • {currentVerse.verses?.length || 1} verses
                </Typography>
              </Box>

              {/* Verse Content */}
              <Box sx={{
                flex: 1,
                p: 4,
                overflow: 'auto',
                display: 'flex',
                justifyContent: 'center'
              }}>
                <Box sx={{ maxWidth: 800, width: '100%' }}>
                  {Array.isArray(currentVerse.text) ? 
                    currentVerse.text.map((verse, idx) => renderVerse(verse, idx + 1)) :
                    renderVerse(currentVerse.text)
                  }
                </Box>
              </Box>

              {/* Navigation Footer */}
              <Box sx={{
                p: 2,
                borderTop: '1px solid #2a2a30',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#1a1a1f'
              }}>
                <Button
                  startIcon={<ArrowBack />}
                  sx={{ color: '#b0b0b8', '&:hover': { color: '#fff' } }}
                >
                  Previous Chapter
                </Button>
                <Button
                  endIcon={<ArrowForward />}
                  sx={{ color: '#b0b0b8', '&:hover': { color: '#fff' } }}
                >
                  Next Chapter
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#707078'
            }}>
              <MenuBook sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
              <Typography variant="h6" sx={{ mb: 1 }}>Select a Scripture</Typography>
              <Typography variant="body2">
                Enter a reference or browse books to get started
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ScriptureLookup;
