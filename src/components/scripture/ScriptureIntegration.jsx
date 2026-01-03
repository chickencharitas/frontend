import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Chip,
  Grid,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  InputAdornment
} from '@mui/material';
import {
  Search,
  Add,
  ContentCopy,
  Share,
  BookmarkBorder,
  Bookmark
} from '@mui/icons-material';

const ScriptureIntegration = ({ onScriptureSelect }) => {
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState('1');
  const [startVerse, setStartVerse] = useState('1');
  const [endVerse, setEndVerse] = useState('1');
  const [translation, setTranslation] = useState('KJV');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPassage, setSelectedPassage] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [bookmarks, setBookmarks] = useState(new Set());

  // Sample Bible books
  const bibleBooks = [
    'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
    'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel', '1 Kings', '2 Kings',
    'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
    '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
    '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus',
    'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John',
    '3 John', 'Jude', 'Revelation'
  ];

  const translations = ['KJV', 'NIV', 'NKJV', 'ESV', 'NASB', 'NLT', 'The Message'];

  // Sample scripture passages
  const scriptureDatabase = {
    'John:1:1-1': {
      book: 'John',
      chapter: 1,
      verses: [{ verse: 1, text: 'In the beginning was the Word, and the Word was with God, and the Word was God.' }],
      translation: 'KJV'
    },
    'John:3:16-16': {
      book: 'John',
      chapter: 3,
      verses: [{ verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' }],
      translation: 'KJV'
    },
    'Psalm:23:1-6': {
      book: 'Psalm',
      chapter: 23,
      verses: [
        { verse: 1, text: 'The LORD is my shepherd; I shall not want.' },
        { verse: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
        { verse: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
        { verse: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
        { verse: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
        { verse: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' }
      ],
      translation: 'KJV'
    },
    'Romans:12:1-2': {
      book: 'Romans',
      chapter: 12,
      verses: [
        { verse: 1, text: 'I beseech you therefore, brethren, by the mercies of God, that ye present your bodies a living sacrifice, holy, acceptable unto God, which is your reasonable service.' },
        { verse: 2, text: 'And be not conformed to this world: but be ye transformed by the renewing of your mind, that ye may prove what is that good, and acceptable, and perfect, will of God.' }
      ],
      translation: 'KJV'
    },
    'Matthew:6:9-13': {
      book: 'Matthew',
      chapter: 6,
      verses: [
        { verse: 9, text: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.' },
        { verse: 10, text: 'Thy kingdom come. Thy will be done in earth, as it is in heaven.' },
        { verse: 11, text: 'Give us this day our daily bread.' },
        { verse: 12, text: 'And forgive us our debts, as we forgive our debtors.' },
        { verse: 13, text: 'And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.' }
      ],
      translation: 'KJV'
    }
  };

  const passageList = Object.values(scriptureDatabase);

  const filteredPassages = useMemo(() => {
    return passageList.filter(passage =>
      passage.book.toLowerCase().includes(searchQuery.toLowerCase()) ||
      searchQuery.toLowerCase().includes('chapter') ||
      searchQuery.includes(':')
    );
  }, [searchQuery]);

  const handleGetPassage = () => {
    const key = `${book}:${chapter}:${startVerse}-${endVerse}`;
    const passage = scriptureDatabase[key] || scriptureDatabase[`${book}:${chapter}:${startVerse}-${startVerse}`];
    
    if (passage) {
      setSelectedPassage({ ...passage, reference: `${book} ${chapter}:${startVerse}-${endVerse}` });
      setOpenDialog(true);
    } else {
      alert('Passage not found. Try John 1:1 or John 3:16');
    }
  };

  const handleAddToPresentation = (passage) => {
    if (onScriptureSelect) {
      onScriptureSelect(passage);
    }
    setOpenDialog(false);
  };

  const handleToggleBookmark = (passageKey) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(passageKey)) {
      newBookmarks.delete(passageKey);
    } else {
      newBookmarks.add(passageKey);
    }
    setBookmarks(newBookmarks);
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
        <Typography variant="h6" sx={{ mb: 2 }}>Scripture Lookup</Typography>
        
        <Grid container spacing={1} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#cccccc' }}>Book</InputLabel>
              <Select
                value={book}
                onChange={(e) => setBook(e.target.value)}
                label="Book"
                sx={{
                  color: '#cccccc',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                {bibleBooks.map(b => (
                  <MenuItem key={b} value={b}>{b}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Chapter"
              type="number"
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="Start Verse"
              type="number"
              value={startVerse}
              onChange={(e) => setStartVerse(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={2}>
            <TextField
              fullWidth
              label="End Verse"
              type="number"
              value={endVerse}
              onChange={(e) => setEndVerse(e.target.value)}
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth size="small">
              <InputLabel sx={{ color: '#cccccc' }}>Translation</InputLabel>
              <Select
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
                label="Translation"
                sx={{
                  color: '#cccccc',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                {translations.map(t => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Button
          fullWidth
          variant="contained"
          onClick={handleGetPassage}
          sx={{ backgroundColor: '#81c784', color: '#1a1a1a', borderRadius: 0 }}
        >
          Get Passage
        </Button>
      </Paper>

      {/* Search/Browse */}
      <Paper
        sx={{
          backgroundColor: '#2d2d2e',
          borderBottom: '1px solid #333',
          p: 2,
          borderRadius: 0
        }}
      >
        <TextField
          fullWidth
          placeholder="Search scriptures..."
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
      </Paper>

      {/* Passages List */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <List sx={{ backgroundColor: '#1a1a1a' }}>
          {filteredPassages.map((passage, idx) => {
            const passageKey = `${passage.book}:${passage.chapter}`;
            return (
              <ListItem key={idx} disablePadding>
                <ListItemButton
                  onClick={() => {
                    setSelectedPassage({ ...passage, reference: `${passage.book} ${passage.chapter}` });
                    setOpenDialog(true);
                  }}
                  sx={{
                    backgroundColor: '#252526',
                    borderBottom: '1px solid #333',
                    '&:hover': { backgroundColor: '#2d2d2e' },
                    py: 2
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ color: '#cccccc', fontWeight: 500 }}>
                        {passage.book} {passage.chapter}:{passage.verses[0].verse}
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                        {passage.verses[0].text.substring(0, 80)}...
                      </Typography>
                    }
                  />
                  <Tooltip title="Bookmark">
                    <IconButton
                      edge="end"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleBookmark(passageKey);
                      }}
                      sx={{ color: bookmarks.has(passageKey) ? '#ffd700' : '#cccccc' }}
                    >
                      {bookmarks.has(passageKey) ? <Bookmark /> : <BookmarkBorder />}
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Scripture Details Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        {selectedPassage && (
          <>
            <DialogTitle>{selectedPassage.reference}</DialogTitle>
            <DialogContent>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label={selectedPassage.translation}
                  size="small"
                  variant="outlined"
                  sx={{ mb: 2 }}
                />
                
                <Box>
                  {selectedPassage.verses.map((verseObj) => (
                    <Box key={verseObj.verse} sx={{ mb: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          backgroundColor: '#3c3c3d',
                          color: '#81c784',
                          px: 1,
                          borderRadius: 1,
                          fontWeight: 'bold'
                        }}
                      >
                        {verseObj.verse}
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#cccccc', mt: 1 }}>
                        {verseObj.text}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>Close</Button>
              <Tooltip title="Copy">
                <IconButton
                  onClick={() => {
                    const text = selectedPassage.verses.map(v => v.text).join('\n');
                    navigator.clipboard.writeText(text);
                  }}
                  size="small"
                  sx={{ color: '#81c784' }}
                >
                  <ContentCopy />
                </IconButton>
              </Tooltip>
              <Button
                onClick={() => handleAddToPresentation(selectedPassage)}
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

export default ScriptureIntegration;
