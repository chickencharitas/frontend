import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
  Fab,
  Tooltip
} from '@mui/material';
import {
  PlayArrow,
  Stop,
  SkipNext,
  SkipPrevious,
  Clear,
  Settings,
  Tv,
  Monitor,
  AccessTime,
  Keyboard,
  VolumeUp,
  Videocam,
  Lightbulb,
  Router
} from '@mui/icons-material';
import api from '../services/api';

export default function LiveControlPage() {
  const { presentationId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLive, setIsLive] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [stageDisplay, setStageDisplay] = useState('lyrics');
  const [audienceDisplay, setAudienceDisplay] = useState('full');

  // Mock data for demonstration
  const mockSlides = [
    { id: 1, title: 'Welcome', content: 'Welcome to our service today!\nWe are glad you are here.' },
    { id: 2, title: 'Opening Prayer', content: 'Let us pray...\n\nHeavenly Father, we thank you for this day...' },
    { id: 3, title: 'Amazing Grace', content: 'Amazing grace, how sweet the sound\nThat saved a wretch like me\nI once was lost, but now am found\nWas blind, but now I see' },
    { id: 4, title: 'Scripture Reading', content: 'John 3:16\n\n"For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life."' },
    { id: 5, title: 'Benediction', content: 'May the Lord bless you and keep you...\nMay His face shine upon you...' }
  ];

  // Get presentation data
  const { data: presentation, isLoading } = useQuery(
    ['presentation', presentationId],
    () => presentationId ? api.get(`/presentations/${presentationId}`) : Promise.resolve({ data: { title: 'Demo Presentation', slides: mockSlides } }),
    { enabled: true }
  );

  const slides = presentation?.data?.slides || mockSlides;
  const currentSlide = slides[currentSlideIndex];
  const formatting = presentation?.data?.formatting || {};

  // Broadcast slide changes to output screens (Main Output & Stage Display)
  useEffect(() => {
    const nextSlide = slides[currentSlideIndex + 1];
    
    window.dispatchEvent(new CustomEvent('slide:change', {
      detail: {
        currentSlide: currentSlide || null,
        nextSlide: nextSlide || null,
        formatting: formatting,
        slideIndex: currentSlideIndex,
        totalSlides: slides.length,
        presentationTitle: presentation?.data?.title || 'Live Presentation',
        isLive: isLive
      }
    }));
  }, [currentSlideIndex, slides, formatting, isLive, presentation]);

  // Keyboard shortcuts (event-driven)
  useEffect(() => {
    const onNext = () => { if (isLive) handleNextSlide(); };
    const onPrev = () => { if (isLive) handlePrevSlide(); };
    const onClear = () => { if (isLive) handleClear(); };
    const onToggleFullscreen = () => { /* could toggle display fullscreen if needed */ };

    window.addEventListener('presentation:next', onNext);
    window.addEventListener('presentation:previous', onPrev);
    window.addEventListener('presentation:stop', onClear);
    window.addEventListener('app:toggle-fullscreen', onToggleFullscreen);

    return () => {
      window.removeEventListener('presentation:next', onNext);
      window.removeEventListener('presentation:previous', onPrev);
      window.removeEventListener('presentation:stop', onClear);
      window.removeEventListener('app:toggle-fullscreen', onToggleFullscreen);
    };
  }, [isLive, currentSlideIndex]);

  const handleGoLive = () => {
    setIsLive(true);
    // In a real app, this would start the live presentation
    console.log('Going live with presentation:', presentation?.data?.title);
  };

  const handleEndLive = () => {
    setIsLive(false);
    // In a real app, this would end the live presentation
    console.log('Ending live presentation');
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleGoToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  const handleClear = () => {
    // In a real app, this would clear all displays
    console.log('Clearing displays');
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#1a1a1a', color: 'white' }}>
        <Typography>Loading live control...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', bgcolor: '#1a1a1a', color: 'white', display: 'flex', flexDirection: 'column' }}>
      {/* Top Control Bar */}
      <Paper sx={{ p: 2, bgcolor: '#2a2a2a', borderBottom: '1px solid #404040' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#e0e0e0' }}>
              Live
            </Typography>
            {isLive && <Chip label="LIVE" color="error" sx={{ fontWeight: 'bold' }} />}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTime fontSize="small" />
              {new Date().toLocaleTimeString()}
            </Typography>

            <Typography variant="body2">
              Slide {currentSlideIndex + 1} of {slides.length}
            </Typography>

            <IconButton onClick={() => setShowSettings(true)} sx={{ color: 'white' }}>
              <Settings />
            </IconButton>

            <Button
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ color: 'white', borderColor: 'white' }}
            >
              Exit Live
            </Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Slide Navigator */}
        <Paper sx={{ width: 280, bgcolor: '#2a2a2a', borderRight: '1px solid #404040', overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
              Slide Navigator
            </Typography>

            <Box sx={{ mb: 3 }}>
              {!isLive ? (
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={handleGoLive}
                  sx={{ mb: 2 }}
                >
                  GO LIVE
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  startIcon={<Stop />}
                  onClick={handleEndLive}
                  sx={{ mb: 2 }}
                >
                  END LIVE
                </Button>
              )}
            </Box>

            <Divider sx={{ bgcolor: '#404040', mb: 2 }} />

            {/* Slide List */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {slides.map((slide, index) => (
                <Card
                  key={slide.id}
                  sx={{
                    cursor: 'pointer',
                    bgcolor: currentSlideIndex === index ? 'primary.main' : '#333',
                    color: currentSlideIndex === index ? '#000' : 'white',
                    border: currentSlideIndex === index ? '2px solid' : '1px solid #404040',
                    borderColor: currentSlideIndex === index ? 'primary.main' : '#404040',
                    '&:hover': {
                      bgcolor: currentSlideIndex === index ? 'primary.main' : '#404040'
                    }
                  }}
                  onClick={() => handleGoToSlide(index)}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Slide {index + 1}
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {slide.title}
                    </Typography>
                    {currentSlideIndex === index && (
                      <Chip label="Current" size="small" sx={{ mt: 1, bgcolor: '#000', color: 'primary.main' }} />
                    )}
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Main Content Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
          {/* Control Buttons */}
          {isLive && (
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
              <Fab
                color="primary"
                size="large"
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                sx={{ width: 60, height: 60 }}
              >
                <SkipPrevious />
              </Fab>

              <Fab
                color="primary"
                size="large"
                onClick={handleClear}
                sx={{ width: 60, height: 60, bgcolor: '#ff9800' }}
              >
                <Clear />
              </Fab>

              <Fab
                color="primary"
                size="large"
                onClick={handleNextSlide}
                disabled={currentSlideIndex >= slides.length - 1}
                sx={{ width: 60, height: 60 }}
              >
                <SkipNext />
              </Fab>
            </Box>
          )}

          {/* Main Display Preview */}
          <Card sx={{
            flex: 1,
            bgcolor: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
            border: '2px solid',
            borderColor: 'primary.main'
          }}> 
            <CardContent sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              {currentSlide ? (
                <Box sx={{ maxWidth: '90%', maxHeight: '90%' }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '3.5rem',
                      fontWeight: 'bold',
                      mb: 3,
                      color: 'white',
                      textShadow: '3px 3px 6px rgba(0,0,0,0.8)',
                      lineHeight: 1.1
                    }}
                  >
                    {currentSlide.title}
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontSize: '2.5rem',
                      color: 'white',
                      whiteSpace: 'pre-wrap',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      lineHeight: 1.2
                    }}
                  >
                    {currentSlide.content}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="h3" sx={{ color: '#666' }}>
                  No slide selected
                </Typography>
              )}
            </CardContent>
          </Card>

          {/* Display Controls */}
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tv />
                    Audience Display
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant={audienceDisplay === 'full' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setAudienceDisplay('full')}
                      sx={{ borderColor: 'primary.main', color: audienceDisplay === 'full' ? '#000' : 'primary.main' }}
                    >
                      Full
                    </Button>
                    <Button
                      variant={audienceDisplay === 'blank' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setAudienceDisplay('blank')}
                      sx={{ borderColor: 'primary.main', color: audienceDisplay === 'blank' ? '#000' : 'primary.main' }}
                    >
                      Blank
                    </Button>
                    <Button
                      variant={audienceDisplay === 'logo' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setAudienceDisplay('logo')}
                      sx={{ borderColor: 'primary.main', color: audienceDisplay === 'logo' ? '#000' : 'primary.main' }}
                    >
                      Logo
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 2, color: 'white', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Monitor />
                    Stage Display
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Button
                      variant={stageDisplay === 'lyrics' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setStageDisplay('lyrics')}
                      sx={{ borderColor: '#81c784', color: stageDisplay === 'lyrics' ? '#000' : '#81c784' }}
                    >
                      Lyrics
                    </Button>
                    <Button
                      variant={stageDisplay === 'notes' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setStageDisplay('notes')}
                      sx={{ borderColor: '#81c784', color: stageDisplay === 'notes' ? '#000' : '#81c784' }}
                    >
                      Notes
                    </Button>
                    <Button
                      variant={stageDisplay === 'chords' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setStageDisplay('chords')}
                      sx={{ borderColor: '#81c784', color: stageDisplay === 'chords' ? '#000' : '#81c784' }}
                    >
                      Chords
                    </Button>
                    <Button
                      variant={stageDisplay === 'blank' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setStageDisplay('blank')}
                      sx={{ borderColor: '#81c784', color: stageDisplay === 'blank' ? '#000' : '#81c784' }}
                    >
                      Blank
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Keyboard Shortcuts Info */}
          <Alert severity="info" sx={{ mt: 2, bgcolor: '#2a2a2a', color: 'white', border: '1px solid #404040' }}>
            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Keyboard />
              <strong>Keyboard Shortcuts:</strong> Space/→ Next • ← Previous • Esc Clear • F11 Fullscreen
            </Typography>
          </Alert>
        </Box>

        {/* Right Sidebar - Device Control */}
        <Paper sx={{ width: 280, bgcolor: '#2a2a2a', borderLeft: '1px solid #404040', overflow: 'auto' }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>
              Device Control
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Camera Control */}
              <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Videocam sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>Camera</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main', flex: 1 }}>Preset 1</Button>
                    <Button size="small" variant="outlined" sx={{ borderColor: 'primary.main', color: 'primary.main', flex: 1 }}>Preset 2</Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Lighting Control */}
              <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Lightbulb sx={{ color: '#ffb74d' }} />
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>Lighting</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d', flex: 1 }}>Scene 1</Button>
                    <Button size="small" variant="outlined" sx={{ borderColor: '#ffb74d', color: '#ffb74d', flex: 1 }}>Scene 2</Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Audio Control */}
              <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <VolumeUp sx={{ color: '#81c784' }} />
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>Audio</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ borderColor: '#81c784', color: '#81c784', flex: 1 }}>Cue 1</Button>
                    <Button size="small" variant="outlined" sx={{ borderColor: '#81c784', color: '#81c784', flex: 1 }}>Cue 2</Button>
                  </Box>
                </CardContent>
              </Card>

              {/* Video Router */}
              <Card sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Router sx={{ color: '#e57373' }} />
                    <Typography variant="subtitle2" sx={{ color: 'white' }}>Video Router</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button size="small" variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373', flex: 1 }}>Input 1</Button>
                    <Button size="small" variant="outlined" sx={{ borderColor: '#e57373', color: '#e57373', flex: 1 }}>Input 2</Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Settings Dialog */}
      <Dialog
        open={showSettings}
        onClose={() => setShowSettings(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Live Control Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Display Settings</Typography>

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Auto-advance slides"
                sx={{ color: 'white', mb: 1 }}
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Show slide numbers"
                sx={{ color: 'white', mb: 1 }}
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable keyboard shortcuts"
                sx={{ color: 'white', mb: 1 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>Output Configuration</Typography>

              <TextField
                fullWidth
                label="Main Display Resolution"
                defaultValue="1920x1080"
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'white' } }}
                InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              />

              <TextField
                fullWidth
                label="Stage Display Resolution"
                defaultValue="1280x720"
                sx={{ mb: 2 }}
                InputProps={{ sx: { color: 'white' } }}
                InputLabelProps={{ sx: { color: '#b0b0b0' } }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }}>
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}