import React, { useState, useEffect, useRef } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  InputAdornment,
  Tooltip,
  Fade,
  Paper
} from '@mui/material';
import {
  FontDownload as FontDownloadIcon,
  TextFieldsRounded,
  ExpandMore as ExpandMoreIcon,
  Search as SearchIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const FontDropdown = ({ onFontSelect, selectedFont = 'Arial' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fonts, setFonts] = useState([]);
  const [filteredFonts, setFilteredFonts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customFonts, setCustomFonts] = useState([]);
  const [favorites, setFavorites] = useState(['Arial', 'Helvetica', 'Times New Roman']);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const fileInputRef = useRef(null);
  const searchInputRef = useRef(null);

  // Sample text for font preview
  const sampleText = "WorshipRess";
  const extendedSample = "The quick brown fox jumps over the lazy dog. 1234567890";

  // System fonts (common web-safe fonts)
  const systemFonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia', 'Verdana', 'Courier New',
    'Trebuchet MS', 'Arial Black', 'Impact', 'Lucida Sans', 'Tahoma', 'Geneva',
    'Palatino', 'Bookman', 'Comic Sans MS', 'Candara', 'Calibri', 'Cambria',
    'Consolas', 'Constantia', 'Corbel', 'Franklin Gothic', 'Gabriola', 'Garamond',
    'Segoe UI', 'Segoe Print', 'Segoe Script'
  ];

  // Load custom fonts and favorites from localStorage on mount
  useEffect(() => {
    const savedCustomFonts = localStorage.getItem('customFonts');
    if (savedCustomFonts) {
      const parsed = JSON.parse(savedCustomFonts);
      setCustomFonts(parsed);
      // Combine system and custom fonts
      const allFonts = [...systemFonts, ...parsed.map(f => f.name)];
      setFonts(allFonts);
      setFilteredFonts(allFonts);
    } else {
      setFonts(systemFonts);
      setFilteredFonts(systemFonts);
    }

    const savedFavorites = localStorage.getItem('fontFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []); // Empty dependency - only run on mount

  // Update fonts list when customFonts changes (after upload)
  useEffect(() => {
    const allFonts = [...systemFonts, ...customFonts.map(f => f.name)];
    setFonts(allFonts);
    setFilteredFonts(allFonts);
  }, [customFonts]);

  useEffect(() => {
    // Filter fonts based on search query
    const filtered = fonts.filter(font =>
      font.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFonts(filtered);
  }, [searchQuery, fonts]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    // Focus search input when menu opens
    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }, 100);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSearchQuery('');
  };

  const handleFontSelect = (font) => {
    onFontSelect(font);
    handleClose();
  };

  const handleToggleFavorite = (font, event) => {
    event.stopPropagation();
    const newFavorites = favorites.includes(font)
      ? favorites.filter(f => f !== font)
      : [...favorites, font];

    setFavorites(newFavorites);
    localStorage.setItem('fontFavorites', JSON.stringify(newFavorites));
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const fontFiles = files.filter(file =>
      file.type === 'font/ttf' ||
      file.type === 'font/otf' ||
      file.name.toLowerCase().endsWith('.ttf') ||
      file.name.toLowerCase().endsWith('.otf')
    );

    fontFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fontData = e.target.result;
        const fontName = file.name.replace(/\.(ttf|otf)$/i, '');

        // Create font face
        const fontFace = new FontFace(fontName, fontData);
        fontFace.load().then((loadedFace) => {
          document.fonts.add(loadedFace);
          console.log(`Font "${fontName}" loaded successfully`);

          const newCustomFont = {
            name: fontName,
            data: fontData,
            fileName: file.name,
            uploadedAt: new Date().toISOString()
          };

          const updatedCustomFonts = [...customFonts, newCustomFont];
          setCustomFonts(updatedCustomFonts);
          localStorage.setItem('customFonts', JSON.stringify(updatedCustomFonts));

          // Add to favorites automatically
          if (!favorites.includes(fontName)) {
            const newFavorites = [...favorites, fontName];
            setFavorites(newFavorites);
            localStorage.setItem('fontFavorites', JSON.stringify(newFavorites));
          }

          // Show success message
          setTimeout(() => {
            alert(`Font "${fontName}" installed successfully!`);
          }, 100);
        }).catch(err => {
          console.error('Error loading font:', err);
          alert(`Failed to install font "${fontName}". Please make sure it's a valid TTF or OTF file.`);
        });
      };
      reader.readAsArrayBuffer(file);
    });

    setUploadDialogOpen(false);
  };

  const handleDeleteCustomFont = (fontName, event) => {
    event.stopPropagation();
    const updatedCustomFonts = customFonts.filter(f => f.name !== fontName);
    setCustomFonts(updatedCustomFonts);
    localStorage.setItem('customFonts', JSON.stringify(updatedCustomFonts));

    // Remove from favorites if it's there
    const newFavorites = favorites.filter(f => f !== fontName);
    setFavorites(newFavorites);
    localStorage.setItem('fontFavorites', JSON.stringify(newFavorites));
  };

  const isCustomFont = (fontName) => {
    return customFonts.some(f => f.name === fontName);
  };

  const isFavorite = (fontName) => {
    return favorites.includes(fontName);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          flex: 1,
          minWidth: 60,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 0.75,
          px: 0.5,
          color: '#cccccc',
          backgroundColor: 'transparent',
          border: 'none',
          borderRadius: 0,
          textTransform: 'none',
          fontSize: '0.7rem',
          position: 'relative',
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.08)',
            '& .font-preview': {
              opacity: 1
            }
          }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <TextFieldsRounded fontSize="large" sx={{ mb: 0.25 }} />
          <ExpandMoreIcon fontSize="small" sx={{ mb: 0.25 }} />
        </Box>
        <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.25 }}>
          Fonts
        </Typography>
        <Typography
          className="font-preview"
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.7rem',
            fontFamily: selectedFont,
            color: '#81c784',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            fontWeight: 'bold',
            textShadow: '0 0 4px rgba(129, 199, 132, 0.5)'
          }}
        >
          {selectedFont}
        </Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d30',
            color: '#cccccc',
            borderRadius: 1,
            border: '1px solid #3e3e42',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            minWidth: 320,
            maxWidth: 400,
            maxHeight: 500,
            overflow: 'hidden'
          }
        }}
        TransitionComponent={Fade}
        transitionDuration={200}
      >
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid #3e3e42' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              Font Library
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Upload Font">
                <IconButton
                  size="small"
                  onClick={() => setUploadDialogOpen(true)}
                  sx={{ color: '#81c784' }}
                >
                  <UploadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Search */}
          <TextField
            inputRef={searchInputRef}
            fullWidth
            size="small"
            placeholder="Search fonts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: '#cccccc' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: '#1e1e1e',
                color: '#cccccc',
                '& fieldset': {
                  borderColor: '#3e3e42'
                },
                '&:hover fieldset': {
                  borderColor: '#569cd6'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#569cd6'
                }
              }
            }}
          />
        </Box>

        {/* Font List */}
        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {/* Favorites Section */}
          {favorites.length > 0 && !searchQuery && (
            <>
              <Box sx={{ px: 2, py: 1, backgroundColor: alpha('#569cd6', 0.1) }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: '#569cd6', fontWeight: 600 }}>
                  ⭐ Favorites
                </Typography>
              </Box>
              {favorites.map((font) => (
                <MenuItem
                  key={`fav-${font}`}
                  onClick={() => handleFontSelect(font)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderBottom: '1px solid #252526',
                    backgroundColor: font === selectedFont ? alpha('#569cd6', 0.2) : 'transparent',
                    '&:hover': {
                      backgroundColor: alpha('#569cd6', 0.1)
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: font,
                          fontSize: '1.1rem',
                          color: '#cccccc',
                          mb: 0.5
                        }}
                      >
                        {sampleText}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: font,
                          fontSize: '0.8rem',
                          color: '#808080',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {font}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleToggleFavorite(font, e)}
                        sx={{ color: '#569cd6', p: 0.5 }}
                      >
                        <StarIcon fontSize="small" />
                      </IconButton>
                      {isCustomFont(font) && (
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteCustomFont(font, e)}
                          sx={{ color: '#f44747', p: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </MenuItem>
              ))}
              <Divider sx={{ bgcolor: '#3e3e42', my: 1 }} />
            </>
          )}

          {/* Custom Fonts Section */}
          {customFonts.length > 0 && !searchQuery && (
            <>
              <Box sx={{ px: 2, py: 1, backgroundColor: alpha('#4ec9b0', 0.1) }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: '#4ec9b0', fontWeight: 600 }}>
                  📁 Custom Fonts
                </Typography>
              </Box>
              {customFonts
                .filter(font => !favorites.includes(font.name))
                .map((font) => (
                  <MenuItem
                    key={`custom-${font.name}`}
                    onClick={() => handleFontSelect(font.name)}
                    sx={{
                      py: 1.5,
                      px: 2,
                      borderBottom: '1px solid #252526',
                      backgroundColor: font.name === selectedFont ? alpha('#4ec9b0', 0.2) : 'transparent',
                      '&:hover': {
                        backgroundColor: alpha('#4ec9b0', 0.1)
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          sx={{
                            fontFamily: font.name,
                            fontSize: '1.1rem',
                            color: '#cccccc',
                            mb: 0.5
                          }}
                        >
                          {sampleText}
                        </Typography>
                        <Typography
                          sx={{
                            fontFamily: font.name,
                            fontSize: '0.8rem',
                            color: '#808080',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {font.name}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton
                          size="small"
                          onClick={(e) => handleToggleFavorite(font.name, e)}
                          sx={{ color: '#569cd6', p: 0.5 }}
                        >
                          <StarBorderIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={(e) => handleDeleteCustomFont(font.name, e)}
                          sx={{ color: '#f44747', p: 0.5 }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              <Divider sx={{ bgcolor: '#3e3e42', my: 1 }} />
            </>
          )}

          {/* System Fonts */}
          <Box sx={{ px: 2, py: 1, backgroundColor: alpha('#cccccc', 0.1) }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: '#cccccc', fontWeight: 600 }}>
              🔤 System Fonts
            </Typography>
          </Box>
          {filteredFonts
            .filter(font => !favorites.includes(font) && !customFonts.some(cf => cf.name === font))
            .map((font) => (
              <MenuItem
                key={font}
                onClick={() => handleFontSelect(font)}
                sx={{
                  py: 1.5,
                  px: 2,
                  borderBottom: '1px solid #252526',
                  backgroundColor: font === selectedFont ? alpha('#cccccc', 0.2) : 'transparent',
                  '&:hover': {
                    backgroundColor: alpha('#cccccc', 0.1)
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 1 }}>
                  <Typography
                    sx={{
                      fontFamily: font,
                      fontSize: '1.1rem',
                      flex: 1,
                      color: '#cccccc'
                    }}
                  >
                    {sampleText}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleToggleFavorite(font, e)}
                    sx={{ color: '#569cd6', p: 0.5 }}
                  >
                    <StarBorderIcon fontSize="small" />
                  </IconButton>
                </Box>
              </MenuItem>
            ))}
        </Box>

        {/* Footer */}
        <Box sx={{ p: 1, borderTop: '1px solid #3e3e42', backgroundColor: '#252526' }}>
          <Typography variant="caption" sx={{ color: '#808080', fontSize: '0.7rem' }}>
            Current: <span style={{ color: '#cccccc', fontFamily: selectedFont }}>{selectedFont}</span>
          </Typography>
        </Box>
      </Menu>

      {/* Upload Dialog */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d30',
            color: '#cccccc',
            minWidth: 400
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #3e3e42' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FontDownloadIcon />
            Upload Fonts
          </Box>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <Typography variant="body2" sx={{ mb: 2, color: '#cccccc' }}>
            Upload OTF or TTF font files. Fonts will be available immediately and saved locally.
          </Typography>

          <Box
            sx={{
              border: '2px dashed #3e3e42',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
              cursor: 'pointer',
              '&:hover': {
                borderColor: '#569cd6',
                backgroundColor: alpha('#569cd6', 0.05)
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadIcon sx={{ fontSize: 48, color: '#569cd6', mb: 1 }} />
            <Typography variant="h6" sx={{ color: '#cccccc', mb: 1 }}>
              Click to Upload Fonts
            </Typography>
            <Typography variant="body2" sx={{ color: '#808080' }}>
              Supports OTF and TTF files
            </Typography>
          </Box>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".ttf,.otf,font/ttf,font/otf"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />
        </DialogContent>
        <DialogActions sx={{ borderTop: '1px solid #3e3e42' }}>
          <Button onClick={() => setUploadDialogOpen(false)} sx={{ color: '#cccccc' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default FontDropdown;