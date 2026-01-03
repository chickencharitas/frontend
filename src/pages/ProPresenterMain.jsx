import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Tooltip,
  CircularProgress,
  Chip,
  Grid,
  List,
  ListItemButton,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  PlayArrow,
  Add,
  MoreVert,
  Edit,
  Delete,
  FileCopy,
  Slideshow,
  FolderOpen,
  Search,
  Stop,
  SkipNext,
  SkipPrevious,
  Fullscreen
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../services/api';

export default function ProPresenterMain() {
  const navigate = useNavigate();
  const [selectedPresentation, setSelectedPresentation] = useState(null);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);
  const [liveSlideIndex, setLiveSlideIndex] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [contextPresentation, setContextPresentation] = useState(null);
  const [createDialog, setCreateDialog] = useState(false);
  const [newPresentationName, setNewPresentationName] = useState('');
  const [creating, setCreating] = useState(false);

  // Fetch presentations
  const { data: presentationsData, isLoading, refetch } = useQuery(
    'presentations-main',
    () => api.get('/presentations'),
    { staleTime: 30000 }
  );

  // Handle different API response formats
  const presentations = Array.isArray(presentationsData?.data)
    ? presentationsData.data
    : Array.isArray(presentationsData?.data?.data)
      ? presentationsData.data.data
      : Array.isArray(presentationsData?.data?.presentations)
        ? presentationsData.data.presentations
        : [];

  // Filter presentations by search
  const filteredPresentations = presentations.filter(p =>
    p.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle selecting a presentation
  const handleSelectPresentation = async (presentation) => {
    setSelectedPresentation(presentation);
    setSelectedSlideIndex(0);
    // Fetch full presentation with slides if not already loaded
    if (!presentation.slides) {
      try {
        const res = await api.get(`/presentations/${presentation.id}`);
        const fullPres = res.data?.data || res.data;
        setSelectedPresentation(fullPres);
      } catch (err) {
        console.error('Failed to load presentation', err);
      }
    }
  };

  // Create new presentation
  const handleCreatePresentation = async () => {
    if (!newPresentationName.trim()) return;
    setCreating(true);
    try {
      const res = await api.post('/presentations', { title: newPresentationName.trim() });
      const created = res.data?.data || res.data;
      const id = created?.id;
      if (id) {
        setNewPresentationName('');
        setCreateDialog(false);
        refetch();
        navigate(`/presentations/${id}/edit`);
      }
    } catch (err) {
      console.error('Failed to create presentation', err);
    } finally {
      setCreating(false);
    }
  };

  // Go live with a slide
  const handleGoLiveWithSlide = (slideIndex) => {
    setLiveSlideIndex(slideIndex);
    setIsLive(true);
  };

  // Stop live
  const handleStopLive = () => {
    setIsLive(false);
    setLiveSlideIndex(null);
  };

  // Navigate slides
  const handlePrevSlide = () => {
    if (liveSlideIndex > 0) {
      setLiveSlideIndex(liveSlideIndex - 1);
    }
  };

  const handleNextSlide = () => {
    if (selectedPresentation?.slides && liveSlideIndex < selectedPresentation.slides.length - 1) {
      setLiveSlideIndex(liveSlideIndex + 1);
    }
  };

  // Context menu handlers
  const handleMenuClose = () => {
    setMenuAnchor(null);
    setContextPresentation(null);
  };

  return (
    <Box sx={{ display: 'flex', height: 'calc(100vh - 110px)', bgcolor: '#0d0d0f', overflow: 'hidden' }}>
      {/* LEFT PANEL - Presentation Library */}
      <Box sx={{ width: 280, borderRight: '1px solid #1f1f24', display: 'flex', flexDirection: 'column', bgcolor: '#141418' }}>
        {/* Library Header */}
        <Box sx={{ p: 1.5, borderBottom: '1px solid #1f1f24', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#18181c' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
            <FolderOpen sx={{ fontSize: 18, color: '#0088ff' }} /> Library
          </Typography>
          <Tooltip title="New Presentation">
            <IconButton size="small" onClick={() => setCreateDialog(true)} sx={{ color: '#0088ff' }}>
              <Add sx={{ fontSize: 18 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Search */}
        <Box sx={{ p: 1, borderBottom: '1px solid #1f1f24' }}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search presentations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: <Search sx={{ color: '#666', mr: 1, fontSize: 18 }} />,
              sx: { bgcolor: '#1a1a1f', color: '#fff', borderRadius: 1, fontSize: '0.8rem', '& input': { py: 0.75, color: '#fff' } }
            }}
            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' } }}
          />
        </Box>

        {/* Presentations List */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} sx={{ color: '#0088ff' }} />
            </Box>
          ) : filteredPresentations.length === 0 ? (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Slideshow sx={{ fontSize: 48, color: '#333', mb: 1 }} />
              <Typography sx={{ color: '#666', fontSize: '0.85rem', mb: 2 }}>No presentations</Typography>
              <Button size="small" startIcon={<Add />} onClick={() => setCreateDialog(true)} sx={{ color: '#0088ff' }}>
                Create New
              </Button>
            </Box>
          ) : (
            <List dense sx={{ p: 0 }}>
              {filteredPresentations.map((pres) => (
                <ListItemButton
                  key={pres.id || pres._id}
                  onClick={() => handleSelectPresentation(pres)}
                  onContextMenu={(e) => { e.preventDefault(); setContextPresentation(pres); setMenuAnchor(e.currentTarget); }}
                  sx={{
                    py: 1.5,
                    px: 1.5,
                    bgcolor: selectedPresentation?.id === pres.id ? 'rgba(0,136,255,0.15)' : 'transparent',
                    borderLeft: selectedPresentation?.id === pres.id ? '3px solid #0088ff' : '3px solid transparent',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                  }}
                >
                  <Slideshow sx={{ fontSize: 20, color: selectedPresentation?.id === pres.id ? '#0088ff' : '#666', mr: 1.5 }} />
                  <Box sx={{ flex: 1, overflow: 'hidden' }}>
                    <Typography sx={{ fontSize: '0.85rem', fontWeight: selectedPresentation?.id === pres.id ? 600 : 400, color: '#e0e0e0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pres.title || 'Untitled'}
                    </Typography>
                    <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>
                      {pres.slides?.length || pres.slides_count || 0} slides
                    </Typography>
                  </Box>
                </ListItemButton>
              ))}
            </List>
          )}
        </Box>
      </Box>

      {/* CENTER PANEL - Slides Grid */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', bgcolor: '#0d0d0f' }}>
        {selectedPresentation ? (
          <>
            {/* Presentation Header */}
            <Box sx={{ p: 1.5, borderBottom: '1px solid #1f1f24', display: 'flex', alignItems: 'center', justifyContent: 'space-between', bgcolor: '#141418' }}>
              <Box>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
                  {selectedPresentation.title}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>
                  {selectedPresentation.slides?.length || 0} slides
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button size="small" startIcon={<Edit />} onClick={() => navigate(`/presentations/${selectedPresentation.id}/edit`)} sx={{ color: '#888', fontSize: '0.75rem' }}>
                  Edit
                </Button>
                <Button size="small" variant="contained" startIcon={<PlayArrow />} onClick={() => handleGoLiveWithSlide(0)} sx={{ bgcolor: '#00cc88', fontSize: '0.75rem', '&:hover': { bgcolor: '#00dd99' } }}>
                  Go Live
                </Button>
              </Box>
            </Box>

            {/* Slides Grid */}
            <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
              {selectedPresentation.slides?.length > 0 ? (
                <>
                  <Typography sx={{ color: '#888', fontSize: '0.85rem', mb: 2 }}>
                    {selectedPresentation.slides.length} slides • Click to preview, use controls below to present
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedPresentation.slides.map((slide, idx) => (
                      <Grid item xs={6} sm={4} md={3} lg={2} key={idx}>
                        <Box
                          onClick={() => { setSelectedSlideIndex(idx); if (isLive) handleGoLiveWithSlide(idx); }}
                          sx={{
                            cursor: 'pointer',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: liveSlideIndex === idx ? '3px solid #00cc88' : selectedSlideIndex === idx ? '2px solid #0088ff' : '1px solid #2a2a30',
                            transition: 'all 0.15s ease',
                            '&:hover': { borderColor: '#0088ff', transform: 'scale(1.02)' }
                          }}
                        >
                          <Box sx={{
                            aspectRatio: '16/9',
                            bgcolor: selectedPresentation.formatting?.backgroundColor || '#1a1a1f',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            p: 1,
                            position: 'relative'
                          }}>
                            {liveSlideIndex === idx && (
                              <Chip label="LIVE" size="small" sx={{ position: 'absolute', top: 4, right: 4, bgcolor: '#00cc88', color: '#fff', fontSize: '0.6rem', height: 18 }} />
                            )}
                            <Typography sx={{ fontSize: '0.65rem', color: selectedPresentation.formatting?.fontColor || '#fff', textAlign: 'center', fontWeight: 600 }}>
                              {slide.title || `Slide ${idx + 1}`}
                            </Typography>
                            {slide.content && (
                              <Typography sx={{ fontSize: '0.5rem', color: '#888', textAlign: 'center', mt: 0.5, overflow: 'hidden', textOverflow: 'ellipsis', maxHeight: 24 }}>
                                {slide.content.substring(0, 30)}...
                              </Typography>
                            )}
                          </Box>
                          <Box sx={{ bgcolor: '#18181c', py: 0.5, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '0.7rem', color: '#888' }}>{idx + 1}</Typography>
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Slideshow sx={{ fontSize: 64, color: '#333', mb: 2 }} />
                  <Typography sx={{ color: '#666', mb: 2 }}>No slides in this presentation</Typography>
                  <Button variant="contained" startIcon={<Add />} onClick={() => navigate(`/presentations/${selectedPresentation.id}/edit`)} sx={{ bgcolor: '#0088ff' }}>
                    Add Slides
                  </Button>
                </Box>
              )}
            </Box>
          </>
        ) : (
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Slideshow sx={{ fontSize: 80, color: '#333', mb: 2 }} />
            <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>Select a Presentation</Typography>
            <Typography sx={{ color: '#555', fontSize: '0.85rem', mb: 3 }}>Choose from the library or create a new one</Typography>
            <Button variant="contained" startIcon={<Add />} onClick={() => setCreateDialog(true)} sx={{ bgcolor: '#0088ff' }}>
              New Presentation
            </Button>
          </Box>
        )}
      </Box>

      {/* RIGHT PANEL - Live Output Preview */}
      <Box sx={{ width: 320, borderLeft: '1px solid #1f1f24', display: 'flex', flexDirection: 'column', bgcolor: '#141418' }}>
        <Box sx={{ p: 1.5, borderBottom: '1px solid #1f1f24', bgcolor: '#18181c' }}>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: '#e0e0e0', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Fullscreen sx={{ fontSize: 18, color: isLive ? '#00cc88' : '#666' }} />
            {isLive ? 'LIVE OUTPUT' : 'Preview'}
            {isLive && <Chip label="ON AIR" size="small" sx={{ ml: 1, bgcolor: '#00cc88', color: '#fff', fontSize: '0.6rem', height: 18 }} />}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, p: 2, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{
            flex: 1,
            borderRadius: '8px',
            bgcolor: isLive && selectedPresentation?.slides?.[liveSlideIndex] ? (selectedPresentation.formatting?.backgroundColor || '#000') : '#1a1a1f',
            border: isLive ? '2px solid #00cc88' : '1px solid #2a2a30',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 3,
            position: 'relative'
          }}>
            {isLive && selectedPresentation?.slides?.[liveSlideIndex] ? (
              <>
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 600, color: selectedPresentation.formatting?.fontColor || '#fff', textAlign: 'center', mb: 1 }}>
                  {selectedPresentation.slides[liveSlideIndex].title}
                </Typography>
                <Typography sx={{ fontSize: '0.85rem', color: selectedPresentation.formatting?.fontColor || '#fff', textAlign: 'center', opacity: 0.8 }}>
                  {selectedPresentation.slides[liveSlideIndex].content}
                </Typography>
                <Typography sx={{ position: 'absolute', bottom: 8, right: 8, fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>
                  {liveSlideIndex + 1} / {selectedPresentation.slides.length}
                </Typography>
              </>
            ) : (
              <Typography sx={{ color: '#555', fontSize: '0.85rem' }}>
                {isLive ? 'No slide selected' : 'Click "Go Live" to start'}
              </Typography>
            )}
          </Box>

          {isLive && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'center' }}>
              <IconButton onClick={handlePrevSlide} disabled={liveSlideIndex === 0} sx={{ bgcolor: '#1f1f24', color: '#fff', '&:disabled': { color: '#444' } }}>
                <SkipPrevious />
              </IconButton>
              <IconButton onClick={handleStopLive} sx={{ bgcolor: '#ff4444', color: '#fff', '&:hover': { bgcolor: '#ff6666' } }}>
                <Stop />
              </IconButton>
              <IconButton onClick={handleNextSlide} disabled={!selectedPresentation?.slides || liveSlideIndex >= selectedPresentation.slides.length - 1} sx={{ bgcolor: '#1f1f24', color: '#fff', '&:disabled': { color: '#444' } }}>
                <SkipNext />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>

      {/* Context Menu */}
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose} sx={{ '& .MuiPaper-root': { bgcolor: '#2a2a2a', border: '1px solid #404040', color: '#fff' } }}>
        <MenuItem onClick={() => { if (contextPresentation) navigate(`/presentations/${contextPresentation.id}/edit`); handleMenuClose(); }}>
          <Edit sx={{ mr: 1, fontSize: 18 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => { if (contextPresentation) handleSelectPresentation(contextPresentation); handleGoLiveWithSlide(0); handleMenuClose(); }}>
          <PlayArrow sx={{ mr: 1, fontSize: 18 }} /> Go Live
        </MenuItem>
        <Divider sx={{ bgcolor: '#404040' }} />
        <MenuItem onClick={handleMenuClose} sx={{ color: '#ff6666' }}>
          <Delete sx={{ mr: 1, fontSize: 18 }} /> Delete
        </MenuItem>
      </Menu>

      {/* Create Dialog */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#2a2a2a', color: '#fff', border: '1px solid #404040' } }}>
        <DialogTitle>Create New Presentation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Presentation Name"
            value={newPresentationName}
            onChange={(e) => setNewPresentationName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreatePresentation()}
            sx={{ mt: 2, '& .MuiOutlinedInput-root': { color: '#fff', '& fieldset': { borderColor: '#404040' } }, '& .MuiInputLabel-root': { color: '#888' } }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)} sx={{ color: '#888' }}>Cancel</Button>
          <Button onClick={handleCreatePresentation} variant="contained" disabled={!newPresentationName.trim() || creating}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
