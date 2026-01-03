import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Paper,
  IconButton,
  Divider,
  Chip,
  Tooltip,
  CircularProgress,
  Button,
  Menu,
  MenuItem
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  FirstPage,
  LastPage,
  Slideshow,
  MoreVert,
  Edit,
  Delete,
  ContentCopy,
  Add,
  Stop
} from '@mui/icons-material';
import api from '../services/api';

const ProPresenterSidebar = () => {
  const { presentationId, id } = useParams();
  const location = useLocation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSlide, setSelectedSlide] = useState(null);
  const [localPresentation, setLocalPresentation] = useState(null);

  const effectiveId = presentationId || id;

  // Listen for local presentation updates from PresentationEditorPage
  useEffect(() => {
    const handlePresentationUpdate = (event) => {
      setLocalPresentation(event.detail);
    };
    const handleSlideSelect = (event) => {
      if (event.detail?.slideIndex !== undefined) {
        setCurrentSlideIndex(event.detail.slideIndex);
      }
    };
    window.addEventListener('presentation:update', handlePresentationUpdate);
    window.addEventListener('presentation:selectSlide', handleSlideSelect);
    return () => {
      window.removeEventListener('presentation:update', handlePresentationUpdate);
      window.removeEventListener('presentation:selectSlide', handleSlideSelect);
    };
  }, []);

  // Get current presentation from API (only if we have an ID and no local data)
  const { data: presentation, isLoading: presentationLoading } = useQuery(
    ['presentation', effectiveId],
    () => effectiveId && effectiveId !== 'new' ? api.get(`/presentations/${effectiveId}`) : null,
    { enabled: !!effectiveId && effectiveId !== 'new' && !localPresentation }
  );

  // Get live presentation status
  const { data: livePresentation } = useQuery(
    ['live-presentation', effectiveId],
    () => effectiveId && effectiveId !== 'new' ? api.get(`/presentations/${effectiveId}/live`) : null,
    {
      enabled: !!effectiveId && effectiveId !== 'new',
      refetchInterval: 1000,
      onSuccess: (data) => {
        if (data?.current_slide_index !== undefined) {
          setCurrentSlideIndex(data.current_slide_index);
        }
      }
    }
  );

  // Use local presentation if available, otherwise use API data
  const presentationData = localPresentation || presentation?.data;
  const slides = presentationData?.slides || [];
  const isLive = livePresentation?.is_active;
  const currentSlide = slides[currentSlideIndex];

  // Handle slide click
  const handleSlideClick = (slideIndex) => {
    setCurrentSlideIndex(slideIndex);
    // Dispatch slide selection event
    window.dispatchEvent(new CustomEvent('slide:selected', {
      detail: { slideIndex, slide: slides[slideIndex] }
    }));
  };

  // Handle presentation controls
  const handlePlayPause = () => {
    if (isLive) {
      // End live presentation
      api.post(`/presentations/${presentationId}/live/end`);
    } else {
      // Start live presentation
      api.post(`/presentations/${presentationId}/live/start`);
    }
  };

  const handleNextSlide = () => {
    if (currentSlideIndex < slides.length - 1) {
      const newIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newIndex);
      // Update live presentation if active
      if (isLive) {
        api.put(`/presentations/${presentationId}/live/slide`, {
          slideIndex: newIndex,
          action: 'next_slide'
        });
      }
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      const newIndex = currentSlideIndex - 1;
      setCurrentSlideIndex(newIndex);
      // Update live presentation if active
      if (isLive) {
        api.put(`/presentations/${presentationId}/live/slide`, {
          slideIndex: newIndex,
          action: 'prev_slide'
        });
      }
    }
  };

  const handleFirstSlide = () => {
    setCurrentSlideIndex(0);
    if (isLive) {
      api.put(`/presentations/${presentationId}/live/slide`, {
        slideIndex: 0,
        action: 'first_slide'
      });
    }
  };

  const handleLastSlide = () => {
    const lastIndex = slides.length - 1;
    setCurrentSlideIndex(lastIndex);
    if (isLive) {
      api.put(`/presentations/${presentationId}/live/slide`, {
        slideIndex: lastIndex,
        action: 'last_slide'
      });
    }
  };

  const handleMenuOpen = (event, slide) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSlide(slide);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSlide(null);
  };

  // Generate slide thumbnail/preview
  const generateSlidePreview = (slide, index) => {
    const isCurrent = index === currentSlideIndex;
    const isLiveSlide = isLive && index === currentSlideIndex;

    return (
      <Paper
        key={slide.id || index}
        onClick={() => handleSlideClick(index)}
        sx={{
          width: '100%',
          height: 80,
          mb: 1,
          cursor: 'pointer',
          border: isCurrent ? '2px solid #4CAF50' : '1px solid #333',
          borderRadius: 1,
          backgroundColor: isLiveSlide ? '#1a4d3a' : '#2a2a2a',
          transition: 'all 0.2s ease',
          position: 'relative',
          overflow: 'hidden',
          '&:hover': {
            borderColor: '#666',
            transform: 'scale(1.02)'
          }
        }}
      >
        {/* Slide number */}
        <Box
          sx={{
            position: 'absolute',
            top: 4,
            left: 4,
            backgroundColor: isLiveSlide ? '#4CAF50' : '#666',
            color: 'white',
            borderRadius: '50%',
            width: 20,
            height: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.7rem',
            fontWeight: 'bold',
            zIndex: 1
          }}
        >
          {index + 1}
        </Box>

        {/* Live indicator */}
        {isLiveSlide && (
          <Box
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              backgroundColor: '#FF4444',
              color: 'white',
              borderRadius: 1,
              px: 1,
              py: 0.25,
              fontSize: '0.6rem',
              fontWeight: 'bold',
              zIndex: 1,
              animation: 'pulse 2s infinite'
            }}
          >
            LIVE
          </Box>
        )}

        {/* Slide content preview */}
        <Box
          sx={{
            p: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          {/* Title */}
          {slide.title && (
            <Typography
              sx={{
                fontSize: '0.7rem',
                fontWeight: 'bold',
                color: '#fff',
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: 1.2
              }}
            >
              {slide.title}
            </Typography>
          )}

          {/* Content preview */}
          {slide.content && (
            <Typography
              sx={{
                fontSize: '0.6rem',
                color: '#ccc',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                lineHeight: 1.3
              }}
            >
              {slide.content.replace(/<[^>]*>/g, '').substring(0, 60)}...
            </Typography>
          )}

          {/* Menu button */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleMenuOpen(e, slide);
            }}
            sx={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              color: '#999',
              p: 0.25,
              '&:hover': {
                color: '#fff'
              }
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    );
  };

  // Check if we're on a presentation-specific page (editing or live control)
  const isPresentationPage = location.pathname.includes('/presentations/') ||
                            location.pathname.includes('/live-control/');

  // Don't show ProPresenterSidebar if not on presentation-specific pages
  if (!isPresentationPage) {
    return null;
  }

  if (presentationLoading) {
    return (
      <Box sx={{
        width: 320,
        backgroundColor: '#1a1a1a',
        borderRight: '1px solid #404040',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh'
      }}>
        <CircularProgress sx={{ color: '#9147FF' }} />
      </Box>
    );
  }

  // Show placeholder only if no presentation data at all (no ID, no local data)
  if (!effectiveId && !localPresentation) {
    return null;
  }

  // For new presentations, show slides from local data
  const showNewPresentationHeader = effectiveId === 'new' || (!effectiveId && localPresentation);

  return (
    <>
      <Box sx={{
        width: 320,
        backgroundColor: '#1a1a1a',
        borderRight: '1px solid #404040',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <Box sx={{
          p: 2,
          borderBottom: '1px solid #404040',
          backgroundColor: '#252526'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}
            >
              {presentationData?.title || 'Untitled Presentation'}
            </Typography>
            <Chip
              label={isLive ? 'LIVE' : 'OFFLINE'}
              size="small"
              sx={{
                backgroundColor: isLive ? '#4CAF50' : '#666',
                color: 'white',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}
            />
          </Box>

          {/* Presentation Controls */}
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            <Tooltip title={isLive ? "End Live Presentation" : "Go Live"}>
              <IconButton
                onClick={handlePlayPause}
                sx={{
                  backgroundColor: isLive ? '#4CAF50' : '#666',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: isLive ? '#45a049' : '#777'
                  }
                }}
              >
                {isLive ? <Stop /> : <PlayArrow />}
              </IconButton>
            </Tooltip>

            <Tooltip title="First Slide">
              <IconButton
                onClick={handleFirstSlide}
                disabled={currentSlideIndex === 0}
                sx={{ color: '#ccc' }}
              >
                <FirstPage />
              </IconButton>
            </Tooltip>

            <Tooltip title="Previous Slide">
              <IconButton
                onClick={handlePrevSlide}
                disabled={currentSlideIndex === 0}
                sx={{ color: '#ccc' }}
              >
                <SkipPrevious />
              </IconButton>
            </Tooltip>

            <Typography sx={{ color: '#ccc', mx: 1, fontSize: '0.9rem', minWidth: 60, textAlign: 'center' }}>
              {currentSlideIndex + 1} / {slides.length}
            </Typography>

            <Tooltip title="Next Slide">
              <IconButton
                onClick={handleNextSlide}
                disabled={currentSlideIndex >= slides.length - 1}
                sx={{ color: '#ccc' }}
              >
                <SkipNext />
              </IconButton>
            </Tooltip>

            <Tooltip title="Last Slide">
              <IconButton
                onClick={handleLastSlide}
                disabled={currentSlideIndex >= slides.length - 1}
                sx={{ color: '#ccc' }}
              >
                <LastPage />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Slides List */}
        <Box sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#1a1a1a',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#404040',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: '#505050',
          }
        }}>
          {slides.length === 0 ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '200px',
              color: '#666'
            }}>
              <Slideshow sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                No slides yet.<br />Add slides to get started.
              </Typography>
            </Box>
          ) : (
            slides.map((slide, index) => generateSlidePreview(slide, index))
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          p: 2,
          borderTop: '1px solid #404040',
          backgroundColor: '#252526'
        }}>
          <Typography variant="caption" sx={{ color: '#808080', fontSize: '0.7rem' }}>
            {slides.length} slide{slides.length !== 1 ? 's' : ''} • {presentation?.data?.updated_at ? 'Updated recently' : 'Created recently'}
          </Typography>
        </Box>
      </Box>

      {/* Slide Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            backgroundColor: '#2d2d30',
            color: '#cccccc',
            borderRadius: 1,
            border: '1px solid #3e3e42'
          }
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1, fontSize: '1rem' }} />
          Edit Slide
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ContentCopy sx={{ mr: 1, fontSize: '1rem' }} />
          Duplicate Slide
        </MenuItem>
        <Divider sx={{ bgcolor: '#3e3e42', my: 1 }} />
        <MenuItem onClick={handleMenuClose} sx={{ color: '#f44747' }}>
          <Delete sx={{ mr: 1, fontSize: '1rem' }} />
          Delete Slide
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProPresenterSidebar;