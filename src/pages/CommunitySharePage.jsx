import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  Rating,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Avatar,
  Stack
} from '@mui/material';
import { Share2, Heart, Download, MessageCircle, Star, Trash2, ThumbsUp } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

const MotionCard = motion(Card);

export default function CommunitySharePage() {
  const [presentations, setPresentations] = useState([]);
  const [myPresentations, setMyPresentations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [openRatingDialog, setOpenRatingDialog] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [likedPresentations, setLikedPresentations] = useState(new Set());

  const [shareFormData, setShareFormData] = useState({
    title: '',
    description: '',
    category: 'sermon',
    is_public: true,
    tags: []
  });

  const fetchCommunityPresentations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/marketplace/community');
      setPresentations(res.data.data);
    } catch (err) {
      console.error('Failed to fetch presentations:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCommunityPresentations();
  }, []);

  const handleSharePresentation = async () => {
    if (!selectedPresentation) return;
    try {
      await api.post(`/marketplace/community/share/${selectedPresentation.id}`, shareFormData);
      setOpenShareDialog(false);
      setShareFormData({
        title: '',
        description: '',
        category: 'sermon',
        is_public: true,
        tags: []
      });
      fetchCommunityPresentations();
      alert('Presentation shared to community!');
    } catch (err) {
      console.error('Failed to share presentation:', err);
    }
  };

  const handleLikePresentations = async (presentation_id) => {
    try {
      await api.post(`/marketplace/community/${presentation_id}/like`);
      const newLiked = new Set(likedPresentations);
      if (newLiked.has(presentation_id)) {
        newLiked.delete(presentation_id);
      } else {
        newLiked.add(presentation_id);
      }
      setLikedPresentations(newLiked);
      fetchCommunityPresentations();
    } catch (err) {
      console.error('Failed to like presentation:', err);
    }
  };

  const handleRatePresentations = async (presentation_id) => {
    try {
      await api.post(`/marketplace/community/${presentation_id}/rate`, {
        rating: userRating,
        review: userReview
      });
      setOpenRatingDialog(false);
      setUserRating(0);
      setUserReview('');
      fetchCommunityPresentations();
    } catch (err) {
      console.error('Failed to rate presentation:', err);
    }
  };

  const handleDownloadPresentations = async (presentation_id) => {
    try {
      await api.post(`/marketplace/community/${presentation_id}/download`);
      alert('Presentation downloaded!');
    } catch (err) {
      console.error('Failed to download presentation:', err);
    }
  };

  const PresentationCard = ({ presentation, isMyPresentation = false }) => (
    <MotionCard
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      <CardMedia
        sx={{
          height: 160,
          backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'flex-start',
          padding: 2,
          color: 'white'
        }}
      >
        {presentation.thumbnail_url ? (
          <img
            src={presentation.thumbnail_url}
            alt={presentation.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Box sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              {presentation.title}
            </Typography>
          </Box>
        )}
      </CardMedia>

      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem' }}>
            {presentation.firstName?.charAt(0)}{presentation.lastName?.charAt(0)}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ fontWeight: 600 }}>
              {presentation.firstName} {presentation.lastName}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {presentation.organizationName}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" sx={{ mb: 0.5, fontWeight: 700, fontSize: '1rem' }}>
          {presentation.title}
        </Typography>

        <Typography variant="body2" color="textSecondary" sx={{ mb: 2, flex: 1 }}>
          {presentation.description?.substring(0, 80)}...
        </Typography>

        <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
          {presentation.category && (
            <Chip label={presentation.category} size="small" variant="outlined" />
          )}
        </Stack>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Rating value={presentation.rating_avg || 0} readOnly size="small" />
          <Typography variant="caption" color="textSecondary">
            ({presentation.rating_count})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2, fontSize: '0.85rem', color: 'textSecondary' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <ThumbsUp size={14} /> {presentation.like_count}
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Download size={14} /> {presentation.download_count}
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Download size={14} />}
            onClick={() => handleDownloadPresentations(presentation.id)}
            sx={{ flex: 1 }}
          >
            Download
          </Button>
          <IconButton
            size="small"
            onClick={() => handleLikePresentations(presentation.id)}
            color={likedPresentations.has(presentation.id) ? 'error' : 'default'}
          >
            <Heart size={16} fill={likedPresentations.has(presentation.id) ? 'currentColor' : 'none'} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => {
              setSelectedPresentation(presentation);
              setOpenRatingDialog(true);
            }}
          >
            <Star size={16} />
          </IconButton>
        </Box>
      </CardContent>
    </MotionCard>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Community Presentations
        </Typography>
        <Button
          variant="contained"
          startIcon={<Share2 size={20} />}
          onClick={() => setOpenShareDialog(true)}
        >
          Share Presentation
        </Button>
      </Box>

      {/* Filter Chips */}
      <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <Chip label="All" variant="filled" onClick={() => {}} />
        <Chip label="Worship" variant="outlined" onClick={() => {}} />
        <Chip label="Sermon" variant="outlined" onClick={() => {}} />
        <Chip label="Prayer" variant="outlined" onClick={() => {}} />
        <Chip label="Event" variant="outlined" onClick={() => {}} />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {presentations.map((pres) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={pres.id}>
              <PresentationCard presentation={pres} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Share Dialog */}
      <Dialog open={openShareDialog} onClose={() => setOpenShareDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Share Presentation to Community</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            label="Title"
            value={shareFormData.title}
            onChange={(e) => setShareFormData({ ...shareFormData, title: e.target.value })}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            value={shareFormData.description}
            onChange={(e) => setShareFormData({ ...shareFormData, description: e.target.value })}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            placeholder="Tell the community about your presentation..."
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={shareFormData.category}
              onChange={(e) => setShareFormData({ ...shareFormData, category: e.target.value })}
              label="Category"
            >
              <MenuItem value="worship">Worship</MenuItem>
              <MenuItem value="sermon">Sermon</MenuItem>
              <MenuItem value="prayer">Prayer</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="announcement">Announcement</MenuItem>
              <MenuItem value="bible_study">Bible Study</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={shareFormData.is_public}
                onChange={(e) => setShareFormData({ ...shareFormData, is_public: e.target.checked })}
              />
            }
            label="Make Public"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)}>Cancel</Button>
          <Button onClick={handleSharePresentation} variant="contained">
            Share
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={openRatingDialog} onClose={() => setOpenRatingDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Rate Presentation</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700 }}>
            {selectedPresentation?.title}
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
            value={userReview}
            onChange={(e) => setUserReview(e.target.value)}
            multiline
            rows={4}
            fullWidth
            placeholder="Share what you think about this presentation..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRatingDialog(false)}>Cancel</Button>
          <Button onClick={() => handleRatePresentations(selectedPresentation.id)} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}