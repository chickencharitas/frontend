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
  Edit
} from '@mui/icons-material';

// Bible books for reference
const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians',
  '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James',
  '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

export default function ScriptureLookup() {
  // Purchase dialog state
  const [purchaseDialog, setPurchaseDialog] = useState({ open: false, version: null });
  // Bible API hook
  const {
    verses,
    loading,
    error,
    version,
    versions,
    history,
    favorites,
    search: searchBible,
    setVersion,
    addToFavorites,
    removeFromFavorites,
    isFavorite
  } = useBible('KJV');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [endVerse, setEndVerse] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  // Auto-show preview when verses load successfully
  useEffect(() => {
    if (verses && verses.length > 0) {
      setShowPreview(true);
    }
    
    // Show error if search fails
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [verses, error]);

  // Handle search
  const handleSearch = useCallback(async () => {
    if (!selectedBook || !chapter) return;
    
    const reference = `${selectedBook} ${chapter}${verse ? `:${verse}` : ''}${endVerse ? `-${endVerse}` : ''}`;
    await searchBible(reference, version);
  }, [selectedBook, chapter, verse, endVerse, version, searchBible]);

  // Handle quick search from search bar
  const handleQuickSearch = useCallback(async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    await searchBible(searchQuery.trim(), version);
    setShowPreview(true);
    
    setSnackbar({
      open: true,
      message: `Loaded ${searchQuery}`,
      severity: 'success'
    });
  }, [searchQuery, version, searchBible]);

  // Toggle favorite status
  const toggleFavorite = useCallback(() => {
    if (!verses) return;
    
    if (isFavorite(verses.reference, version)) {
      removeFromFavorites(verses.reference, version);
      setSnackbar({
        open: true,
        message: 'Removed from favorites',
        severity: 'info'
      });
    } else {
      addToFavorites(verses.reference, verses.text, version);
      setSnackbar({
        open: true,
        message: 'Added to favorites',
        severity: 'success'
      });
    }
  }, [verses, version, isFavorite, addToFavorites, removeFromFavorites]);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Load a verse from history
  const loadFromHistory = useCallback((historyItem) => {
    searchBible(historyItem.query, historyItem.version);
    setShowPreview(true);
  }, [searchBible]);

  // Load a favorite verse
  const loadFavorite = useCallback((fav) => {
    searchBible(fav.reference, fav.version);
    setShowPreview(true);
  }, [searchBible]);

  // Quick search for common references
  const quickSearches = [
    'John 3:16', 'Psalm 23', 'Jeremiah 29:11', 'Romans 8:28',
    'Philippians 4:13', 'Proverbs 3:5-6', 'Matthew 28:19-20'
  ];

  // Generate autocomplete suggestions with version info
  const autocompleteSuggestions = useMemo(() => {
    const suggestions = new Set();
    const popularVersions = ['kjv', 'niv', 'esv', 'nkjv', 'amp', 'msg', 'nlt', 'nasb'];
    
    // Add quick searches with versions
    quickSearches.forEach(s => {
      suggestions.add(s);
      popularVersions.forEach(v => {
        suggestions.add(`${s} (${v.toUpperCase()})`);
      });
    });
    
    // Add history with versions
    history.forEach(h => {
      const query = typeof h === 'string' ? h : h.query;
      suggestions.add(query);
      const histVersion = typeof h === 'string' ? version : h.version;
      if (histVersion) {
        suggestions.add(`${query} (${histVersion.toUpperCase()})`);
      }
    });
    
    // Add common chapter references for selected book with versions
    if (selectedBook) {
      for (let i = 1; i <= 10; i++) {
        const ref = `${selectedBook} ${i}:1`;
        suggestions.add(ref);
        popularVersions.forEach(v => {
          suggestions.add(`${ref} (${v.toUpperCase()})`);
        });
      }
    }
    
    // Add search query matches with versions
    if (searchQuery && searchQuery.length > 0) {
      // Find books that match search query
      BIBLE_BOOKS.forEach(book => {
        if (book.toLowerCase().includes(searchQuery.toLowerCase())) {
          for (let i = 1; i <= 5; i++) {
            const ref = `${book} ${i}:1`;
            suggestions.add(ref);
            popularVersions.forEach(v => {
              suggestions.add(`${ref} (${v.toUpperCase()})`);
            });
          }
        }
      });
    }
    
    return Array.from(suggestions).sort();
  }, [selectedBook, searchQuery, history, version]);

  const handleQuickReference = (reference) => {
    // Parse reference and optional version (e.g., "John 3:16 (KJV)")
    const versionMatch = reference.match(/\(([A-Z0-9]+)\)$/);
    let query = reference;
    let selectedVersion = version;
    
    if (versionMatch) {
      selectedVersion = versionMatch[1].toLowerCase();
      query = reference.replace(/ \([A-Z0-9]+\)$/, ''); // Remove version from query
    }
    
    // Parse reference (simplified)
    const parts = query.split(' ');
    if (parts.length >= 2) {
      const book = parts.slice(0, -1).join(' ');
      const chapterVerse = parts[parts.length - 1];
      const [chap, verse] = chapterVerse.split(':');

      setSelectedBook(book);
      setChapter(chap);
      setVerse(verse || '');
      setEndVerse('');
      setVersion(selectedVersion);
      // Use the searchBible function directly with the reference
      searchBible(query, selectedVersion);
      setShowPreview(true);
    }
  };

  const handleAddToPresentation = () => {
    if (!verses || verses.length === 0) return;
    // In a real app, this would add the verse to the current presentation
    console.log('Adding verse to presentation:', verses);
    alert('Verse added to current presentation!');
  };

  const handleToggleFavorite = () => {
    if (!verses || verses.length === 0) return;
    if (isFavorite(verses[0]?.reference)) {
      removeFromFavorites(verses[0]?.reference);
    } else {
      addToFavorites(verses[0]?.reference);
    }
  };

  const handleCopyVerse = () => {
    if (!verses || verses.length === 0) return;
    const verse = verses[0];
    navigator.clipboard.writeText(`${verse?.text}\n\n${verse?.reference} (${verse?.version})`);
    alert('Verse copied to clipboard!');
  };

  const handleInstall = async (option) => {
    try {
      await installBibleVersion(option.code);
      setSnackbar({
        open: true,
        message: `${option.name} installed successfully!`,
        severity: 'success'
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to install Bible version',
        severity: 'error'
      });
    }
  };

  const handlePurchaseCancel = () => {
    setPurchaseDialog({ open: false, version: null });
  };

  const handlePurchaseConfirm = async () => {
    if (!purchaseDialog.version) return;
    try {
      await installBibleVersion(purchaseDialog.version.code);
      setSnackbar({
        open: true,
        message: `${purchaseDialog.version.name} purchased and installed!`,
        severity: 'success'
      });
      setPurchaseDialog({ open: false, version: null });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to purchase and install Bible version',
        severity: 'error'
      });
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          Scripture Lookup
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
          Search and integrate Bible verses into your presentations
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Search Panel */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Search Scripture
              </Typography>

              {/* Version Selector with Autocomplete */}
              <Autocomplete
                fullWidth
                options={versions || []}
                getOptionLabel={(option) => 
                  typeof option === 'string' ? option : `${option.name}${!option.free ? ' [Premium]' : ''} (${option.code.toUpperCase()})`
                }
                value={versions?.find(v => v.code === version) || null}
                onChange={(e, value) => {
                  if (value) {
                    setVersion(value.code);
                  }
                }}
                renderOption={(props, option) => (
                  <Box component="li" {...props} sx={{ color: '#b0b0b0 !important', alignItems: 'center', display: 'flex' }}>
                    <Box sx={{ flex: 1 }}>
                      <span style={{ fontWeight: 600 }}>{option.name}</span>
                      <Typography variant="caption" sx={{ color: '#808080', ml: 1 }}>
                        {option.language}
                      </Typography>
                      {option.free ? (
                        <Chip label="Free" size="small" sx={{ ml: 1, bgcolor: '#388e3c', color: 'white', fontWeight: 700 }} />
                      ) : (
                        <Chip label="Premium" size="small" sx={{ ml: 1, bgcolor: '#d32f2f', color: 'white', fontWeight: 700 }} />
                      )}
                    </Box>
                    {!option.installed && (
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ ml: 2, fontSize: 12, fontWeight: 700, borderColor: '#81c784', color: '#81c784' }}
                        onClick={e => {
                          e.stopPropagation();
                          if (!option.free) {
                            setPurchaseDialog({ open: true, version: option });
                          } else {
                            handleInstall(option);
                          }
                        }}
                      >
                        Install
                      </Button>
                    )}
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Bible Version"
                    placeholder="Search translation..."
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputLabel-root': { color: '#b0b0b0' },
                      '& .MuiAutocomplete-listbox': {
                        bgcolor: '#2a2a2a',
                        '& li': { color: '#b0b0b0' },
                        '& li[aria-selected="true"]': { bgcolor: 'primary.main !important' }
                      }
                    }}
                  />
                )}
                ListboxProps={{
                  sx: {
                    bgcolor: '#2a2a2a',
                    '& .MuiAutocomplete-option': {
                      color: '#b0b0b0 !important',
                      '&[aria-selected="true"]': {
                        bgcolor: 'primary.main !important'
                      }
                    }
                  }
                }}
                noOptionsText="No translations found"
                filterOptions={(options, state) => {
                  if (!state.inputValue) return options;
                  
                  const inputValue = state.inputValue.toLowerCase();
                  return (options || []).filter(option => {
                    if (!option) return false;
                    
                    // Handle both object and string formats
                    if (typeof option === 'string') {
                      return option.toLowerCase().includes(inputValue);
                    }
                    
                    // For objects
                    const nameStr = String(option.name || '').toLowerCase();
                    const codeStr = String(option.code || '').toLowerCase();
                    const categoryStr = String(option.category || '').toLowerCase();
                    
                    return (
                      nameStr.includes(inputValue) ||
                      codeStr.includes(inputValue) ||
                      categoryStr.includes(inputValue)
                    );
                  });
                }}
              />

              {/* Purchase Dialog */}
              <Dialog open={purchaseDialog.open} onClose={handlePurchaseCancel}>
                <DialogTitle>Purchase Bible Version</DialogTitle>
                <DialogContent>
                  <Typography gutterBottom>
                    To install <b>{purchaseDialog.version?.name}</b>, you must purchase this premium Bible version.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    (Simulated purchase flow. Integrate with your payment provider for real purchases.)
                  </Typography>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePurchaseCancel}>Cancel</Button>
                  <Button onClick={handlePurchaseConfirm} variant="contained" color="primary">Purchase & Install</Button>
                </DialogActions>
              </Dialog>

              {/* Book Selector */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel sx={{ color: '#b0b0b0' }}>Book</InputLabel>
                <Select
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'primary.main' }
                  }}
                >
                  {BIBLE_BOOKS.map(book => (
                    <MenuItem key={book} value={book}>
                      {book}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Autocomplete Quick Search */}
              <Autocomplete
                fullWidth
                options={autocompleteSuggestions}
                value={searchQuery}
                onChange={(e, value) => {
                  setSearchQuery(value || '');
                  if (value) {
                    handleQuickReference(value);
                  }
                }}
                inputValue={searchQuery}
                onInputChange={(e, value) => setSearchQuery(value)}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Quick Search (e.g., John 3:16)"
                    placeholder="Type book name or full reference..."
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputLabel-root': { color: '#b0b0b0' },
                      '& .MuiAutocomplete-listbox': {
                        bgcolor: '#2a2a2a',
                        '& li': { color: '#b0b0b0' },
                        '& li[aria-selected="true"]': { bgcolor: 'primary.main !important' }
                      }
                    }}
                  />
                )}
                ListboxProps={{
                  sx: {
                    bgcolor: '#2a2a2a',
                    '& .MuiAutocomplete-option': {
                      color: '#b0b0b0 !important',
                      '&[aria-selected="true"]': {
                        bgcolor: 'primary.main !important'
                      }
                    }
                  }
                }}
                noOptionsText="No matches found"
                filterOptions={(options, state) => {
                  const inputValue = state.inputValue.toLowerCase();
                  return options.filter(option =>
                    option.toLowerCase().includes(inputValue)
                  );
                }}
              />

              {/* Chapter and Verse */}
              <Grid container spacing={1} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Chapter"
                    type="number"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputLabel-root': { color: '#b0b0b0' }
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="Verse"
                    type="number"
                    value={verse}
                    onChange={(e) => setVerse(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputLabel-root': { color: '#b0b0b0' }
                    }}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    fullWidth
                    label="To"
                    type="number"
                    value={endVerse}
                    onChange={(e) => setEndVerse(e.target.value)}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: 'white',
                        '& fieldset': { borderColor: '#404040' },
                        '&:hover fieldset': { borderColor: 'primary.main' },
                        '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                      },
                      '& .MuiInputLabel-root': { color: '#b0b0b0' }
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                fullWidth
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <Search />}
                onClick={handleSearch}
                disabled={loading || !selectedBook || !chapter}
                sx={{ mb: 3, bgcolor: 'primary.main' }}
              >
                {loading ? 'Searching...' : 'Search Scripture'}
              </Button>

              {/* Quick Searches */}
              <Typography variant="subtitle2" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>
                Quick Searches
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {quickSearches.map(reference => (
                  <Button
                    key={reference}
                    variant="outlined"
                    size="small"
                    onClick={() => handleQuickReference(reference)}
                    sx={{
                      justifyContent: 'flex-start',
                      borderColor: '#404040',
                      color: '#b0b0b0',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }
                    }}
                  >
                    {reference}
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>

          {/* Recent Searches */}
          {history.length > 0 && (
            <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', mt: 2 }}>
              <CardContent>
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                  Recent Searches
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {history.slice(0, 5).map((search, idx) => (
                    <Chip
                      key={idx}
                      label={typeof search === 'string' ? search : search.query}
                      size="small"
                      onClick={() => handleQuickSearch(typeof search === 'string' ? search : search.query)}
                      sx={{
                        bgcolor: '#333',
                        color: '#b0b0b0',
                        '&:hover': {
                          bgcolor: 'primary.main',
                          color: 'white'
                        }
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}
        </Grid>

        {/* Results Panel */}
        <Grid item xs={12} lg={8}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {showPreview && verses && verses.length > 0 ? (
            <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                    {verses[0]?.reference}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Add to Favorites">
                      <IconButton
                        onClick={handleToggleFavorite}
                        sx={{ color: isFavorite(verses[0]?.reference) ? '#ffb74d' : '#b0b0b0' }}
                      >
                        {isFavorite(verses[0]?.reference) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Copy Verse">
                      <IconButton onClick={handleCopyVerse} sx={{ color: '#b0b0b0' }}>
                        <ContentCopy />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton sx={{ color: '#b0b0b0' }}>
                        <Share />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Paper
                  sx={{
                    p: 3,
                    bgcolor: '#1a1a1a',
                    border: '1px solid #404040',
                    mb: 2,
                    fontSize: '1.2rem',
                    lineHeight: 1.6
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      color: 'white',
                      fontStyle: 'italic',
                      textAlign: 'center'
                    }}
                  >
                    {verses[0]?.text}
                  </Typography>
                </Paper>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                    {verses[0]?.version} • {verses[0]?.copyright}
                  </Typography>
                  <Chip
                    label="NIV"
                    size="small"
                    sx={{ bgcolor: 'primary.main', color: 'white' }}
                  />
                </Box>

                <Divider sx={{ bgcolor: '#404040', mb: 2 }} />

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleAddToPresentation}
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    Add to Presentation
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => setShowPreview(false)}
                    sx={{ borderColor: 'primary.main', color: 'primary.main' }}
                  >
                    Search Again
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', minHeight: 400 }}>
              <CardContent sx={{ textAlign: 'center', py: 8 }}>
                <MenuBook sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 2 }}>
                  Search for Scripture
                </Typography>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Select a book, chapter, and verse to find Bible passages for your presentations
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Advanced Features */}
          <Accordion sx={{ mt: 3, bgcolor: '#2a2a2a', border: '1px solid #404040', '&:before': { display: 'none' } }}>
            <AccordionSummary
              expandIcon={<ExpandMore sx={{ color: '#b0b0b0' }} />}
              sx={{ color: 'white', '&:hover': { bgcolor: '#333' } }}
            >
              <Typography>Advanced Features</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid #404040' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                    Display Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button size="small" sx={{ justifyContent: 'flex-start', color: '#b0b0b0' }}>
                      Show Verse Numbers
                    </Button>
                    <Button size="small" sx={{ justifyContent: 'flex-start', color: '#b0b0b0' }}>
                      Highlight Keywords
                    </Button>
                    <Button size="small" sx={{ justifyContent: 'flex-start', color: '#b0b0b0' }}>
                      Add Cross References
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                    Study Tools
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button size="small" sx={{ justifyContent: 'flex-start', color: '#b0b0b0' }}>
                      View Commentary
                    </Button>
                    <Button size="small" sx={{ justifyContent: 'flex-start', color: '#b0b0b0' }}>
                      Related Verses
                    </Button>
                    <Button size="small" sx={{ justifyContent: 'flex-start', color: '#b0b0b0' }}>
                      Word Study
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>
      </Grid>

      {/* Floating Action Button for Quick Add */}
      {verses && verses.length > 0 && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' }
          }}
          onClick={handleAddToPresentation}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}