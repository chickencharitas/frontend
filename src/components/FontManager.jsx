/**
 * Font Management System
 * Supports Google Fonts, System Fonts, and Custom Uploads
 */

import React, { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
  Alert,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Input,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
  CloudUpload as CloudUploadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { getInvokeFunction } from '../utils/mockDevices';

export default function FontManager() {
  const [tabValue, setTabValue] = useState(0);
  const [systemFonts, setSystemFonts] = useState([]);
  const [googleFonts, setGoogleFonts] = useState([]);
  const [customFonts, setCustomFonts] = useState([]);
  const [selectedFonts, setSelectedFonts] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [invoke] = useState(() => getInvokeFunction());

  // Load system fonts (Tauri/Electron only)
  useEffect(() => {
    loadSystemFonts();
    loadCustomFonts();
  }, []);

  const loadSystemFonts = async () => {
    setLoading(true);
    try {
      // In Tauri, this would call the Rust backend
      // For now, use fallback system fonts
      const fonts = [
        'Arial',
        'Times New Roman',
        'Courier New',
        'Georgia',
        'Verdana',
        'Trebuchet MS',
        'Comic Sans MS',
        'Impact',
        'Segoe UI',
        'Calibri',
        'Consolas',
        'Garamond',
        'Palatino',
      ];
      setSystemFonts(fonts.sort());
    } catch (err) {
      setError('Failed to load system fonts');
    } finally {
      setLoading(false);
    }
  };

  const loadGoogleFonts = async (query = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC4J0j8e0KJjKJmKBQ9k6pO6IxVQq_7z_4&sort=popularity`
      );
      const data = await response.json();
      let fonts = data.items || [];

      if (query) {
        fonts = fonts.filter((f) => f.family.toLowerCase().includes(query.toLowerCase()));
      }

      setGoogleFonts(fonts.slice(0, 50)); // Limit to 50 most popular
    } catch (err) {
      setError('Failed to load Google Fonts');
    } finally {
      setLoading(false);
    }
  };

  const loadCustomFonts = async () => {
    try {
      const fonts = JSON.parse(localStorage.getItem('customFonts') || '[]');
      setCustomFonts(fonts);
      
      // Recreate font-face rules for custom fonts
      fonts.forEach(font => {
        if (font.base64Data) {
          const fontFace = `
            @font-face {
              font-family: "${font.name}";
              src: url('data:font/ttf;base64,${font.base64Data}') format('truetype');
            }
          `;
          
          const style = document.createElement('style');
          style.textContent = fontFace;
          style.setAttribute('data-font-id', font.id);
          document.head.appendChild(style);
        }
      });
    } catch (err) {
      console.error('Failed to load custom fonts:', err);
    }
  };

  const handleFontUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['font/ttf', 'font/otf', 'application/octet-stream'].includes(file.type) &&
        !['.ttf', '.otf', '.woff', '.woff2'].some(ext => file.name.endsWith(ext))) {
      setError('Invalid font file. Supports: TTF, OTF, WOFF, WOFF2');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fontData = event.target?.result;
        const fontName = file.name.replace(/\.[^.]+$/, '');

        // Create @font-face rule
        const fontFace = `
          @font-face {
            font-family: "${fontName}";
            src: url('data:font/ttf;base64,${btoa(String.fromCharCode(...new Uint8Array(fontData)))}') format('truetype');
          }
        `;

        // Add to document
        const style = document.createElement('style');
        style.textContent = fontFace;
        style.setAttribute('data-font-id', newFont.id);
        document.head.appendChild(style);

        // Save to custom fonts
        const base64Data = btoa(String.fromCharCode(...new Uint8Array(fontData)));
        const newFont = {
          id: `custom_${Date.now()}`,
          name: fontName,
          family: fontName,
          file: file.name,
          uploadedAt: new Date().toISOString(),
          category: 'custom',
          base64Data: base64Data, // Store the actual font data
        };

        const updated = [...customFonts, newFont];
        setCustomFonts(updated);
        localStorage.setItem('customFonts', JSON.stringify(updated));

        setError(null);
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Failed to upload font: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadGoogleFont = async (font) => {
    setLoading(true);
    try {
      // Load font from Google Fonts
      const link = document.createElement('link');
      link.href = `https://fonts.googleapis.com/css2?family=${font.family.replace(/ /g, '+')}`;
      link.rel = 'stylesheet';
      document.head.appendChild(link);

      const newFont = {
        id: `google_${font.family}`,
        name: font.family,
        family: font.family,
        category: font.category,
        variants: font.variants,
        source: 'Google Fonts',
      };

      const updated = [...customFonts, newFont];
      setCustomFonts(updated);
      localStorage.setItem('customFonts', JSON.stringify(updated));

      setSelectedFonts(new Set([...selectedFonts, newFont.id]));
      setError(null);
    } catch (err) {
      setError('Failed to download font');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFont = (fontId) => {
    // Remove the style element from DOM
    const styleElement = document.querySelector(`[data-font-id="${fontId}"]`);
    if (styleElement) {
      styleElement.remove();
    }
    
    const updated = customFonts.filter((f) => f.id !== fontId);
    setCustomFonts(updated);
    localStorage.setItem('customFonts', JSON.stringify(updated));
    setSelectedFonts((prev) => {
      const newSet = new Set(prev);
      newSet.delete(fontId);
      return newSet;
    });
  };

  const handleSelectFont = (fontId) => {
    const newSet = new Set(selectedFonts);
    if (newSet.has(fontId)) {
      newSet.delete(fontId);
    } else {
      newSet.add(fontId);
    }
    setSelectedFonts(newSet);
  };

  const filteredSystemFonts = systemFonts.filter((f) =>
    f.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGoogleFonts = googleFonts.filter((f) =>
    f.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ p: 3, backgroundColor: '#1a1a1a', minHeight: '100vh', color: '#e0e0e0' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#81c784' }}>
        Font Manager
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        sx={{
          borderBottom: '1px solid #3c3c3d',
          mb: 3,
          '& .MuiTab-root': { color: '#9e9e9e' },
          '& .Mui-selected': { color: '#81c784' },
          '& .MuiTabs-indicator': { backgroundColor: '#81c784' },
        }}
      >
        <Tab label="System Fonts" />
        <Tab label="Google Fonts" />
        <Tab label="Custom Fonts" />
      </Tabs>

      {/* System Fonts Tab */}
      {tabValue === 0 && (
        <Box>
          <TextField
            placeholder="Search system fonts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: '#9e9e9e' }} />,
            }}
            sx={{
              mb: 3,
              backgroundColor: '#252526',
              borderRadius: 1,
              '& .MuiOutlinedInput-root': {
                color: '#e0e0e0',
                '& fieldset': { borderColor: '#3c3c3d' },
                '&:hover fieldset': { borderColor: '#81c784' },
              },
            }}
            fullWidth
          />

          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {filteredSystemFonts.map((font) => (
                <Grid item xs={12} sm={6} md={4} key={font}>
                  <Card
                    sx={{
                      backgroundColor: '#252526',
                      cursor: 'pointer',
                      border: selectedFonts.has(font) ? '2px solid #81c784' : '1px solid #3c3c3d',
                      '&:hover': { borderColor: '#81c784' },
                    }}
                    onClick={() => handleSelectFont(font)}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1" sx={{ fontFamily: font }}>
                          {font}
                        </Typography>
                        {selectedFonts.has(font) && <CheckIcon sx={{ color: '#81c784' }} />}
                      </Box>
                      <Typography variant="caption" sx={{ color: '#9e9e9e', fontFamily: font }}>
                        The quick brown fox jumps over the lazy dog
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Google Fonts Tab */}
      {tabValue === 1 && (
        <Box>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              placeholder="Search Google Fonts..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                loadGoogleFonts(e.target.value);
              }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: '#9e9e9e' }} />,
              }}
              sx={{
                flex: 1,
                backgroundColor: '#252526',
                borderRadius: 1,
                '& .MuiOutlinedInput-root': {
                  color: '#e0e0e0',
                  '& fieldset': { borderColor: '#3c3c3d' },
                  '&:hover fieldset': { borderColor: '#81c784' },
                },
              }}
            />
          </Box>

          {loading ? (
            <CircularProgress />
          ) : (
            <Grid container spacing={2}>
              {filteredGoogleFonts.map((font) => (
                <Grid item xs={12} sm={6} md={4} key={font.family}>
                  <Card
                    sx={{
                      backgroundColor: '#252526',
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{font.family}</Typography>
                      <Typography variant="caption" sx={{ color: '#9e9e9e' }}>
                        {font.category} • {font.variants?.length || 0} variants
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={() => handleDownloadGoogleFont(font)}
                        sx={{ color: '#81c784' }}
                      >
                        Download
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Custom Fonts Tab */}
      {tabValue === 2 && (
        <Box>
          <Box sx={{ mb: 3 }}>
            <Button
              variant="contained"
              component="label"
              startIcon={<CloudUploadIcon />}
              sx={{
                backgroundColor: '#81c784',
                color: '#000',
                '&:hover': { backgroundColor: '#66bb6a' },
              }}
            >
              Upload Font
              <Input
                type="file"
                hidden
                onChange={handleFontUpload}
                inputProps={{
                  accept: '.ttf,.otf,.woff,.woff2',
                }}
              />
            </Button>
          </Box>

          {customFonts.length === 0 ? (
            <Alert>No custom fonts uploaded yet. Upload TTF, OTF, WOFF, or WOFF2 files.</Alert>
          ) : (
            <List>
              {customFonts.map((font) => (
                <Card key={font.id} sx={{ mb: 1, backgroundColor: '#252526' }}>
                  <ListItem>
                    <ListItemIcon>
                      {selectedFonts.has(font.id) && <CheckIcon sx={{ color: '#81c784' }} />}
                    </ListItemIcon>
                    <ListItemText
                      primary={font.name}
                      secondary={`${font.source || 'Custom'} • ${new Date(font.uploadedAt).toLocaleDateString()}`}
                      onClick={() => handleSelectFont(font.id)}
                      sx={{ cursor: 'pointer' }}
                    />
                    <IconButton
                      edge="end"
                      onClick={() => handleDeleteFont(font.id)}
                      sx={{ color: '#f44336' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                </Card>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Selected Fonts Summary */}
      {selectedFonts.size > 0 && (
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#252526', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Selected Fonts ({selectedFonts.size}):
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {Array.from(selectedFonts).map((fontId) => {
              const font = [...customFonts, ...systemFonts.map((f) => ({ id: f, name: f }))]
                .find((f) => f.id === fontId || f.name === fontId);
              return (
                <Chip
                  key={fontId}
                  label={font?.name || fontId}
                  onDelete={() => handleSelectFont(fontId)}
                  sx={{ backgroundColor: '#3c3c3d', color: '#81c784' }}
                />
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}
