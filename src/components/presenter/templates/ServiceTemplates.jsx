/**
 * Service Templates Component
 * 10 worship service order templates
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
  List,
  ListItem,
  ListItemText,
  Divider,
  LinearProgress
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  ContentCopy as DuplicateIcon,
  Schedule as ScheduleIcon,
  AccessTime as TimeIcon,
  Preview as PreviewIcon
} from '@mui/icons-material';
import { serviceTemplates } from './data/templateData';

const ServiceTemplates = ({ onTemplateSelect, onTemplateApply }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem('favoriteServiceTemplates') || '[]')
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return serviceTemplates.filter(template => {
      const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  // Get unique categories
  const categories = ['All', ...new Set(serviceTemplates.map(t => t.category))];

  // Toggle favorite
  const toggleFavorite = (id) => {
    const updated = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('favoriteServiceTemplates', JSON.stringify(updated));
  };

  // Parse duration string to minutes
  const durationToMinutes = (duration) => {
    const match = duration.match(/(\d+)/);
    return match ? parseInt(match[0]) : 0;
  };

  // Template Card Component
  const ServiceCard = ({ template }) => (
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
      onClick={() => {
        setSelectedTemplate(template);
        setPreviewOpen(true);
        onTemplateSelect?.(template);
      }}
    >
      {/* Header with Icon */}
      <Stack direction="row" spacing={1} sx={{ mb: 1.5, alignItems: 'flex-start' }}>
        <ScheduleIcon sx={{ color: '#81c784', fontSize: 24, mt: 0.5 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            {template.name}
          </Typography>
          <Typography variant="caption" sx={{ color: '#81c784', display: 'block' }}>
            {template.category}
          </Typography>
        </Box>
      </Stack>

      {/* Duration and Sections */}
      <Stack spacing={1} sx={{ mb: 1.5 }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <TimeIcon sx={{ fontSize: 14, color: '#64b5f6' }} />
          <Typography variant="caption" sx={{ color: '#64b5f6', fontWeight: 500 }}>
            {template.totalDuration}
          </Typography>
          <Typography variant="caption" sx={{ color: '#808080' }}>
            ({template.order.length} sections)
          </Typography>
        </Stack>

        {/* Order Preview */}
        <Box sx={{ backgroundColor: '#1a1a1a', p: 1, borderRadius: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#808080', display: 'block', mb: 0.5 }}>
            Order Preview:
          </Typography>
          <Stack spacing={0.5}>
            {template.order.slice(0, 3).map((section, i) => (
              <Typography
                key={i}
                variant="caption"
                sx={{
                  color: '#c0c0c0',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
              >
                <span>{section.section}</span>
                <span sx={{ color: '#808080' }}>{section.duration}</span>
              </Typography>
            ))}
            {template.order.length > 3 && (
              <Typography variant="caption" sx={{ color: '#81c784', fontStyle: 'italic' }}>
                +{template.order.length - 3} more sections
              </Typography>
            )}
          </Stack>
        </Box>
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
              setSelectedTemplate(template);
              setPreviewOpen(true);
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
          Service Order Templates
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
            {filteredTemplates.length} service templates available
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

      {/* Services Grid */}
      {filteredTemplates.length > 0 ? (
        <Grid container spacing={2}>
          {filteredTemplates.map(template => (
            <Grid item xs={12} sm={6} md={4} key={template.id}>
              <ServiceCard template={template} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Typography sx={{ color: '#808080', mb: 1 }}>
            No service templates found.
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
              {/* Duration Bar */}
              <Box>
                <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                  <TimeIcon sx={{ color: '#81c784' }} />
                  <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                    Total Duration: {selectedTemplate.totalDuration}
                  </Typography>
                </Stack>
              </Box>

              {/* Service Order */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Service Order
                </Typography>
                <Paper
                  sx={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #404040',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <List sx={{ p: 0 }}>
                    {selectedTemplate.order.map((section, i) => {
                      const minutes = durationToMinutes(selectedTemplate.totalDuration);
                      const sectionMinutes = durationToMinutes(section.duration);
                      const percentage = (sectionMinutes / minutes) * 100;

                      return (
                        <Box key={i}>
                          <ListItem sx={{ p: 1.5 }}>
                            <Stack sx={{ width: '100%' }}>
                              <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {i + 1}. {section.section}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#81c784', fontWeight: 600 }}>
                                  {section.duration}
                                </Typography>
                              </Stack>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min(percentage, 100)}
                                sx={{
                                  height: 4,
                                  backgroundColor: '#2d2d2e',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#81c784'
                                  }
                                }}
                              />
                            </Stack>
                          </ListItem>
                          {i < selectedTemplate.order.length - 1 && (
                            <Divider sx={{ backgroundColor: '#2d2d2e' }} />
                          )}
                        </Box>
                      );
                    })}
                  </List>
                </Paper>
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
            Use This Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ServiceTemplates;
