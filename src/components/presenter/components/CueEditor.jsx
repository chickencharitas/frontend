import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tabs,
  Tab,
  Box,
  Typography,
  IconButton,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Divider,
  useTheme,
  useMediaQuery,
  Slider,
  InputAdornment,
  Chip,
  Stack,
} from '@mui/material';
import { 
  Close as CloseIcon, 
  ColorLens as ColorLensIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  Title as TitleIcon,
  TextFields as TextFieldsIcon,
  Image as ImageIcon,
  Movie as MovieIcon,
  MusicNote as MusicNoteIcon,
  Web as WebIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
// import { ChromePicker } from 'react-color'; // Commented out - react-color package not installed
import { useDropzone } from 'react-dropzone';

const CueEditor = ({ 
  open, 
  onClose, 
  cue, 
  onSave,
  onDelete,
}) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [activeTab, setActiveTab] = useState(0);
  const [editedCue, setEditedCue] = useState(cue);
  const [colorPicker, setColorPicker] = useState({
    open: false,
    target: null,
    color: '#000000',
  });

  // Update local state when cue prop changes
  useEffect(() => {
    if (cue) {
      setEditedCue(cue);
    }
  }, [cue]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleChange = (field, value) => {
    setEditedCue(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStyleChange = (field, value) => {
    setEditedCue(prev => ({
      ...prev,
      style: {
        ...prev.style,
        [field]: value
      }
    }));
  };

  const handleTimingChange = (field, value) => {
    setEditedCue(prev => ({
      ...prev,
      timing: {
        ...prev.timing,
        [field]: value
      }
    }));
  };

  const openColorPicker = (field, color) => {
    setColorPicker({
      open: true,
      target: field,
      color: color || '#000000',
    });
  };

  const handleColorChange = (color) => {
    setColorPicker(prev => ({
      ...prev,
      color: color.hex,
    }));
  };

  const applyColor = () => {
    const { target, color } = colorPicker;
    if (target && color) {
      if (target.startsWith('style.')) {
        const styleField = target.split('.')[1];
        handleStyleChange(styleField, color);
      } else {
        handleChange(target, color);
      }
    }
    setColorPicker(prev => ({ ...prev, open: false }));
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const fileType = file.type.split('/')[0];
      
      // Create a preview URL for the file
      const fileUrl = URL.createObjectURL(file);
      
      // Determine cue type based on file type
      let cueType = 'file';
      if (fileType === 'image') cueType = 'image';
      else if (fileType === 'video') cueType = 'video';
      else if (fileType === 'audio') cueType = 'audio';
      
      // Update the cue with the file information
      handleChange('type', cueType);
      handleChange('content', fileUrl);
      handleChange('file', file);
      handleChange('fileName', file.name);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.webm', '.ogg'],
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a'],
    },
    multiple: false,
  });

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: // Content tab
        return (
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              value={editedCue.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              margin="normal"
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TitleIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            
            <FormControl fullWidth margin="normal">
              <InputLabel id="cue-type-label">Cue Type</InputLabel>
              <Select
                labelId="cue-type-label"
                value={editedCue.type || 'text'}
                label="Cue Type"
                onChange={(e) => handleChange('type', e.target.value)}
                startAdornment={
                  <InputAdornment position="start">
                    {editedCue.type === 'image' && <ImageIcon />}
                    {editedCue.type === 'video' && <MovieIcon />}
                    {editedCue.type === 'audio' && <MusicNoteIcon />}
                    {editedCue.type === 'web' && <WebIcon />}
                    {editedCue.type === 'text' && <TextFieldsIcon />}
                  </InputAdornment>
                }
              >
                <MenuItem value="text">Text</MenuItem>
                <MenuItem value="image">Image</MenuItem>
                <MenuItem value="video">Video</MenuItem>
                <MenuItem value="audio">Audio</MenuItem>
                <MenuItem value="web">Web Page</MenuItem>
              </Select>
            </FormControl>

            {editedCue.type === 'text' && (
              <TextField
                fullWidth
                label="Content"
                value={editedCue.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                margin="normal"
                multiline
                rows={6}
                variant="outlined"
              />
            )}

            {(editedCue.type === 'image' || 
              editedCue.type === 'video' || 
              editedCue.type === 'audio') && (
              <Box 
                {...getRootProps()} 
                sx={{
                  border: `2px dashed ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: isDragActive 
                    ? theme.palette.action.hover 
                    : theme.palette.background.paper,
                  transition: 'background-color 0.2s',
                  mt: 2,
                }}
              >
                <input {...getInputProps()} />
                {editedCue.content ? (
                  <Box>
                    <Typography variant="body1">
                      {editedCue.fileName || 'File selected'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Click to change or drag and drop a new file
                    </Typography>
                    {editedCue.type === 'image' && (
                      <Box 
                        component="img" 
                        src={editedCue.content} 
                        alt="Preview" 
                        sx={{ 
                          maxWidth: '100%', 
                          maxHeight: 200, 
                          mt: 2,
                          borderRadius: 1,
                        }} 
                      />
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1">
                      {isDragActive 
                        ? 'Drop the file here...' 
                        : 'Drag and drop a file here, or click to select'}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Supported formats: {editedCue.type === 'image' 
                        ? 'JPG, PNG, GIF, WebP, SVG' 
                        : editedCue.type === 'video' 
                          ? 'MP4, WebM, Ogg' 
                          : 'MP3, WAV, OGG, M4A'}
                    </Typography>
                  </Box>
                )}
              </Box>
            )}

            {editedCue.type === 'web' && (
              <TextField
                fullWidth
                label="Web URL"
                value={editedCue.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                margin="normal"
                placeholder="https://example.com"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <WebIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            )}

            <TextField
              fullWidth
              label="Notes"
              value={editedCue.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
              margin="normal"
              multiline
              rows={3}
              variant="outlined"
              placeholder="Internal notes about this cue (not visible to audience)"
            />
          </Box>
        );

      case 1: // Style tab
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Text Styling
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ColorLensIcon />}
                  onClick={() => 
                    openColorPicker('style.textColor', editedCue.style?.textColor)
                  }
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: editedCue.style?.textColor || 'text.primary',
                    borderColor: 'divider',
                    backgroundColor: editedCue.style?.textColor 
                      ? `${editedCue.style.textColor}14` 
                      : 'background.paper',
                  }}
                >
                  Text Color
                </Button>
              </Box>
              
              <Box sx={{ flex: 1 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<ColorLensIcon />}
                  onClick={() => 
                    openColorPicker('style.backgroundColor', editedCue.style?.backgroundColor)
                  }
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    color: editedCue.style?.backgroundColor 
                      ? theme.palette.getContrastText(editedCue.style.backgroundColor)
                      : 'text.primary',
                    backgroundColor: editedCue.style?.backgroundColor || 'background.paper',
                    borderColor: 'divider',
                  }}
                >
                  Background
                </Button>
              </Box>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="caption" display="block" gutterBottom>
                Font Size: {editedCue.style?.fontSize || '16px'}
              </Typography>
              <Slider
                value={parseInt(editedCue.style?.fontSize || '16')}
                onChange={(e, value) => handleStyleChange('fontSize', `${value}px`)}
                min={8}
                max={72}
                step={1}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}px`}
              />
            </Box>

            <Typography variant="subtitle2" gutterBottom sx={{ mt: 3, mb: 1 }}>
              Text Alignment
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
              {[
                { value: 'left', icon: <FormatAlignLeft /> },
                { value: 'center', icon: <FormatAlignCenter /> },
                { value: 'right', icon: <FormatAlignRight /> },
                { value: 'justify', icon: <FormatAlignJustify /> },
              ].map((align) => (
                <Button
                  key={align.value}
                  variant={editedCue.style?.textAlign === align.value ? 'contained' : 'outlined'}
                  onClick={() => handleStyleChange('textAlign', align.value)}
                  sx={{ minWidth: 'auto', flex: 1 }}
                >
                  {align.icon}
                </Button>
              ))}
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={editedCue.style?.fullWidth || false}
                  onChange={(e) => handleStyleChange('fullWidth', e.target.checked)}
                />
              }
              label="Full Width"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={editedCue.style?.fullHeight || false}
                  onChange={(e) => handleStyleChange('fullHeight', e.target.checked)}
                />
              }
              label="Full Height"
              sx={{ ml: 2 }}
            />
          </Box>
        );

      case 2: // Timing tab
        return (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" gutterBottom>
                Duration: {editedCue.timing?.duration || 0} seconds
              </Typography>
              <Slider
                value={editedCue.timing?.duration || 30}
                onChange={(e, value) => handleTimingChange('duration', value)}
                min={0}
                max={300}
                step={5}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}s`}
              />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: -1 }}>
                <Typography variant="caption" color="textSecondary">
                  0s
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  5:00
                </Typography>
              </Box>
            </Box>

            <FormControlLabel
              control={
                <Switch
                  checked={editedCue.timing?.autoContinue || false}
                  onChange={(e) => handleTimingChange('autoContinue', e.target.checked)}
                />
              }
              label="Auto-continue to next cue"
            />

            <Typography variant="caption" display="block" sx={{ mt: 1, mb: 2, color: 'text.secondary' }}>
              When enabled, the next cue will automatically start after this cue's duration.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Transition
            </Typography>
            <FormControl fullWidth margin="normal">
              <InputLabel id="transition-type-label">Type</InputLabel>
              <Select
                labelId="transition-type-label"
                value={editedCue.timing?.transition?.type || 'fade'}
                label="Transition Type"
                onChange={(e) => 
                  handleTimingChange('transition', {
                    ...editedCue.timing?.transition,
                    type: e.target.value,
                  })
                }
              >
                <MenuItem value="none">None</MenuItem>
                <MenuItem value="fade">Fade</MenuItem>
                <MenuItem value="slide">Slide</MenuItem>
                <MenuItem value="zoom">Zoom</MenuItem>
              </Select>
            </FormControl>

            {editedCue.timing?.transition?.type !== 'none' && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Duration: {editedCue.timing?.transition?.duration || 0.5}s
                </Typography>
                <Slider
                  value={editedCue.timing?.transition?.duration || 0.5}
                  onChange={(e, value) => 
                    handleTimingChange('transition', {
                      ...editedCue.timing?.transition,
                      duration: value,
                    })
                  }
                  min={0.1}
                  max={3}
                  step={0.1}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `${value}s`}
                />
              </Box>
            )}
          </Box>
        );

      case 3: // Advanced tab
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Cue ID: {editedCue.id}
            </Typography>
            
            <TextField
              fullWidth
              label="Custom CSS Class"
              value={editedCue.className || ''}
              onChange={(e) => handleChange('className', e.target.value)}
              margin="normal"
              variant="outlined"
              helperText="Add custom CSS class names to style this cue"
            />

            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Custom Attributes
              </Typography>
              <Stack spacing={1}>
                {editedCue.attributes?.map((attr, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      label="Name"
                      value={attr.name}
                      onChange={(e) => {
                        const newAttributes = [...(editedCue.attributes || [])];
                        newAttributes[index] = {
                          ...newAttributes[index],
                          name: e.target.value,
                        };
                        handleChange('attributes', newAttributes);
                      }}
                      size="small"
                      sx={{ flex: 1 }}
                    />
                    <TextField
                      label="Value"
                      value={attr.value}
                      onChange={(e) => {
                        const newAttributes = [...(editedCue.attributes || [])];
                        newAttributes[index] = {
                          ...newAttributes[index],
                          value: e.target.value,
                        };
                        handleChange('attributes', newAttributes);
                      }}
                      size="small"
                      sx={{ flex: 2 }}
                    />
                    <IconButton
                      onClick={() => {
                        const newAttributes = [...(editedCue.attributes || [])];
                        newAttributes.splice(index, 1);
                        handleChange('attributes', newAttributes);
                      }}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => {
                    const newAttributes = [
                      ...(editedCue.attributes || []),
                      { name: '', value: '' },
                    ];
                    handleChange('attributes', newAttributes);
                  }}
                >
                  Add Attribute
                </Button>
              </Stack>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      fullScreen={fullScreen}
      aria-labelledby="cue-editor-dialog"
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <span>{cue?.id ? 'Edit Cue' : 'Add New Cue'}</span>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ px: 2 }}
      >
        <Tab label="Content" />
        <Tab label="Style" />
        <Tab label="Timing" />
        <Tab label="Advanced" />
      </Tabs>
      
      <DialogContent dividers>
        {renderTabContent()}
      </DialogContent>
      
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Box>
          {onDelete && (
            <Button 
              color="error" 
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this cue?')) {
                  onDelete();
                  onClose();
                }
              }}
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
        </Box>
        <Box>
          <Button 
            onClick={onClose} 
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => {
              onSave(editedCue);
              onClose();
            }}
          >
            Save
          </Button>
        </Box>
      </DialogActions>

      {/* Color Picker Dialog */}
      <Dialog 
        open={colorPicker.open} 
        onClose={() => setColorPicker(prev => ({ ...prev, open: false }))}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Select Color</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            <input
              type="color"
              value={colorPicker.color}
              onChange={(e) => handleColorChange({ hex: e.target.value })}
              style={{
                width: '100%',
                height: '50px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            />
            <Typography variant="body2" color="text.secondary">
              Current color: {colorPicker.color}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setColorPicker(prev => ({ ...prev, open: false }))}>
            Cancel
          </Button>
          <Button onClick={applyColor} color="primary">
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CueEditor;
