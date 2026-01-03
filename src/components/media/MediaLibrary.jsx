import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Tab,
  Tabs,
  GridList,
  GridListTile,
  GridListTileBar,
  IconButton,
  Tooltip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  TextField,
  InputAdornment,
  LinearProgress
} from '@mui/material';
import {
  CloudUpload,
  Delete,
  Edit,
  Download,
  PlayArrow,
  Image,
  MovieCreation,
  AudioFile,
  Folder,
  Search,
  AddCircle,
  FolderOpen
} from '@mui/icons-material';

const MediaLibrary = ({ onMediaSelect }) => {
  const [tabValue, setTabValue] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  // Sample media data
  const [mediaItems, setMediaItems] = useState([
    {
      id: 1,
      name: 'Church Banner',
      type: 'image',
      url: '/sample/banner.jpg',
      size: '2.5 MB',
      dimensions: '1920x1080',
      tags: ['header', 'background'],
      uploadDate: '2025-12-20'
    },
    {
      id: 2,
      name: 'Worship Intro Video',
      type: 'video',
      url: '/sample/intro.mp4',
      size: '45 MB',
      duration: '1:30',
      tags: ['opening', 'video'],
      uploadDate: '2025-12-18'
    },
    {
      id: 3,
      name: 'Background Music',
      type: 'audio',
      url: '/sample/music.mp3',
      size: '8.2 MB',
      duration: '3:45',
      tags: ['music', 'background'],
      uploadDate: '2025-12-15'
    },
    {
      id: 4,
      name: 'Worship Graphic',
      type: 'image',
      url: '/sample/graphic.png',
      size: '1.8 MB',
      dimensions: '1280x720',
      tags: ['graphic', 'overlay'],
      uploadDate: '2025-12-20'
    }
  ]);

  const [folders, setFolders] = useState([
    { id: 'images', name: 'Images', count: 12, icon: Image },
    { id: 'videos', name: 'Videos', count: 8, icon: MovieCreation },
    { id: 'audio', name: 'Audio', count: 15, icon: AudioFile },
    { id: 'templates', name: 'Templates', count: 5, icon: Folder }
  ]);

  const handleFileUpload = useCallback((e) => {
    const files = e.target.files;
    if (files.length > 0) {
      setUploading(true);
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setUploading(false);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate adding new media item
      setTimeout(() => {
        const file = files[0];
        const newItem = {
          id: mediaItems.length + 1,
          name: file.name,
          type: file.type.split('/')[0] || 'file',
          url: URL.createObjectURL(file),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          uploadDate: new Date().toISOString().split('T')[0]
        };
        setMediaItems([newItem, ...mediaItems]);
        setUploadProgress(0);
      }, 2000);
    }
  }, [mediaItems.length]);

  const handleDeleteMedia = (id) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const filteredMedia = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image': return <Image />;
      case 'video': return <MovieCreation />;
      case 'audio': return <AudioFile />;
      default: return <Folder />;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', bgcolor: '#1a1a1a', color: '#cccccc' }}>
      {/* Header */}
      <Paper sx={{ backgroundColor: '#252526', borderBottom: '1px solid #333', p: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            placeholder="Search media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search sx={{ color: '#808080' }} />
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#cccccc',
                '& fieldset': { borderColor: '#404040' }
              }
            }}
          />
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUpload />}
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a', borderRadius: 0 }}
          >
            Upload
            <input hidden accept="image/*,video/*,audio/*" multiple type="file" onChange={handleFileUpload} />
          </Button>
        </Box>

        {uploading && (
          <Box>
            <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
              Uploading... {uploadProgress}%
            </Typography>
            <LinearProgress variant="determinate" value={uploadProgress} sx={{ mt: 1 }} />
          </Box>
        )}
      </Paper>

      {/* Tabs */}
      <Box sx={{ borderBottom: '1px solid #333', backgroundColor: '#2d2d2e' }}>
        <Tabs
          value={tabValue}
          onChange={(e, val) => setTabValue(val)}
          sx={{
            '& .MuiTab-root': { color: '#cccccc' },
            '& .Mui-selected': { color: '#81c784' }
          }}
        >
          <Tab label="All Media" />
          <Tab label="Images" />
          <Tab label="Videos" />
          <Tab label="Audio" />
          <Tab label="Folders" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {tabValue === 0 && (
          /* All Media Grid */
          <Box>
            {filteredMedia.length === 0 ? (
              <Paper sx={{ backgroundColor: '#252526', p: 4, textAlign: 'center', borderRadius: 0 }}>
                <Folder sx={{ fontSize: 48, color: '#808080', mb: 2 }} />
                <Typography sx={{ color: '#cccccc' }}>No media files found</Typography>
              </Paper>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                {filteredMedia.map(item => (
                  <Paper
                    key={item.id}
                    sx={{
                      backgroundColor: '#252526',
                      overflow: 'hidden',
                      borderRadius: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      '&:hover': { backgroundColor: '#2d2d2e', transform: 'scale(1.02)' }
                    }}
                    onClick={() => onMediaSelect?.(item)}
                  >
                    <Box
                      sx={{
                        aspectRatio: '1/1',
                        backgroundColor: '#1a1a1a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative'
                      }}
                    >
                      {getMediaIcon(item.type)}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: 'rgba(0,0,0,0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          '&:hover': { opacity: 1 },
                          transition: 'opacity 0.3s'
                        }}
                      >
                        <Tooltip title="Preview">
                          <IconButton sx={{ color: '#81c784' }}>
                            <PlayArrow />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                    <Box sx={{ p: 1 }}>
                      <Typography variant="caption" sx={{ color: '#cccccc' }} noWrap>
                        {item.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block' }}>
                        {item.size}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteMedia(item.id);
                            }}
                            sx={{ color: '#ff6b6b' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 1 && (
          /* Images */
          <Box>
            {filteredMedia.filter(m => m.type === 'image').length === 0 ? (
              <Typography sx={{ color: '#b0b0b0', textAlign: 'center', py: 4 }}>
                No images in library
              </Typography>
            ) : (
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 2 }}>
                {filteredMedia.filter(m => m.type === 'image').map(item => (
                  <Paper key={item.id} sx={{ backgroundColor: '#252526', p: 2, borderRadius: 0 }}>
                    <Image sx={{ fontSize: 48, color: '#81c784', mb: 1 }} />
                    <Typography variant="caption">{item.name}</Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Box>
        )}

        {tabValue === 4 && (
          /* Folders */
          <List>
            {folders.map(folder => {
              const FolderIcon = folder.icon;
              return (
                <ListItem
                  key={folder.id}
                  sx={{
                    backgroundColor: '#252526',
                    mb: 1,
                    borderRadius: 0,
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#2d2d2e' }
                  }}
                >
                  <ListItemIcon sx={{ color: '#81c784' }}>
                    <FolderIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary={folder.name}
                    secondary={`${folder.count} items`}
                    primaryTypographyProps={{ sx: { color: '#cccccc' } }}
                    secondaryTypographyProps={{ sx: { color: '#b0b0b0' } }}
                  />
                  <FolderOpen sx={{ color: '#81c784' }} />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Box>
  );
};

export default MediaLibrary;
