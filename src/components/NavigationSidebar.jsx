import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Typography,
  Divider
} from '@mui/material';
import {
  PlayCircleRounded,
  LibraryMusicRounded,
  MenuBookRounded,
  TimerRounded,
  ScheduleRounded,
  VideoLibraryRounded,
  PaletteRounded,
  DevicesRounded,
  SettingsRounded,
  DashboardRounded,
  SlideshowRounded,
  TvRounded
} from '@mui/icons-material';

const NavigationSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const sections = [
    {
      title: 'SHOW',
      items: [
        { text: 'Home', icon: DashboardRounded, path: '/' },
        { text: 'Presenter', icon: SlideshowRounded, path: '/presenter' },
        { text: 'New Presentation', icon: SlideshowRounded, path: '/presentations/new' },
      ]
    },
    {
      title: 'LIBRARY',
      items: [
        { text: 'Songs', icon: LibraryMusicRounded, path: '/songs' },
        { text: 'Scripture', icon: MenuBookRounded, path: '/scripture' },
        { text: 'Media', icon: VideoLibraryRounded, path: '/media' },
        { text: 'Templates', icon: PaletteRounded, path: '/templates' },
      ]
    },
    {
      title: 'PLAN',
      items: [
        { text: 'Service Planner', icon: ScheduleRounded, path: '/planner' },
        { text: 'Timer', icon: TimerRounded, path: '/timer' },
      ]
    },
    {
      title: 'CONFIGURE',
      items: [
        { text: 'Screens', icon: TvRounded, path: '/devices' },
        { text: 'Settings', icon: SettingsRounded, path: '/settings' },
      ]
    }
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  return (
    <Box sx={{
      width: 240,
      backgroundColor: '#1e1e1e',
      borderRight: '1px solid #333',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      {/* Header - ProPresenter style */}
      <Box sx={{
        p: 1.5,
        borderBottom: '1px solid #333',
        backgroundColor: '#2d2d2d'
      }}>
        <Typography
          sx={{
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          WORSHIPRESS
        </Typography>
      </Box>

      {/* Navigation Menu - ProPresenter grouped style */}
      <Box sx={{ flex: 1, overflowY: 'auto', py: 1 }}>
        {sections.map((section, sectionIndex) => (
          <Box key={section.title}>
            <Typography
              sx={{
                color: '#666',
                fontSize: '0.65rem',
                fontWeight: 600,
                letterSpacing: '1px',
                px: 2,
                py: 1,
                mt: sectionIndex > 0 ? 1 : 0
              }}
            >
              {section.title}
            </Typography>
            <List disablePadding>
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <ListItem
                    button
                    key={item.path}
                    onClick={() => handleItemClick(item.path)}
                    sx={{
                      py: 0.75,
                      px: 2,
                      '&:hover': {
                        backgroundColor: '#333',
                      },
                      backgroundColor: isActive ? '#0066cc' : 'transparent',
                    }}
                  >
                    <ListItemIcon sx={{
                      color: isActive ? '#fff' : '#999',
                      minWidth: 32,
                    }}>
                      <item.icon sx={{ fontSize: 20 }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.8rem',
                        fontWeight: isActive ? 500 : 400,
                        color: isActive ? '#fff' : '#ccc',
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Box>
        ))}
      </Box>

      {/* Footer */}
      <Box sx={{
        p: 1.5,
        borderTop: '1px solid #333',
        backgroundColor: '#2d2d2d'
      }}>
        <Typography sx={{ color: '#555', fontSize: '0.6rem', textAlign: 'center' }}>
          Professional Worship Software
        </Typography>
      </Box>
    </Box>
  );
};

export default NavigationSidebar;