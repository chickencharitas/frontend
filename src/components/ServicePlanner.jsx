import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Divider,
  Menu,
  Tooltip,
  Collapse,
  Badge
} from '@mui/material';
import {
  Add,
  Delete,
  DragIndicator,
  PlayArrow,
  Pause,
  SkipNext,
  SkipPrevious,
  MusicNote,
  MenuBook,
  Announcement,
  VideoLibrary,
  Image,
  Timer,
  ExpandMore,
  ExpandLess,
  Edit,
  ContentCopy,
  MoreVert,
  Slideshow,
  Save,
  FolderOpen,
  Church,
  Celebration,
  NightsStay,
  WbSunny
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Service item types
const ITEM_TYPES = {
  SONG: { id: 'song', label: 'Song/Hymn', icon: MusicNote, color: '#8855ff' },
  SCRIPTURE: { id: 'scripture', label: 'Scripture', icon: MenuBook, color: '#00cc88' },
  ANNOUNCEMENT: { id: 'announcement', label: 'Announcement', icon: Announcement, color: '#ffaa00' },
  VIDEO: { id: 'video', label: 'Video', icon: VideoLibrary, color: '#ff4444' },
  IMAGE: { id: 'image', label: 'Image/Slide', icon: Image, color: '#0088ff' },
  PRESENTATION: { id: 'presentation', label: 'Presentation', icon: Slideshow, color: '#00aacc' },
  TIMER: { id: 'timer', label: 'Countdown', icon: Timer, color: '#ff8800' },
};

// Service templates
const SERVICE_TEMPLATES = [
  {
    id: 'sunday-morning',
    name: 'Sunday Morning Service',
    icon: WbSunny,
    items: [
      { type: 'announcement', title: 'Welcome', duration: 120 },
      { type: 'song', title: 'Opening Worship', duration: 300 },
      { type: 'song', title: 'Praise Song', duration: 240 },
      { type: 'scripture', title: 'Scripture Reading', duration: 180 },
      { type: 'song', title: 'Worship Song', duration: 300 },
      { type: 'presentation', title: 'Sermon', duration: 1800 },
      { type: 'song', title: 'Closing Song', duration: 240 },
      { type: 'announcement', title: 'Announcements', duration: 180 },
    ]
  },
  {
    id: 'evening-service',
    name: 'Evening Service',
    icon: NightsStay,
    items: [
      { type: 'song', title: 'Opening Worship', duration: 300 },
      { type: 'scripture', title: 'Scripture', duration: 180 },
      { type: 'presentation', title: 'Teaching', duration: 2400 },
      { type: 'song', title: 'Response Song', duration: 300 },
    ]
  },
  {
    id: 'special-event',
    name: 'Special Event',
    icon: Celebration,
    items: [
      { type: 'video', title: 'Intro Video', duration: 120 },
      { type: 'announcement', title: 'Welcome', duration: 60 },
      { type: 'presentation', title: 'Main Content', duration: 3600 },
      { type: 'announcement', title: 'Closing', duration: 60 },
    ]
  }
];

const ServicePlanner = ({ open, onClose, onGoLive }) => {
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState(null);
  const [serviceItems, setServiceItems] = useState([]);
  const [activeItemIndex, setActiveItemIndex] = useState(-1);
  const [isLive, setIsLive] = useState(false);
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [newItemType, setNewItemType] = useState('song');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newServiceDialogOpen, setNewServiceDialogOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');
  const [templateMenuAnchor, setTemplateMenuAnchor] = useState(null);
  const [expandedSections, setExpandedSections] = useState({ items: true });
  const [itemMenuAnchor, setItemMenuAnchor] = useState(null);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);

  // Load saved services from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('worshipress_services');
    if (saved) {
      try {
        setServices(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load services', e);
      }
    }
  }, []);

  // Save services to localStorage
  const saveServices = (newServices) => {
    setServices(newServices);
    localStorage.setItem('worshipress_services', JSON.stringify(newServices));
  };

  const handleCreateService = (template = null) => {
    const newService = {
      id: Date.now().toString(),
      name: template ? template.name : newServiceName || 'New Service',
      createdAt: new Date().toISOString(),
      items: template ? template.items.map((item, idx) => ({
        id: `${Date.now()}-${idx}`,
        ...item
      })) : []
    };
    
    const updated = [...services, newService];
    saveServices(updated);
    setCurrentService(newService);
    setServiceItems(newService.items);
    setNewServiceDialogOpen(false);
    setNewServiceName('');
    setTemplateMenuAnchor(null);
  };

  const handleAddItem = () => {
    if (!newItemTitle.trim()) return;
    
    const newItem = {
      id: Date.now().toString(),
      type: newItemType,
      title: newItemTitle,
      duration: 180,
      notes: ''
    };
    
    const updatedItems = [...serviceItems, newItem];
    setServiceItems(updatedItems);
    
    if (currentService) {
      const updatedServices = services.map(s => 
        s.id === currentService.id ? { ...s, items: updatedItems } : s
      );
      saveServices(updatedServices);
    }
    
    setAddItemDialogOpen(false);
    setNewItemTitle('');
    setNewItemType('song');
  };

  const handleDeleteItem = (index) => {
    const updatedItems = serviceItems.filter((_, i) => i !== index);
    setServiceItems(updatedItems);
    
    if (currentService) {
      const updatedServices = services.map(s => 
        s.id === currentService.id ? { ...s, items: updatedItems } : s
      );
      saveServices(updatedServices);
    }
    setItemMenuAnchor(null);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(serviceItems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setServiceItems(items);
    
    if (currentService) {
      const updatedServices = services.map(s => 
        s.id === currentService.id ? { ...s, items } : s
      );
      saveServices(updatedServices);
    }
  };

  const handleGoLive = () => {
    setIsLive(true);
    setActiveItemIndex(0);
    if (onGoLive) onGoLive(currentService, serviceItems);
  };

  const handleNextItem = () => {
    if (activeItemIndex < serviceItems.length - 1) {
      setActiveItemIndex(activeItemIndex + 1);
    }
  };

  const handlePrevItem = () => {
    if (activeItemIndex > 0) {
      setActiveItemIndex(activeItemIndex - 1);
    }
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTotalDuration = () => {
    return serviceItems.reduce((sum, item) => sum + (item.duration || 0), 0);
  };

  const getItemIcon = (type) => {
    const itemType = ITEM_TYPES[type.toUpperCase()];
    if (itemType) {
      const IconComponent = itemType.icon;
      return <IconComponent sx={{ color: itemType.color }} />;
    }
    return <Slideshow />;
  };

  const getItemColor = (type) => {
    const itemType = ITEM_TYPES[type.toUpperCase()];
    return itemType?.color || '#666';
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#141418',
          color: '#fff',
          borderRadius: '16px',
          border: '1px solid #1f1f24',
          minHeight: '70vh',
          maxHeight: '85vh'
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: '1px solid #1f1f24', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        py: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Church sx={{ color: '#0088ff' }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Service Planner
          </Typography>
          {currentService && (
            <Chip 
              label={currentService.name} 
              size="small" 
              sx={{ bgcolor: '#1f1f24', color: '#b0b0b8' }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {isLive && (
            <Chip 
              label="LIVE" 
              size="small" 
              sx={{ 
                bgcolor: '#ff3333', 
                color: '#fff',
                fontWeight: 700,
                animation: 'pulse 1.5s infinite'
              }}
            />
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0, display: 'flex', overflow: 'hidden' }}>
        {/* Left Sidebar - Service List */}
        <Box sx={{ 
          width: 240, 
          borderRight: '1px solid #1f1f24', 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="subtitle2" sx={{ color: '#707078', mb: 1.5, fontWeight: 600 }}>
            SERVICES
          </Typography>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Add />}
            onClick={(e) => setTemplateMenuAnchor(e.currentTarget)}
            sx={{
              mb: 2,
              borderColor: '#2a2a30',
              color: '#b0b0b8',
              borderRadius: '8px',
              textTransform: 'none',
              '&:hover': { borderColor: '#0088ff', color: '#0088ff' }
            }}
          >
            New Service
          </Button>

          <Menu
            anchorEl={templateMenuAnchor}
            open={Boolean(templateMenuAnchor)}
            onClose={() => setTemplateMenuAnchor(null)}
            PaperProps={{
              sx: { bgcolor: '#1f1f24', border: '1px solid #2a2a30', borderRadius: '8px' }
            }}
          >
            <MenuItem onClick={() => { setTemplateMenuAnchor(null); setNewServiceDialogOpen(true); }}>
              <ListItemIcon><Add sx={{ color: '#b0b0b8' }} /></ListItemIcon>
              <ListItemText primary="Blank Service" sx={{ color: '#fff' }} />
            </MenuItem>
            <Divider sx={{ bgcolor: '#2a2a30' }} />
            <Typography variant="caption" sx={{ px: 2, py: 1, color: '#707078', display: 'block' }}>
              Templates
            </Typography>
            {SERVICE_TEMPLATES.map(template => (
              <MenuItem key={template.id} onClick={() => handleCreateService(template)}>
                <ListItemIcon>
                  <template.icon sx={{ color: '#0088ff' }} />
                </ListItemIcon>
                <ListItemText primary={template.name} sx={{ color: '#fff' }} />
              </MenuItem>
            ))}
          </Menu>

          <List sx={{ flex: 1, overflow: 'auto' }}>
            {services.map(service => (
              <ListItem
                key={service.id}
                button
                selected={currentService?.id === service.id}
                onClick={() => {
                  setCurrentService(service);
                  setServiceItems(service.items || []);
                  setActiveItemIndex(-1);
                  setIsLive(false);
                }}
                sx={{
                  borderRadius: '8px',
                  mb: 0.5,
                  '&.Mui-selected': { bgcolor: 'rgba(0,136,255,0.15)' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Church sx={{ color: currentService?.id === service.id ? '#0088ff' : '#707078', fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText 
                  primary={service.name}
                  secondary={`${service.items?.length || 0} items`}
                  primaryTypographyProps={{ fontSize: '0.85rem', color: '#fff' }}
                  secondaryTypographyProps={{ fontSize: '0.7rem', color: '#707078' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>

        {/* Main Content - ProPresenter Style Layout */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar - Service Items (300px like ProPresenter) */}
          <Box sx={{ 
            width: 300, 
            display: 'flex', 
            flexDirection: 'column', 
            borderRight: '1px solid #1f1f24',
            overflow: 'hidden',
            bgcolor: '#1a1a1f'
          }}>
            {currentService ? (
              <>
                {/* Toolbar */}
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid #1f1f24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2
                }}>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setAddItemDialogOpen(true)}
                    sx={{
                      bgcolor: '#0088ff',
                      borderRadius: '8px',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#0099ff' }
                    }}
                  >
                    Add Item
                  </Button>
                  
                  <Box sx={{ flex: 1 }} />
                  
                  <Typography variant="body2" sx={{ color: '#707078' }}>
                    Total: {formatDuration(getTotalDuration())} • {serviceItems.length} items
                  </Typography>

                  <Divider orientation="vertical" sx={{ height: 24, bgcolor: '#2a2a30' }} />

                  {!isLive ? (
                    <Button
                      variant="contained"
                      startIcon={<PlayArrow />}
                      onClick={handleGoLive}
                      disabled={serviceItems.length === 0}
                      sx={{
                        bgcolor: '#00cc88',
                        borderRadius: '8px',
                        textTransform: 'none',
                        fontWeight: 600,
                        '&:hover': { bgcolor: '#00dd99' }
                      }}
                    >
                      Go Live
                    </Button>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton onClick={handlePrevItem} disabled={activeItemIndex <= 0} sx={{ color: '#fff' }}>
                        <SkipPrevious />
                      </IconButton>
                      <IconButton onClick={() => setIsLive(false)} sx={{ color: '#ff4444' }}>
                        <Pause />
                      </IconButton>
                      <IconButton onClick={handleNextItem} disabled={activeItemIndex >= serviceItems.length - 1} sx={{ color: '#fff' }}>
                        <SkipNext />
                      </IconButton>
                    </Box>
                  )}
                </Box>

                {/* Items List */}
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="service-items">
                      {(provided) => (
                        <List {...provided.droppableProps} ref={provided.innerRef}>
                          {serviceItems.map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <ListItem
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  sx={{
                                    bgcolor: snapshot.isDragging 
                                      ? '#2a2a30' 
                                      : activeItemIndex === index 
                                        ? 'rgba(0,204,136,0.15)' 
                                        : '#1a1a1f',
                                    borderRadius: '8px',
                                    mb: 1,
                                    border: activeItemIndex === index 
                                      ? '2px solid #00cc88' 
                                      : '1px solid #2a2a30',
                                    transition: 'all 0.2s ease',
                                    '&:hover': { bgcolor: '#1f1f24' }
                                  }}
                                >
                                  <Box {...provided.dragHandleProps} sx={{ mr: 1, cursor: 'grab' }}>
                                    <DragIndicator sx={{ color: '#505058' }} />
                                  </Box>
                                  
                                  <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Box sx={{
                                      width: 32,
                                      height: 32,
                                      borderRadius: '6px',
                                      bgcolor: `${getItemColor(item.type)}20`,
                                      display: 'flex',
                                      alignItems: 'center',
                                      justifyContent: 'center'
                                    }}>
                                      {getItemIcon(item.type)}
                                    </Box>
                                  </ListItemIcon>
                                  
                                  <ListItemText
                                    primary={item.title}
                                    secondary={
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                                        <Chip 
                                          label={ITEM_TYPES[item.type.toUpperCase()]?.label || item.type}
                                          size="small"
                                          sx={{ 
                                            height: 20, 
                                            fontSize: '0.65rem',
                                            bgcolor: `${getItemColor(item.type)}20`,
                                            color: getItemColor(item.type)
                                          }}
                                        />
                                        <Typography variant="caption" sx={{ color: '#707078' }}>
                                          {formatDuration(item.duration || 0)}
                                        </Typography>
                                      </Box>
                                    }
                                    primaryTypographyProps={{ 
                                      fontWeight: activeItemIndex === index ? 600 : 400,
                                      color: '#fff'
                                    }}
                                  />
                                  
                                  <ListItemSecondaryAction>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      {activeItemIndex === index && (
                                        <Chip 
                                          label="NOW" 
                                          size="small" 
                                          sx={{ 
                                            bgcolor: '#00cc88', 
                                            color: '#fff',
                                            fontWeight: 700,
                                            fontSize: '0.65rem',
                                            height: 20
                                          }} 
                                        />
                                      )}
                                      <IconButton 
                                        size="small"
                                        onClick={(e) => {
                                          setSelectedItemIndex(index);
                                          setItemMenuAnchor(e.currentTarget);
                                        }}
                                        sx={{ color: '#707078' }}
                                      >
                                        <MoreVert fontSize="small" />
                                      </IconButton>
                                    </Box>
                                  </ListItemSecondaryAction>
                                </ListItem>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </List>
                      )}
                    </Droppable>
                  </DragDropContext>

                  {serviceItems.length === 0 && (
                    <Box sx={{ 
                      textAlign: 'center', 
                      py: 8,
                      color: '#707078'
                    }}>
                      <Slideshow sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                      <Typography variant="body1" sx={{ mb: 1 }}>No items in this service</Typography>
                      <Typography variant="body2">Click "Add Item" to get started</Typography>
                    </Box>
                  )}
                </Box>
              </>
            ) : (
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#707078'
              }}>
                <Church sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6" sx={{ mb: 1 }}>No Service Selected</Typography>
                <Typography variant="body2">Create a new service or select one from the list</Typography>
              </Box>
            )}
          </Box>

          {/* Main Content Area - Preview/Output */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            bgcolor: '#141418',
            overflow: 'hidden'
          }}>
            {/* Preview Header */}
            <Box sx={{
              p: 2,
              borderBottom: '1px solid #1f1f24',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h6" sx={{ color: '#00cc88', fontWeight: 600 }}>
                {isLive ? 'LIVE OUTPUT' : 'PREVIEW'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={currentService?.name || 'No Service'} 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(0,136,255,0.15)', 
                    color: '#0088ff',
                    fontSize: '0.7rem'
                  }} 
                />
                {isLive && (
                  <Chip 
                    label="● LIVE" 
                    size="small"
                    sx={{ 
                      bgcolor: '#ff3333', 
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '0.7rem',
                      animation: 'pulse 1.5s infinite'
                    }} 
                  />
                )}
              </Box>
            </Box>

            {/* Preview Content */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center',
              p: 4,
              position: 'relative'
            }}>
              {activeItemIndex >= 0 && serviceItems[activeItemIndex] ? (
                <Box sx={{ 
                  textAlign: 'center',
                  maxWidth: '90%',
                  width: '100%'
                }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: '3.5rem',
                      fontWeight: 700,
                      color: '#ffffff',
                      textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                      mb: 3,
                      lineHeight: 1.2
                    }}
                  >
                    {serviceItems[activeItemIndex].title}
                  </Typography>
                  
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: '2rem',
                      fontWeight: 400,
                      color: '#ffffff',
                      textShadow: '2px 2px 8px rgba(0,0,0,0.5)',
                      whiteSpace: 'pre-wrap',
                      lineHeight: 1.5
                    }}
                  >
                    {serviceItems[activeItemIndex].content || 'Content goes here...'}
                  </Typography>

                  {/* Item Type Badge */}
                  <Box sx={{ position: 'absolute', top: 20, right: 20 }}>
                    <Chip
                      label={ITEM_TYPES[serviceItems[activeItemIndex].type.toUpperCase()]?.label || serviceItems[activeItemIndex].type}
                      size="small"
                      sx={{
                        bgcolor: `${getItemColor(serviceItems[activeItemIndex].type)}20`,
                        color: getItemColor(serviceItems[activeItemIndex].type),
                        fontSize: '0.7rem',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', color: '#505058' }}>
                  <Slideshow sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    {isLive ? 'Waiting for content...' : 'Select an item to preview'}
                  </Typography>
                  <Typography variant="body2">
                    {currentService ? 'Click an item in the service list' : 'Create a service and add items'}
                  </Typography>
                </Box>
              )}

              {/* Safe Zone Indicator */}
              <Box
                sx={{
                  position: 'absolute',
                  top: '5%',
                  left: '5%',
                  right: '5%',
                  bottom: '5%',
                  border: '2px dashed rgba(255,255,255,0.1)',
                  pointerEvents: 'none',
                  borderRadius: '8px'
                }}
              />
            </Box>

            {/* Preview Footer */}
            <Box sx={{
              p: 2,
              borderTop: '1px solid #1f1f24',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              bgcolor: '#141418'
            }}>
              <Typography variant="body2" sx={{ color: '#707078' }}>
                {activeItemIndex >= 0 ? `Item ${activeItemIndex + 1} of ${serviceItems.length}` : 'No active item'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#707078' }}>
                {activeItemIndex >= 0 && serviceItems[activeItemIndex] ? 
                  formatDuration(serviceItems[activeItemIndex].duration || 0) : '0:00'
                }
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Right Sidebar - Preview/Info */}
        <Box sx={{ 
          width: 280, 
          borderLeft: '1px solid #1f1f24', 
          p: 2,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Typography variant="subtitle2" sx={{ color: '#707078', mb: 1.5, fontWeight: 600 }}>
            SCREENS
          </Typography>
          
          <Paper sx={{ 
            bgcolor: '#1a1a1f', 
            p: 2, 
            borderRadius: '8px',
            border: '1px solid #2a2a30',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#b0b0b8' }}>Audience Display</Typography>
              <Chip label="Ready" size="small" sx={{ bgcolor: '#00cc8820', color: '#00cc88', fontSize: '0.65rem' }} />
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => window.open('/projection/demo/audience', '_blank', 'width=1280,height=720')}
              sx={{ 
                borderColor: '#2a2a30', 
                color: '#b0b0b8',
                borderRadius: '6px',
                textTransform: 'none',
                '&:hover': { borderColor: '#0088ff' }
              }}
            >
              Open Window
            </Button>
          </Paper>

          <Paper sx={{ 
            bgcolor: '#1a1a1f', 
            p: 2, 
            borderRadius: '8px',
            border: '1px solid #2a2a30',
            mb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" sx={{ color: '#b0b0b8' }}>Stage Monitor</Typography>
              <Chip label="Ready" size="small" sx={{ bgcolor: '#00cc8820', color: '#00cc88', fontSize: '0.65rem' }} />
            </Box>
            <Button
              fullWidth
              variant="outlined"
              size="small"
              onClick={() => window.open('/stage-monitor', '_blank', 'width=1280,height=720')}
              sx={{ 
                borderColor: '#2a2a30', 
                color: '#b0b0b8',
                borderRadius: '6px',
                textTransform: 'none',
                '&:hover': { borderColor: '#0088ff' }
              }}
            >
              Open Window
            </Button>
          </Paper>

          <Divider sx={{ bgcolor: '#2a2a30', my: 2 }} />

          <Typography variant="subtitle2" sx={{ color: '#707078', mb: 1.5, fontWeight: 600 }}>
            QUICK ADD
          </Typography>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {Object.values(ITEM_TYPES).map(type => (
              <Chip
                key={type.id}
                icon={<type.icon sx={{ color: `${type.color} !important`, fontSize: 16 }} />}
                label={type.label}
                size="small"
                onClick={() => {
                  if (currentService) {
                    setNewItemType(type.id);
                    setAddItemDialogOpen(true);
                  }
                }}
                sx={{
                  bgcolor: `${type.color}15`,
                  color: type.color,
                  border: `1px solid ${type.color}30`,
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: `${type.color}25` }
                }}
              />
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, borderTop: '1px solid #1f1f24' }}>
        <Button onClick={onClose} sx={{ color: '#b0b0b8', textTransform: 'none' }}>
          Close
        </Button>
      </DialogActions>

      {/* Add Item Dialog */}
      <Dialog 
        open={addItemDialogOpen} 
        onClose={() => setAddItemDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: '#1f1f24', borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Add Service Item</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel sx={{ color: '#707078' }}>Type</InputLabel>
            <Select
              value={newItemType}
              onChange={(e) => setNewItemType(e.target.value)}
              sx={{ bgcolor: '#141418', color: '#fff', borderRadius: '8px' }}
            >
              {Object.values(ITEM_TYPES).map(type => (
                <MenuItem key={type.id} value={type.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <type.icon sx={{ color: type.color, fontSize: 18 }} />
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Title"
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            sx={{
              '& .MuiInputBase-root': { bgcolor: '#141418', color: '#fff', borderRadius: '8px' },
              '& .MuiInputLabel-root': { color: '#707078' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setAddItemDialogOpen(false)} sx={{ color: '#b0b0b8' }}>Cancel</Button>
          <Button onClick={handleAddItem} variant="contained" sx={{ bgcolor: '#0088ff' }}>Add</Button>
        </DialogActions>
      </Dialog>

      {/* New Service Dialog */}
      <Dialog 
        open={newServiceDialogOpen} 
        onClose={() => setNewServiceDialogOpen(false)}
        PaperProps={{ sx: { bgcolor: '#1f1f24', borderRadius: '12px' } }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Create New Service</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Service Name"
            value={newServiceName}
            onChange={(e) => setNewServiceName(e.target.value)}
            placeholder="e.g., Sunday Morning Service"
            sx={{
              mt: 2,
              '& .MuiInputBase-root': { bgcolor: '#141418', color: '#fff', borderRadius: '8px' },
              '& .MuiInputLabel-root': { color: '#707078' }
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setNewServiceDialogOpen(false)} sx={{ color: '#b0b0b8' }}>Cancel</Button>
          <Button onClick={() => handleCreateService()} variant="contained" sx={{ bgcolor: '#0088ff' }}>Create</Button>
        </DialogActions>
      </Dialog>

      {/* Item Context Menu */}
      <Menu
        anchorEl={itemMenuAnchor}
        open={Boolean(itemMenuAnchor)}
        onClose={() => setItemMenuAnchor(null)}
        PaperProps={{ sx: { bgcolor: '#1f1f24', border: '1px solid #2a2a30', borderRadius: '8px' } }}
      >
        <MenuItem onClick={() => { setActiveItemIndex(selectedItemIndex); setItemMenuAnchor(null); }}>
          <ListItemIcon><PlayArrow sx={{ color: '#00cc88' }} /></ListItemIcon>
          <ListItemText primary="Go to Item" sx={{ color: '#fff' }} />
        </MenuItem>
        <MenuItem onClick={() => { /* Edit item */ setItemMenuAnchor(null); }}>
          <ListItemIcon><Edit sx={{ color: '#b0b0b8' }} /></ListItemIcon>
          <ListItemText primary="Edit" sx={{ color: '#fff' }} />
        </MenuItem>
        <MenuItem onClick={() => { /* Duplicate item */ setItemMenuAnchor(null); }}>
          <ListItemIcon><ContentCopy sx={{ color: '#b0b0b8' }} /></ListItemIcon>
          <ListItemText primary="Duplicate" sx={{ color: '#fff' }} />
        </MenuItem>
        <Divider sx={{ bgcolor: '#2a2a30' }} />
        <MenuItem onClick={() => handleDeleteItem(selectedItemIndex)}>
          <ListItemIcon><Delete sx={{ color: '#ff4444' }} /></ListItemIcon>
          <ListItemText primary="Delete" sx={{ color: '#ff4444' }} />
        </MenuItem>
      </Menu>
    </Dialog>
  );
};

export default ServicePlanner;
