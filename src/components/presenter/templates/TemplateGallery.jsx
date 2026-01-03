/**
 * Template Gallery - Main Hub for All 5 Template Types
 * Sleek tab-based interface with search, filtering, and management
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Stack,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Badge,
  Divider
} from '@mui/material';
import {
  GridView as GalleryIcon,
  Palette as PaletteIcon,
  Layers as LayersIcon,
  Schedule as ScheduleIcon,
  Videocam as VideoIcon,
  Star as StarIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Delete as DeleteIcon,
  ZoomOut as CollectionsIcon
} from '@mui/icons-material';
import SlideTemplates from './SlideTemplates';
import PresentationTemplates from './PresentationTemplates';
import ThemeTemplates from './ThemeTemplates';
import ServiceTemplates from './ServiceTemplates';
import MediaTemplates from './MediaTemplates';

const TemplateGallery = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [savedTemplates, setSavedTemplates] = useState(
    JSON.parse(localStorage.getItem('savedTemplates') || '[]')
  );
  const [favoriteCount, setFavoriteCount] = useState({
    slides: 0,
    presentations: 0,
    themes: 0,
    services: 0,
    media: 0
  });
  const [managerOpen, setManagerOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templateName, setTemplateName] = useState('');
  const [searchGlobal, setSearchGlobal] = useState('');

  // Update favorite counts
  useEffect(() => {
    const counts = {
      slides: JSON.parse(localStorage.getItem('favoriteSlideTemplates') || '[]').length,
      presentations: JSON.parse(localStorage.getItem('favoritePresentationTemplates') || '[]').length,
      themes: JSON.parse(localStorage.getItem('favoriteThemeTemplates') || '[]').length,
      services: JSON.parse(localStorage.getItem('favoriteServiceTemplates') || '[]').length,
      media: JSON.parse(localStorage.getItem('favoriteMediaTemplates') || '[]').length
    };
    setFavoriteCount(counts);
  }, []);

  // Handle template selection
  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
  };

  // Handle template application
  const handleTemplateApply = (template, action) => {
    if (action === 'apply') {
      setSnackbar({
        open: true,
        message: `Template "${template.name}" applied successfully!`,
        severity: 'success'
      });
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('template:applied', { detail: template }));
    } else if (action === 'duplicate') {
      setSnackbar({
        open: true,
        message: `Template "${template.name}" duplicated!`,
        severity: 'info'
      });
      window.dispatchEvent(new CustomEvent('template:duplicated', { detail: template }));
    }
  };

  // Handle theme apply
  const handleThemeApply = (theme) => {
    setSnackbar({
      open: true,
      message: `Theme "${theme.name}" applied!`,
      severity: 'success'
    });
    window.dispatchEvent(new CustomEvent('theme:applied', { detail: theme }));
  };

  // Handle media download
  const handleMediaDownload = (template) => {
    setSnackbar({
      open: true,
      message: `Downloading "${template.name}"...`,
      severity: 'info'
    });
    window.dispatchEvent(new CustomEvent('media:download', { detail: template }));
  };

  // Save custom template
  const handleSaveTemplate = () => {
    if (selectedTemplate && templateName) {
      const newTemplate = {
        ...selectedTemplate,
        id: `custom-${Date.now()}`,
        name: templateName,
        custom: true,
        createdAt: new Date().toISOString()
      };
      setSavedTemplates([...savedTemplates, newTemplate]);
      localStorage.setItem('savedTemplates', JSON.stringify([...savedTemplates, newTemplate]));
      setSnackbar({
        open: true,
        message: `Custom template "${templateName}" saved!`,
        severity: 'success'
      });
      setTemplateName('');
      setSelectedTemplate(null);
      setManagerOpen(false);
    }
  };

  // Delete saved template
  const handleDeleteTemplate = (id) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('savedTemplates', JSON.stringify(updated));
    setSnackbar({
      open: true,
      message: 'Template deleted',
      severity: 'info'
    });
  };

  // Tab configuration
  const tabs = [
    { label: 'Slide Templates', icon: <LayersIcon />, count: 14 },
    { label: 'Presentations', icon: <GalleryIcon />, count: 12 },
    { label: 'Themes', icon: <PaletteIcon />, count: 8 },
    { label: 'Service Orders', icon: <ScheduleIcon />, count: 10 },
    { label: 'Media Assets', icon: <VideoIcon />, count: 8 }
  ];

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a1a', color: '#fff' }}>
      {/* Header */}
      <Paper
        sx={{
          p: 2,
          backgroundColor: '#252526',
          borderRadius: 0,
          borderBottom: '1px solid #404040',
          boxShadow: 'none'
        }}
      >
        <Stack spacing={2}>
          <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#81c784', mb: 0.5 }}>
                ✨ Template Gallery
              </Typography>
              <Typography variant="caption" sx={{ color: '#808080' }}>
                50+ professional templates for every presentation type
              </Typography>
            </Box>
            <Stack direction="row" spacing={1}>
              <Tooltip title="Manage saved templates">
                <IconButton
                  onClick={() => setManagerOpen(true)}
                  sx={{
                    color: savedTemplates.length > 0 ? '#81c784' : '#808080'
                  }}
                >
                  <Badge badgeContent={savedTemplates.length} sx={{ '& .MuiBadge-badge': { backgroundColor: '#ff9800' } }}>
                    <CollectionsIcon />
                  </Badge>
                </IconButton>
              </Tooltip>
              <Tooltip title="Template settings">
                <IconButton sx={{ color: '#808080' }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>

          {/* Global Search */}
          <TextField
            placeholder="Search all templates..."
            value={searchGlobal}
            onChange={(e) => setSearchGlobal(e.target.value)}
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#ffffff',
                '& fieldset': { borderColor: '#404040' },
                '&:hover fieldset': { borderColor: '#81c784' }
              },
              '& .MuiOutlinedInput-input::placeholder': {
                color: '#808080',
                opacity: 1
              }
            }}
          />
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper
        sx={{
          backgroundColor: '#2d2d2e',
          borderRadius: 0,
          borderBottom: '1px solid #404040',
          boxShadow: 'none'
        }}
      >
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          sx={{
            '& .MuiTabs-indicator': { backgroundColor: '#81c784', height: 3 },
            '& .MuiTab-root': {
              color: '#808080',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              '&:hover': { color: '#81c784' },
              '&.Mui-selected': { color: '#81c784', fontWeight: 600 }
            }
          }}
        >
          {tabs.map((tab, i) => (
            <Tab
              key={i}
              label={
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  {tab.icon}
                  <span>{tab.label}</span>
                  {favoriteCount[['slides', 'presentations', 'themes', 'services', 'media'][i]] > 0 && (
                    <Chip
                      icon={<StarIcon />}
                      label={favoriteCount[['slides', 'presentations', 'themes', 'services', 'media'][i]]}
                      size="small"
                      sx={{
                        height: 20,
                        backgroundColor: '#ff9800',
                        color: '#000',
                        fontWeight: 600,
                        fontSize: '11px'
                      }}
                    />
                  )}
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Box sx={{ flex: 1, overflow: 'auto', backgroundColor: '#1a1a1a' }}>
        {/* Slide Templates Tab */}
        {activeTab === 0 && (
          <SlideTemplates
            onTemplateSelect={handleTemplateSelect}
            onTemplateApply={handleTemplateApply}
          />
        )}

        {/* Presentation Templates Tab */}
        {activeTab === 1 && (
          <PresentationTemplates
            onTemplateSelect={handleTemplateSelect}
            onTemplateApply={handleTemplateApply}
          />
        )}

        {/* Theme Templates Tab */}
        {activeTab === 2 && (
          <ThemeTemplates
            onTemplateSelect={handleTemplateSelect}
            onThemeApply={handleThemeApply}
          />
        )}

        {/* Service Templates Tab */}
        {activeTab === 3 && (
          <ServiceTemplates
            onTemplateSelect={handleTemplateSelect}
            onTemplateApply={handleTemplateApply}
          />
        )}

        {/* Media Templates Tab */}
        {activeTab === 4 && (
          <MediaTemplates
            onTemplateSelect={handleTemplateSelect}
            onTemplateDownload={handleMediaDownload}
          />
        )}
      </Box>

      {/* Saved Templates Manager Dialog */}
      <Dialog open={managerOpen} onClose={() => setManagerOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 600 }}>
          Saved Templates ({savedTemplates.length})
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          {savedTemplates.length > 0 ? (
            <Stack spacing={1}>
              {savedTemplates.map(template => (
                <Paper
                  key={template.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#2d2d2e',
                    border: '1px solid #404040'
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {template.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#808080' }}>
                      Saved {new Date(template.createdAt).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Apply">
                      <IconButton
                        size="small"
                        onClick={() => handleTemplateApply(template, 'apply')}
                        sx={{ color: '#81c784' }}
                      >
                        <UploadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTemplate(template.id)}
                        sx={{ color: '#ff5722' }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          ) : (
            <Typography sx={{ color: '#808080', textAlign: 'center', py: 3 }}>
              No saved templates yet. Create and save custom templates here.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManagerOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ backgroundColor: '#252526', color: '#fff' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TemplateGallery;
