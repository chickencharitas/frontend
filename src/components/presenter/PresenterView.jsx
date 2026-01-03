import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, IconButton, Tooltip, Dialog, DialogTitle, DialogContent } from '@mui/material';
import { Play, Pause, SkipForward, SkipBack, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useDrop } from 'react-dnd';
import Slide from './Slide';
import MediaLibrary from './MediaLibrary';

const PresenterView = () => {
  const [currentSlide, setCurrentSlide] = useState({
    id: 1,
    type: 'text',
    content: 'Welcome to Worshipress',
    notes: 'Welcome everyone to our service!'
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [presenterNotes, setPresenterNotes] = useState('Welcome everyone to our service!');
  const [playlist, setPlaylist] = useState([
    { id: 1, type: 'text', content: 'Welcome to Worshipress', title: 'Welcome', duration: 10 },
    { id: 2, type: 'text', content: 'Announcements', title: 'Announcements', duration: 30 },
  ]);
  const [activeTab, setActiveTab] = useState('slides');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [timer, setTimer] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const timerRef = useRef(null);
  const slideDurationRef = useRef(null);

  // Handle drag and drop for slides
  const [{ isOver }, drop] = useDrop(() => ({
    accept: ['SLIDE', 'MEDIA'],
    drop: (item) => addToPlaylist(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const addToPlaylist = (item) => {
    setPlaylist(prev => [...prev, { id: Date.now(), ...item }]);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = useCallback(() => {
    if (currentSlideIndex < playlist.length - 1) {
      const nextIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIndex);
      setCurrentSlide(playlist[nextIndex]);
      setPresenterNotes(playlist[nextIndex].notes || '');
      setTimer(0); // Reset timer for the new slide
    }
  }, [currentSlideIndex, playlist]);

  const handlePrevious = useCallback(() => {
    if (currentSlideIndex > 0) {
      const prevIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIndex);
      setCurrentSlide(playlist[prevIndex]);
      setPresenterNotes(playlist[prevIndex].notes || '');
      setTimer(0); // Reset timer for the new slide
    }
  }, [currentSlideIndex, playlist]);

  const handleMediaSelect = (media) => {
    const newItem = {
      id: Date.now(),
      ...media,
      duration: media.type === 'video' ? 180 : 30 // Default durations in seconds
    };
    setPlaylist(prev => [...prev, newItem]);
    setShowMediaLibrary(false);
  };

  const handleSlideSelect = (index) => {
    setCurrentSlideIndex(index);
    setCurrentSlide(playlist[index]);
    setPresenterNotes(playlist[index].notes || '');
    setTimer(0);
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate progress percentage for the current slide
  const progress = currentSlide?.duration ? (timer / currentSlide.duration) * 100 : 0;

  // Timer and auto-advance effect
  useEffect(() => {
    if (isPlaying && currentSlide) {
      // Clear any existing intervals
      clearInterval(timerRef.current);
      clearTimeout(slideDurationRef.current);

      // Start the timer
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          // Auto-advance to next slide if duration is exceeded
          if (currentSlide.duration && prev >= currentSlide.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);

      // Set auto-advance timeout if slide has a duration
      if (currentSlide.duration) {
        const timeRemaining = (currentSlide.duration - timer) * 1000;
        if (timeRemaining > 0) {
          slideDurationRef.current = setTimeout(() => {
            if (isPlaying) handleNext();
          }, timeRemaining);
        }
      }
    } else {
      clearInterval(timerRef.current);
      clearTimeout(slideDurationRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      clearTimeout(slideDurationRef.current);
    };
  }, [isPlaying, currentSlide, currentSlideIndex, handleNext, timer]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left sidebar - Controls and Playlist */}
      <Box sx={{ width: 320, borderRight: '1px solid #333', display: 'flex', flexDirection: 'column', backgroundColor: '#1a1a1a', color: '#fff' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Tooltip title="Slides">
              <IconButton onClick={() => setActiveTab('slides')} color={activeTab === 'slides' ? 'primary' : 'default'}>
                <FileText size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Media">
              <IconButton onClick={() => setActiveTab('media')} color={activeTab === 'media' ? 'primary' : 'default'}>
                <ImageIcon size={20} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton onClick={() => setActiveTab('settings')} color={activeTab === 'settings' ? 'primary' : 'default'}>
                <Settings size={20} />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* Playback Controls */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={handlePrevious} size="large">
              <SkipBack />
            </IconButton>
            <IconButton 
              onClick={handlePlayPause} 
              size="large" 
              color="primary"
              sx={{ 
                width: 56, 
                height: 56,
                backgroundColor: 'primary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'primary.dark',
                }
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </IconButton>
            <IconButton onClick={handleNext} size="large">
              <SkipForward />
            </IconButton>
          </Box>
          
          {/* Timer */}
          <Box sx={{ textAlign: 'center', color: 'text.secondary', fontSize: '0.875rem' }}>
            {new Date(timer * 1000).toISOString().substr(11, 8)}
          </Box>
        </Box>
        
        {/* Playlist */}
        <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }} ref={drop}>
          {playlist.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '100%',
              color: 'text.secondary',
              textAlign: 'center',
              p: 2,
              border: `2px dashed ${isOver ? 'primary.main' : '#eee'}`,
              borderRadius: 1,
              backgroundColor: isOver ? 'action.hover' : 'background.paper',
            }}>
              <FileText size={48} style={{ marginBottom: 8, opacity: 0.5 }} />
              <div>Drag slides or media here</div>
            </Box>
          ) : (
            <div>Playlist items will appear here</div>
          )}
        </Box>
      </Box>
      
      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Current Slide Display */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          position: 'relative',
          borderBottom: '1px solid #eee'
        }}>
          {currentSlide ? (
            <div>Current Slide Content</div>
          ) : (
            <Box sx={{ color: 'text.secondary' }}>No slide selected</Box>
          )}
        </Box>
        
        {/* Presenter Notes */}
        <Box sx={{ height: '30%', p: 2, overflowY: 'auto', borderTop: '1px solid #eee' }}>
          <h3>Presenter Notes</h3>
          <textarea
            value={presenterNotes}
            onChange={(e) => setPresenterNotes(e.target.value)}
            style={{
              width: '100%',
              height: 'calc(100% - 30px)',
              border: '1px solid #ddd',
              borderRadius: 4,
              padding: 8,
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '0.875rem',
            }}
            placeholder="Add your notes here..."
          />
        </Box>
      </Box>
      
      {/* Preview Pane */}
      <Box sx={{ width: 300, borderLeft: '1px solid #eee', p: 2, overflowY: 'auto' }}>
        <h3>Preview</h3>
        <Box sx={{ 
          aspectRatio: '16/9', 
          backgroundColor: '#f0f0f0',
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary'
        }}>
          Preview Pane
        </Box>
        <h4>Next Up</h4>
        <Box sx={{ mt: 1 }}>
          {playlist.slice(0, 3).map((item, index) => (
            <Box key={item.id} sx={{ 
              p: 1, 
              mb: 1, 
              backgroundColor: index === 0 ? 'action.selected' : 'background.paper',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}>
              {item.type === 'slide' ? 'Slide' : 'Media'}: {item.title || 'Untitled'}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default PresenterView;
