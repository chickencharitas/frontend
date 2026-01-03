import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Slider,
  Typography,
  Button,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  Stop,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  Speed,
  SkipNext,
  SkipPrevious,
  Settings
} from '@mui/icons-material';

const MediaPlayer = ({ mediaUrl, mediaType = 'video', onTimeUpdate, onEnded }) => {
  const mediaRef = useRef(null);
  const containerRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef(null);

  // Load media
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.src = mediaUrl;
      mediaRef.current.volume = volume;
      mediaRef.current.playbackRate = playbackSpeed;
    }
  }, [mediaUrl]);

  const handlePlayPause = () => {
    if (mediaRef.current) {
      if (playing) {
        mediaRef.current.pause();
      } else {
        mediaRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleStop = () => {
    if (mediaRef.current) {
      mediaRef.current.pause();
      mediaRef.current.currentTime = 0;
      setPlaying(false);
      setCurrentTime(0);
    }
  };

  const handleTimeChange = (e, value) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = value;
      setCurrentTime(value);
      onTimeUpdate?.(value);
    }
  };

  const handleVolumeChange = (e, value) => {
    setVolume(value);
    if (mediaRef.current) {
      mediaRef.current.volume = value;
    }
  };

  const handlePlaybackSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (mediaRef.current) {
      mediaRef.current.playbackRate = speed;
    }
  };

  const handleMetadataLoaded = () => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  };

  const handleTimelineUpdate = () => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
      onTimeUpdate?.(mediaRef.current.currentTime);
    }
  };

  const handleEnded = () => {
    setPlaying(false);
    onEnded?.();
  };

  const handleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  const toggleControlsVisibility = () => {
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    setShowControls(true);
    controlsTimeoutRef.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const formatTime = (time) => {
    if (!time) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Box
      ref={containerRef}
      onMouseMove={toggleControlsVisibility}
      sx={{
        position: 'relative',
        width: '100%',
        backgroundColor: '#000',
        borderRadius: 0,
        overflow: 'hidden'
      }}
    >
      {/* Media Element */}
      <Box
        sx={{
          aspectRatio: '16/9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#000'
        }}
      >
        {mediaType === 'video' && (
          <video
            ref={mediaRef}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            onLoadedMetadata={handleMetadataLoaded}
            onTimeUpdate={handleTimelineUpdate}
            onEnded={handleEnded}
          />
        )}
        {mediaType === 'audio' && (
          <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
            <audio
              ref={mediaRef}
              style={{ width: '100%' }}
              onLoadedMetadata={handleMetadataLoaded}
              onTimeUpdate={handleTimelineUpdate}
              onEnded={handleEnded}
            />
            <Typography sx={{ color: '#cccccc', mt: 2 }}>
              Audio Player
            </Typography>
          </Box>
        )}
      </Box>

      {/* Controls Overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s',
          background: 'linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0))',
          p: 2,
          cursor: 'pointer'
        }}
      >
        {/* Timeline */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#b0b0b0', minWidth: 40 }}>
            {formatTime(currentTime)}
          </Typography>
          <Slider
            value={currentTime}
            onChange={handleTimeChange}
            max={duration || 100}
            size="small"
            sx={{
              flex: 1,
              '& .MuiSlider-thumb': { backgroundColor: '#81c784' },
              '& .MuiSlider-track': { backgroundColor: '#81c784' }
            }}
          />
          <Typography variant="caption" sx={{ color: '#b0b0b0', minWidth: 40, textAlign: 'right' }}>
            {formatTime(duration)}
          </Typography>
        </Box>

        {/* Controls */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {/* Playback Controls */}
          <Tooltip title="Previous">
            <IconButton size="small" sx={{ color: '#cccccc' }}>
              <SkipPrevious />
            </IconButton>
          </Tooltip>

          <Tooltip title={playing ? 'Pause' : 'Play'}>
            <IconButton
              size="small"
              onClick={handlePlayPause}
              sx={{
                color: '#81c784',
                backgroundColor: 'rgba(129, 199, 132, 0.1)',
                '&:hover': { backgroundColor: 'rgba(129, 199, 132, 0.2)' }
              }}
            >
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>
          </Tooltip>

          <Tooltip title="Stop">
            <IconButton size="small" onClick={handleStop} sx={{ color: '#cccccc' }}>
              <Stop />
            </IconButton>
          </Tooltip>

          <Tooltip title="Next">
            <IconButton size="small" sx={{ color: '#cccccc' }}>
              <SkipNext />
            </IconButton>
          </Tooltip>

          {/* Spacer */}
          <Box sx={{ flex: 1 }} />

          {/* Volume Control */}
          <Tooltip title="Volume">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <IconButton size="small" sx={{ color: '#cccccc' }}>
                {volume === 0 ? <VolumeOff /> : volume < 0.5 ? <VolumeDown /> : <VolumeUp />}
              </IconButton>
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={1}
                step={0.1}
                sx={{
                  width: 80,
                  '& .MuiSlider-thumb': { backgroundColor: '#81c784' },
                  '& .MuiSlider-track': { backgroundColor: '#81c784' }
                }}
              />
            </Box>
          </Tooltip>

          {/* Speed Control */}
          <Tooltip title="Playback Speed">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            </Box>
          </Tooltip>

          {/* Settings */}
          <Tooltip title="Settings">
            <IconButton
              size="small"
              onClick={() => setOpenSettings(true)}
              sx={{ color: '#cccccc' }}
            >
              <Settings />
            </IconButton>
          </Tooltip>

          {/* Fullscreen */}
          <Tooltip title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}>
            <IconButton
              size="small"
              onClick={handleFullscreen}
              sx={{ color: '#cccccc' }}
            >
              {fullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Settings Dialog */}
      <Dialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
        PaperProps={{ sx: { backgroundColor: '#252526', color: '#cccccc' } }}
      >
        <DialogTitle>Playback Settings</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Playback Speed
          </Typography>
          <Grid container spacing={1} sx={{ mb: 3 }}>
            {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
              <Grid item xs={4} key={speed}>
                <Button
                  fullWidth
                  variant={playbackSpeed === speed ? 'contained' : 'outlined'}
                  onClick={() => handlePlaybackSpeedChange(speed)}
                  sx={{
                    backgroundColor: playbackSpeed === speed ? '#81c784' : 'transparent',
                    color: playbackSpeed === speed ? '#1a1a1a' : '#cccccc',
                    borderColor: '#404040'
                  }}
                >
                  {speed}x
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 0 }}>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Current Duration: {formatTime(duration)}
            </Typography>
            <Typography variant="body2" sx={{ color: '#b0b0b0' }}>
              Current Position: {formatTime(currentTime)}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default MediaPlayer;
