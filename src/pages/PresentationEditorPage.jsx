import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  IconButton,
  Collapse,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  Add,
  PlayArrow,
  Save,
  Delete,
  ContentCopy,
  DragIndicator,
  Visibility,
  VisibilityOff,
  MoreVert,
  Edit,
  Fullscreen,
  ExpandMore,
  ExpandLess,
  Slideshow,
  FolderOpen
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
import api from '../services/api';
import MotionBackground from '../components/MotionGraphics';

// Edit functionality components
import { useState as useStateGlobal } from 'react';

export default function PresentationEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedSlide, setSelectedSlide] = useState(0);
  const [openSlideDialog, setOpenSlideDialog] = useState(false);
  const [slideTitle, setSlideTitle] = useState('');
  const [slideContent, setSlideContent] = useState('');
  const [presentation, setPresentation] = useState(null);
  
  // Edit functionality state
  const [findDialogOpen, setFindDialogOpen] = useState(false);
  const [replaceDialogOpen, setReplaceDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [replaceTerm, setReplaceTerm] = useState('');
  
  // Dialog states (theme/transitions accessible from Presentation menu)
  const [themeDialogOpen, setThemeDialogOpen] = useState(false);
  const [transitionDialogOpen, setTransitionDialogOpen] = useState(false);
  const [expandedPresentations, setExpandedPresentations] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Formatting state
  const [formatting, setFormatting] = useState({
    fontFamily: 'Arial',
    fontSize: 48,
    fontColor: '#FFFFFF',
    fontWeight: 'normal',
    textAlign: 'center',
    backgroundColor: '#000000',
    backgroundImage: '',
    motion: {
      particleType: 'none',
      particleColor: 'rgba(255,255,255,0.5)',
      particleCount: 30,
      lightRays: false,
      lightRayColor: 'rgba(255,215,0,0.15)',
      floatingElements: false,
      floatingType: 'circles',
      floatingColor: 'rgba(255,255,255,0.1)',
      waves: false,
      lensFlare: false,
      lensFlareColor: '#ffd700',
      animatedGradient: false
    },
    transitionType: 'fade',
    transitionDuration: 500
  });

  const { data: presentationData, isLoading } = useQuery(
    ['presentation', id],
    () => api.get(`/presentations/${id}`),
    { enabled: !!id && id !== 'new' }
  );

  // Fetch all saved presentations for sidebar
  const { data: allPresentationsData, isLoading: loadingPresentations } = useQuery(
    ['presentations'],
    () => api.get('/presentations'),
    { staleTime: 30000 }
  );
  // Handle different API response formats
  const savedPresentations = Array.isArray(allPresentationsData?.data) 
    ? allPresentationsData.data 
    : Array.isArray(allPresentationsData?.data?.data) 
      ? allPresentationsData.data.data 
      : Array.isArray(allPresentationsData?.data?.presentations)
        ? allPresentationsData.data.presentations
        : [];

  const togglePresentationExpand = (presId) => {
    setExpandedPresentations(prev => ({ ...prev, [presId]: !prev[presId] }));
  };

  const handleLoadPresentation = (presId) => {
    navigate(`/presentations/${presId}/edit`);
  };

  const handleSelectSlideFromSidebar = (presId, slideIndex) => {
    if (presId === id || presId === presentation?.id) {
      setSelectedSlide(slideIndex);
    } else {
      navigate(`/presentations/${presId}/edit`);
    }
  };

  useEffect(() => {
    if (id === 'new') {
      setPresentation({ id: null, title: '', slides: [], formatting: formatting });
      return;
    }
    if (presentationData?.data) {
      setPresentation(presentationData.data);
      // Load saved formatting if available
      if (presentationData.data.formatting) {
        setFormatting(prev => ({ ...prev, ...presentationData.data.formatting }));
      }
    }
  }, [presentationData, id]);

  // Emit presentation updates to ProPresenterSidebar
  useEffect(() => {
    if (presentation) {
      window.dispatchEvent(new CustomEvent('presentation:update', { detail: presentation }));
    }
  }, [presentation]);

  // Listen for slide selection from ProPresenterSidebar
  useEffect(() => {
    const handleSlideSelected = (event) => {
      if (event.detail?.slideIndex !== undefined) {
        setSelectedSlide(event.detail.slideIndex);
      }
    };
    window.addEventListener('slide:selected', handleSlideSelected);
    return () => window.removeEventListener('slide:selected', handleSlideSelected);
  }, []);

  // Broadcast slide changes to output screens (Main Output & Stage Display)
  useEffect(() => {
    if (presentation?.slides) {
      const currentSlideData = presentation.slides[selectedSlide];
      const nextSlideData = presentation.slides[selectedSlide + 1];
      
      window.dispatchEvent(new CustomEvent('slide:change', {
        detail: {
          currentSlide: currentSlideData || null,
          nextSlide: nextSlideData || null,
          formatting: formatting,
          slideIndex: selectedSlide,
          totalSlides: presentation.slides.length,
          presentationTitle: presentation.title
        }
      }));
    }
  }, [selectedSlide, presentation, formatting]);

  // Listen for font/theme selection from second toolbar dropdowns
  useEffect(() => {
    const handleFontSelected = (event) => {
      if (event.detail?.font) {
        const newFormatting = { ...formatting, fontFamily: event.detail.font };
        setFormatting(newFormatting);
        // Apply to presentation for persistence
        if (presentation) {
          setPresentation(prev => ({ ...prev, formatting: newFormatting }));
        }
      }
    };
    const handleThemeSelected = (event) => {
      if (event.detail?.theme) {
        const theme = event.detail.theme;
        const newFormatting = {
          ...formatting,
          backgroundColor: theme.colors?.background || formatting.backgroundColor,
          fontColor: theme.colors?.text || formatting.fontColor,
          fontFamily: theme.fonts?.heading || formatting.fontFamily,
          themeId: theme.id,
          themeName: theme.name,
          motion: theme.motion || formatting.motion
        };
        setFormatting(newFormatting);
        if (presentation) {
          setPresentation(prev => ({ ...prev, formatting: newFormatting }));
        }
      }
    };
    
    window.addEventListener('font:selected', handleFontSelected);
    window.addEventListener('presentation:theme:selected', handleThemeSelected);
    
    return () => {
      window.removeEventListener('font:selected', handleFontSelected);
      window.removeEventListener('presentation:theme:selected', handleThemeSelected);
    };
  }, [formatting, presentation]);

  // Edit functionality event listeners
  useEffect(() => {
    const handleFind = () => {
      setFindDialogOpen(true);
    };

    const handleReplace = () => {
      setReplaceDialogOpen(true);
    };

    const handleSelectAll = () => {
      // Select all slides in the presentation
      if (presentation && presentation.slides) {
        // Could implement bulk selection here
        console.log('Select all slides');
      }
    };

    window.addEventListener('app:find', handleFind);
    window.addEventListener('app:replace', handleReplace);
    window.addEventListener('app:select-all', handleSelectAll);

    return () => {
      window.removeEventListener('app:find', handleFind);
      window.removeEventListener('app:replace', handleReplace);
      window.removeEventListener('app:select-all', handleSelectAll);
    };
  }, [presentation]);

  // Find functionality
  const handleFindNext = () => {
    if (!searchTerm || !presentation?.slides) return;
    
    const currentSlideIndex = selectedSlide;
    const slides = presentation.slides;
    
    // Search from current slide onwards
    for (let i = currentSlideIndex; i < slides.length; i++) {
      const slide = slides[i];
      if (slide.title && slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slide.content && slide.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        setSelectedSlide(i);
        return;
      }
    }
    
    // Search from beginning if not found
    for (let i = 0; i < currentSlideIndex; i++) {
      const slide = slides[i];
      if (slide.title && slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          slide.content && slide.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        setSelectedSlide(i);
        return;
      }
    }
    
    alert(`"${searchTerm}" not found`);
  };

  // Replace functionality
  const handleReplaceAll = () => {
    if (!searchTerm || !presentation?.slides) return;
    
    let replacedCount = 0;
    const updatedSlides = presentation.slides.map(slide => {
      let updatedSlide = { ...slide };
      let changed = false;
      
      if (slide.title && slide.title.includes(searchTerm)) {
        updatedSlide.title = slide.title.replaceAll(searchTerm, replaceTerm);
        changed = true;
      }
      
      if (slide.content && slide.content.includes(searchTerm)) {
        updatedSlide.content = slide.content.replaceAll(searchTerm, replaceTerm);
        changed = true;
      }
      
      if (changed) {
        replacedCount++;
      }
      
      return updatedSlide;
    });
    
    if (replacedCount > 0) {
      setPresentation({ ...presentation, slides: updatedSlides });
      alert(`Replaced "${searchTerm}" with "${replaceTerm}" in ${replacedCount} slide(s)`);
    } else {
      alert(`No occurrences of "${searchTerm}" found`);
    }
    
    setReplaceDialogOpen(false);
    setSearchTerm('');
    setReplaceTerm('');
  };

  const updateMutation = useMutation(
    (data) => {
      if (!id || id === 'new') {
        throw new Error('Cannot update unsaved presentation');
      }
      return api.put(`/presentations/${id}`, data);
    },
    { 
      onSuccess: () => queryClient.invalidateQueries(['presentation', id]),
      onError: (error) => {
        console.error('Failed to update presentation:', error);
        alert('Please save the presentation first before making changes.');
      }
    }
  );

  const addSlideMutation = useMutation(
    (data) => {
      if (!id || id === 'new') {
        throw new Error('Cannot add slide to unsaved presentation');
      }
      return api.post(`/presentations/${id}/slides`, data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['presentation', id]);
        setOpenSlideDialog(false);
        setSlideTitle('');
        setSlideContent('');
      },
      onError: (error) => {
        console.error('Failed to add slide:', error);
        // Show error message to user
        alert('Please save the presentation first before adding slides.');
      }
    }
  );

  const handleGoLive = () => navigate(`/live-control/${id}`);

  const handleSavePresentation = async () => {
    if (id === 'new') {
      try {
        const res = await api.post('/presentations', { 
          title: presentation?.title || 'Untitled Presentation',
          slides: presentation?.slides || [],
          formatting: formatting
        });
        const created = res.data || res.data?.data;
        const newId = created?.id || created?.data?.id;
        if (newId) navigate(`/presentations/${newId}/edit`);
      } catch (err) {
        console.error('Failed to create presentation', err);
      }
    } else {
      updateMutation.mutate({ 
        title: presentation?.title, 
        slides: presentation?.slides,
        formatting: formatting 
      });
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#ccc' }}>
        <Typography>Loading presentation...</Typography>
      </Box>
    );
  }

  const currentSlide = presentation?.slides?.[selectedSlide];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)', bgcolor: '#0d0d0f' }}>
      {/* Professional Header Bar */}
      <Box sx={{ 
        px: 2, 
        py: 1, 
        borderBottom: '1px solid #1f1f24', 
        bgcolor: '#141418', 
        display: 'flex', 
        alignItems: 'center', 
        gap: 2,
        background: 'linear-gradient(180deg, #18181c 0%, #141418 100%)'
      }}>
        <TextField
          size="small"
          placeholder="Presentation Title"
          value={presentation?.title || ''}
          onChange={(e) => setPresentation({ ...presentation, title: e.target.value })}
          sx={{
            width: 300,
            '& .MuiInputBase-root': { 
              bgcolor: '#1a1a1f', 
              color: '#fff', 
              height: 38,
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              '&:hover': { bgcolor: '#1f1f24' },
              '&.Mui-focused': { bgcolor: '#1f1f24', boxShadow: '0 0 0 2px rgba(0,136,255,0.3)' }
            },
            '& .MuiInputBase-input': { color: '#fff', fontSize: '0.9rem', fontWeight: 500 },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' }
          }}
        />
        <Button 
          size="small" 
          variant="contained" 
          startIcon={<Save />} 
          onClick={handleSavePresentation} 
          sx={{ 
            bgcolor: '#0088ff', 
            textTransform: 'none',
            borderRadius: '8px',
            px: 2.5,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,136,255,0.3)',
            '&:hover': { 
              bgcolor: '#0099ff',
              boxShadow: '0 4px 12px rgba(0,136,255,0.4)',
              transform: 'translateY(-1px)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Save
        </Button>
        <Button 
          size="small" 
          variant="contained" 
          startIcon={<PlayArrow />} 
          onClick={handleGoLive} 
          disabled={id === 'new'} 
          sx={{ 
            bgcolor: '#00cc88',
            textTransform: 'none',
            borderRadius: '8px',
            px: 2.5,
            fontWeight: 600,
            boxShadow: '0 2px 8px rgba(0,204,136,0.3)',
            '&:hover': { 
              bgcolor: '#00dd99',
              boxShadow: '0 4px 12px rgba(0,204,136,0.4)',
              transform: 'translateY(-1px)'
            },
            '&:disabled': { bgcolor: '#333', color: '#666' },
            transition: 'all 0.2s ease'
          }}
        >
          Go Live
        </Button>
        <Box sx={{ flex: 1 }} />
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<Add />} 
          onClick={() => setOpenSlideDialog(true)} 
          sx={{ 
            color: '#b0b0b8', 
            borderColor: '#2a2a30', 
            textTransform: 'none',
            borderRadius: '8px',
            px: 2,
            '&:hover': { 
              borderColor: '#0088ff',
              color: '#0088ff',
              bgcolor: 'rgba(0,136,255,0.08)'
            },
            transition: 'all 0.2s ease'
          }}
        >
          Add Slide
        </Button>
      </Box>

      {/* Main Content - Professional Layout */}
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', bgcolor: '#0d0d0f' }}>
        {/* Saved Presentations Sidebar */}
        {sidebarOpen && (
          <Box sx={{ 
            width: 280, 
            borderRight: '1px solid #1f1f24', 
            bgcolor: '#141418', 
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            <Box sx={{ 
              p: 1.5, 
              borderBottom: '1px solid #1f1f24', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              bgcolor: '#18181c'
            }}>
              <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#b0b0b8', display: 'flex', alignItems: 'center', gap: 1 }}>
                <FolderOpen sx={{ fontSize: 18 }} /> Presentations
              </Typography>
              <Tooltip title="New Presentation">
                <IconButton size="small" onClick={() => navigate('/presentations/new')} sx={{ color: '#0088ff' }}>
                  <Add sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {/* Current Presentation Section */}
              {presentation && (
                <Box sx={{ borderBottom: '1px solid #2a2a30', mb: 1 }}>
                  <Box sx={{ px: 1.5, py: 1, bgcolor: '#1a1a1f' }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#0088ff', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      Current Presentation
                    </Typography>
                  </Box>
                  <ListItemButton 
                    onClick={() => setExpandedPresentations(prev => ({ ...prev, current: !prev.current }))}
                    sx={{ 
                      py: 1,
                      bgcolor: 'rgba(0,136,255,0.15)',
                      borderLeft: '3px solid #0088ff',
                      '&:hover': { bgcolor: 'rgba(0,136,255,0.2)' }
                    }}
                  >
                    <Slideshow sx={{ fontSize: 18, color: '#0088ff', mr: 1.5 }} />
                    <ListItemText 
                      primary={presentation.title || 'Untitled Presentation'} 
                      secondary={`${presentation.slides?.length || 0} slides`}
                      primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}
                      secondaryTypographyProps={{ fontSize: '0.7rem', color: '#0088ff' }}
                    />
                    {expandedPresentations.current ? <ExpandLess sx={{ color: '#0088ff' }} /> : <ExpandMore sx={{ color: '#0088ff' }} />}
                  </ListItemButton>
                  <Collapse in={expandedPresentations.current !== false} timeout="auto">
                    <List component="div" disablePadding sx={{ bgcolor: '#0d0d0f' }}>
                      {presentation.slides?.map((slide, idx) => (
                        <ListItemButton 
                          key={idx} 
                          onClick={() => setSelectedSlide(idx)}
                          sx={{ 
                            pl: 4, 
                            py: 0.75,
                            bgcolor: idx === selectedSlide ? 'rgba(0,136,255,0.2)' : 'transparent',
                            borderLeft: idx === selectedSlide ? '2px solid #0088ff' : '2px solid transparent',
                            '&:hover': { bgcolor: 'rgba(0,136,255,0.1)' }
                          }}
                        >
                          <Box sx={{ 
                            width: 48, 
                            height: 32, 
                            bgcolor: formatting.backgroundColor || '#1a1a1f', 
                            borderRadius: '4px', 
                            border: idx === selectedSlide ? '2px solid #0088ff' : '1px solid #2a2a30',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 1.5,
                            fontSize: '0.6rem',
                            color: formatting.fontColor || '#888',
                            overflow: 'hidden',
                            position: 'relative'
                          }}>
                            <Typography sx={{ fontSize: '0.5rem', textAlign: 'center', px: 0.5, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {slide.title?.substring(0, 8) || idx + 1}
                            </Typography>
                          </Box>
                          <Box sx={{ flex: 1, overflow: 'hidden' }}>
                            <Typography sx={{ fontSize: '0.8rem', color: idx === selectedSlide ? '#fff' : '#b0b0b8', fontWeight: idx === selectedSlide ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {slide.title || `Slide ${idx + 1}`}
                            </Typography>
                            <Typography sx={{ fontSize: '0.65rem', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {slide.content?.substring(0, 30) || 'No content'}
                            </Typography>
                          </Box>
                        </ListItemButton>
                      ))}
                      {(!presentation.slides || presentation.slides.length === 0) && (
                        <Box sx={{ p: 2, textAlign: 'center' }}>
                          <Typography sx={{ fontSize: '0.75rem', color: '#555', fontStyle: 'italic' }}>
                            No slides yet - click "Add Slide" to create one
                          </Typography>
                        </Box>
                      )}
                    </List>
                  </Collapse>
                </Box>
              )}

              {/* Saved Presentations Section */}
              <Box sx={{ px: 1.5, py: 1, bgcolor: '#18181c' }}>
                <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: '#707078', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Saved Presentations
                </Typography>
              </Box>
              {loadingPresentations ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress size={24} sx={{ color: '#0088ff' }} />
                </Box>
              ) : savedPresentations.length === 0 ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Slideshow sx={{ fontSize: 40, color: '#333', mb: 1 }} />
                  <Typography sx={{ color: '#666', fontSize: '0.8rem' }}>No saved presentations</Typography>
                </Box>
              ) : (
                <List dense sx={{ p: 0 }}>
                  {savedPresentations.map((pres) => (
                    <Box key={pres.id || pres._id}>
                      <ListItemButton 
                        onClick={() => togglePresentationExpand(pres.id || pres._id)}
                        sx={{ 
                          py: 1,
                          bgcolor: (pres.id || pres._id) === id ? 'rgba(0,136,255,0.1)' : 'transparent',
                          borderLeft: (pres.id || pres._id) === id ? '3px solid #0088ff' : '3px solid transparent',
                          '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                        }}
                      >
                        <Slideshow sx={{ fontSize: 18, color: '#0088ff', mr: 1.5 }} />
                        <ListItemText 
                          primary={pres.title || 'Untitled'} 
                          secondary={`${pres.slides?.length || 0} slides`}
                          primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, color: '#e0e0e0' }}
                          secondaryTypographyProps={{ fontSize: '0.7rem', color: '#707078' }}
                        />
                        {expandedPresentations[pres.id || pres._id] ? <ExpandLess sx={{ color: '#666' }} /> : <ExpandMore sx={{ color: '#666' }} />}
                      </ListItemButton>
                      <Collapse in={expandedPresentations[pres.id || pres._id]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding sx={{ bgcolor: '#0d0d0f' }}>
                          {pres.slides?.map((slide, idx) => (
                            <ListItemButton 
                              key={idx} 
                              onClick={() => handleSelectSlideFromSidebar(pres.id || pres._id, idx)}
                              sx={{ 
                                pl: 4, 
                                py: 0.5,
                                bgcolor: ((pres.id || pres._id) === id && idx === selectedSlide) ? 'rgba(0,136,255,0.15)' : 'transparent',
                                '&:hover': { bgcolor: 'rgba(0,136,255,0.08)' }
                              }}
                            >
                              <Box sx={{ 
                                width: 40, 
                                height: 28, 
                                bgcolor: '#1a1a1f', 
                                borderRadius: '4px', 
                                border: '1px solid #2a2a30',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1.5,
                                fontSize: '0.65rem',
                                color: '#888'
                              }}>
                                {idx + 1}
                              </Box>
                              <Typography sx={{ fontSize: '0.75rem', color: '#b0b0b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {slide.title || `Slide ${idx + 1}`}
                              </Typography>
                            </ListItemButton>
                          ))}
                          {(!pres.slides || pres.slides.length === 0) && (
                            <Typography sx={{ pl: 4, py: 1, fontSize: '0.7rem', color: '#555', fontStyle: 'italic' }}>
                              No slides
                            </Typography>
                          )}
                        </List>
                      </Collapse>
                      <Divider sx={{ bgcolor: '#1f1f24' }} />
                    </Box>
                  ))}
                </List>
              )}
            </Box>
          </Box>
        )}

        {/* Slide Editor - Center Area */}
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          p: 2.5,
          background: 'linear-gradient(180deg, #0d0d0f 0%, #101014 100%)'
        }}>
          {currentSlide ? (
            <>
              {/* Live Preview with Motion Graphics */}
              <Box sx={{
                position: 'relative',
                flex: 1,
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                  zIndex: 10
                }
              }}>
              <MotionBackground
                particleType={formatting.motion?.particleType || 'none'}
                particleColor={formatting.motion?.particleColor}
                particleCount={formatting.motion?.particleCount || 30}
                lightRays={formatting.motion?.lightRays}
                lightRayColor={formatting.motion?.lightRayColor}
                floatingElements={formatting.motion?.floatingElements}
                floatingType={formatting.motion?.floatingType}
                floatingColor={formatting.motion?.floatingColor}
                waves={formatting.motion?.waves}
                waveColor={formatting.motion?.waveColor}
                lensFlare={formatting.motion?.lensFlare}
                lensFlareColor={formatting.motion?.lensFlareColor}
                animatedGradient={formatting.motion?.animatedGradient}
                videoSrc={formatting.motion?.videoUrl}
                sx={{
                  flex: 1,
                  background: formatting.backgroundColor,
                  backgroundImage: formatting.backgroundImage ? `url(${formatting.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: formatting.textAlign === 'left' ? 'flex-start' : formatting.textAlign === 'right' ? 'flex-end' : 'center',
                  justifyContent: 'center',
                  p: 4,
                  borderRadius: 2,
                  minHeight: 300
                }}
              >
                <Typography
                  sx={{
                    fontFamily: formatting.fontFamily,
                    fontSize: `${Math.min(formatting.fontSize, 72)}px`,
                    fontWeight: formatting.fontWeight,
                    color: formatting.fontColor,
                    textAlign: formatting.textAlign,
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    mb: 2
                  }}
                >
                  {currentSlide.title || 'Slide Title'}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: formatting.fontFamily,
                    fontSize: `${Math.min(formatting.fontSize * 0.6, 36)}px`,
                    fontWeight: formatting.fontWeight,
                    color: formatting.fontColor,
                    textAlign: formatting.textAlign,
                    textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                    whiteSpace: 'pre-wrap',
                    maxWidth: '80%'
                  }}
                >
                  {currentSlide.content || 'Content appears here...'}
                </Typography>
                <Box sx={{ 
                  position: 'absolute', 
                  bottom: 12, 
                  right: 16, 
                  color: 'rgba(255,255,255,0.5)', 
                  fontSize: '0.75rem', 
                  zIndex: 2,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '6px',
                  backdropFilter: 'blur(4px)'
                }}>
                  Slide {selectedSlide + 1} of {presentation?.slides?.length || 0}
                </Box>
              </MotionBackground>
              </Box>

              {/* Editor Fields - Professional Styling */}
              <Box sx={{ 
                mt: 2.5, 
                p: 2, 
                bgcolor: '#141418', 
                borderRadius: '12px', 
                border: '1px solid #1f1f24'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Slide Title"
                      value={currentSlide.title || ''}
                      onChange={(e) => {
                        const updated = [...presentation.slides];
                        updated[selectedSlide] = { ...updated[selectedSlide], title: e.target.value };
                        setPresentation({ ...presentation, slides: updated });
                      }}
                      sx={{
                        '& .MuiInputBase-root': { 
                          bgcolor: '#1a1a1f', 
                          color: '#fff',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        },
                        '& .MuiInputBase-input': { 
                          color: '#fff', 
                          caretColor: '#0088ff', 
                          '&::selection': { bgcolor: '#0066cc', color: '#fff' } 
                        },
                        '& .MuiInputLabel-root': { color: '#707078' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' },
                        '& .MuiOutlinedInput-root.Mui-focused': { boxShadow: '0 0 0 3px rgba(0,136,255,0.15)' }
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      rows={3}
                      label="Slide Content"
                      value={currentSlide.content || ''}
                      onChange={(e) => {
                        const updated = [...presentation.slides];
                        updated[selectedSlide] = { ...updated[selectedSlide], content: e.target.value };
                        setPresentation({ ...presentation, slides: updated });
                      }}
                      sx={{
                        '& .MuiInputBase-root': { 
                          bgcolor: '#1a1a1f', 
                          color: '#fff',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        },
                        '& .MuiInputBase-input': { 
                          color: '#fff', 
                          caretColor: '#0088ff', 
                          '&::selection': { bgcolor: '#0066cc', color: '#fff' } 
                        },
                        '& .MuiInputLabel-root': { color: '#707078' },
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' },
                        '& .MuiOutlinedInput-root.Mui-focused': { boxShadow: '0 0 0 3px rgba(0,136,255,0.15)' }
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </>
          ) : (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'radial-gradient(ellipse at center, #1a1a1f 0%, #0d0d0f 100%)',
              borderRadius: '12px',
              border: '1px dashed #2a2a30'
            }}>
              <Box sx={{ 
                width: 80, 
                height: 80, 
                borderRadius: '50%', 
                bgcolor: '#141418', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 3,
                border: '2px solid #1f1f24'
              }}>
                <Add sx={{ fontSize: 40, color: '#3a3a42' }} />
              </Box>
              <Typography variant="h6" sx={{ mb: 1, color: '#b0b0b8', fontWeight: 500 }}>No Slide Selected</Typography>
              <Typography variant="body2" sx={{ mb: 3, color: '#707078', maxWidth: 300, textAlign: 'center' }}>
                Add a slide to get started or select one from the sidebar
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => setOpenSlideDialog(true)} 
                sx={{ 
                  bgcolor: '#0088ff',
                  borderRadius: '8px',
                  px: 3,
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px rgba(0,136,255,0.3)',
                  '&:hover': {
                    bgcolor: '#0099ff',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,136,255,0.4)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Add First Slide
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {/* Add Slide Dialog - Professional Styling */}
      <Dialog 
        open={openSlideDialog} 
        onClose={() => setOpenSlideDialog(false)} 
        maxWidth="sm" 
        fullWidth 
        PaperProps={{ 
          sx: { 
            bgcolor: '#141418', 
            color: '#fff',
            borderRadius: '16px',
            border: '1px solid #1f1f24',
            boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
          } 
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid #1f1f24', 
          pb: 2,
          fontWeight: 600,
          fontSize: '1.1rem'
        }}>
          Add New Slide
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField 
            autoFocus 
            fullWidth 
            label="Slide Title" 
            value={slideTitle} 
            onChange={(e) => setSlideTitle(e.target.value)} 
            sx={{ 
              mt: 1, 
              mb: 2.5, 
              '& .MuiInputBase-root': { bgcolor: '#1a1a1f', color: '#fff', borderRadius: '8px' }, 
              '& .MuiInputLabel-root': { color: '#707078' }, 
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' }
            }} 
          />
          <TextField 
            fullWidth 
            multiline 
            rows={4} 
            label="Slide Content" 
            value={slideContent} 
            onChange={(e) => setSlideContent(e.target.value)} 
            sx={{ 
              '& .MuiInputBase-root': { bgcolor: '#1a1a1f', color: '#fff', borderRadius: '8px' }, 
              '& .MuiInputLabel-root': { color: '#707078' }, 
              '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' }
            }} 
          />
        </DialogContent>
        <DialogActions sx={{ p: 2.5, borderTop: '1px solid #1f1f24' }}>
          <Button 
            onClick={() => setOpenSlideDialog(false)} 
            sx={{ 
              color: '#b0b0b8', 
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (id === 'new') {
                const newSlide = { id: Date.now().toString(), title: slideTitle, content: slideContent };
                setPresentation({ ...presentation, slides: [...(presentation.slides || []), newSlide] });
                setOpenSlideDialog(false);
                setSlideTitle('');
                setSlideContent('');
              } else {
                addSlideMutation.mutate({ title: slideTitle, content: slideContent });
              }
            }}
            variant="contained"
            sx={{ 
              bgcolor: '#0088ff',
              borderRadius: '8px',
              px: 3,
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': { bgcolor: '#0099ff' }
            }}
          >
            Add Slide
          </Button>
        </DialogActions>
      </Dialog>

      {/* Theme Dialog */}
      <Dialog open={themeDialogOpen} onClose={() => setThemeDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#2d2d2d', color: '#fff' } }}>
        <DialogTitle>Theme & Background</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <Typography sx={{ color: '#888', mb: 1, fontSize: '0.85rem' }}>Background Color</Typography>
              <TextField fullWidth type="color" value={formatting.backgroundColor} onChange={(e) => setFormatting({ ...formatting, backgroundColor: e.target.value })} sx={{ '& .MuiInputBase-root': { bgcolor: '#333', height: 50 } }} />
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: '#888', mb: 1, fontSize: '0.85rem' }}>Text Color</Typography>
              <TextField fullWidth type="color" value={formatting.fontColor} onChange={(e) => setFormatting({ ...formatting, fontColor: e.target.value })} sx={{ '& .MuiInputBase-root': { bgcolor: '#333', height: 50 } }} />
            </Grid>
            <Grid item xs={12}>
              <Typography sx={{ color: '#888', mb: 1, fontSize: '0.85rem' }}>Background Image URL</Typography>
              <TextField fullWidth placeholder="https://example.com/image.jpg" value={formatting.backgroundImage} onChange={(e) => setFormatting({ ...formatting, backgroundImage: e.target.value })} sx={{ '& .MuiInputBase-root': { bgcolor: '#333', color: '#fff' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#444' } }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setThemeDialogOpen(false)} sx={{ color: '#888' }}>Cancel</Button>
          <Button onClick={() => setThemeDialogOpen(false)} variant="contained" sx={{ bgcolor: '#0066cc' }}>Apply</Button>
        </DialogActions>
      </Dialog>


      {/* Transition Dialog */}
      <Dialog open={transitionDialogOpen} onClose={() => setTransitionDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { bgcolor: '#2d2d2d', color: '#fff' } }}>
        <DialogTitle>Transitions</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel sx={{ color: '#888' }}>Transition Type</InputLabel>
                <Select value={formatting.transitionType} onChange={(e) => setFormatting({ ...formatting, transitionType: e.target.value })} sx={{ bgcolor: '#333', color: '#fff' }}>
                  <MenuItem value="fade">Fade</MenuItem>
                  <MenuItem value="slide_left">Slide Left</MenuItem>
                  <MenuItem value="slide_right">Slide Right</MenuItem>
                  <MenuItem value="slide_up">Slide Up</MenuItem>
                  <MenuItem value="slide_down">Slide Down</MenuItem>
                  <MenuItem value="zoom">Zoom</MenuItem>
                  <MenuItem value="cut">Cut (No transition)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <Typography sx={{ color: '#888', fontSize: '0.85rem' }}>Duration: {formatting.transitionDuration}ms</Typography>
              <Slider value={formatting.transitionDuration} onChange={(e, value) => setFormatting({ ...formatting, transitionDuration: value })} min={100} max={2000} step={100} sx={{ color: '#0066cc', mt: 2 }} />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTransitionDialogOpen(false)} sx={{ color: '#888' }}>Cancel</Button>
          <Button onClick={() => setTransitionDialogOpen(false)} variant="contained" sx={{ bgcolor: '#0066cc' }}>Apply</Button>
        </DialogActions>
      </Dialog>

        {/* Find Dialog */}
        <Dialog open={findDialogOpen} onClose={() => setFindDialogOpen(false)}>
          <DialogTitle>Find</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Find text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiInputBase-root': { bgcolor: '#1a1a1f', color: '#fff', borderRadius: '8px' },
                '& .MuiInputLabel-root': { color: '#707078' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFindDialogOpen(false)} sx={{ color: '#888' }}>Cancel</Button>
            <Button onClick={handleFindNext} variant="contained" sx={{ bgcolor: '#0066cc' }}>Find Next</Button>
          </DialogActions>
        </Dialog>

        {/* Replace Dialog */}
        <Dialog open={replaceDialogOpen} onClose={() => setReplaceDialogOpen(false)}>
          <DialogTitle>Replace</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Find text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 2,
                '& .MuiInputBase-root': { bgcolor: '#1a1a1f', color: '#fff', borderRadius: '8px' },
                '& .MuiInputLabel-root': { color: '#707078' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' }
              }}
            />
            <TextField
              fullWidth
              label="Replace with"
              value={replaceTerm}
              onChange={(e) => setReplaceTerm(e.target.value)}
              sx={{
                '& .MuiInputBase-root': { bgcolor: '#1a1a1f', color: '#fff', borderRadius: '8px' },
                '& .MuiInputLabel-root': { color: '#707078' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#2a2a30' },
                '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#3a3a42' },
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0088ff' }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setReplaceDialogOpen(false)} sx={{ color: '#888' }}>Cancel</Button>
            <Button onClick={handleReplaceAll} variant="contained" sx={{ bgcolor: '#0066cc' }}>Replace All</Button>
          </DialogActions>
        </Dialog>
    </Box>
  );
}
