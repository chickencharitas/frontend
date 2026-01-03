import React from 'react';
import { Box, Typography } from '@mui/material';

const Slide = ({ content, type = 'text', style = {} }) => {
  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 4,
              ...style
            }}
          >
            <Typography variant="h3" component="div">
              {content}
            </Typography>
          </Box>
        );
      case 'image':
        return (
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${content})`,
              backgroundSize: 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              ...style
            }}
          />
        );
      case 'video':
        return (
          <Box
            component="video"
            src={content}
            autoPlay
            loop
            muted
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              ...style
            }}
          />
        );
      default:
        return <div>Unsupported slide type</div>;
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {renderContent()}
    </Box>
  );
};

export default Slide;
