import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Tabs,
  Tab,
  Tooltip,
  Switch,
  FormControlLabel,
  Grid,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  SkipPrevious,
  SkipNext,
  FastForward,
  FastRewind,
  Settings,
  ZoomIn,
  ZoomOut,
  FormatSize,
  Palette,
  Timer,
  Visibility,
  VisibilityOff,
  Fullscreen,
  FullscreenExit,
  Save,
  Restore,
  Edit,
  TextFields,
  Speed,
  VolumeUp,
  VolumeOff,
  Mic,
  MicOff
} from '@mui/icons-material';

const mockScripts = [
  {
    id: '1',
    title: 'Welcome Message',
    content: `Good morning, everyone! Welcome to our worship service today.

I hope you're all doing well and feeling blessed this beautiful morning. It's wonderful to see so many familiar faces and to welcome our visitors who have joined us today.

Today, we're going to explore the theme of "God's Unfailing Love" from the book of Psalms. We'll hear some powerful scriptures, sing some beautiful songs, and have a special message from our pastor.

Before we begin, let's take a moment to center our hearts and minds on the presence of God. Let us pray...`,
    duration: 120,
    lastModified: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: '2',
    title: 'Benediction',
    content: `As we come to the close of our worship service today, let me leave you with these final words from the Apostle Paul in Philippians 4:7:

"And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus."

May this peace be with you throughout this week. May you carry the love of God in your hearts, and may you share that love with everyone you encounter.

Go forth in peace, and may God's blessing be upon you all. Amen.`,
    duration: 90,
    lastModified: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: '3',
    title: 'Prayer of Confession',
    content: `Let us pray together in confession...

Almighty and most merciful Father, we have erred and strayed from Your ways like lost sheep. We have followed too much the devices and desires of our own hearts. We have offended against Your holy laws. We have left undone those things which we ought to have done, and we have done those things which we ought not to have done, and there is no health in us.

But You, O Lord, have mercy upon us, miserable offenders. Spare those, O God, who confess their faults. Restore those who are penitent, according to Your promises declared unto mankind in Christ Jesus our Lord.

Grant that we may hereafter live a godly, righteous, and sober life, to the glory of Your holy name. Amen.`,
    duration: 150,
    lastModified: new Date(Date.now() - 3 * 60 * 60 * 1000)
  }
];

export default function Teleprompter({ onClose }) {
  const [activeScript, setActiveScript] = useState(mockScripts[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [scrollSpeed, setScrollSpeed] = useState(50);
  const [fontSize, setFontSize] = useState(32);
  const [textColor, setTextColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [showMirror, setShowMirror] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [scripts, setScripts] = useState(mockScripts);
  const [editingScript, setEditingScript] = useState(null);
  const [newScriptTitle, setNewScriptTitle] = useState('');
  const [newScriptContent, setNewScriptContent] = useState('');

  const teleprompterRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Calculate estimated reading time
  const calculateReadingTime = (text) => {
    const wordsPerMinute = 150; // Average speaking rate
    const words = text.trim().split(/\s+/).length;
    return Math.ceil((words / wordsPerMinute) * 60); // Convert to seconds
  };

  // Auto-scroll functionality
  useEffect(() => {
    if (isPlaying && activeScript) {
      const scrollStep = scrollSpeed / 10; // Adjust scroll speed
      scrollIntervalRef.current = setInterval(() => {
        if (teleprompterRef.current) {
          teleprompterRef.current.scrollTop += scrollStep;

          // Update position indicator
          const scrollTop = teleprompterRef.current.scrollTop;
          const scrollHeight = teleprompterRef.current.scrollHeight - teleprompterRef.current.clientHeight;
          const position = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
          setCurrentPosition(Math.min(100, position));
        }
      }, 100);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isPlaying, scrollSpeed, activeScript]);

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      teleprompterRef.current?.requestFullscreen().catch(err => {
        console.error('Error entering fullscreen:', err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Reset scroll position
  const resetScroll = () => {
    if (teleprompterRef.current) {
      teleprompterRef.current.scrollTop = 0;
      setCurrentPosition(0);
    }
  };

  // Save script changes
  const saveScript = () => {
    if (editingScript) {
      const updatedScript = {
        ...editingScript,
        title: newScriptTitle,
        content: newScriptContent,
        lastModified: new Date()
      };

      setScripts(scripts.map(s => s.id === editingScript.id ? updatedScript : s));
      setActiveScript(updatedScript);
      setEditingScript(null);
      setNewScriptTitle('');
      setNewScriptContent('');
    }
  };

  // Create new script
  const createNewScript = () => {
    const newScript = {
      id: Date.now().toString(),
      title: 'New Script',
      content: 'Enter your script text here...',
      duration: 60,
      lastModified: new Date()
    };

    setScripts([...scripts, newScript]);
    setActiveScript(newScript);
    setActiveTab(0);
  };

  const renderTeleprompterView = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Control Bar */}
      <Box sx={{
        p: 2,
        borderBottom: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        bgcolor: '#2a2a2a'
      }}>
        <Typography variant="h6" sx={{ color: 'white', minWidth: 200 }}>
          {activeScript?.title}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title="Reset Scroll">
            <IconButton onClick={resetScroll} sx={{ color: '#ffb74d' }}>
              <Restore />
            </IconButton>
          </Tooltip>

          <Tooltip title="Previous Script">
            <IconButton
              onClick={() => {
                const currentIndex = scripts.findIndex(s => s.id === activeScript.id);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : scripts.length - 1;
                setActiveScript(scripts[prevIndex]);
                resetScroll();
              }}
              sx={{ color: '#b0b0b0' }}
            >
              <SkipPrevious />
            </IconButton>
          </Tooltip>

          <Tooltip title={isPlaying ? 'Pause' : 'Play'}>
            <IconButton
              onClick={() => setIsPlaying(!isPlaying)}
              sx={{ color: isPlaying ? '#e57373' : 'primary.main', mx: 1 }}
              size="large"
            >
              {isPlaying ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Stop">
            <IconButton
              onClick={() => {
                setIsPlaying(false);
                resetScroll();
              }}
              sx={{ color: '#b0b0b0' }}
            >
              <Stop />
            </IconButton>
          </Tooltip>

          <Tooltip title="Next Script">
            <IconButton
              onClick={() => {
                const currentIndex = scripts.findIndex(s => s.id === activeScript.id);
                const nextIndex = currentIndex < scripts.length - 1 ? currentIndex + 1 : 0;
                setActiveScript(scripts[nextIndex]);
                resetScroll();
              }}
              sx={{ color: '#b0b0b0' }}
            >
              <SkipNext />
            </IconButton>
          </Tooltip>
        </Box>

        <Box sx={{ flex: 1, mx: 2 }}>
          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
            Scroll Position
          </Typography>
          <Slider
            value={currentPosition}
            onChange={(e, value) => {
              setCurrentPosition(value);
              if (teleprompterRef.current) {
                const scrollHeight = teleprompterRef.current.scrollHeight - teleprompterRef.current.clientHeight;
                teleprompterRef.current.scrollTop = (value / 100) * scrollHeight;
              }
            }}
            sx={{ color: 'primary.main' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="caption" sx={{ color: '#b0b0b0', minWidth: 60 }}>
            Speed: {scrollSpeed}%
          </Typography>

          <Tooltip title="Settings">
            <IconButton onClick={() => setShowSettings(true)} sx={{ color: '#ffb74d' }}>
              <Settings />
            </IconButton>
          </Tooltip>

          <Tooltip title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}>
            <IconButton onClick={toggleFullscreen} sx={{ color: '#81c784' }}>
              {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Teleprompter Display */}
      <Box
        ref={teleprompterRef}
        sx={{
          flex: 1,
          p: 4,
          overflow: 'auto',
          backgroundColor: backgroundColor,
          color: textColor,
          fontSize: `${fontSize}px`,
          lineHeight: 1.6,
          fontFamily: 'Arial, sans-serif',
          textAlign: 'center',
          transform: showMirror ? 'scaleX(-1)' : 'none',
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0,0,0,0.1)'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '4px'
          }
        }}
      >
        <Box sx={{
          maxWidth: '800px',
          margin: '0 auto',
          whiteSpace: 'pre-wrap',
          transform: showMirror ? 'scaleX(-1)' : 'none'
        }}>
          {activeScript?.content.split('\n').map((line, index) => (
            <div key={index} style={{ margin: '20px 0' }}>
              {line || '\u00A0'}
            </div>
          ))}
        </Box>
      </Box>
    </Box>
  );

  const renderScriptsTab = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Script Library</Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={createNewScript}
          sx={{ bgcolor: 'primary.main' }}
        >
          New Script
        </Button>
      </Box>

      <Grid container spacing={2}>
        {scripts.map((script) => (
          <Grid item xs={12} md={6} lg={4} key={script.id}>
            <Card
              sx={{
                bgcolor: activeScript?.id === script.id ? 'primary.main' : '#2a2a2a',
                border: '1px solid #404040',
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': { borderColor: 'primary.main' }
              }}
              onClick={() => {
                setActiveScript(script);
                setActiveTab(0);
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 1 }}>
                  {script.title}
                </Typography>

                <Typography variant="body2" sx={{ color: '#b0b0b0', mb: 2, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {script.content.substring(0, 100)}...
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    {calculateReadingTime(script.content)}s • {script.lastModified.toLocaleDateString()}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingScript(script);
                        setNewScriptTitle(script.title);
                        setNewScriptContent(script.content);
                      }}
                      sx={{ color: '#ffb74d' }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#1a1a1a' }}>
      {/* Header */}
      <Box sx={{ p: 2, borderBottom: '1px solid #404040', bgcolor: '#2a2a2a' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
            Teleprompter
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Paper sx={{ bgcolor: '#333', border: '1px solid #404040' }}>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
                sx={{
                  minHeight: 40,
                  '& .MuiTab-root': { color: '#b0b0b0', minHeight: 40 },
                  '& .MuiTab-root.Mui-selected': { color: 'primary.main' }
                }}
              >
                <Tab label="Teleprompter" />
                <Tab label="Scripts" />
              </Tabs>
            </Paper>

            {onClose && (
              <Button variant="outlined" onClick={onClose} sx={{ borderColor: '#666', color: '#b0b0b0' }}>
                Close
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        {activeTab === 0 && renderTeleprompterView()}
        {activeTab === 1 && renderScriptsTab()}
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
        <DialogTitle sx={{ fontWeight: 'bold' }}>Teleprompter Settings</DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Display Settings</Typography>

              <Stack spacing={2}>
                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Font Size</Typography>
                  <Slider
                    value={fontSize}
                    onChange={(e, value) => setFontSize(value)}
                    min={16}
                    max={72}
                    step={2}
                    valueLabelDisplay="auto"
                    sx={{ color: 'primary.main' }}
                  />
                </Box>

                <Box>
                  <Typography variant="body2" sx={{ mb: 1 }}>Scroll Speed</Typography>
                  <Slider
                    value={scrollSpeed}
                    onChange={(e, value) => setScrollSpeed(value)}
                    min={10}
                    max={200}
                    step={10}
                    valueLabelDisplay="auto"
                    sx={{ color: 'primary.main' }}
                  />
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={showMirror}
                      onChange={(e) => setShowMirror(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Mirror text for glass reflection"
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6" sx={{ mb: 2 }}>Appearance</Typography>

              <Stack spacing={2}>
                <TextField
                  label="Text Color"
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#404040' }
                    },
                    '& .MuiInputLabel-root': { color: '#b0b0b0' }
                  }}
                />

                <TextField
                  label="Background Color"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': { borderColor: '#404040' }
                    },
                    '& .MuiInputLabel-root': { color: '#b0b0b0' }
                  }}
                />

                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#b0b0b0' }}>Font Family</InputLabel>
                  <Select
                    value="Arial"
                    sx={{
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                    }}
                  >
                    <MenuItem value="Arial">Arial</MenuItem>
                    <MenuItem value="Times New Roman">Times New Roman</MenuItem>
                    <MenuItem value="Georgia">Georgia</MenuItem>
                    <MenuItem value="Verdana">Verdana</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettings(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button variant="contained" sx={{ bgcolor: 'primary.main' }}>
            Apply Settings
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Script Dialog */}
      <Dialog
        open={!!editingScript}
        onClose={() => setEditingScript(null)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>Edit Script</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Script Title"
              value={newScriptTitle}
              onChange={(e) => setNewScriptTitle(e.target.value)}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' }
              }}
            />

            <TextField
              label="Script Content"
              value={newScriptContent}
              onChange={(e) => setNewScriptContent(e.target.value)}
              multiline
              rows={15}
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': { borderColor: '#404040' }
                },
                '& .MuiInputLabel-root': { color: '#b0b0b0' }
              }}
            />

            <Typography variant="caption" color="text.secondary">
              Estimated reading time: {calculateReadingTime(newScriptContent)} seconds
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingScript(null)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button variant="contained" onClick={saveScript} sx={{ bgcolor: 'primary.main' }}>
            Save Script
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}