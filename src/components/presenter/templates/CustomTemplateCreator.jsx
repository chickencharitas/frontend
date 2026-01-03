/**
 * Custom Template Creator
 * Create, edit, and manage custom presentation templates
 */
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Grid,
  Alert,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cloud as CloudIcon,
  Lock as LockIcon,
  Public as PublicIcon
} from '@mui/icons-material';
import { templateAPI } from './services/templateAPI';
import { brandConfig } from './config/brandConfig';

const CustomTemplateCreator = ({ onTemplateCreated, onTemplateUpdated }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [syncEnabled, setSyncEnabled] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Custom',
    tags: [],
    tagInput: '',
    type: 'presentation',
    isPublic: false,
    slideCount: 1,
    slides: [],
    thumbnail: '',
    syncToBackend: true
  });

  // Step 1: Basic Info
  const handleBasicInfoChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Step 2: Add Tags
  const handleAddTag = () => {
    if (formData.tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, prev.tagInput.trim()],
        tagInput: ''
      }));
    }
  };

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  // Step 3: Configure Slides
  const handleAddSlide = () => {
    setFormData(prev => ({
      ...prev,
      slides: [...prev.slides, { type: 'blank', title: '', content: '' }],
      slideCount: prev.slideCount + 1
    }));
  };

  const handleUpdateSlide = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.map((slide, i) =>
        i === index ? { ...slide, [field]: value } : slide
      )
    }));
  };

  const handleRemoveSlide = (index) => {
    setFormData(prev => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
      slideCount: Math.max(1, prev.slideCount - 1)
    }));
  };

  // Save Template
  const handleSaveTemplate = async () => {
    try {
      setLoading(true);
      setError(null);

      const template = {
        id: editingTemplate?.id || `custom-${Date.now()}`,
        ...formData,
        createdAt: editingTemplate?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        custom: true,
        author: localStorage.getItem('userId') || 'anonymous'
      };

      let savedTemplate = template;

      // Save to backend if enabled
      if (formData.syncToBackend && syncEnabled) {
        try {
          if (editingTemplate) {
            savedTemplate = await templateAPI.customTemplates.update(template.id, template);
          } else {
            savedTemplate = await templateAPI.customTemplates.save(template);
          }
        } catch (apiError) {
          console.warn('Backend sync failed, saving locally:', apiError);
          // Continue with local save
        }
      }

      // Save to localStorage
      const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
      const index = saved.findIndex(t => t.id === template.id);
      
      if (index >= 0) {
        saved[index] = savedTemplate;
        onTemplateUpdated?.(savedTemplate);
      } else {
        saved.push(savedTemplate);
        onTemplateCreated?.(savedTemplate);
      }

      localStorage.setItem('savedTemplates', JSON.stringify(saved));

      setSuccess(`Template "${savedTemplate.name}" saved successfully!`);
      setTimeout(() => {
        setDialogOpen(false);
        resetForm();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: 'Custom',
      tags: [],
      tagInput: '',
      type: 'presentation',
      isPublic: false,
      slideCount: 1,
      slides: [],
      thumbnail: '',
      syncToBackend: true
    });
    setActiveStep(0);
    setEditingTemplate(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      ...template,
      tagInput: ''
    });
    setActiveStep(0);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (!loading) {
      setDialogOpen(false);
      resetForm();
    }
  };

  return (
    <Box>
      {/* Create Button */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleOpenCreate}
        sx={{
          background: brandConfig.accent,
          color: '#000',
          fontWeight: 600,
          '&:hover': { background: brandConfig.accentSecondary, color: '#fff' }
        }}
      >
        Create Custom Template
      </Button>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 600, background: brandConfig.secondary }}>
          {editingTemplate ? 'Edit Template' : 'Create Custom Template'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {/* Stepper */}
          <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
            <Step>
              <StepLabel>Basic Info</StepLabel>
            </Step>
            <Step>
              <StepLabel>Tags & Settings</StepLabel>
            </Step>
            <Step>
              <StepLabel>Slides</StepLabel>
            </Step>
            <Step>
              <StepLabel>Review</StepLabel>
            </Step>
          </Stepper>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Success Alert */}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* Step 1: Basic Info */}
          {activeStep === 0 && (
            <Stack spacing={2}>
              <TextField
                label="Template Name"
                value={formData.name}
                onChange={(e) => handleBasicInfoChange('name', e.target.value)}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: brandConfig.textPrimary,
                    '& fieldset': { borderColor: brandConfig.border },
                    '&:hover fieldset': { borderColor: brandConfig.accent }
                  }
                }}
              />

              <TextField
                label="Description"
                value={formData.description}
                onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                fullWidth
                multiline
                rows={3}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: brandConfig.textPrimary,
                    '& fieldset': { borderColor: brandConfig.border },
                    '&:hover fieldset': { borderColor: brandConfig.accent }
                  }
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleBasicInfoChange('type', e.target.value)}
                  label="Type"
                >
                  <MenuItem value="presentation">Presentation</MenuItem>
                  <MenuItem value="slide">Slide Layout</MenuItem>
                  <MenuItem value="theme">Theme</MenuItem>
                  <MenuItem value="service">Service Order</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}

          {/* Step 2: Tags & Settings */}
          {activeStep === 1 && (
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Tags
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Add tag"
                    value={formData.tagInput}
                    onChange={(e) => handleBasicInfoChange('tagInput', e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        color: brandConfig.textPrimary,
                        '& fieldset': { borderColor: brandConfig.border }
                      }
                    }}
                  />
                  <Button onClick={handleAddTag}>Add</Button>
                </Stack>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {formData.tags.map((tag, i) => (
                    <Chip
                      key={i}
                      label={tag}
                      onDelete={() => handleRemoveTag(i)}
                      sx={{
                        backgroundColor: brandConfig.tertiary,
                        color: brandConfig.accent
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isPublic}
                    onChange={(e) => handleBasicInfoChange('isPublic', e.target.checked)}
                  />
                }
                label="Make template public"
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.syncToBackend}
                    onChange={(e) => handleBasicInfoChange('syncToBackend', e.target.checked)}
                    disabled={!syncEnabled}
                  />
                }
                label={
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <span>Sync to backend</span>
                    <CloudIcon sx={{ fontSize: 16, color: brandConfig.accentSecondary }} />
                  </Stack>
                }
              />

              <Alert severity="info">
                {formData.isPublic ? (
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <PublicIcon />
                    <span>This template will be shared with your team</span>
                  </Stack>
                ) : (
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <LockIcon />
                    <span>This template is private</span>
                  </Stack>
                )}
              </Alert>
            </Stack>
          )}

          {/* Step 3: Slides */}
          {activeStep === 2 && (
            <Stack spacing={2}>
              <Box>
                <Button
                  startIcon={<AddIcon />}
                  onClick={handleAddSlide}
                  fullWidth
                  variant="outlined"
                  sx={{
                    borderColor: brandConfig.accent,
                    color: brandConfig.accent,
                    mb: 2
                  }}
                >
                  Add Slide
                </Button>

                {formData.slides.length === 0 ? (
                  <Typography sx={{ color: brandConfig.textTertiary, textAlign: 'center', py: 3 }}>
                    No slides yet. Add a slide to get started.
                  </Typography>
                ) : (
                  <Stack spacing={1}>
                    {formData.slides.map((slide, i) => (
                      <Paper
                        key={i}
                        sx={{
                          p: 2,
                          backgroundColor: brandConfig.tertiary,
                          border: `1px solid ${brandConfig.border}`
                        }}
                      >
                        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                          <Typography variant="subtitle2">
                            Slide {i + 1}
                          </Typography>
                          <Tooltip title="Delete slide">
                            <IconButton
                              size="small"
                              onClick={() => handleRemoveSlide(i)}
                              sx={{ color: brandConfig.danger }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>

                        <TextField
                          size="small"
                          label="Slide Type"
                          value={slide.type}
                          onChange={(e) => handleUpdateSlide(i, 'type', e.target.value)}
                          fullWidth
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          size="small"
                          label="Title"
                          value={slide.title}
                          onChange={(e) => handleUpdateSlide(i, 'title', e.target.value)}
                          fullWidth
                        />
                      </Paper>
                    ))}
                  </Stack>
                )}
              </Box>
            </Stack>
          )}

          {/* Step 4: Review */}
          {activeStep === 3 && (
            <Stack spacing={2}>
              <Card sx={{ backgroundColor: brandConfig.tertiary }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                        Name
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.name || '(Not set)'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                        Type
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600, textTransform: 'capitalize' }}>
                        {formData.type}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                        Slides
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {formData.slides.length}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="caption" sx={{ color: brandConfig.textTertiary }}>
                        Tags
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                        {formData.tags.length === 0 ? (
                          <Typography variant="body2" sx={{ color: brandConfig.textTertiary }}>
                            (No tags)
                          </Typography>
                        ) : (
                          formData.tags.map(tag => (
                            <Chip key={tag} label={tag} size="small" />
                          ))
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {formData.syncToBackend && (
                <Alert severity="info" icon={<CloudIcon />}>
                  This template will be synced to the backend
                </Alert>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, background: brandConfig.secondary }}>
          <Button onClick={handleCloseDialog} disabled={loading}>
            Cancel
          </Button>
          {activeStep > 0 && (
            <Button onClick={() => setActiveStep(activeStep - 1)} disabled={loading}>
              Back
            </Button>
          )}
          {activeStep < 3 ? (
            <Button
              onClick={() => setActiveStep(activeStep + 1)}
              disabled={loading || !formData.name}
              variant="contained"
              sx={{ background: brandConfig.accent, color: '#000' }}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSaveTemplate}
              disabled={loading || !formData.name}
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ background: brandConfig.accent, color: '#000' }}
            >
              {loading ? 'Saving...' : 'Save Template'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CustomTemplateCreator;
