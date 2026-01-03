import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Paper,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
  LinearProgress,
  CircularProgress,
  Alert,
  Fab,
  Tooltip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  RestartAlt,
  Add,
  Edit,
  Delete,
  AccessTime,
  Timer,
  Notifications,
  NotificationsOff,
  VolumeUp,
  VolumeOff,
  Settings,
  ExpandMore,
  CheckCircle,
  Warning,
  Error,
  Info
} from '@mui/icons-material';

// Mock timer data
const mockTimers = [
  {
    id: 1,
    name: 'Sermon Timer',
    duration: 1800, // 30 minutes in seconds
    description: 'Main sermon presentation',
    color: 'primary.main',
    soundEnabled: true,
    autoStart: false,
    warningTime: 300, // 5 minutes warning
    criticalTime: 60, // 1 minute critical
    category: 'sermon'
  },
  {
    id: 2,
    name: 'Offering',
    duration: 300, // 5 minutes
    description: 'Time for offering collection',
    color: '#81c784',
    soundEnabled: true,
    autoStart: true,
    warningTime: 60,
    criticalTime: 30,
    category: 'offering'
  },
  {
    id: 3,
    name: 'Communion',
    duration: 600, // 10 minutes
    description: 'Communion service time',
    color: '#ffb74d',
    soundEnabled: false,
    autoStart: false,
    warningTime: 120,
    criticalTime: 30,
    category: 'communion'
  },
  {
    id: 4,
    name: 'Benediction',
    duration: 120, // 2 minutes
    description: 'Closing prayer and benediction',
    color: '#e57373',
    soundEnabled: true,
    autoStart: true,
    warningTime: 30,
    criticalTime: 10,
    category: 'closing'
  }
];

const categories = [
  { value: 'worship', label: 'Worship', color: 'primary.main' },
  { value: 'sermon', label: 'Sermon', color: '#81c784' },
  { value: 'offering', label: 'Offering', color: '#ffb74d' },
  { value: 'communion', label: 'Communion', color: '#e57373' },
  { value: 'announcements', label: 'Announcements', color: '#ba68c8' },
  { value: 'closing', label: 'Closing', color: '#90a4ae' },
  { value: 'other', label: 'Other', color: '#a1887f' }
];

export default function ServiceTimer() {
  const [timers, setTimers] = useState(mockTimers);
  const [activeTimer, setActiveTimer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [createDialog, setCreateDialog] = useState(false);
  const [editTimer, setEditTimer] = useState(null);
  const [timerForm, setTimerForm] = useState({
    name: '',
    duration: 300,
    description: '',
    color: 'primary.main',
    soundEnabled: true,
    autoStart: false,
    warningTime: 60,
    criticalTime: 30,
    category: 'other'
  });

  // Timer countdown effect
  useEffect(() => {
    let interval = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsRunning(false);
            // Play completion sound or notification
            console.log('Timer completed!');
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (!isRunning && timeLeft === 0 && activeTimer) {
      // Timer completed
      setActiveTimer(null);
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, activeTimer]);

  const handleStartTimer = (timer) => {
    setActiveTimer(timer);
    setTimeLeft(timer.duration);
    setIsRunning(true);
  };

  const handlePauseResume = () => {
    setIsRunning(!isRunning);
  };

  const handleStopTimer = () => {
    setIsRunning(false);
    setActiveTimer(null);
    setTimeLeft(0);
  };

  const handleResetTimer = () => {
    if (activeTimer) {
      setTimeLeft(activeTimer.duration);
      setIsRunning(false);
    }
  };

  const handleCreateTimer = () => {
    if (timerForm.name.trim()) {
      const newTimer = {
        id: Date.now(),
        ...timerForm,
        duration: timerForm.duration * 60 // Convert minutes to seconds
      };
      setTimers([...timers, newTimer]);
      setCreateDialog(false);
      resetTimerForm();
    }
  };

  const handleEditTimer = (timer) => {
    setEditTimer(timer);
    setTimerForm({
      name: timer.name,
      duration: timer.duration / 60, // Convert to minutes
      description: timer.description,
      color: timer.color,
      soundEnabled: timer.soundEnabled,
      autoStart: timer.autoStart,
      warningTime: timer.warningTime,
      criticalTime: timer.criticalTime,
      category: timer.category
    });
    setCreateDialog(true);
  };

  const handleUpdateTimer = () => {
    if (editTimer && timerForm.name.trim()) {
      const updatedTimer = {
        ...editTimer,
        ...timerForm,
        duration: timerForm.duration * 60
      };
      setTimers(timers.map(t => t.id === editTimer.id ? updatedTimer : t));
      setCreateDialog(false);
      setEditTimer(null);
      resetTimerForm();
    }
  };

  const handleDeleteTimer = (timerId) => {
    setTimers(timers.filter(t => t.id !== timerId));
    if (activeTimer && activeTimer.id === timerId) {
      handleStopTimer();
    }
  };

  const resetTimerForm = () => {
    setTimerForm({
      name: '',
      duration: 300,
      description: '',
      color: 'primary.main',
      soundEnabled: true,
      autoStart: false,
      warningTime: 60,
      criticalTime: 30,
      category: 'other'
    });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerStatus = () => {
    if (!activeTimer) return null;

    if (timeLeft <= activeTimer.criticalTime) return 'critical';
    if (timeLeft <= activeTimer.warningTime) return 'warning';
    return 'normal';
  };

  const getProgressValue = () => {
    if (!activeTimer) return 0;
    return ((activeTimer.duration - timeLeft) / activeTimer.duration) * 100;
  };

  const filteredTimers = selectedCategory === 'all'
    ? timers
    : timers.filter(timer => timer.category === selectedCategory);

  return (
    <Box sx={{ p: 3, bgcolor: '#1a1a1a', minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
          Service Timer
        </Typography>
        <Typography variant="subtitle1" sx={{ color: '#b0b0b0' }}>
          Professional countdown timers for worship service management
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Active Timer Display */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', minHeight: 300 }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Active Timer
              </Typography>

              {activeTimer ? (
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    fontFamily: 'monospace',
                    mb: 1,
                    fontSize: '4rem'
                  }}>
                    {formatTime(timeLeft)}
                  </Typography>

                  <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 2 }}>
                    {activeTimer.name}
                  </Typography>

                  <Typography variant="body2" sx={{ color: '#666', mb: 3 }}>
                    {activeTimer.description}
                  </Typography>

                  {/* Progress Bar */}
                  <Box sx={{ mb: 3 }}>
                    <LinearProgress
                      variant="determinate"
                      value={getProgressValue()}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#404040',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: activeTimer.color,
                          borderRadius: 4
                        }
                      }}
                    />
                  </Box>

                  {/* Status Indicator */}
                  {getTimerStatus() === 'critical' && (
                    <Alert severity="error" sx={{ mb: 2, bgcolor: '#d32f2f', color: 'white' }}>
                      <Error sx={{ mr: 1 }} />
                      Critical time remaining!
                    </Alert>
                  )}
                  {getTimerStatus() === 'warning' && (
                    <Alert severity="warning" sx={{ mb: 2, bgcolor: '#f57c00', color: 'white' }}>
                      <Warning sx={{ mr: 1 }} />
                      Warning: Time running low
                    </Alert>
                  )}

                  {/* Control Buttons */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="contained"
                      onClick={handlePauseResume}
                      sx={{ bgcolor: 'primary.main' }}
                    >
                      {isRunning ? <Pause /> : <PlayArrow />}
                      {isRunning ? 'Pause' : 'Resume'}
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleResetTimer}
                      sx={{ borderColor: '#ffb74d', color: '#ffb74d' }}
                    >
                      <RestartAlt sx={{ mr: 1 }} />
                      Reset
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={handleStopTimer}
                      sx={{ borderColor: '#e57373', color: '#e57373' }}
                    >
                      <Stop sx={{ mr: 1 }} />
                      Stop
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <AccessTime sx={{ fontSize: 64, color: '#666', mb: 2 }} />
                  <Typography variant="h6" sx={{ color: '#b0b0b0', mb: 2 }}>
                    No Active Timer
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    Select a timer from the list below to start counting down
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Timer Library */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040', minHeight: 300 }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                  Timer Library
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                      }}
                    >
                      <MenuItem value="all">All Categories</MenuItem>
                      {categories.map(cat => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <div style={{ width: 12, height: 12, backgroundColor: cat.color, borderRadius: '50%' }}></div>
                            {cat.label}
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setCreateDialog(true)}
                    sx={{ bgcolor: 'primary.main' }}
                  >
                    Add Timer
                  </Button>
                </Box>
              </Box>

              <Box sx={{ flex: 1, overflow: 'auto' }}>
                <List>
                  {filteredTimers.map((timer) => (
                    <ListItem
                      key={timer.id}
                      sx={{
                        border: '1px solid #404040',
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: activeTimer?.id === timer.id ? 'primary.main' : '#333',
                        '&:hover': { bgcolor: activeTimer?.id === timer.id ? 'primary.main' : '#404040' }
                      }}
                    >
                      <ListItemIcon>
                        <Box
                          sx={{
                            width: 16,
                            height: 16,
                            borderRadius: '50%',
                            bgcolor: timer.color
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                            {timer.name}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                              {formatTime(timer.duration)} • {timer.description}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip
                                label={categories.find(c => c.value === timer.category)?.label}
                                size="small"
                                sx={{
                                  height: 16,
                                  fontSize: '0.6rem',
                                  bgcolor: categories.find(c => c.value === timer.category)?.color,
                                  color: 'white'
                                }}
                              />
                              {timer.soundEnabled && <VolumeUp sx={{ fontSize: 14, color: '#81c784' }} />}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <Tooltip title="Start Timer">
                            <IconButton
                              size="small"
                              onClick={() => handleStartTimer(timer)}
                              sx={{ color: 'primary.main' }}
                            >
                              <PlayArrow fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Timer">
                            <IconButton
                              size="small"
                              onClick={() => handleEditTimer(timer)}
                              sx={{ color: '#ffb74d' }}
                            >
                              <Edit fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Timer">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteTimer(timer.id)}
                              sx={{ color: '#e57373' }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Timer Presets */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#2a2a2a', border: '1px solid #404040' }}>
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>
                Quick Timer Presets
              </Typography>
              <Grid container spacing={2}>
                {[
                  { name: '5 Minutes', duration: 300, color: 'primary.main' },
                  { name: '10 Minutes', duration: 600, color: '#81c784' },
                  { name: '15 Minutes', duration: 900, color: '#ffb74d' },
                  { name: '20 Minutes', duration: 1200, color: '#e57373' },
                  { name: '30 Minutes', duration: 1800, color: '#ba68c8' },
                  { name: '45 Minutes', duration: 2700, color: '#90a4ae' }
                ].map((preset) => (
                  <Grid item xs={6} sm={4} md={2} key={preset.name}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => {
                        const quickTimer = {
                          id: Date.now(),
                          name: preset.name,
                          duration: preset.duration,
                          description: `Quick ${preset.name.toLowerCase()} timer`,
                          color: preset.color,
                          soundEnabled: true,
                          autoStart: true,
                          warningTime: Math.max(60, preset.duration * 0.2),
                          criticalTime: Math.max(30, preset.duration * 0.1),
                          category: 'other'
                        };
                        handleStartTimer(quickTimer);
                      }}
                      sx={{
                        borderColor: preset.color,
                        color: preset.color,
                        '&:hover': {
                          borderColor: preset.color,
                          bgcolor: `${preset.color}20`
                        },
                        flexDirection: 'column',
                        py: 2,
                        height: 'auto'
                      }}
                    >
                      <Timer sx={{ mb: 1 }} />
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                        {preset.name}
                      </Typography>
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Create/Edit Timer Dialog */}
      <Dialog
        open={createDialog}
        onClose={() => {
          setCreateDialog(false);
          setEditTimer(null);
          resetTimerForm();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: '#2a2a2a',
            color: 'white',
            border: '1px solid #404040'
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>
          {editTimer ? 'Edit Timer' : 'Create New Timer'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Timer Name"
                value={timerForm.name}
                onChange={(e) => setTimerForm({...timerForm, name: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Duration (minutes)"
                value={timerForm.duration}
                onChange={(e) => setTimerForm({...timerForm, duration: parseInt(e.target.value) || 0})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#b0b0b0' }}>Category</InputLabel>
                <Select
                  value={timerForm.category}
                  onChange={(e) => setTimerForm({...timerForm, category: e.target.value})}
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                  }}
                >
                  {categories.map(cat => (
                    <MenuItem key={cat.value} value={cat.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <div style={{ width: 12, height: 12, backgroundColor: cat.color, borderRadius: '50%' }}></div>
                        {cat.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={timerForm.description}
                onChange={(e) => setTimerForm({...timerForm, description: e.target.value})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Warning Time (seconds)"
                value={timerForm.warningTime}
                onChange={(e) => setTimerForm({...timerForm, warningTime: parseInt(e.target.value) || 0})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                type="number"
                label="Critical Time (seconds)"
                value={timerForm.criticalTime}
                onChange={(e) => setTimerForm({...timerForm, criticalTime: parseInt(e.target.value) || 0})}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: '#404040' },
                    '&:hover fieldset': { borderColor: 'primary.main' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0b0b0' }
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={timerForm.soundEnabled}
                    onChange={(e) => setTimerForm({...timerForm, soundEnabled: e.target.checked})}
                  />
                }
                label="Sound Enabled"
                sx={{ color: '#b0b0b0' }}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={timerForm.autoStart}
                    onChange={(e) => setTimerForm({...timerForm, autoStart: e.target.checked})}
                  />
                }
                label="Auto Start"
                sx={{ color: '#b0b0b0' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCreateDialog(false);
              setEditTimer(null);
              resetTimerForm();
            }}
            sx={{ color: '#b0b0b0' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={editTimer ? handleUpdateTimer : handleCreateTimer}
            disabled={!timerForm.name.trim()}
            sx={{ bgcolor: 'primary.main' }}
          >
            {editTimer ? 'Update' : 'Create'} Timer
          </Button>
        </DialogActions>
      </Dialog>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: 'primary.main',
          '&:hover': { bgcolor: 'primary.dark' }
        }}
        onClick={() => setCreateDialog(true)}
      >
        <Add />
      </Fab>
    </Box>
  );
}