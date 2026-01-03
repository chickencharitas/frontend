/**
 * Presentation Templates Component
 * 12 complete presentation templates with slide sequences
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
  LinearProgress,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ContentCopy as DuplicateIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  PlayArrow as PreviewIcon,
  Schedule as DurationIcon
} from '@mui/icons-material';
import { presentationTemplates } from './data/templateData';

const PresentationTemplates = ({ onTemplateSelect, onTemplateApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favoritePresentationTemplates') || '[]')
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedSlide, setSelectedSlide] = useState(0);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return presentationTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = ['All', ...new Set(presentationTemplates.map(t => t.category))];

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoritePresentationTemplates', JSON.stringify(updated));
  };

  // Handle template selection
  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setSelectedSlide(0);
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
        background: 'linear-gradient(135deg, #252526 0%, #2d2d2e 100%)',
        '&:hover': {
          border: '2px solid #81c784',
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(129, 199, 132, 0.25)'
        }
      }}
      onClick={() => handleSelectTemplate(template)}
    >
      {/* Thumbnail Collage */}
      <Box
        sx={{
          width: '100%',
          height: 120,
          mb: 1.5,
          border: '1px solid #404040',
          borderRadius: 1,
          overflow: 'hidden',
          background: '#1a1a1a',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr'
        }}
      >
        {template.slides.slice(0, 4).map((slide, i) => (
          <Box
            key={i}
            sx={{
              p: 1,
              borderRight: i % 2 === 0 ? '1px solid #404040' : 'none',
              borderBottom: i < 2 ? '1px solid #404040' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              color: '#808080',
              textAlign: 'center'
            }}
          >
            <Typography variant="caption" sx={{ fontSize: '9px' }}>
              {slide.type}
            </Typography>
          </Box>
        ))}
        
        {/* Slide count badge */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            backgroundColor: '#81c784',
            color: '#000',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          {template.slideCount} slides
        </Box>
      </Box>

      {/* Template Info */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
        {template.name}
      </Typography>
      <Typography variant="caption" sx={{ color: '#81c784', mb: 1, display: 'block' }}>
        {template.category}
      </Typography>

      {/* Duration */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 1, alignItems: 'center' }}>
        <DurationIcon sx={{ fontSize: 14, color: '#64b5f6' }} />
        <Typography variant="caption" sx={{ color: '#64b5f6' }}>
          {template.duration}
        </Typography>
      </Stack>

      {/* Tags */}
      <Box sx={{ mb: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
        {template.tags.slice(0, 2).map(tag => (
          <Chip
            key={tag}
            label={tag}
            size="small"
            sx={{
              height: 18,
              fontSize: '9px',
              backgroundColor: '#2d2d2e',
              color: '#81c784'
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
        <Tooltip title="Preview">
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSelectTemplate(template);
            }}
            sx={{ color: '#81c784' }}
          >
            <PreviewIcon />
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
          Presentation Templates
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
            {filteredTemplates.length} presentation templates available
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

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTemplates.map(template => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <TemplateCard template={template} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#808080', mb: 1 }}>
            No presentations found.
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
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{selectedTemplate?.name}</span>
          <Chip
            label={`${selectedTemplate?.slideCount} slides`}
            sx={{ backgroundColor: '#81c784', color: '#000', fontWeight: 600 }}
          />
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedTemplate && (
            <Stack spacing={3}>
              {/* Main Preview Area */}
              <Box
                sx={{
                  width: '100%',
                  paddingBottom: '56.25%',
                  position: 'relative',
                  border: '2px solid #404040',
                  borderRadius: 1,
                  overflow: 'hidden',
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #252526 100%)'
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
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#81c784'
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedTemplate.slides[selectedSlide]?.type}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    Slide {selectedSlide + 1} of {selectedTemplate.slideCount}
                  </Typography>
                </Box>
              </Box>

              {/* Slide Navigation */}
              <Stack spacing={1}>
                <LinearProgress
                  variant="determinate"
                  value={(selectedSlide + 1) / selectedTemplate.slideCount * 100}
                  sx={{ backgroundColor: '#2d2d2e', '& .MuiLinearProgress-bar': { backgroundColor: '#81c784' } }}
                />
                <Stack direction="row" spacing={1} sx={{ justifyContent: 'space-between' }}>
                  <Button
                    onClick={() => setSelectedSlide(Math.max(0, selectedSlide - 1))}
                    disabled={selectedSlide === 0}
                  >
                    Previous
                  </Button>
                  <Typography variant="caption" sx={{ alignSelf: 'center', color: '#808080' }}>
                    {selectedSlide + 1} / {selectedTemplate.slideCount}
                  </Typography>
                  <Button
                    onClick={() => setSelectedSlide(Math.min(selectedTemplate.slideCount - 1, selectedSlide + 1))}
                    disabled={selectedSlide === selectedTemplate.slideCount - 1}
                  >
                    Next
                  </Button>
                </Stack>
              </Stack>

              {/* Slide List */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Slide Structure
                </Typography>
                <List sx={{ maxHeight: 200, overflow: 'auto', backgroundColor: '#1a1a1a', borderRadius: 1 }}>
                  {selectedTemplate.slides.map((slide, i) => (
                    <ListItem
                      key={i}
                      onClick={() => setSelectedSlide(i)}
                      sx={{
                        cursor: 'pointer',
                        backgroundColor: selectedSlide === i ? '#2d2d2e' : 'transparent',
                        borderLeft: selectedSlide === i ? '3px solid #81c784' : '3px solid transparent',
                        '&:hover': { backgroundColor: '#252526' }
                      }}
                    >
                      <ListItemText
                        primary={`Slide ${i + 1}: ${slide.type}`}
                        secondary={slide.content}
                        primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 500 } }}
                        secondaryTypographyProps={{ variant: 'caption', sx: { color: '#808080' } }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>

              {/* Details */}
              <Stack spacing={1} sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 1 }}>
                <Box>
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    Category
                  </Typography>
                  <Typography variant="body2">{selectedTemplate.category}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ color: '#808080' }}>
                    Duration
                  </Typography>
                  <Typography variant="body2">{selectedTemplate.duration}</Typography>
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
            Use This Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresentationTemplates;
