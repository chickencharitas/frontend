/**
 * Theme Templates Component
 * 8 professional color and typography themes
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  IconButton,
  Stack,
  Tooltip,
  Button as MuiButton
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ContentCopy as DuplicateIcon,
  Check as ApplyIcon,
  Palette as PaletteIcon,
  Download as DownloadIcon
} from '@mui/icons-material';
import { themeTemplates } from './data/templateData';

const ThemeTemplates = ({ onTemplateSelect, onThemeApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favoriteThemeTemplates') || '[]')
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [appliedTheme, setAppliedTheme] = useState(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return themeTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = ['All', ...new Set(themeTemplates.map(t => t.category))];

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoriteThemeTemplates', JSON.stringify(updated));
  };

  // Apply theme
  const handleApplyTheme = (template) => {
    setAppliedTheme(template.id);
    localStorage.setItem('currentTheme', JSON.stringify(template));
    onThemeApply?.(template);
    setTimeout(() => setAppliedTheme(null), 2000);
  };

  // Template Card Component
  const ThemeCard = ({ template }) => (
    <Paper
      sx={{
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        '&:hover': {
          border: '2px solid ' + template.colors.accent,
          transform: 'translateY(-6px)',
          boxShadow: `0 12px 32px ${template.colors.accent}30`
        }
      }}
      onClick={() => {
        setSelectedTemplate(template);
        setPreviewOpen(true);
        onTemplateSelect?.(template);
      }}
    >
      {/* Color Preview */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: 80 }}>
        {Object.values(template.colors).map((color, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: color,
              transition: 'transform 0.2s ease',
              '&:hover': {
                transform: 'scale(1.05)'
              }
            }}
            title={color}
          />
        ))}
      </Box>

      {/* Template Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {template.name}
        </Typography>
        <Typography variant="caption" sx={{ color: template.colors.accent, mb: 1, display: 'block' }}>
          {template.category}
        </Typography>

        {/* Font Info */}
        <Typography variant="caption" sx={{ color: '#808080', display: 'block', mb: 1 }}>
          Heading: {template.fonts.heading.split(',')[0]}
        </Typography>

        {/* Tags */}
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
          {template.tags.slice(0, 2).map(tag => (
            <Chip
              key={tag}
              label={tag}
              size="small"
              sx={{
                height: 18,
                fontSize: '9px',
                backgroundColor: template.colors.secondary,
                color: template.colors.text
              }}
            />
          ))}
        </Box>

        {/* Actions */}
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={favorites.includes(template.id) ? 'Remove favorite' : 'Add favorite'}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(template.id);
              }}
              sx={{ color: favorites.includes(template.id) ? '#ff5722' : '#808080' }}
            >
              {favorites.includes(template.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Apply Theme">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleApplyTheme(template);
              }}
              sx={{
                color: appliedTheme === template.id ? template.colors.accent : '#64b5f6'
              }}
            >
              {appliedTheme === template.id ? <ApplyIcon /> : <PaletteIcon />}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* Applied Badge */}
      {appliedTheme === template.id && (
        <Chip
          label="Applied"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: template.colors.accent,
            color: '#000',
            fontWeight: 600
          }}
        />
      )}
    </Paper>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Theme Templates
        </Typography>

        {/* Search and Controls */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search by name or tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#81c784' }
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: '#808080',
                opacity: 1
              }
            }}
          />

          {/* Results count */}
          <Typography variant="caption" sx={{ color: '#808080' }}>
            {filteredTemplates.length} themes available
          </Typography>
        </Stack>

        {/* Category Filter */}
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
          {categories.map(cat => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                backgroundColor: selectedCategory === cat ? '#81c784' : '#2d2d2e',
                color: selectedCategory === cat ? '#000' : '#ffffff',
                cursor: 'pointer',
                fontWeight: selectedCategory === cat ? 600 : 400,
                '&:hover': {
                  backgroundColor: selectedCategory === cat ? '#66bb6a' : '#404040'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Themes Grid */}
      {filteredTemplates.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTemplates.map(template => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
              <ThemeCard template={template} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#808080', mb: 1 }}>
            No themes found.
          </Typography>
          <Typography variant="caption" sx={{ color: '#606060' }}>
            Try a different search or category.
          </Typography>
        </Box>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600 }}>
          {selectedTemplate?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedTemplate && (
            <Stack spacing={3}>
              {/* Full Color Palette */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Color Palette
                </Typography>
                <Grid container spacing={1}>
                  {Object.entries(selectedTemplate.colors).map(([name, color]) => (
                    <Grid item xs={6} sm={4} key={name}>
                      <Paper
                        sx={{
                          height: 100,
                          backgroundColor: color,
                          border: '2px solid #404040',
                          display: 'flex',
                          alignItems: 'flex-end',
                          p: 1,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'scale(1.05)',
                            boxShadow: `0 4px 12px ${color}40`
                          }
                        }}
                        onClick={() => navigator.clipboard.writeText(color)}
                      >
                        <Stack sx={{ width: '100%' }}>
                          <Typography
                            variant="caption"
                            sx={{
                              color: color === '#ffffff' ? '#000' : '#ffffff',
                              fontWeight: 600,
                              textTransform: 'capitalize'
                            }}
                          >
                            {name}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: color === '#ffffff' ? '#000' : '#ffffff',
                              opacity: 0.8
                            }}
                          >
                            {color}
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              {/* Typography */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                  Typography
                </Typography>
                <Stack spacing={2} sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#808080', display: 'block', mb: 0.5 }}>
                      Heading Font
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontFamily: selectedTemplate.fonts.heading,
                        fontWeight: 600
                      }}
                    >
                      Sample Heading
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#808080', display: 'block', mb: 0.5 }}>
                      Body Font
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: selectedTemplate.fonts.body
                      }}
                    >
                      This is sample body text using the theme's body font family.
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: '#808080', display: 'block', mb: 0.5 }}>
                      Accent Font
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: selectedTemplate.fonts.accent,
                        color: selectedTemplate.colors.accent
                      }}
                    >
                      Elegant Accent Text
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Info */}
              <Stack spacing={1} sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    Category
                  </Typography>
                  <Typography variant="body2">{selectedTemplate.category}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    Tags
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                    {selectedTemplate.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Box>
                </Box>
              </Stack>
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleApplyTheme(selectedTemplate);
              setPreviewOpen(false);
            }}
            sx={{
              background: selectedTemplate.colors.accent,
              color: '#000'
            }}
          >
            Apply Theme
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ThemeTemplates;
