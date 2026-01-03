/**
 * Phase 3 Templates Integration Example
 * Shows how to use the Template System with existing Phase 1/2 components
 */
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Stack,
  Typography,
  Button,
  Card,
  CardContent,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid
} from '@mui/material';
import {
  CheckCircle as SuccessIcon,
  Code as CodeIcon,
  Event as EventIcon,
  Storage as StorageIcon
} from '@mui/icons-material';
import TemplateGallery from './TemplateGallery';

/**
 * Integration Pattern:
 * 1. Template Gallery provides UI for browsing/selecting templates
 * 2. Custom events notify when templates are applied
 * 3. Parent component receives events and applies templates
 * 4. localStorage persists user preferences and saved templates
 */

const Phase3TemplatesIntegration = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [appliedTemplate, setAppliedTemplate] = useState(null);
  const [eventLog, setEventLog] = useState([]);
  const [stats, setStats] = useState({
    templatesApplied: 0,
    templatesSaved: 0,
    themesUsed: 0,
    customTemplates: 0
  });

  // Initialize event listeners
  useEffect(() => {
    const handleTemplateApplied = (e) => {
      const template = e.detail;
      setAppliedTemplate(template);
      setEventLog(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        event: 'Template Applied',
        template: template.name,
        type: 'success'
      }, ...prev.slice(0, 9)]);
      setStats(prev => ({ ...prev, templatesApplied: prev.templatesApplied + 1 }));
    };

    const handleTemplateDuplicated = (e) => {
      const template = e.detail;
      setEventLog(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        event: 'Template Duplicated',
        template: template.name,
        type: 'info'
      }, ...prev.slice(0, 9)]);
    };

    const handleThemeApplied = (e) => {
      const theme = e.detail;
      setEventLog(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        event: 'Theme Applied',
        template: theme.name,
        type: 'success'
      }, ...prev.slice(0, 9)]);
      setStats(prev => ({ ...prev, themesUsed: prev.themesUsed + 1 }));
    };

    const handleMediaDownload = (e) => {
      const media = e.detail;
      setEventLog(prev => [{
        timestamp: new Date().toLocaleTimeString(),
        event: 'Media Downloaded',
        template: media.name,
        type: 'info'
      }, ...prev.slice(0, 9)]);
    };

    window.addEventListener('template:applied', handleTemplateApplied);
    window.addEventListener('template:duplicated', handleTemplateDuplicated);
    window.addEventListener('theme:applied', handleThemeApplied);
    window.addEventListener('media:download', handleMediaDownload);

    // Load stats from localStorage
    const savedStats = JSON.parse(localStorage.getItem('templateStats') || '{}');
    if (Object.keys(savedStats).length > 0) {
      setStats(savedStats);
    }
    const customCount = JSON.parse(localStorage.getItem('savedTemplates') || '[]').length;
    setStats(prev => ({ ...prev, customTemplates: customCount }));

    return () => {
      window.removeEventListener('template:applied', handleTemplateApplied);
      window.removeEventListener('template:duplicated', handleTemplateDuplicated);
      window.removeEventListener('theme:applied', handleThemeApplied);
      window.removeEventListener('media:download', handleMediaDownload);
    };
  }, []);

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('templateStats', JSON.stringify(stats));
  }, [stats]);

  // Code examples
  const codeExamples = [
    {
      title: 'Event Listener Setup',
      code: `// Listen for template application
window.addEventListener('template:applied', (e) => {
  const template = e.detail;
  console.log('Template applied:', template.name);
  // Apply template to presentation
  applyTemplateToPresentation(template);
});

// Listen for theme changes
window.addEventListener('theme:applied', (e) => {
  const theme = e.detail;
  updateTheme(theme.colors, theme.fonts);
});`,
      language: 'javascript'
    },
    {
      title: 'Using Template in Component',
      code: `import TemplateGallery from './templates/TemplateGallery';

function MyPresentationBuilder() {
  const [template, setTemplate] = useState(null);

  const applyTemplate = (selectedTemplate) => {
    setTemplate(selectedTemplate);
    // Update slide structure, styles, content
    updatePresentation(selectedTemplate);
  };

  return (
    <Box>
      <TemplateGallery onTemplateApply={applyTemplate} />
    </Box>
  );
}`,
      language: 'jsx'
    },
    {
      title: 'Saving Custom Templates',
      code: `// Save current presentation as template
const saveAsTemplate = async (name) => {
  const customTemplate = {
    id: 'custom-' + Date.now(),
    name: name,
    slides: currentPresentation.slides,
    theme: currentPresentation.theme,
    createdAt: new Date().toISOString(),
    custom: true
  };

  const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
  saved.push(customTemplate);
  localStorage.setItem('savedTemplates', JSON.stringify(saved));
};`,
      language: 'javascript'
    }
  ];

  // Features list
  const features = [
    {
      title: 'Slide Templates',
      description: '14 pre-designed slide layouts',
      templates: 14
    },
    {
      title: 'Full Presentations',
      description: '12 complete presentation templates',
      templates: 12
    },
    {
      title: 'Professional Themes',
      description: '8 color & typography themes',
      templates: 8
    },
    {
      title: 'Service Orders',
      description: '10 worship service templates',
      templates: 10
    },
    {
      title: 'Media Assets',
      description: '8 video & graphics templates',
      templates: 8
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#1a1a1a', color: '#fff' }}>
      <Tabs
        value={activeTab}
        onChange={(e, val) => setActiveTab(val)}
        sx={{
          backgroundColor: '#252526',
          borderBottom: '1px solid #404040',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          '& .MuiTabs-indicator': { backgroundColor: '#81c784', height: 3 },
          '& .MuiTab-root': {
            color: '#808080',
            textTransform: 'none',
            fontSize: '14px',
            fontWeight: 500,
            '&:hover': { color: '#81c784' },
            '&.Mui-selected': { color: '#81c784', fontWeight: 600 }
          }
        }}
      >
        <Tab label="Template Gallery" />
        <Tab label="Integration Guide" />
        <Tab label="Code Examples" />
        <Tab label="Statistics" />
      </Tabs>

      {/* Gallery Tab */}
      {activeTab === 0 && <TemplateGallery />}

      {/* Integration Guide Tab */}
      {activeTab === 1 && (
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#81c784' }}>
                Phase 3: Template System Integration Guide
              </Typography>
              <Typography variant="body2" sx={{ color: '#c0c0c0', mb: 2 }}>
                Learn how to integrate the Template System with your presentation builder.
              </Typography>
            </Box>

            {/* Features Overview */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Available Template Types
              </Typography>
              <Grid container spacing={2}>
                {features.map((feature, i) => (
                  <Grid item xs={12} sm={6} md={4} key={i}>
                    <Card sx={{ backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                      <CardContent>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#808080', display: 'block', mb: 1 }}>
                          {feature.description}
                        </Typography>
                        <Chip
                          label={`${feature.templates} templates`}
                          size="small"
                          sx={{
                            backgroundColor: '#81c784',
                            color: '#000',
                            fontWeight: 600
                          }}
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Event System */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Custom Events Dispatched
              </Typography>
              <Stack spacing={1}>
                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <EventIcon sx={{ color: '#81c784' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      template:applied
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Fired when a template is applied to presentation. Access template data via event.detail
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <EventIcon sx={{ color: '#64b5f6' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      theme:applied
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Fired when a color theme is applied. Includes color palette and typography settings.
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <EventIcon sx={{ color: '#ffc107' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      template:duplicated
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Fired when user duplicates a template for custom modification.
                  </Typography>
                </Paper>
              </Stack>
            </Box>

            {/* Data Persistence */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                localStorage Keys
              </Typography>
              <Stack spacing={1}>
                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <StorageIcon sx={{ color: '#81c784' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      favoriteSlideTemplates
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Array of favorite slide template IDs
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <StorageIcon sx={{ color: '#64b5f6' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      favoritePresentationTemplates
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Array of favorite presentation template IDs
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <StorageIcon sx={{ color: '#ff9800' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      savedTemplates
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Array of user-created custom templates
                  </Typography>
                </Paper>

                <Paper sx={{ p: 2, backgroundColor: '#2d2d2e', border: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                    <StorageIcon sx={{ color: '#a78bfa' }} />
                    <Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                      currentTheme
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#c0c0c0' }}>
                    Currently active theme object with colors and fonts
                  </Typography>
                </Paper>
              </Stack>
            </Box>
          </Stack>
        </Box>
      )}

      {/* Code Examples Tab */}
      {activeTab === 2 && (
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#81c784' }}>
              Integration Code Examples
            </Typography>

            {codeExamples.map((example, i) => (
              <Paper
                key={i}
                sx={{
                  backgroundColor: '#2d2d2e',
                  border: '1px solid #404040',
                  overflow: 'hidden'
                }}
              >
                <Box sx={{ p: 2, backgroundColor: '#1a1a1a', borderBottom: '1px solid #404040' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <CodeIcon sx={{ color: '#81c784' }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      {example.title}
                    </Typography>
                  </Stack>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: '#1a1a1a',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    color: '#81c784',
                    overflowX: 'auto',
                    maxHeight: 300,
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word'
                  }}
                >
                  {example.code}
                </Box>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}

      {/* Statistics Tab */}
      {activeTab === 3 && (
        <Box sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#81c784' }}>
              Usage Statistics
            </Typography>

            {/* Stats Cards */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#2d2d2e', border: '2px solid #81c784' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <SuccessIcon sx={{ color: '#81c784' }} />
                      <Typography variant="caption" sx={{ color: '#808080' }}>
                        Templates Applied
                      </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ color: '#81c784', fontWeight: 700 }}>
                      {stats.templatesApplied}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#2d2d2e', border: '2px solid #64b5f6' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <SuccessIcon sx={{ color: '#64b5f6' }} />
                      <Typography variant="caption" sx={{ color: '#808080' }}>
                        Themes Used
                      </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ color: '#64b5f6', fontWeight: 700 }}>
                      {stats.themesUsed}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#2d2d2e', border: '2px solid #ff9800' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <SuccessIcon sx={{ color: '#ff9800' }} />
                      <Typography variant="caption" sx={{ color: '#808080' }}>
                        Custom Templates
                      </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ color: '#ff9800', fontWeight: 700 }}>
                      {stats.customTemplates}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <Card sx={{ backgroundColor: '#2d2d2e', border: '2px solid #a78bfa' }}>
                  <CardContent>
                    <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1 }}>
                      <SuccessIcon sx={{ color: '#a78bfa' }} />
                      <Typography variant="caption" sx={{ color: '#808080' }}>
                        Total Available
                      </Typography>
                    </Stack>
                    <Typography variant="h4" sx={{ color: '#a78bfa', fontWeight: 700 }}>
                      50+
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Event Log */}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Recent Activity
              </Typography>
              {eventLog.length > 0 ? (
                <Paper sx={{ backgroundColor: '#2d2d2e', border: '1px solid #404040', p: 0 }}>
                  <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {eventLog.map((log, i) => (
                      <ListItem key={i} sx={{ borderBottom: i < eventLog.length - 1 ? '1px solid #404040' : 'none' }}>
                        <ListItemText
                          primary={
                            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                              <Chip
                                label={log.event}
                                size="small"
                                sx={{
                                  backgroundColor: log.type === 'success' ? '#81c784' : '#2196f3',
                                  color: '#000',
                                  fontWeight: 600
                                }}
                              />
                              <Typography variant="body2">{log.template}</Typography>
                            </Stack>
                          }
                          secondary={log.timestamp}
                          secondaryTypographyProps={{ variant: 'caption', sx: { color: '#808080' } }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              ) : (
                <Alert severity="info">No activity yet. Start using templates to see the activity log.</Alert>
              )}
            </Box>
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default Phase3TemplatesIntegration;
