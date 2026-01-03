import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Toolbar,
  IconButton,
  Divider,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Typography,
  useTheme
} from '@mui/material';
import {
  Format,
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Add,
  Delete,
  Undo,
  Redo,
  Image as ImageIcon,
  VideoLibrary,
  TextFields,
  Palette,
  Settings,
  Save
} from '@mui/icons-material';

const SlideEditor = ({ slideData, onSave, onUpdate }) => {
  const theme = useTheme();
  const [slide, setSlide] = useState(slideData || {
    id: Date.now(),
    title: 'Untitled Slide',
    content: '',
    background: '#ffffff',
    layout: 'title-content',
    elements: []
  });

  const [selectedElement, setSelectedElement] = useState(null);
  const [fontSizeOpen, setFontSizeOpen] = useState(false);
  const [bgColorOpen, setBgColorOpen] = useState(false);
  const editorRef = useRef(null);
  
  // Edit functionality state
  const [history, setHistory] = useState([slide]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [copiedElement, setCopiedElement] = useState(null);

  const handleTextFormat = (format) => {
    document.execCommand(format, false);
    editorRef.current?.focus();
  };

  const handleAddElement = (type) => {
    const newElement = {
      id: Date.now(),
      type, // 'text', 'image', 'video'
      content: type === 'text' ? 'Click to edit text' : '',
      x: 50,
      y: 50,
      width: 300,
      height: type === 'text' ? 50 : 200,
      fontSize: 16,
      color: '#000000',
      fontFamily: 'Arial'
    };

    const newSlide = {
      ...slide,
      elements: [...slide.elements, newElement]
    };
    setSlide(newSlide);
    updateHistory(newSlide);
    setSelectedElement(newElement);
  };

  const handleDeleteElement = (id) => {
    const newSlide = {
      ...slide,
      elements: slide.elements.filter(el => el.id !== id)
    };
    setSlide(newSlide);
    updateHistory(newSlide);
    setSelectedElement(null);
  };

  const handleElementChange = (id, updates) => {
    const newSlide = {
      ...slide,
      elements: slide.elements.map(el =>
        el.id === id ? { ...el, ...updates } : el
      )
    };
    setSlide(newSlide);
    updateHistory(newSlide);
  };

  // Update history for undo/redo
  const updateHistory = (newSlide) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newSlide))); // Deep copy
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Edit functionality event listeners
  useEffect(() => {
    const handleUndo = () => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setSlide(JSON.parse(JSON.stringify(history[newIndex]))); // Deep copy
        setSelectedElement(null);
      }
    };

    const handleRedo = () => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setSlide(JSON.parse(JSON.stringify(history[newIndex]))); // Deep copy
        setSelectedElement(null);
      }
    };

    const handleCut = () => {
      if (selectedElement) {
        setCopiedElement(JSON.parse(JSON.stringify(selectedElement))); // Deep copy
        const newSlide = {
          ...slide,
          elements: slide.elements.filter(el => el.id !== selectedElement.id)
        };
        setSlide(newSlide);
        updateHistory(newSlide);
        setSelectedElement(null);
      }
    };

    const handleCopy = () => {
      if (selectedElement) {
        setCopiedElement(JSON.parse(JSON.stringify(selectedElement))); // Deep copy
      }
    };

    const handlePaste = () => {
      if (copiedElement) {
        const newElement = {
          ...copiedElement,
          id: Date.now(), // New ID for pasted element
          x: copiedElement.x + 20, // Offset slightly
          y: copiedElement.y + 20
        };
        const newSlide = {
          ...slide,
          elements: [...slide.elements, newElement]
        };
        setSlide(newSlide);
        updateHistory(newSlide);
        setSelectedElement(newElement);
      }
    };

    const handleDelete = () => {
      if (selectedElement) {
        const newSlide = {
          ...slide,
          elements: slide.elements.filter(el => el.id !== selectedElement.id)
        };
        setSlide(newSlide);
        updateHistory(newSlide);
        setSelectedElement(null);
      }
    };

    const handleSelectAll = () => {
      // Select all elements
      if (slide.elements.length > 0) {
        setSelectedElement(slide.elements[slide.elements.length - 1]); // Select last element
      }
    };

    const handleFind = () => {
      const searchTerm = window.prompt('Find text in elements:');
      if (searchTerm) {
        const foundElements = slide.elements.filter(el => 
          el.type === 'text' && el.content && 
          el.content.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (foundElements.length > 0) {
          setSelectedElement(foundElements[0]);
          alert(`Found ${foundElements.length} element(s) with "${searchTerm}"`);
        } else {
          alert(`No elements found with "${searchTerm}"`);
        }
      }
    };

    const handleReplace = () => {
      const searchTerm = window.prompt('Find text in elements:');
      if (searchTerm) {
        const replaceTerm = window.prompt('Replace with:');
        if (replaceTerm !== null) {
          let newSlide = { ...slide };
          let replacedCount = 0;
          
          newSlide.elements = slide.elements.map(el => {
            if (el.type === 'text' && el.content) {
              if (el.content.includes(searchTerm)) {
                replacedCount++;
                return { ...el, content: el.content.replaceAll(searchTerm, replaceTerm) };
              }
            }
            return el;
          });
          
          setSlide(newSlide);
          updateHistory(newSlide);
          alert(`Replaced text in ${replacedCount} element(s)`);
        }
      }
    };

    window.addEventListener('app:undo', handleUndo);
    window.addEventListener('app:redo', handleRedo);
    window.addEventListener('app:cut', handleCut);
    window.addEventListener('app:copy', handleCopy);
    window.addEventListener('app:paste', handlePaste);
    window.addEventListener('app:delete', handleDelete);
    window.addEventListener('app:select-all', handleSelectAll);
    window.addEventListener('app:find', handleFind);
    window.addEventListener('app:replace', handleReplace);

    return () => {
      window.removeEventListener('app:undo', handleUndo);
      window.removeEventListener('app:redo', handleRedo);
      window.removeEventListener('app:cut', handleCut);
      window.removeEventListener('app:copy', handleCopy);
      window.removeEventListener('app:paste', handlePaste);
      window.removeEventListener('app:delete', handleDelete);
      window.removeEventListener('app:select-all', handleSelectAll);
      window.removeEventListener('app:find', handleFind);
      window.removeEventListener('app:replace', handleReplace);
    };
  }, [history, historyIndex, slide, selectedElement, copiedElement]);

  const handleSave = () => {
    onSave?.(slide);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a1a1a', color: '#cccccc' }}>
      {/* Toolbar */}
      <Toolbar
        variant="dense"
        sx={{
          backgroundColor: '#252526',
          borderBottom: '1px solid #333',
          gap: 1,
          overflowX: 'auto'
        }}
      >
        {/* Text Formatting */}
        <Tooltip title="Bold">
          <IconButton
            size="small"
            onClick={() => handleTextFormat('bold')}
            sx={{ color: '#cccccc' }}
          >
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic">
          <IconButton
            size="small"
            onClick={() => handleTextFormat('italic')}
            sx={{ color: '#cccccc' }}
          >
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline">
          <IconButton
            size="small"
            onClick={() => handleTextFormat('underline')}
            sx={{ color: '#cccccc' }}
          >
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" sx={{ my: 1, bgcolor: '#404040' }} />

        {/* Text Alignment */}
        <Tooltip title="Align Left">
          <IconButton
            size="small"
            onClick={() => handleTextFormat('justifyLeft')}
            sx={{ color: '#cccccc' }}
          >
            <FormatAlignLeft fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Center">
          <IconButton
            size="small"
            onClick={() => handleTextFormat('justifyCenter')}
            sx={{ color: '#cccccc' }}
          >
            <FormatAlignCenter fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Align Right">
          <IconButton
            size="small"
            onClick={() => handleTextFormat('justifyRight')}
            sx={{ color: '#cccccc' }}
          >
            <FormatAlignRight fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" sx={{ my: 1, bgcolor: '#404040' }} />

        {/* Add Elements */}
        <Tooltip title="Add Text">
          <IconButton
            size="small"
            onClick={() => handleAddElement('text')}
            sx={{ color: '#cccccc' }}
          >
            <TextFields fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Image">
          <IconButton
            size="small"
            onClick={() => handleAddElement('image')}
            sx={{ color: '#cccccc' }}
          >
            <ImageIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Video">
          <IconButton
            size="small"
            onClick={() => handleAddElement('video')}
            sx={{ color: '#cccccc' }}
          >
            <VideoLibrary fontSize="small" />
          </IconButton>
        </Tooltip>

        <Divider orientation="vertical" sx={{ my: 1, bgcolor: '#404040' }} />

        {/* Background Color */}
        <Tooltip title="Background Color">
          <IconButton
            size="small"
            onClick={() => setBgColorOpen(true)}
            sx={{ color: '#cccccc' }}
          >
            <Palette fontSize="small" />
          </IconButton>
        </Tooltip>

        <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
          <Tooltip title="Save Slide">
            <IconButton
              size="small"
              onClick={handleSave}
              sx={{ color: '#81c784' }}
            >
              <Save fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>

      {/* Canvas Area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden', gap: 1, p: 1 }}>
        {/* Main Editor */}
        <Paper
          sx={{
            flex: 1,
            backgroundColor: slide.background,
            position: 'relative',
            overflow: 'auto',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}
        >
          {/* Slide Elements */}
          {slide.elements.map((element) => (
            <Box
              key={element.id}
              onClick={() => setSelectedElement(element.id)}
              sx={{
                position: 'absolute',
                left: `${element.x}px`,
                top: `${element.y}px`,
                width: `${element.width}px`,
                height: `${element.height}px`,
                border: selectedElement === element.id ? '2px solid #1976d2' : '1px solid #ddd',
                padding: 1,
                cursor: 'move',
                backgroundColor: element.type === 'text' ? 'transparent' : '#f5f5f5',
                overflow: 'auto',
                fontSize: `${element.fontSize}px`,
                color: element.color,
                fontFamily: element.fontFamily,
                userSelect: 'none',
                '&:hover': { boxShadow: '0 0 5px rgba(0,0,0,0.3)' }
              }}
            >
              {element.type === 'text' && (
                <Typography
                  sx={{
                    fontSize: 'inherit',
                    color: 'inherit',
                    fontFamily: 'inherit'
                  }}
                >
                  {element.content}
                </Typography>
              )}
              {element.type === 'image' && (
                <ImageIcon sx={{ width: '100%', height: '100%' }} />
              )}
              {element.type === 'video' && (
                <VideoLibrary sx={{ width: '100%', height: '100%' }} />
              )}
            </Box>
          ))}
        </Paper>

        {/* Properties Panel */}
        <Paper
          sx={{
            width: 280,
            backgroundColor: '#2d2d2e',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            borderRadius: 0
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#b0b0b0' }}>
              SLIDE PROPERTIES
            </Typography>

            <Stack spacing={2}>
              <TextField
                label="Slide Title"
                value={slide.title}
                onChange={(e) => setSlide({ ...slide, title: e.target.value })}
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': { color: '#cccccc' },
                  '& .MuiInputBase-input::placeholder': { color: '#808080' }
                }}
              />

              <FormControl size="small" fullWidth>
                <InputLabel sx={{ color: '#cccccc' }}>Layout</InputLabel>
                <Select
                  value={slide.layout}
                  onChange={(e) => setSlide({ ...slide, layout: e.target.value })}
                  label="Layout"
                  sx={{ color: '#cccccc' }}
                >
                  <MenuItem value="title-content">Title + Content</MenuItem>
                  <MenuItem value="blank">Blank</MenuItem>
                  <MenuItem value="title-only">Title Only</MenuItem>
                  <MenuItem value="two-column">Two Column</MenuItem>
                </Select>
              </FormControl>

              <TextField
                type="color"
                label="Background"
                value={slide.background}
                onChange={(e) => setSlide({ ...slide, background: e.target.value })}
                size="small"
                fullWidth
              />
            </Stack>

            <Divider sx={{ my: 2, bgcolor: '#404040' }} />

            <Typography variant="subtitle2" sx={{ mb: 1, color: '#b0b0b0' }}>
              ELEMENT PROPERTIES
            </Typography>

            {selectedElement ? (
              <Stack spacing={1}>
                {(() => {
                  const element = slide.elements.find(el => el.id === selectedElement);
                  return element ? (
                    <>
                      <TextField
                        label="Content"
                        value={element.content}
                        onChange={(e) => handleElementChange(element.id, { content: e.target.value })}
                        size="small"
                        fullWidth
                        multiline
                        rows={2}
                        sx={{ '& .MuiOutlinedInput-root': { color: '#cccccc' } }}
                      />
                      <TextField
                        label="Font Size"
                        type="number"
                        value={element.fontSize}
                        onChange={(e) => handleElementChange(element.id, { fontSize: parseInt(e.target.value) })}
                        size="small"
                        fullWidth
                        sx={{ '& .MuiOutlinedInput-root': { color: '#cccccc' } }}
                      />
                      <TextField
                        type="color"
                        label="Color"
                        value={element.color}
                        onChange={(e) => handleElementChange(element.id, { color: e.target.value })}
                        size="small"
                        fullWidth
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteElement(element.id)}
                      >
                        Delete Element
                      </Button>
                    </>
                  ) : null;
                })()}
              </Stack>
            ) : (
              <Typography variant="caption" sx={{ color: '#808080' }}>
                Select an element to edit properties
              </Typography>
            )}
          </Box>
        </Paper>
      </Box>

      {/* Background Color Dialog */}
      <Dialog open={bgColorOpen} onClose={() => setBgColorOpen(false)}>
        <DialogTitle>Choose Background Color</DialogTitle>
        <DialogContent>
          <TextField
            type="color"
            value={slide.background}
            onChange={(e) => setSlide({ ...slide, background: e.target.value })}
            fullWidth
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBgColorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SlideEditor;
