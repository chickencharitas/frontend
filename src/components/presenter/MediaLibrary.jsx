import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Grid,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  Search as SearchIcon,
  Image as ImageIcon,
  Video as VideoIcon,
  FileText as FileTextIcon,
  X as ClearIcon
} from 'lucide-react';

const MediaLibrary = ({ onSelect, onClose }) => {
  const [activeTab, setActiveTab] = useState('images');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock media items - in a real app, these would come from an API
  const mediaItems = {
    images: [
      { id: 1, type: 'image', url: '/placeholder-image-1.jpg', title: 'Background 1' },
      { id: 2, type: 'image', url: '/placeholder-image-2.jpg', title: 'Background 2' },
      { id: 3, type: 'image', url: '/placeholder-image-3.jpg', title: 'Background 3' },
    ],
    videos: [
      { id: 4, type: 'video', url: '/placeholder-video-1.mp4', title: 'Worship Video 1' },
      { id: 5, type: 'video', url: '/placeholder-video-2.mp4', title: 'Worship Video 2' },
    ],
    slides: [
      { id: 6, type: 'text', content: 'Welcome!', title: 'Welcome Slide' },
      { id: 7, type: 'text', content: 'Announcements', title: 'Announcements' },
    ]
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredItems = mediaItems[activeTab].filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={`Search ${activeTab}...`}
          value={searchQuery}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon size={20} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton 
                  onClick={clearSearch} 
                  size="small"
                  aria-label="Clear search"
                >
                  <ClearIcon size={16} />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        variant="fullWidth"
        sx={{ borderBottom: '1px solid #eee' }}
      >
        <Tab
          icon={<ImageIcon size={20} />}
          label="Images"
          value="images"
          sx={{ minHeight: 64 }}
        />
        <Tab
          icon={<VideoIcon size={20} />}
          label="Videos"
          value="videos"
          sx={{ minHeight: 64 }}
        />
        <Tab
          icon={<FileTextIcon size={20} />}
          label="Slides"
          value="slides"
          sx={{ minHeight: 64 }}
        />
      </Tabs>

      <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={6} sm={4} md={3} key={item.id}>
              <Box
                onClick={() => onSelect(item)}
                sx={{
                  aspectRatio: '16/9',
                  backgroundColor: 'background.paper',
                  borderRadius: 1,
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #eee',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                    boxShadow: 2,
                  }
                }}
              >
                {item.type === 'image' && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url(${item.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                )}
                {item.type === 'video' && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundColor: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}
                  >
                    <VideoIcon size={32} />
                  </Box>
                )}
                {item.type === 'text' && (
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 2,
                      textAlign: 'center',
                      wordBreak: 'break-word'
                    }}
                  >
                    {item.content}
                  </Box>
                )}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    p: 1,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    color: 'white',
                    fontSize: '0.75rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {item.title}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default MediaLibrary;
