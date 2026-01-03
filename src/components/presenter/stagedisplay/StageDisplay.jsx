import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Settings,
  Refresh,
  ZoomIn,
  ZoomOut
} from '@mui/icons-material';

const StageDisplay = ({ currentSlide = {}, nextSlide = {} }) => {
  const [showStageDisplay, setShowStageDisplay] = useState(false);
  const [stageTheme, setStageTheme] = useState('dark');
  const [slideSize, setSlideSize] = useState(100);
  const [showMetadata, setShowMetadata] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [showNotes, setShowNotes] = useState(false);
  const [displayMode, setDisplayMode] = useState('current');
  const [backgroundColor, setBackgroundColor] = useState('#1a1a1a');

  useEffect(() => {
    // Load saved preferences
    const saved = localStorage.getItem('stageDisplaySettings');
    if (saved) {
      const settings = JSON.parse(saved);
      setShowStageDisplay(settings.showStageDisplay || false);
      setStageTheme(settings.stageTheme || 'dark');
      setSlideSize(settings.slideSize || 100);
      setShowMetadata(settings.showMetadata !== false);
      setShowTimer(settings.showTimer !== false);
      setDisplayMode(settings.displayMode || 'current');
    }
  }, []);

  const handleSaveSettings = () => {
    const settings = {
      showStageDisplay,
      stageTheme,
      slideSize,
      showMetadata,
      showTimer,
      displayMode
    };
    localStorage.setItem('stageDisplaySettings', JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('presenter:stage-display-updated', { detail: settings }));
  };

  const toggleStageDisplay = () => {
    setShowStageDisplay(!showStageDisplay);
    if (!showStageDisplay) {
      window.dispatchEvent(new CustomEvent('presenter:stage-display-opened'));
    } else {
      window.dispatchEvent(new CustomEvent('presenter:stage-display-closed'));
    }
  };

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: '#cccccc', p: 2 }}>
      {/* Header */}
      <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Stage Display Settings</Typography>
          <FormControlLabel
            control={<Switch checked={showStageDisplay} onChange={toggleStageDisplay} />}
            label={showStageDisplay ? 'Active' : 'Inactive'}
            sx={{ color: '#cccccc' }}
          />
        </Box>
      </Paper>

      {showStageDisplay && (
        <>
          {/* Theme Selection */}
          <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
            <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 2 }}>
              Display Theme
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#cccccc' }}>Theme</InputLabel>
              <Select
                value={stageTheme}
                onChange={(e) => setStageTheme(e.target.value)}
                label="Theme"
                sx={{
                  color: '#cccccc',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                <MenuItem value="dark">Dark (Black Background)</MenuItem>
                <MenuItem value="light">Light (White Background)</MenuItem>
                <MenuItem value="custom">Custom Color</MenuItem>
                <MenuItem value="gradient">Gradient</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={stageTheme === 'dark' ? 'contained' : 'outlined'}
                  sx={{
                    backgroundColor: stageTheme === 'dark' ? '#1a1a1a' : 'transparent',
                    color: '#cccccc',
                    borderColor: '#404040',
                    borderRadius: 0
                  }}
                  onClick={() => setStageTheme('dark')}
                >
                  Dark Theme
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  fullWidth
                  variant={stageTheme === 'light' ? 'contained' : 'outlined'}
                  sx={{
                    backgroundColor: stageTheme === 'light' ? '#ffffff' : 'transparent',
                    color: stageTheme === 'light' ? '#000000' : '#cccccc',
                    borderColor: '#404040',
                    borderRadius: 0
                  }}
                  onClick={() => setStageTheme('light')}
                >
                  Light Theme
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Display Content Selection */}
          <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
            <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 2 }}>
              Display Mode
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel sx={{ color: '#cccccc' }}>What to Show</InputLabel>
              <Select
                value={displayMode}
                onChange={(e) => setDisplayMode(e.target.value)}
                label="What to Show"
                sx={{
                  color: '#cccccc',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                }}
              >
                <MenuItem value="current">Current Slide Only</MenuItem>
                <MenuItem value="current-next">Current + Next</MenuItem>
                <MenuItem value="lyrics">Lyrics Only</MenuItem>
                <MenuItem value="timer">Timer Only</MenuItem>
                <MenuItem value="hymnal">Hymnal Mode</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <FormControlLabel
                control={<Switch checked={showMetadata} onChange={(e) => setShowMetadata(e.target.checked)} />}
                label="Show Metadata"
                sx={{ color: '#cccccc', flex: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={showTimer} onChange={(e) => setShowTimer(e.target.checked)} />}
                label="Show Timer"
                sx={{ color: '#cccccc', flex: 1 }}
              />
              <FormControlLabel
                control={<Switch checked={showNotes} onChange={(e) => setShowNotes(e.target.checked)} />}
                label="Show Notes"
                sx={{ color: '#cccccc', flex: 1 }}
              />
            </Box>
          </Paper>

          {/* Slide Size Control */}
          <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
            <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 2 }}>
              Slide Size: {slideSize}%
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Tooltip title="Zoom Out">
                <IconButton
                  size="small"
                  onClick={() => setSlideSize(Math.max(50, slideSize - 10))}
                  sx={{ color: '#81c784' }}
                >
                  <ZoomOut />
                </IconButton>
              </Tooltip>
              <Slider
                value={slideSize}
                onChange={(e, val) => setSlideSize(val)}
                min={50}
                max={150}
                marks={[
                  { value: 50, label: '50%' },
                  { value: 100, label: '100%' },
                  { value: 150, label: '150%' }
                ]}
                sx={{ flex: 1 }}
              />
              <Tooltip title="Zoom In">
                <IconButton
                  size="small"
                  onClick={() => setSlideSize(Math.min(150, slideSize + 10))}
                  sx={{ color: '#81c784' }}
                >
                  <ZoomIn />
                </IconButton>
              </Tooltip>
            </Box>
          </Paper>

          {/* Preview */}
          <Paper sx={{ backgroundColor: '#2d2d2e', p: 2, mb: 2, borderRadius: 0, minHeight: 300 }}>
            <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 2 }}>
              Preview
            </Typography>
            <Box
              sx={{
                backgroundColor: stageTheme === 'dark' ? '#000000' : '#ffffff',
                color: stageTheme === 'dark' ? '#cccccc' : '#000000',
                p: 4,
                textAlign: 'center',
                borderRadius: 1,
                minHeight: 250,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>
                {currentSlide.title || 'Slide Title'}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.8 }}>
                {currentSlide.content || 'Slide content goes here...'}
              </Typography>
              
              {showMetadata && (
                <Typography variant="caption" sx={{ mt: 3, opacity: 0.6 }}>
                  Slide information and metadata
                </Typography>
              )}
              
              {showTimer && (
                <Typography variant="h6" sx={{ mt: 2, color: '#81c784' }}>
                  00:05:32
                </Typography>
              )}
            </Box>
          </Paper>

          {/* Save Settings */}
          <Button
            fullWidth
            variant="contained"
            onClick={handleSaveSettings}
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a', borderRadius: 0 }}
          >
            <Settings sx={{ mr: 1 }} />
            Save Stage Display Settings
          </Button>
        </>
      )}

      {!showStageDisplay && (
        <Paper sx={{ backgroundColor: '#252526', p: 3, textAlign: 'center', borderRadius: 0 }}>
          <VisibilityOff sx={{ fontSize: 48, color: '#808080', mb: 1 }} />
          <Typography variant="body1" sx={{ color: '#cccccc' }}>
            Stage Display is currently disabled
          </Typography>
          <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
            Enable to customize the display shown on stage or secondary monitors
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default StageDisplay;
