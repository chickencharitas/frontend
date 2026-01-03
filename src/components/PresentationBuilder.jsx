import React, { useState } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  Tooltip,
  Typography
} from '@mui/material';
import {
  Close,
  Delete,
  Edit,
  DragIndicator,
  ArrowUpward,
  ArrowDownward,
  Visibility,
  PlayArrow
} from '@mui/icons-material';
import SlideEditor from '../editor/SlideEditor';
import PresenterView from '../presenter/views/PresenterView';
import SongManagement from '../songs/SongManagement';
import ScriptureIntegration from '../scripture/ScriptureIntegration';

const PresentationBuilder = () => {
  const [tabValue, setTabValue] = useState(0);
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: 'Welcome',
      layout: 'title',
      content: 'Welcome to Worship',
      elements: []
    }
  ]);
  const [selectedSlideId, setSelectedSlideId] = useState(1);
  const [openPreview, setOpenPreview] = useState(false);
  const [presentationMode, setPresentationMode] = useState(false);

  const selectedSlide = slides.find(s => s.id === selectedSlideId);

  const handleAddSlide = () => {
    const newId = Math.max(...slides.map(s => s.id), 0) + 1;
    setSlides([
      ...slides,
      {
        id: newId,
        title: `Slide ${newId}`,
        layout: 'title',
        content: '',
        elements: []
      }
    ]);
    setSelectedSlideId(newId);
  };

  const handleDeleteSlide = (id) => {
    if (slides.length > 1) {
      const newSlides = slides.filter(s => s.id !== id);
      setSlides(newSlides);
      setSelectedSlideId(newSlides[0].id);
    }
  };

  const handleUpdateSlide = (updatedSlide) => {
    setSlides(slides.map(s => s.id === updatedSlide.id ? updatedSlide : s));
  };

  const handleMoveSlide = (id, direction) => {
    const index = slides.findIndex(s => s.id === id);
    if ((direction === 'up' && index > 0) || (direction === 'down' && index < slides.length - 1)) {
      const newSlides = [...slides];
      const swapIndex = direction === 'up' ? index - 1 : index + 1;
      [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];
      setSlides(newSlides);
    }
  };

  const handleSongSelect = (song) => {
    if (selectedSlide) {
      const updatedSlide = {
        ...selectedSlide,
        elements: [
          ...selectedSlide.elements,
          {
            id: `song-${Date.now()}`,
            type: 'song',
            data: song
          }
        ]
      };
      handleUpdateSlide(updatedSlide);
    }
  };

  const handleScriptureSelect = (scripture) => {
    if (selectedSlide) {
      const updatedSlide = {
        ...selectedSlide,
        elements: [
          ...selectedSlide.elements,
          {
            id: `scripture-${Date.now()}`,
            type: 'scripture',
            data: scripture
          }
        ]
      };
      handleUpdateSlide(updatedSlide);
    }
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#1a1a1a' }}>
      {/* Left Panel - Slide Thumbnails */}
      <Paper
        sx={{
          width: 200,
          backgroundColor: '#252526',
          borderRight: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0
        }}
      >
        <Box sx={{ p: 1, borderBottom: '1px solid #333' }}>
          <Button
            fullWidth
            variant="contained"
            onClick={handleAddSlide}
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a', borderRadius: 0 }}
          >
            Add Slide
          </Button>
        </Box>
        
        <List sx={{ flex: 1, overflow: 'auto' }}>
          {slides.map((slide) => (
            <ListItem
              key={slide.id}
              disablePadding
              onContextMenu={(e) => e.preventDefault()}
            >
              <ListItemButton
                selected={selectedSlideId === slide.id}
                onClick={() => setSelectedSlideId(slide.id)}
                sx={{
                  backgroundColor: selectedSlideId === slide.id ? '#3c3c3d' : '#252526',
                  borderBottom: '1px solid #333',
                  borderRadius: 0
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="caption" sx={{ color: '#cccccc' }}>
                      {slide.title}
                    </Typography>
                  }
                />
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSlide(slide.id);
                    }}
                    sx={{ color: '#ff6b6b' }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Main Content Area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tabs */}
        <Paper
          sx={{
            backgroundColor: '#2d2d2e',
            borderBottom: '1px solid #333',
            borderRadius: 0
          }}
        >
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            sx={{
              '& .MuiTab-root': { color: '#cccccc' },
              '& .Mui-selected': { color: '#81c784' }
            }}
          >
            <Tab label="Slide Editor" />
            <Tab label="Songs" />
            <Tab label="Scripture" />
            <Tab label="Presenter View" />
          </Tabs>
        </Paper>

        {/* Tab Content */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {tabValue === 0 && selectedSlide && (
            <SlideEditor
              slide={selectedSlide}
              onUpdateSlide={handleUpdateSlide}
            />
          )}
          {tabValue === 1 && (
            <SongManagement onSongSelect={handleSongSelect} />
          )}
          {tabValue === 2 && (
            <ScriptureIntegration onScriptureSelect={handleScriptureSelect} />
          )}
          {tabValue === 3 && (
            <PresenterView
              slides={slides}
              currentSlideId={selectedSlideId}
              onSlideChange={setSelectedSlideId}
            />
          )}
        </Box>
      </Box>

      {/* Right Panel - Slide Properties & Controls */}
      <Paper
        sx={{
          width: 250,
          backgroundColor: '#252526',
          borderLeft: '1px solid #333',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto',
          borderRadius: 0,
          p: 2
        }}
      >
        <Typography variant="h6" sx={{ color: '#cccccc', mb: 2 }}>
          Slide Controls
        </Typography>

        {selectedSlide && (
          <Box>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                Slide Title
              </Typography>
              <input
                type="text"
                value={selectedSlide.title}
                onChange={(e) => handleUpdateSlide({ ...selectedSlide, title: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  border: '1px solid #404040',
                  borderRadius: 0
                }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                Layout
              </Typography>
              <select
                value={selectedSlide.layout}
                onChange={(e) => handleUpdateSlide({ ...selectedSlide, layout: e.target.value })}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: '#3c3c3d',
                  color: '#cccccc',
                  border: '1px solid #404040',
                  borderRadius: 0
                }}
              >
                <option value="title">Title Slide</option>
                <option value="content">Content</option>
                <option value="twoColumn">Two Column</option>
                <option value="blank">Blank</option>
              </select>
            </Box>

            <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Tooltip title="Preview">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Visibility />}
                  onClick={() => setOpenPreview(true)}
                  sx={{ borderRadius: 0, borderColor: '#81c784', color: '#81c784' }}
                >
                  Preview
                </Button>
              </Tooltip>
              <Tooltip title="Present">
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<PlayArrow />}
                  onClick={() => setPresentationMode(true)}
                  sx={{ borderRadius: 0, borderColor: '#81c784', color: '#81c784' }}
                >
                  Present
                </Button>
              </Tooltip>
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Move Up">
                <IconButton
                  size="small"
                  onClick={() => handleMoveSlide(selectedSlide.id, 'up')}
                  sx={{ color: '#81c784' }}
                >
                  <ArrowUpward />
                </IconButton>
              </Tooltip>
              <Tooltip title="Move Down">
                <IconButton
                  size="small"
                  onClick={() => handleMoveSlide(selectedSlide.id, 'down')}
                  sx={{ color: '#81c784' }}
                >
                  <ArrowDownward />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Slide Elements */}
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" sx={{ color: '#b0b0b0', mb: 1 }}>
                Elements ({selectedSlide.elements.length})
              </Typography>
              <List>
                {selectedSlide.elements.map((element) => (
                  <ListItem
                    key={element.id}
                    secondaryAction={
                      <IconButton
                        edge="end"
                        size="small"
                        onClick={() => {
                          handleUpdateSlide({
                            ...selectedSlide,
                            elements: selectedSlide.elements.filter(e => e.id !== element.id)
                          });
                        }}
                        sx={{ color: '#ff6b6b' }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    }
                    sx={{ backgroundColor: '#3c3c3d', mb: 1, borderRadius: 0 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="caption" sx={{ color: '#cccccc' }}>
                          {element.type === 'song' ? `🎵 ${element.data.title}` : `📖 ${element.data.reference}`}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Preview Dialog */}
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} fullScreen>
        <DialogTitle>
          Slide Preview: {selectedSlide?.title}
        </DialogTitle>
        <DialogContent>
          {selectedSlide && (
            <Box
              sx={{
                backgroundColor: '#1a1a1a',
                color: '#cccccc',
                p: 4,
                minHeight: '500px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Typography variant="h4" sx={{ mb: 2 }}>
                {selectedSlide.title}
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedSlide.content}
              </Typography>
              {selectedSlide.elements.map((element) => (
                <Box key={element.id} sx={{ mt: 2, p: 2, backgroundColor: '#252526', borderRadius: 1 }}>
                  {element.type === 'song' && (
                    <>
                      <Typography variant="subtitle1">🎵 {element.data.title}</Typography>
                      <Typography variant="caption">by {element.data.artist}</Typography>
                    </>
                  )}
                  {element.type === 'scripture' && (
                    <>
                      <Typography variant="subtitle1">📖 {element.data.reference}</Typography>
                      {element.data.verses?.[0] && (
                        <Typography variant="body2">{element.data.verses[0].text}</Typography>
                      )}
                    </>
                  )}
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default PresentationBuilder;
