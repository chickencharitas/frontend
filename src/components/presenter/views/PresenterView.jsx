import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Divider,
  Tooltip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  useTheme
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  Timer,
  Notes,
  Settings,
  Fullscreen,
  Close,
  Add,
  Delete
} from '@mui/icons-material';

const PresenterView = ({ slides = [], currentSlideIndex = 0, onNavigate, onNotesUpdate }) => {
  const theme = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [presentationTime, setPresentationTime] = useState(0);
  const [notes, setNotes] = useState('');
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showNotesDialog, setShowNotesDialog] = useState(false);

  const currentSlide = slides[currentSlideIndex];
  const nextSlide = slides[currentSlideIndex + 1];

  // Presentation timer
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setPresentationTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Countdown timer
  useEffect(() => {
    let interval;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      onNavigate?.(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      onNavigate?.(currentSlideIndex + 1);
    }
  };

  const handleSaveNotes = () => {
    onNotesUpdate?.(notes);
    setShowNotesDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#1a1a1a', color: '#cccccc' }}>
      {/* Header */}
      <Paper
        sx={{
          backgroundColor: '#252526',
          borderBottom: '1px solid #333',
          p: 2,
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            {currentSlide?.title || 'Presenter View'}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Slide {currentSlideIndex + 1} / {slides.length}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              {formatTime(presentationTime)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Main Content */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 2, p: 2 }}>
        {/* Current Slide */}
        <Paper
          sx={{
            flex: 1.5,
            backgroundColor: currentSlide?.background || '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'auto',
            boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            borderRadius: 0
          }}
        >
          <Box sx={{ textAlign: 'center', p: 3 }}>
            <Typography
              variant="h4"
              sx={{
                color: '#000000',
                mb: 2,
                fontWeight: 'bold'
              }}
            >
              {currentSlide?.title || 'Untitled Slide'}
            </Typography>
            <Typography variant="body1" sx={{ color: '#333333' }}>
              {currentSlide?.content || 'Slide content'}
            </Typography>
          </Box>
        </Paper>

        {/* Right Panel - Notes, Timer, Preview */}
        <Box sx={{ display: 'flex', flexDirection: 'column', width: 350, gap: 2 }}>
          {/* Next Slide Preview */}
          <Paper
            sx={{
              backgroundColor: nextSlide?.background || '#f0f0f0',
              p: 2,
              flex: 1,
              minHeight: 200,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              borderRadius: 0
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
              NEXT SLIDE
            </Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="body2" sx={{ color: '#000000', fontWeight: 'bold' }}>
                  {nextSlide?.title || 'End of Presentation'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666666' }}>
                  {nextSlide?.content?.substring(0, 50) || ''}
                </Typography>
              </Box>
            </Box>
          </Paper>

          {/* Presenter Notes */}
          <Paper
            sx={{
              backgroundColor: '#2d2d2e',
              p: 2,
              flex: 1,
              minHeight: 150,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'auto',
              borderRadius: 0
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0' }}>
                PRESENTER NOTES
              </Typography>
              <Tooltip title="Edit Notes">
                <IconButton size="small" onClick={() => setShowNotesDialog(true)}>
                  <Notes fontSize="small" sx={{ color: '#cccccc' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#cccccc',
                flex: 1,
                whiteSpace: 'pre-wrap',
                overflowY: 'auto',
                p: 1,
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: 1
              }}
            >
              {notes || 'No notes for this slide'}
            </Typography>
          </Paper>

          {/* Timer */}
          <Paper
            sx={{
              backgroundColor: '#2d2d2e',
              p: 2,
              borderRadius: 0
            }}
          >
            <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
              COUNTDOWN TIMER
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                type="number"
                value={timerSeconds}
                onChange={(e) => setTimerSeconds(Math.max(0, parseInt(e.target.value) || 0))}
                disabled={timerRunning}
                size="small"
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': { color: '#cccccc' }
                }}
              />
              <Button
                size="small"
                variant={timerRunning ? 'contained' : 'outlined'}
                onClick={() => setTimerRunning(!timerRunning)}
                sx={{
                  color: timerRunning ? '#fff' : '#cccccc',
                  borderColor: '#cccccc'
                }}
              >
                {timerRunning ? <Pause /> : <PlayArrow />}
              </Button>
            </Box>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                color: timerSeconds < 10 && timerSeconds > 0 ? '#ff6b6b' : '#81c784',
                fontFamily: 'monospace',
                mb: 1
              }}
            >
              {formatTime(timerSeconds)}
            </Typography>
          </Paper>
        </Box>
      </Box>

      {/* Controls */}
      <Paper
        sx={{
          backgroundColor: '#252526',
          borderTop: '1px solid #333',
          p: 1.5,
          display: 'flex',
          gap: 1,
          justifyContent: 'center',
          borderRadius: 0
        }}
      >
        <Tooltip title="Previous Slide">
          <IconButton
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            sx={{ color: '#cccccc' }}
          >
            <SkipPrevious />
          </IconButton>
        </Tooltip>

        <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
          <IconButton
            onClick={() => setIsPlaying(!isPlaying)}
            sx={{ color: isPlaying ? '#81c784' : '#cccccc' }}
          >
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>
        </Tooltip>

        <Tooltip title="Next Slide">
          <IconButton
            onClick={handleNext}
            disabled={currentSlideIndex >= slides.length - 1}
            sx={{ color: '#cccccc' }}
          >
            <SkipNext />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" sx={{ my: 1, bgcolor: '#404040' }} />

        <Tooltip title="Fullscreen">
          <IconButton sx={{ color: '#cccccc' }}>
            <Fullscreen />
          </IconButton>
        </Tooltip>

        <Tooltip title="Settings">
          <IconButton sx={{ color: '#cccccc' }}>
            <Settings />
          </IconButton>
        </Tooltip>
      </Paper>

      {/* Notes Dialog */}
      <Dialog open={showNotesDialog} onClose={() => setShowNotesDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Presenter Notes</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter presenter notes..."
            variant="outlined"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNotesDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveNotes} variant="contained">
            Save Notes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PresenterView;
