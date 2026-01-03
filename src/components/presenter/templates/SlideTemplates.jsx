/**
 * Slide Templates Component
 * 14 professional pre-designed slide layouts
 */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Paper,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Rating,
  IconButton,
  Stack,
  Tooltip
} from '@mui/material';
import {
  GridView as GridViewIcon,
  ViewAgenda as ListViewIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ContentCopy as DuplicateIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon
} from '@mui/icons-material';
import { slideTemplates } from './data/templateData';

const SlideTemplates = ({ onTemplateSelect, onTemplateApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favoriteSlideTemplates') || '[]')
  );
  const [viewMode, setViewMode] = useState('grid');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return slideTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = ['All', ...new Set(slideTemplates.map(t => t.category))];

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoriteSlideTemplates', JSON.stringify(updated));
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
    onTemplateSelect?.(template);
  };

  // Template Card Component
  const TemplateCard = ({ template }) => (
    <Paper
      sx={{
        p: 2,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        '&:hover': {
          border: '2px solid #81c784',
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(129, 199, 132, 0.3)'
        }
      }}
      onClick={() => handleSelectTemplate(template)}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          width: '100%',
          paddingBottom: '75%',
          position: 'relative',
          mb: 1,
          border: '1px solid #404040',
          borderRadius: 1,
          overflow: 'hidden',
          background: template.preview.bgColor || '#1a1a1a'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: template.preview.bgColor ? '#ffffff' : '#81c784',
            fontSize: '12px',
            textAlign: 'center',
            p: 1
          }}
        >
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {template.category}
          </Typography>
        </Box>
      </Box>

      {/* Template Info */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {template.name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#81c784', mb: 1 }}>
        {template.category}
      </Typography>

      {/* Tags */}
      <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {template.tags.slice(0, 2).map(tag => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              height: 20,
              fontSize: '10px',
              backgroundColor: '#2d2d2e',
              color: '#81c784'
            }}
          />
        ))}
      </Box>

      {/* Actions */}
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <Tooltip title={favorites.includes(template.id) ? 'Remove favorite' : 'Add favorite'}>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(template.id);
            }}
            sx={{
              color: favorites.includes(template.id) ? '#ff5722' : '#808080'
            }}
          >
            {favorites.includes(template.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Preview">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedTemplate(template);
              setPreviewOpen(true);
            }}
            sx={{ color: '#81c784' }}
          >
            <ZoomInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Duplicate">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onTemplateApply?.(template, 'duplicate');
            }}
            sx={{ color: '#64b5f6' }}
          >
            <DuplicateIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Featured badge */}
      {template.featured && (
        <Chip
          label="Featured"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: '#ff9800',
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
          Slide Templates
        </Typography>

        {/* Search and Controls */}
        <Stack spacing={2} sx={{ mb: 2 }}>
          <TextField
            placeholder="Search templates by name or tag..."
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

          {/* View Mode Toggle */}
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ color: '#808080' }}>
                View:
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={(e, mode) => mode && setViewMode(mode)}
                size="small"
                sx={{ ml: 1 }}
              >
                <ToggleButton value="grid" sx={{ color: '#81c784' }}>
                  <GridViewIcon />
                </ToggleButton>
                <ToggleButton value="list" sx={{ color: '#81c784' }}>
                  <ListViewIcon />
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Results count */}
            <Typography variant="caption" sx={{ color: '#808080' }}>
              {filteredTemplates.length} results
            </Typography>
          </Stack>
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
                '&:hover': {
                  backgroundColor: selectedCategory === cat ? '#66bb6a' : '#404040'
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Templates Grid/List */}
      {filteredTemplates.length > 0 ? (
        <Grid
          container
          spacing={2}
          sx={{
            gridTemplateColumns: viewMode === 'grid'
              ? 'repeat(auto-fill, minmax(180px, 1fr))'
              : '1fr'
          }}
        >
          {filteredTemplates.map(template => (
            <Grid item xs={viewMode === 'grid' ? undefined : 12} key={template.id}>
              <TemplateCard template={template} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography sx={{ color: '#808080' }}>
            No templates found. Try a different search or category.
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
            <Stack spacing={2}>
              {/* Large Preview */}
              <Box
                sx={{
                  width: '100%',
                  paddingBottom: '56.25%',
                  position: 'relative',
                  border: '2px solid #404040',
                  borderRadius: 1,
                  overflow: 'hidden',
                  background: selectedTemplate.preview.bgColor || '#1a1a1a'
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#81c784',
                    fontSize: '18px'
                  }}
                >
                  {selectedTemplate.name}
                </Box>
              </Box>

              {/* Template Details */}
              <Stack spacing={1}>
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
              onTemplateApply?.(selectedTemplate, 'apply');
              setPreviewOpen(false);
            }}
            sx={{ background: '#81c784', color: '#000' }}
          >
            Apply Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SlideTemplates;
