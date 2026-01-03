import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  Box,
  Typography,
  Paper,
  Fade,
  Slide
} from '@mui/material';
import api from '../services/api';

export default function ProjectionViewPage() {
  const { presentationId, displayType = 'audience' } = useParams();
  const [currentSlide, setCurrentSlide] = useState(null);
  const [transitionIn, setTransitionIn] = useState(false);

  // Get live presentation data
  const { data: livePresentation } = useQuery(
    ['live-presentation', presentationId],
    () => api.get(`/presentations/${presentationId}/live`),
    {
      enabled: !!presentationId,
      refetchInterval: 1000, // Poll every second for live updates
      onSuccess: (data) => {
        if (data?.is_active && data?.current_slide_index !== undefined) {
          // Get the presentation with slides
          api.get(`/presentations/${presentationId}`).then((response) => {
            const slide = response.data.slides?.[data.current_slide_index];
            if (slide && slide.id !== currentSlide?.id) {
              setTransitionIn(false);
              setTimeout(() => {
                setCurrentSlide(slide);
                setTransitionIn(true);
              }, 150);
            }
          });
      } else {
          setCurrentSlide(null);
          setTransitionIn(false);
      }
      }
    }
  );

  // Get display profile settings
  const { data: displayProfiles } = useQuery(
    'display-profiles',
    () => api.get('/presentations/display-profiles'),
    {
      onSuccess: (data) => {
        // Apply display profile settings
        const profile = data.find(p => p.display_type === displayType && p.is_active);
        if (profile) {
          applyDisplaySettings(profile);
    }
      }
    }
  );

  const applyDisplaySettings = (profile) => {
    // Apply background color
    document.body.style.backgroundColor = profile.background_color || '#000000';

    // Apply font scaling and other settings
    const root = document.documentElement;
    root.style.setProperty('--font-scale', profile.font_scaling || 1);

    // Safe zone settings would be applied here
    if (profile.safe_zone_enabled) {
      root.style.setProperty('--safe-zone', `${profile.safe_zone_percentage || 0.9 * 100}%`);
    }
  };

  useEffect(() => {
    // Enter fullscreen mode for projection displays
    const enterFullscreen = async () => {
      try {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } catch (error) {
        console.log('Fullscreen not available');
      }
    };

    // Hide cursor after inactivity
    let cursorTimeout;
    const hideCursor = () => {
      document.body.style.cursor = 'none';
    };

    const showCursor = () => {
      document.body.style.cursor = 'default';
      clearTimeout(cursorTimeout);
      cursorTimeout = setTimeout(hideCursor, 3000);
    };

    const handleMouseMove = () => showCursor();

    // Auto-hide cursor and enter fullscreen
    enterFullscreen();
    showCursor();

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(cursorTimeout);
      document.body.style.cursor = 'default';
    };
  }, []);

  // Get slide formatting
  const { data: slideFormatting } = useQuery(
    ['slide-formatting', currentSlide?.id],
    () => api.get(`/presentations/${presentationId}/slides/${currentSlide.id}/formatting`),
    { enabled: !!currentSlide?.id }
  );

  // Get slide notes for stage display
  const { data: slideNotes } = useQuery(
    ['slide-notes', currentSlide?.id],
    () => api.get(`/presentations/${presentationId}/slides/${currentSlide.id}/notes`),
    { enabled: !!currentSlide?.id && displayType === 'stage_monitor' }
  );

  const formatting = slideFormatting || {};
  const notes = slideNotes?.find(n => n.note_type === 'stage_notes');

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        bgcolor: formatting.backgroundColor || '#000000',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Safe Zone Indicator (only in editor mode) */}
      {displayType === 'audience' && (
        <Box
          sx={{
            position: 'absolute',
            top: '5%',
            left: '5%',
            right: '5%',
            bottom: '5%',
            border: '2px solid rgba(255,255,255,0.1)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
          position: 'relative'
        }}
      >
        <Fade in={transitionIn} timeout={300}>
          <Box
            sx={{
              textAlign: formatting.textAlign || 'center',
              maxWidth: '90%',
              maxHeight: '90%',
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {/* Slide Title */}
            {currentSlide?.title && (
              <Typography
                variant="h1"
                sx={{
                  fontSize: `${(formatting.fontSize || 48) * 2}px`,
                  fontFamily: formatting.fontFamily || 'Arial',
                  fontWeight: formatting.fontWeight || 'bold',
                  color: formatting.fontColor || '#FFFFFF',
                  textShadow: formatting.shadowColor
                    ? `2px 2px 4px ${formatting.shadowColor}`
                    : '2px 2px 4px rgba(0,0,0,0.5)',
                  mb: 4,
                  lineHeight: formatting.lineHeight || 1.2,
                  letterSpacing: formatting.letterSpacing || 0,
                  textTransform: formatting.textTransform || 'none',
                  textAlign: 'inherit'
                }}
              >
                {currentSlide.title}
              </Typography>
            )}

            {/* Slide Content */}
            {currentSlide?.content && (
              <Typography
                variant="h2"
                  sx={{
                  fontSize: `${formatting.fontSize || 48}px`,
                  fontFamily: formatting.fontFamily || 'Arial',
                  fontWeight: formatting.fontWeight || 'normal',
                  color: formatting.fontColor || '#FFFFFF',
                  textShadow: formatting.shadowColor
                    ? `2px 2px 4px ${formatting.shadowColor}`
                    : '2px 2px 4px rgba(0,0,0,0.5)',
                    whiteSpace: 'pre-wrap',
                  lineHeight: formatting.lineHeight || 1.3,
                  letterSpacing: formatting.letterSpacing || 0,
                  textTransform: formatting.textTransform || 'none',
                  textAlign: 'inherit',
                  maxWidth: '100%',
                  overflow: 'hidden'
                  }}
                >
                  {currentSlide.content}
              </Typography>
              )}

            {/* Stage Notes (only for stage monitor) */}
            {displayType === 'stage_monitor' && notes && notes.visible_on_stage && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 20,
                  left: 20,
                  right: 20,
                  bgcolor: notes.background_color || '#333333',
                  p: 2,
                  borderRadius: 1,
                  opacity: 0.9
                }}
              >
                <Typography
                  sx={{
                    fontSize: notes.font_size || 24,
                    color: notes.font_color || '#FFFFFF',
                    textAlign: 'center'
                  }}
                >
                  {notes.content}
                </Typography>
              </Box>
              )}
          </Box>
        </Fade>
          </Box>

      {/* Status Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          bgcolor: 'rgba(0,0,0,0.7)',
          px: 2,
          py: 1,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: livePresentation?.is_active ? '#4caf50' : '#f44336'
          }}
        />
        <Typography variant="caption" sx={{ color: 'white' }}>
          {livePresentation?.is_active ? 'LIVE' : 'OFFLINE'} - {displayType.replace('_', ' ').toUpperCase()}
        </Typography>
      </Box>

      {/* No Content Message */}
      {!currentSlide && livePresentation?.is_active && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center'
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: 'rgba(255,255,255,0.3)',
              fontSize: '2rem'
            }}
          >
            Waiting for content...
          </Typography>
        </Box>
      )}
    </Box>
  );
}