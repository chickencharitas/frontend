import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, Button, Grid, IconButton, Chip, Dialog, DialogTitle,
  DialogContent, DialogActions, FormControl, Select, MenuItem, Tabs, Tab,
  CircularProgress, Divider, Tooltip, Snackbar, Alert, LinearProgress, Card,
  CardContent, Badge, InputAdornment, Switch, FormControlLabel, Paper, Collapse
} from '@mui/material';
import {
  Search, MenuBook, ContentCopy, Share, Favorite, FavoriteBorder, ArrowBack,
  ArrowForward, FormatSize, FormatAlignCenter, FormatAlignLeft, FormatAlignRight,
  Download, Lock, LockOpen, CloudDownload, DeleteOutline, Storage, Language,
  Star, Close, PlayArrow, Add, CheckCircle, ShoppingCart, CreditCard,
  Subscriptions, ExpandMore, ExpandLess, Verified, LocalOffer, FilterList
} from '@mui/icons-material';
import {
  BIBLE_VERSIONS_CATALOG, searchBible, purchaseVersion, subscribePremium,
  hasPremiumAccess, getPurchasedVersions, getSubscriptionStatus
} from '../../services/bibleApiService';

const BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians',
  'Galatians', 'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter',
  '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

const BibleManager = () => {
  const [reference, setReference] = useState('');
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  const [selectedBook, setSelectedBook] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [recent, setRecent] = useState([]);
  const [fontSize, setFontSize] = useState(18);
  const [textAlign, setTextAlign] = useState('left');
  const [showVerseNumbers, setShowVerseNumbers] = useState(true);
  const [versionsDialogOpen, setVersionsDialogOpen] = useState(false);
  const [purchaseDialogOpen, setPurchaseDialogOpen] = useState(false);
  const [subscriptionDialogOpen, setSubscriptionDialogOpen] = useState(false);
  const [selectedPurchaseVersion, setSelectedPurchaseVersion] = useState(null);
  const [versionTab, setVersionTab] = useState(0);
  const [languageFilter, setLanguageFilter] = useState('all');
  const [installedVersions, setInstalledVersions] = useState(['kjv']);
  const [purchasedVersions, setPurchasedVersions] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [installingVersion, setInstallingVersion] = useState(null);
  const [installProgress, setInstallProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [bookFilter, setBookFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentVerse, setCurrentVerse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Get unique languages
  const languages = [...new Set(BIBLE_VERSIONS_CATALOG.map(v => v.language))].sort();

  // Load saved data on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('bible_favorites');
    const savedRecent = localStorage.getItem('bible_recent');
    const savedInstalled = localStorage.getItem('bible_installed');
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedRecent) setRecent(JSON.parse(savedRecent));
    if (savedInstalled) {
      const parsed = JSON.parse(savedInstalled);
      // Ensure KJV is always included
      if (!parsed.includes('kjv')) parsed.unshift('kjv');
      setInstalledVersions(parsed);
    }
    setPurchasedVersions(getPurchasedVersions());
    setSubscription(getSubscriptionStatus());
    setIsInitialized(true);
  }, []);

  // Save installed versions only after initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('bible_installed', JSON.stringify(installedVersions));
    }
  }, [installedVersions, isInitialized]);

  const fetchVerse = useCallback(async (ref) => {
    setLoading(true);
    try {
      const result = await searchBible(ref, selectedVersion);
      if (result.success) {
        setCurrentVerse({
          reference: result.reference,
          book: result.book,
          chapter: result.chapter,
          verses: result.verses,
          version: selectedVersion
        });
      } else if (result.error === 'PREMIUM_REQUIRED') {
        const version = BIBLE_VERSIONS_CATALOG.find(v => v.code === selectedVersion);
        setSelectedPurchaseVersion(version);
        setPurchaseDialogOpen(true);
      } else {
        setSnackbar({ open: true, message: result.error || 'Failed to fetch verse', severity: 'error' });
      }
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
    setLoading(false);
  }, [selectedVersion]);

  const handleReferenceSubmit = () => {
    if (reference.trim()) {
      fetchVerse(reference.trim());
      addToRecent(reference.trim());
    }
  };

  const addToRecent = (ref) => {
    const newRecent = [ref, ...recent.filter(r => r !== ref)].slice(0, 20);
    setRecent(newRecent);
    localStorage.setItem('bible_recent', JSON.stringify(newRecent));
  };

  const toggleFavorite = (ref) => {
    const isFav = favorites.includes(ref);
    const newFavs = isFav ? favorites.filter(f => f !== ref) : [...favorites, ref];
    setFavorites(newFavs);
    localStorage.setItem('bible_favorites', JSON.stringify(newFavs));
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSnackbar({ open: true, message: 'Copied to clipboard!', severity: 'success' });
  };

  const handleInstallVersion = async (version) => {
    if (installedVersions.includes(version.code)) return;
    
    // Check if premium version requires purchase
    if (!version.free && !hasPremiumAccess(version.code)) {
      setSelectedPurchaseVersion(version);
      setPurchaseDialogOpen(true);
      return;
    }
    
    setInstallingVersion(version.code);
    setInstallProgress(0);
    
    const interval = setInterval(() => {
      setInstallProgress(prev => prev >= 100 ? 100 : prev + Math.random() * 15);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setInstallProgress(100);
      setTimeout(() => {
        setInstalledVersions(prev => [...prev, version.code]);
        setInstallingVersion(null);
        setInstallProgress(0);
        setSnackbar({ open: true, message: `${version.name} installed!`, severity: 'success' });
      }, 300);
    }, 2000);
  };

  const handleUninstallVersion = (code) => {
    if (code === 'kjv') {
      setSnackbar({ open: true, message: 'Cannot remove default version', severity: 'warning' });
      return;
    }
    setInstalledVersions(prev => prev.filter(v => v !== code));
    if (selectedVersion === code) setSelectedVersion('kjv');
    setSnackbar({ open: true, message: 'Version removed', severity: 'info' });
  };

  const handlePurchase = async (version) => {
    const result = await purchaseVersion(version.code);
    if (result.success) {
      setPurchasedVersions(getPurchasedVersions());
      setPurchaseDialogOpen(false);
      setSnackbar({ open: true, message: `${version.name} purchased! You can now install it.`, severity: 'success' });
      handleInstallVersion(version);
    }
  };

  const handleSubscribe = async (planType) => {
    const result = await subscribePremium(planType);
    if (result.success) {
      setSubscription(result.subscription);
      setSubscriptionDialogOpen(false);
      setSnackbar({ open: true, message: `Premium subscription activated!`, severity: 'success' });
    }
  };

  const getVersion = (code) => BIBLE_VERSIONS_CATALOG.find(v => v.code === code);
  const filteredBooks = BOOKS.filter(b => b.toLowerCase().includes(bookFilter.toLowerCase()));

  // Parse current reference for navigation
  const parseCurrentReference = () => {
    if (!currentVerse?.reference) return null;
    const match = currentVerse.reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      return { book: match[1], chapter: parseInt(match[2]), verse: parseInt(match[3]) };
    }
    return null;
  };

  const navigatePrevious = () => {
    const parsed = parseCurrentReference();
    if (!parsed) return;
    
    let { book, chapter, verse } = parsed;
    
    if (verse > 1) {
      // Go to previous verse
      verse -= 1;
    } else if (chapter > 1) {
      // Go to previous chapter, verse 1
      chapter -= 1;
      verse = 1;
    } else {
      // Go to previous book
      const bookIndex = BOOKS.indexOf(book);
      if (bookIndex > 0) {
        book = BOOKS[bookIndex - 1];
        chapter = 1;
        verse = 1;
      }
    }
    
    const newRef = `${book} ${chapter}:${verse}`;
    setReference(newRef);
    fetchVerse(newRef);
    addToRecent(newRef);
  };

  const navigateNext = () => {
    const parsed = parseCurrentReference();
    if (!parsed) return;
    
    let { book, chapter, verse } = parsed;
    
    // Try next verse first
    verse += 1;
    let newRef = `${book} ${chapter}:${verse}`;
    
    // If we can fetch it, great. Otherwise try next chapter
    setReference(newRef);
    fetchVerse(newRef);
    addToRecent(newRef);
  };

  const navigateNextChapter = () => {
    const parsed = parseCurrentReference();
    if (!parsed) return;
    
    let { book, chapter } = parsed;
    chapter += 1;
    
    const newRef = `${book} ${chapter}:1`;
    setReference(newRef);
    fetchVerse(newRef);
    addToRecent(newRef);
  };

  const navigatePreviousChapter = () => {
    const parsed = parseCurrentReference();
    if (!parsed) return;
    
    let { book, chapter } = parsed;
    
    if (chapter > 1) {
      chapter -= 1;
    } else {
      const bookIndex = BOOKS.indexOf(book);
      if (bookIndex > 0) {
        book = BOOKS[bookIndex - 1];
        chapter = 1;
      }
    }
    
    const newRef = `${book} ${chapter}:1`;
    setReference(newRef);
    fetchVerse(newRef);
    addToRecent(newRef);
  };
  
  const getFilteredVersions = () => {
    let versions = BIBLE_VERSIONS_CATALOG;
    if (languageFilter !== 'all') {
      versions = versions.filter(v => v.language === languageFilter);
    }
    return versions;
  };

  const VersionCard = ({ version }) => {
    const installed = installedVersions.includes(version.code);
    const purchased = purchasedVersions.includes(version.code) || (subscription?.active);
    const canAccess = version.free || purchased;
    
    return (
      <Card sx={{ mb: 1, bgcolor: installed ? 'rgba(0,136,255,0.1)' : '#1f1f24', border: installed ? '1px solid rgba(0,136,255,0.3)' : '1px solid #2a2a30', borderRadius: 2 }}>
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1, mr: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                <Typography sx={{ fontWeight: 600, color: '#fff', fontSize: '0.9rem' }}>{version.name}</Typography>
                <Chip label={version.abbr} size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: '#333', color: '#aaa' }} />
                {version.popular && <Chip icon={<Star sx={{ fontSize: 10 }} />} label="Popular" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(255,193,7,0.15)', color: '#ffc107' }} />}
                {version.isStudyBible && <Chip icon={<MenuBook sx={{ fontSize: 10 }} />} label="Study" size="small" sx={{ height: 18, fontSize: '0.6rem', bgcolor: 'rgba(33,150,243,0.15)', color: '#2196f3' }} />}
              </Box>
              <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 0.5 }}>{version.description}</Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Typography sx={{ color: '#666', fontSize: '0.65rem', display: 'flex', alignItems: 'center' }}><Language sx={{ fontSize: 10, mr: 0.5 }} />{version.language}</Typography>
                <Typography sx={{ color: '#666', fontSize: '0.65rem', display: 'flex', alignItems: 'center' }}><Storage sx={{ fontSize: 10, mr: 0.5 }} />{version.size}</Typography>
                {version.year && <Typography sx={{ color: '#666', fontSize: '0.65rem' }}>© {version.year}</Typography>}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
              {version.free ? (
                <Chip icon={<LockOpen sx={{ fontSize: 12 }} />} label="Free" size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(76,175,80,0.15)', color: '#81c784' }} />
              ) : (
                <Box sx={{ textAlign: 'right' }}>
                  <Chip icon={<Lock sx={{ fontSize: 12 }} />} label={`$${version.price}`} size="small" sx={{ height: 20, fontSize: '0.65rem', bgcolor: 'rgba(156,39,176,0.15)', color: '#ce93d8', mb: 0.5 }} />
                  {version.priceMonthly && <Typography sx={{ fontSize: '0.55rem', color: '#888' }}>or ${version.priceMonthly}/mo</Typography>}
                </Box>
              )}
              <Box sx={{ mt: 1 }}>
                {installingVersion === version.code ? (
                  <Box sx={{ textAlign: 'center', width: 80 }}>
                    <CircularProgress size={20} sx={{ color: '#0088ff' }} />
                    <Typography sx={{ fontSize: '0.6rem', color: '#888' }}>{Math.round(installProgress)}%</Typography>
                  </Box>
                ) : installed ? (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <Tooltip title="Use this version"><IconButton size="small" onClick={() => { setSelectedVersion(version.code); setVersionsDialogOpen(false); }} sx={{ color: '#0088ff' }}><PlayArrow fontSize="small" /></IconButton></Tooltip>
                    {version.code !== 'kjv' && <Tooltip title="Remove"><IconButton size="small" onClick={() => handleUninstallVersion(version.code)} sx={{ color: '#888' }}><DeleteOutline fontSize="small" /></IconButton></Tooltip>}
                  </Box>
                ) : canAccess ? (
                  <Button size="small" startIcon={<Download />} onClick={() => handleInstallVersion(version)} sx={{ bgcolor: '#0088ff', fontSize: '0.7rem', textTransform: 'none', px: 1.5, '&:hover': { bgcolor: '#0099ff' } }}>
                    Install
                  </Button>
                ) : (
                  <Button size="small" startIcon={<ShoppingCart />} onClick={() => { setSelectedPurchaseVersion(version); setPurchaseDialogOpen(true); }} sx={{ bgcolor: '#9c27b0', fontSize: '0.7rem', textTransform: 'none', px: 1.5, '&:hover': { bgcolor: '#ab47bc' } }}>
                    Buy
                  </Button>
                )}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#141418', color: '#fff' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #2a2a30', background: 'linear-gradient(180deg, #1a1a1f 0%, #141418 100%)' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={5}>
            <TextField fullWidth size="small" placeholder="Enter reference (e.g., John 3:16)" value={reference}
              onChange={(e) => setReference(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleReferenceSubmit()}
              InputProps={{
                startAdornment: <InputAdornment position="start"><MenuBook sx={{ color: '#666' }} /></InputAdornment>,
                endAdornment: <InputAdornment position="end"><IconButton size="small" onClick={handleReferenceSubmit} sx={{ color: '#0088ff' }}><Search /></IconButton></InputAdornment>,
                sx: { bgcolor: '#1f1f24', color: '#fff', borderRadius: 2 }
              }}
              sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' } }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <FormControl fullWidth size="small">
                <Select value={selectedVersion} onChange={(e) => setSelectedVersion(e.target.value)}
                  sx={{ bgcolor: '#1f1f24', color: '#fff', borderRadius: 2, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' }, '& .MuiSvgIcon-root': { color: '#fff' } }}>
                  {installedVersions.map(code => {
                    const v = getVersion(code);
                    return v ? <MenuItem key={code} value={code}>{v.abbr} - {v.name}</MenuItem> : null;
                  })}
                </Select>
              </FormControl>
              <Tooltip title="Manage Versions">
                <IconButton onClick={() => setVersionsDialogOpen(true)} sx={{ bgcolor: '#1f1f24', color: '#0088ff' }}>
                  <Badge badgeContent={installedVersions.length} color="primary"><CloudDownload /></Badge>
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
              <IconButton size="small" onClick={() => setFontSize(Math.max(12, fontSize - 2))} sx={{ color: '#888' }}><FormatSize sx={{ fontSize: 14 }} /></IconButton>
              <Typography sx={{ color: '#666', fontSize: '0.7rem', minWidth: 28 }}>{fontSize}px</Typography>
              <IconButton size="small" onClick={() => setFontSize(Math.min(32, fontSize + 2))} sx={{ color: '#888' }}><FormatSize sx={{ fontSize: 20 }} /></IconButton>
              <Divider orientation="vertical" sx={{ height: 20, bgcolor: '#333', mx: 0.5 }} />
              <IconButton size="small" onClick={() => setTextAlign(textAlign === 'left' ? 'center' : textAlign === 'center' ? 'right' : 'left')} sx={{ color: '#888' }}>
                {textAlign === 'left' ? <FormatAlignLeft /> : textAlign === 'center' ? <FormatAlignCenter /> : <FormatAlignRight />}
              </IconButton>
              <FormControlLabel control={<Switch size="small" checked={showVerseNumbers} onChange={(e) => setShowVerseNumbers(e.target.checked)} sx={{ '& .MuiSwitch-switchBase.Mui-checked': { color: '#0088ff' } }} />}
                label={<Typography sx={{ fontSize: '0.7rem', color: '#888' }}>#</Typography>} sx={{ ml: 0.5 }} />
              {subscription?.active && <Chip icon={<Verified sx={{ fontSize: 12 }} />} label="Premium" size="small" sx={{ height: 20, bgcolor: 'rgba(156,39,176,0.15)', color: '#ce93d8' }} />}
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Box sx={{ width: 280, borderRight: '1px solid #2a2a30', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a1f' }}>
          <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} variant="fullWidth"
            sx={{ borderBottom: '1px solid #2a2a30', '& .MuiTabs-indicator': { bgcolor: '#0088ff' }, '& .MuiTab-root': { color: '#888', fontSize: '0.7rem', minHeight: 40, '&.Mui-selected': { color: '#0088ff' } } }}>
            <Tab label="Books" />
            <Tab label={<Badge badgeContent={favorites.length} color="error" max={99}>Fav</Badge>} />
            <Tab label="Recent" />
          </Tabs>

          <Box sx={{ flex: 1, overflow: 'auto', p: 1.5 }}>
            {tabValue === 0 && (
              <>
                <TextField fullWidth size="small" placeholder="Filter..." value={bookFilter} onChange={(e) => setBookFilter(e.target.value)}
                  sx={{ mb: 1 }} InputProps={{ sx: { bgcolor: '#141418', color: '#fff', borderRadius: 1, fontSize: '0.8rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' } } }} />
                <Typography sx={{ color: '#555', fontSize: '0.65rem', fontWeight: 600, px: 1, letterSpacing: 1 }}>OLD TESTAMENT</Typography>
                {filteredBooks.slice(0, 39).map(book => (
                  <Box key={book} onClick={() => { setSelectedBook(book); setReference(`${book} 1:1`); fetchVerse(`${book} 1:1`); addToRecent(`${book} 1:1`); }}
                    sx={{ p: 0.75, mb: 0.25, bgcolor: selectedBook === book ? 'rgba(0,136,255,0.15)' : 'transparent', borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }, borderLeft: selectedBook === book ? '3px solid #0088ff' : '3px solid transparent' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: selectedBook === book ? 600 : 400 }}>{book}</Typography>
                  </Box>
                ))}
                <Typography sx={{ color: '#555', fontSize: '0.65rem', fontWeight: 600, px: 1, letterSpacing: 1, mt: 1 }}>NEW TESTAMENT</Typography>
                {filteredBooks.slice(39).map(book => (
                  <Box key={book} onClick={() => { setSelectedBook(book); setReference(`${book} 1:1`); fetchVerse(`${book} 1:1`); addToRecent(`${book} 1:1`); }}
                    sx={{ p: 0.75, mb: 0.25, bgcolor: selectedBook === book ? 'rgba(0,136,255,0.15)' : 'transparent', borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }, borderLeft: selectedBook === book ? '3px solid #0088ff' : '3px solid transparent' }}>
                    <Typography sx={{ fontSize: '0.8rem', fontWeight: selectedBook === book ? 600 : 400 }}>{book}</Typography>
                  </Box>
                ))}
              </>
            )}
            {tabValue === 1 && (favorites.length === 0 ? <Box sx={{ textAlign: 'center', py: 4 }}><FavoriteBorder sx={{ fontSize: 40, color: '#333' }} /><Typography sx={{ color: '#666', fontSize: '0.8rem' }}>No favorites</Typography></Box> :
              favorites.map(fav => (
                <Box key={fav} sx={{ p: 1, mb: 0.5, bgcolor: '#141418', borderRadius: 1, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', '&:hover': { bgcolor: '#25252a' } }}
                  onClick={() => { setReference(fav); fetchVerse(fav); }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>{fav}</Typography>
                  <IconButton size="small" onClick={(e) => { e.stopPropagation(); toggleFavorite(fav); }}><Favorite sx={{ fontSize: 14, color: '#ff6b6b' }} /></IconButton>
                </Box>
              ))
            )}
            {tabValue === 2 && (recent.length === 0 ? <Box sx={{ textAlign: 'center', py: 4 }}><MenuBook sx={{ fontSize: 40, color: '#333' }} /><Typography sx={{ color: '#666', fontSize: '0.8rem' }}>No recent</Typography></Box> :
              recent.map((rec, i) => (
                <Box key={`${rec}-${i}`} onClick={() => { setReference(rec); fetchVerse(rec); }} sx={{ p: 1, mb: 0.5, bgcolor: '#141418', borderRadius: 1, cursor: 'pointer', '&:hover': { bgcolor: '#25252a' } }}>
                  <Typography sx={{ fontSize: '0.8rem' }}>{rec}</Typography>
                </Box>
              ))
            )}
          </Box>
        </Box>

        {/* Main Display */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {loading && <LinearProgress />}
          {currentVerse ? (
            <>
              <Box sx={{ p: 2, borderBottom: '1px solid #2a2a30', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>{currentVerse.reference}</Typography>
                  <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>{getVersion(selectedVersion)?.name}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Add to presentation"><IconButton sx={{ color: '#0088ff', bgcolor: 'rgba(0,136,255,0.1)' }}><Add /></IconButton></Tooltip>
                  <Tooltip title="Favorite"><IconButton onClick={() => toggleFavorite(currentVerse.reference)} sx={{ color: favorites.includes(currentVerse.reference) ? '#ff6b6b' : '#888' }}>
                    {favorites.includes(currentVerse.reference) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton></Tooltip>
                  <Tooltip title="Copy"><IconButton onClick={() => copyToClipboard(`${currentVerse.reference}\n${currentVerse.verses?.map(v => `${v.verse}. ${v.text}`).join('\n') || ''}`)} sx={{ color: '#888' }}><ContentCopy /></IconButton></Tooltip>
                </Box>
              </Box>
              <Box sx={{ flex: 1, p: 4, overflow: 'auto', textAlign }}>
                <Box sx={{ maxWidth: 800, mx: 'auto' }}>
                  {currentVerse.verses?.map((v, i) => (
                    <Box key={i} sx={{ mb: 2 }}>
                      {showVerseNumbers && <Typography component="sup" sx={{ fontSize: '0.7em', color: '#0088ff', fontWeight: 700, mr: 0.5 }}>{v.verse}</Typography>}
                      <Typography component="span" sx={{ fontSize: `${fontSize}px`, lineHeight: 1.8, fontFamily: '"Merriweather", Georgia, serif' }}>{v.text}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
              {/* Navigation Footer */}
              <Box sx={{ p: 2, borderTop: '1px solid #2a2a30', display: 'flex', justifyContent: 'space-between', alignItems: 'center', bgcolor: '#1a1a1f' }}>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" startIcon={<ArrowBack />} onClick={navigatePreviousChapter} sx={{ color: '#888', fontSize: '0.75rem' }}>Prev Chapter</Button>
                  <Button size="small" startIcon={<ArrowBack />} onClick={navigatePrevious} sx={{ color: '#0088ff', fontSize: '0.75rem' }}>Previous</Button>
                </Box>
                <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>{currentVerse.reference}</Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button size="small" endIcon={<ArrowForward />} onClick={navigateNext} sx={{ color: '#0088ff', fontSize: '0.75rem' }}>Next</Button>
                  <Button size="small" endIcon={<ArrowForward />} onClick={navigateNextChapter} sx={{ color: '#888', fontSize: '0.75rem' }}>Next Chapter</Button>
                </Box>
              </Box>
            </>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <MenuBook sx={{ fontSize: 80, color: '#333', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>Select a Scripture</Typography>
              <Typography sx={{ color: '#555', fontSize: '0.85rem', mb: 3 }}>Enter a reference or browse books</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="outlined" startIcon={<CloudDownload />} onClick={() => setVersionsDialogOpen(true)} sx={{ color: '#0088ff', borderColor: '#0088ff' }}>Manage Versions</Button>
                {!subscription?.active && <Button variant="contained" startIcon={<Subscriptions />} onClick={() => setSubscriptionDialogOpen(true)} sx={{ bgcolor: '#9c27b0', '&:hover': { bgcolor: '#ab47bc' } }}>Go Premium</Button>}
              </Box>
            </Box>
          )}
        </Box>
      </Box>

      {/* Versions Dialog */}
      <Dialog open={versionsDialogOpen} onClose={() => setVersionsDialogOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { bgcolor: '#1a1a1f', color: '#fff', borderRadius: 2, maxHeight: '85vh' } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #2a2a30', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CloudDownload sx={{ color: '#0088ff' }} /><Typography variant="h6">Bible Versions ({BIBLE_VERSIONS_CATALOG.length})</Typography></Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {!subscription?.active && <Button size="small" startIcon={<Subscriptions />} onClick={() => { setVersionsDialogOpen(false); setSubscriptionDialogOpen(true); }} sx={{ bgcolor: '#9c27b0', fontSize: '0.7rem' }}>Go Premium</Button>}
            <IconButton onClick={() => setVersionsDialogOpen(false)} sx={{ color: '#888' }}><Close /></IconButton>
          </Box>
        </DialogTitle>
        <Box sx={{ px: 2, pt: 2, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tabs value={versionTab} onChange={(e, v) => setVersionTab(v)} sx={{ '& .MuiTabs-indicator': { bgcolor: '#0088ff' }, '& .MuiTab-root': { color: '#888', fontSize: '0.75rem', '&.Mui-selected': { color: '#0088ff' } } }}>
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><CheckCircle sx={{ fontSize: 14 }} />Installed ({installedVersions.length})</Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LockOpen sx={{ fontSize: 14 }} />Free ({BIBLE_VERSIONS_CATALOG.filter(v => v.free).length})</Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Lock sx={{ fontSize: 14 }} />Premium ({BIBLE_VERSIONS_CATALOG.filter(v => !v.free).length})</Box>} />
            <Tab label={<Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><Star sx={{ fontSize: 14 }} />Popular</Box>} />
          </Tabs>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} sx={{ bgcolor: '#141418', color: '#fff', fontSize: '0.75rem', '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' } }}>
              <MenuItem value="all">All Languages</MenuItem>
              {languages.map(lang => <MenuItem key={lang} value={lang}>{lang}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
        <DialogContent sx={{ p: 2 }}>
          {versionTab === 0 && installedVersions.map(code => { const v = getVersion(code); return v ? <VersionCard key={code} version={v} /> : null; })}
          {versionTab === 1 && getFilteredVersions().filter(v => v.free).map(v => <VersionCard key={v.code} version={v} />)}
          {versionTab === 2 && getFilteredVersions().filter(v => !v.free).map(v => <VersionCard key={v.code} version={v} />)}
          {versionTab === 3 && getFilteredVersions().filter(v => v.popular).map(v => <VersionCard key={v.code} version={v} />)}
        </DialogContent>
      </Dialog>

      {/* Purchase Dialog */}
      <Dialog open={purchaseDialogOpen} onClose={() => setPurchaseDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1a1a1f', color: '#fff', borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #2a2a30' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ShoppingCart sx={{ color: '#9c27b0' }} /><Typography variant="h6">Purchase Bible Version</Typography></Box>
        </DialogTitle>
        {selectedPurchaseVersion && (
          <DialogContent sx={{ pt: 3 }}>
            <Paper sx={{ p: 2, bgcolor: '#141418', borderRadius: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>{selectedPurchaseVersion.name}</Typography>
              <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>{selectedPurchaseVersion.description}</Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Chip label={selectedPurchaseVersion.language} size="small" />
                <Chip label={selectedPurchaseVersion.size} size="small" />
                {selectedPurchaseVersion.publisher && <Chip label={selectedPurchaseVersion.publisher} size="small" />}
              </Box>
            </Paper>
            <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>Choose your purchase option:</Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column' }}>
              <Button variant="contained" startIcon={<CreditCard />} onClick={() => handlePurchase(selectedPurchaseVersion)}
                sx={{ bgcolor: '#9c27b0', py: 1.5, justifyContent: 'space-between', '&:hover': { bgcolor: '#ab47bc' } }}>
                <span>Buy Once - Lifetime Access</span>
                <Typography sx={{ fontWeight: 700 }}>${selectedPurchaseVersion.price}</Typography>
              </Button>
              {selectedPurchaseVersion.priceMonthly && (
                <Button variant="outlined" onClick={() => { setPurchaseDialogOpen(false); setSubscriptionDialogOpen(true); }}
                  sx={{ borderColor: '#9c27b0', color: '#ce93d8', py: 1.5, justifyContent: 'space-between' }}>
                  <span>Or subscribe for all premium versions</span>
                  <Typography sx={{ fontWeight: 700 }}>From $4.99/mo</Typography>
                </Button>
              )}
            </Box>
          </DialogContent>
        )}
        <DialogActions sx={{ p: 2, borderTop: '1px solid #2a2a30' }}>
          <Button onClick={() => setPurchaseDialogOpen(false)} sx={{ color: '#888' }}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Subscription Dialog */}
      <Dialog open={subscriptionDialogOpen} onClose={() => setSubscriptionDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#1a1a1f', color: '#fff', borderRadius: 2 } }}>
        <DialogTitle sx={{ borderBottom: '1px solid #2a2a30', textAlign: 'center' }}>
          <Subscriptions sx={{ fontSize: 40, color: '#9c27b0', mb: 1 }} />
          <Typography variant="h5">Worshipress Premium</Typography>
          <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Unlock all {BIBLE_VERSIONS_CATALOG.filter(v => !v.free).length}+ premium Bible versions</Typography>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Paper sx={{ flex: 1, p: 2, bgcolor: '#141418', borderRadius: 2, border: '1px solid #2a2a30', textAlign: 'center' }}>
              <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 1 }}>MONTHLY</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>$4.99</Typography>
              <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>per month</Typography>
              <Button fullWidth variant="outlined" onClick={() => handleSubscribe('monthly')} sx={{ mt: 2, borderColor: '#9c27b0', color: '#ce93d8' }}>Subscribe</Button>
            </Paper>
            <Paper sx={{ flex: 1, p: 2, bgcolor: 'rgba(156,39,176,0.1)', borderRadius: 2, border: '2px solid #9c27b0', textAlign: 'center', position: 'relative' }}>
              <Chip label="SAVE 40%" size="small" sx={{ position: 'absolute', top: -10, right: 10, bgcolor: '#ff9800', color: '#000', fontWeight: 700, fontSize: '0.65rem' }} />
              <Typography sx={{ color: '#888', fontSize: '0.75rem', mb: 1 }}>YEARLY</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>$35.99</Typography>
              <Typography sx={{ color: '#666', fontSize: '0.75rem' }}>per year ($3/mo)</Typography>
              <Button fullWidth variant="contained" onClick={() => handleSubscribe('yearly')} sx={{ mt: 2, bgcolor: '#9c27b0', '&:hover': { bgcolor: '#ab47bc' } }}>Subscribe</Button>
            </Paper>
          </Box>
          <Typography sx={{ color: '#888', fontSize: '0.8rem', textAlign: 'center' }}>✓ All premium versions ✓ Study Bibles ✓ Offline access ✓ Cancel anytime</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #2a2a30', justifyContent: 'center' }}>
          <Button onClick={() => setSubscriptionDialogOpen(false)} sx={{ color: '#888' }}>Maybe Later</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default BibleManager;
