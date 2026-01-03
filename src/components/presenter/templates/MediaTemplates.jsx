/**
 * Media Templates Component
 * 8 video, animation, and graphics templates
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
  Card,
  CardMedia,
  CardContent
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Download as DownloadIcon,
  Videocam as VideoIcon,
  Image as ImageIcon,
  PlayArrow as PlayIcon,
  Loop as LoopIcon,
  HighQuality as HDIcon
} from '@mui/icons-material';
import { mediaTemplates } from './data/templateData';

const MediaTemplates = ({ onTemplateSelect, onTemplateDownload }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favoriteMediaTemplates') || '[]')
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return mediaTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = ['All', ...new Set(mediaTemplates.map(t => t.category))];

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoriteMediaTemplates', JSON.stringify(updated));
  };

  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'video':
        return <VideoIcon sx={{ fontSize: 40, color: '#81c784' }} />;
      case 'graphics':
        return <ImageIcon sx={{ fontSize: 40, color: '#64b5f6' }} />;
      case 'effect':
        return <PlayIcon sx={{ fontSize: 40, color: '#ffc107' }} />;
      default:
        return <VideoIcon sx={{ fontSize: 40, color: '#81c784' }} />;
    }
  };

  // Template Card Component
  const MediaCard = ({ template }) => (
    <Paper
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent',
        overflow: 'hidden',
        '&:hover': {
          border: '2px solid #81c784',
          transform: 'translateY(-6px)',
          boxShadow: '0 12px 32px rgba(129, 199, 132, 0.25)'
        }
      }}
      onClick={() => {
        setSelectedTemplate(template);
        setPreviewOpen(true);
        onTemplateSelect?.(template);
      }}
    >
      {/* Preview Area */}
      <Box
        sx={{
          height: 140,
          backgroundColor: '#1a1a1a',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid #404040'
        }}
      >
        {getTypeIcon(template.type)}

        {/* Badges */}
        <Stack
          spacing={0.5}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8
          }}
        >
          {template.loop && (
            <Tooltip title="Loopable">
              <Box sx={{ color: '#81c784', fontSize: 18 }}>
                <LoopIcon />
              </Box>
            </Tooltip>
          )}
          {template.resolution && (
            <Tooltip title={template.resolution}>
              <Box sx={{ color: '#64b5f6', fontSize: 18 }}>
                <HDIcon />
              </Box>
            </Tooltip>
          )}
        </Stack>
      </Box>

      {/* Template Info */}
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          {template.name}
        </Typography>
        <Typography variant="caption" sx={{ color: '#81c784', mb: 1, display: 'block' }}>
          {template.category}
        </Typography>

        {/* Specs */}
        <Stack spacing={0.5} sx={{ mb: 1 }}>
          {template.duration && (
            <Typography variant="caption" sx={{ color: '#808080', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PlayIcon sx={{ fontSize: 12 }} />
              {template.duration}
            </Typography>
          )}
          {template.resolution && (
            <Typography variant="caption" sx={{ color: '#808080', display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <HDIcon sx={{ fontSize: 12 }} />
              {template.resolution}
            </Typography>
          )}
        </Stack>

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
          <Tooltip title="Download">
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onTemplateDownload?.(template);
              }}
              sx={{ color: '#64b5f6' }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Media Templates
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
            {filteredTemplates.length} media templates available
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

      {/* Media Grid */}
      {filteredTemplates.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTemplates.map(template => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
              <MediaCard template={template} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#808080', mb: 1 }}>
            No media templates found.
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
              {/* Preview Box */}
              <Box
                sx={{
                  width: '100%',
                  height: 300,
                  backgroundColor: '#1a1a1a',
                  border: '2px solid #404040',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}
              >
                {getTypeIcon(selectedTemplate.type)}
              </Box>

              {/* Description */}
              {selectedTemplate.description && (
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Description
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#c0c0c0' }}>
                    {selectedTemplate.description}
                  </Typography>
                </Box>
              )}

              {/* Specifications */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Specifications
                </Typography>
                <Stack spacing={1} sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 1 }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    {selectedTemplate.type && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#808080' }}>
                          Type
                        </Typography>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {selectedTemplate.type}
                        </Typography>
                      </Box>
                    )}
                    {selectedTemplate.duration && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#808080' }}>
                          Duration
                        </Typography>
                        <Typography variant="body2">{selectedTemplate.duration}</Typography>
                      </Box>
                    )}
                    {selectedTemplate.resolution && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#808080' }}>
                          Resolution
                        </Typography>
                        <Typography variant="body2">{selectedTemplate.resolution}</Typography>
                      </Box>
                    )}
                    {selectedTemplate.loop && (
                      <Box>
                        <Typography variant="caption" sx={{ color: '#808080' }}>
                          Loop
                        </Typography>
                        <Typography variant="body2">Yes</Typography>
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>

              {/* Tags */}
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
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              onTemplateDownload?.(selectedTemplate);
              setPreviewOpen(false);
            }}
            sx={{ background: '#81c784', color: '#000' }}
          >
            Download Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MediaTemplates;
