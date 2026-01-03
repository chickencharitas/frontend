import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Rating,
  Chip,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert
} from '@mui/material';
import { Search, Download, Heart, Share2 } from 'lucide-react';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import { motion } from 'framer-motion';
import api from '../services/api';
import Phase3AdvancedIntegration from '../components/presenter/templates/Phase3AdvancedIntegration';
import { brandConfig, brandThemes, applyGlobalTheme } from '../components/presenter/templates/config/brandConfig';

const MotionCard = motion(Card);

export default function TemplateMarketplacePage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openPreview, setOpenPreview] = useState(false);
  const [usePhase3, setUsePhase3] = useState(true);

  // Initialize brand theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('brandTheme');
    if (savedTheme) {
      try {
        applyGlobalTheme(JSON.parse(savedTheme));
      } catch (err) {
        applyGlobalTheme(brandThemes.default);
      }
    } else {
      applyGlobalTheme(brandThemes.default);
    }
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marketplace/templates', {
        params: {
          search: searchTerm,
          category: category || undefined,
          page,
          limit: 12
        }
      });
      // Backend returns { data: [...], total, page, limit }
      const data = res.data?.data || [];
      setTemplates(Array.isArray(data) ? data : []);
      const total = res.data?.total || 0;
      const limit = res.data?.limit || 12;
      setTotalPages(Math.max(1, Math.ceil(total / limit)));
    } catch (err) {
      console.error('Failed to fetch templates:', err);
      setTemplates([]);
      setTotalPages(1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTemplates();
  }, [searchTerm, category, page]);

  const handlePreview = (template) => {
    setSelectedTemplate(template);
    setOpenPreview(true);
  };

  const handleUseTemplate = async (template) => {
    try {
      // Create new presentation from template
      console.log('Using template:', template.id);
      alert('Presentation created from template!');
    } catch (err) {
      console.error('Failed to use template:', err);
    }
  };

  const handleRate = async (template, rating) => {
    try {
      await api.post(`/marketplace/templates/${template.id}/rate`, {
        rating
      });
      fetchTemplates();
    } catch (err) {
      console.error('Failed to rate template:', err);
    }
  };

  // Render Phase 3 templates if enabled
  if (usePhase3) {
    return (
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            🎨 Advanced Template Gallery
          </Typography>
          <Button
            size="small"
            onClick={() => setUsePhase3(false)}
            variant="outlined"
          >
            View Legacy Templates
          </Button>
        </Box>
        <Phase3AdvancedIntegration />
      </Box>
    );
  }

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 2 }}>
        Viewing Legacy Templates | 
        <Button size="small" onClick={() => setUsePhase3(true)} sx={{ ml: 1 }}>
          ✨ View Advanced Templates (Phase 3)
        </Button>
      </Alert>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
          Template Marketplace
        </Typography>
        <Typography color="textSecondary" sx={{ mb: 3 }}>
          Browse and use professionally designed presentation templates
        </Typography>

        {/* Search & Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            sx={{
              flex: 1,
              minWidth: 250,
              // light outline for dark theme and light icon/color
              '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(224,224,224,0.18)' },
              '& .MuiInputBase-input': { color: '#e0e0e0' },
              '& .MuiSvgIcon-root': { color: 'rgba(224,224,224,0.9)' },
              // lucide-react icons render as svg without MUI class - target svg in adornment
              '& .MuiInputAdornment-root svg': { color: 'rgba(224,224,224,0.9)' },
              backgroundColor: 'transparent'
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={20} />
                </InputAdornment>
              )
            }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'rgba(224,224,224,0.85)' }}>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setPage(1);
              }}
              label="Category"
              MenuProps={{ PaperProps: { sx: { bgcolor: '#1a1f2e', color: '#e0e0e0' } } }}
              sx={{
                // ensure the outline is light and the arrow icon is light
                '& .MuiOutlinedInput-notchedOutline, & fieldset': { borderColor: 'rgba(224,224,224,0.18)' },
                '& .MuiSelect-select': { color: '#e0e0e0' },
                '& .MuiSvgIcon-root': { color: 'rgba(224,224,224,0.9)' }
              }}
            >
              <MenuItem value="" sx={{ color: '#e0e0e0', bgcolor: 'transparent' }}>All Categories</MenuItem>
              <MenuItem value="worship" sx={{ color: '#e0e0e0' }}>Worship</MenuItem>
              <MenuItem value="sermon" sx={{ color: '#e0e0e0' }}>Sermon</MenuItem>
              <MenuItem value="announcement" sx={{ color: '#e0e0e0' }}>Announcement</MenuItem>
              <MenuItem value="event" sx={{ color: '#e0e0e0' }}>Event</MenuItem>
              <MenuItem value="prayer" sx={{ color: '#e0e0e0' }}>Prayer</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {templates.map((template, index) => (
              <Grid item xs={12} sm={6} md={4} key={template.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -8 }}
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                >
                  {template.thumbnail_url && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={template.thumbnail_url}
                      alt={template.name}
                      onClick={() => handlePreview(template)}
                      sx={{ objectFit: 'cover' }}
                    />
                  )}
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ mb: 1 }}>
                      <Chip
                        label={template.category}
                        size="small"
                        variant="outlined"
                        sx={{ mb: 1, borderColor: 'rgba(224,224,224,0.12)', color: '#e0e0e0' }}
                      />
                    </Box>
                    <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                      {template.name}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {template.description}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Rating
                          value={template.rating || 0}
                          readOnly
                          size="small"
                        />
                        <Typography variant="caption" color="textSecondary">
                          ({template.review_count || 0})
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="textSecondary">
                        By {template.firstName} {template.lastName}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        size="small"
                        onClick={() => handleUseTemplate(template)}
                        startIcon={<Download size={16} />}
                      >
                        Use
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ minWidth: 40 }}
                        onClick={() => handlePreview(template)}
                      >
                        <Heart size={16} />
                      </Button>
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, py: 3, alignItems: 'center' }}>
            <IconButton
              aria-label="previous page"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              sx={{
                color: '#e0e0e0',
                bgcolor: 'transparent',
                border: '1px solid rgba(224,224,224,0.12)',
                '& .MuiSvgIcon-root': { color: 'rgba(224,224,224,0.95)' },
                '&:hover': { bgcolor: 'rgba(224,224,224,0.03)' },
                '&.Mui-disabled': { opacity: 0.4 }
              }}
            >
              <ChevronLeft sx={{ fontSize: 24 }} />
            </IconButton>
            <Typography sx={{ display: 'flex', alignItems: 'center', px: 2, color: '#e0e0e0' }}>
              Page {page} of {totalPages}
            </Typography>
            <IconButton
              aria-label="next page"
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              sx={{
                color: '#e0e0e0',
                bgcolor: 'transparent',
                border: '1px solid rgba(224,224,224,0.12)',
                '& .MuiSvgIcon-root': { color: 'rgba(224,224,224,0.95)' },
                '&:hover': { bgcolor: 'rgba(224,224,224,0.03)' },
                '&.Mui-disabled': { opacity: 0.4 }
              }}
            >
              <ChevronRight sx={{ fontSize: 24 }} />
            </IconButton>
          </Box>
        </>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedTemplate?.name}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {selectedTemplate?.preview_url && (
            <Box
              component="img"
              src={selectedTemplate.preview_url}
              alt="Preview"
              sx={{ width: '100%', borderRadius: 1, mb: 2 }}
            />
          )}
          <Typography variant="body2" sx={{ mb: 2 }}>
            {selectedTemplate?.description}
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Rate this template
            </Typography>
            <Rating
              value={selectedTemplate?.rating || 0}
              onChange={(e, value) => handleRate(selectedTemplate, value)}
              size="large"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPreview(false)}>Close</Button>
          <Button
            variant="contained"
            onClick={() => {
              handleUseTemplate(selectedTemplate);
              setOpenPreview(false);
            }}
          >
            Use Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}