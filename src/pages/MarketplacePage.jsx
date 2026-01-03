import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Rating,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab
} from '@mui/material';
import { Download, Heart, Star, Share2, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function MarketplacePage() {
  const [activeTab, setActiveTab] = useState(0);
  const [templates, setTemplates] = useState([]);
  const [communityPresentations, setCommunityPresentations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [review, setReview] = useState('');

  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marketplace/templates', {
        params: { search, category }
      });
      setTemplates(res.data.data);
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
    setLoading(false);
  };

  const fetchCommunityPresentations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marketplace/community', {
        params: { search, category }
      });
      setCommunityPresentations(res.data.data);
    } catch (err) {
      console.error('Failed to fetch community presentations:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 0) {
      fetchTemplates();
    } else {
      fetchCommunityPresentations();
    }
  }, [search, category, activeTab]);

  const handleDownload = async (template_id) => {
    try {
      await api.post(`/marketplace/templates/${template_id}/download`);
      alert('Template downloaded successfully!');
    } catch (err) {
      console.error('Failed to download:', err);
    }
  };

  const handleSubmitRating = async () => {
    if (!selectedTemplate) return;
    try {
      await api.post(`/marketplace/templates/${selectedTemplate.id}/rate`, {
        rating: userRating,
        review
      });
      setOpenDialog(false);
      setUserRating(0);
      setReview('');
      fetchTemplates();
    } catch (err) {
      console.error('Failed to submit rating:', err);
    }
  };

  const TemplateCard = ({ template }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
    >
      <CardMedia
        sx={{
          height: 200,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {template.thumbnail_url ? (
          <img src={template.thumbnail_url} alt={template.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Typography>No image</Typography>
        )}
      </CardMedia>
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
          {template.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flex: 1 }}>
          {template.description?.substring(0, 100)}...
        </Typography>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip label={template.category} size="small" variant="outlined" />
          <Chip label={template.difficulty} size="small" />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating value={template.rating_avg || 0} readOnly size="small" />
          <Typography variant="caption" color="textSecondary">
            ({template.rating_count})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<Download size={16} />}
            onClick={() => handleDownload(template.id)}
            sx={{ flex: 1 }}
          >
            Download
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={() => {
              setSelectedTemplate(template);
              setOpenDialog(true);
            }}
          >
            <Star size={16} />
          </Button>
        </Box>

        <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
          ↓ {template.download_count}
        </Typography>
      </CardContent>
    </MotionCard>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Marketplace & Library
      </Typography>

      {/* Search & Filter */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: <Search size={18} style={{ marginRight: 8 }} />
          }}
          sx={{ flex: 1, minWidth: 250 }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            label="Category"
          >
            <MenuItem value="">All Categories</MenuItem>
            <MenuItem value="worship">Worship</MenuItem>
            <MenuItem value="sermon">Sermon</MenuItem>
            <MenuItem value="announcement">Announcement</MenuItem>
            <MenuItem value="event">Event</MenuItem>
            <MenuItem value="prayer">Prayer</MenuItem>
            <MenuItem value="bible_study">Bible Study</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Templates Marketplace" />
          <Tab label="Community Presentations" />
        </Tabs>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <>
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {templates.map((template) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={template.id}>
                  <TemplateCard template={template} />
                </Grid>
              ))}
            </Grid>
          )}

          {activeTab === 1 && (
            <Grid container spacing={3}>
              {communityPresentations.map((pres) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={pres.id}>
                  <MotionCard
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -8 }}
                    sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                        {pres.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        {pres.firstName} {pres.lastName}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '0.85rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Heart size={14} /> {pres.like_count}
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Download size={14} /> {pres.download_count}
                        </Box>
                      </Box>

                      <Rating value={pres.rating_avg || 0} readOnly size="small" sx={{ mb: 2 }} />

                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="contained" size="small" sx={{ flex: 1 }}>
                          <Download size={14} /> Download
                        </Button>
                        <Button variant="outlined" size="small">
                          <Heart size={14} />
                        </Button>
                      </Box>
                    </CardContent>
                  </MotionCard>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Rating Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Template</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            {selectedTemplate?.title}
          </Typography>
          <Box sx={{ mb: 3 }}>
            <Rating
              value={userRating}
              onChange={(e, value) => setUserRating(value)}
              size="large"
            />
          </Box>
          <TextField
            label="Review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Share your thoughts..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleSubmitRating} variant="contained">
            Submit Rating
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}