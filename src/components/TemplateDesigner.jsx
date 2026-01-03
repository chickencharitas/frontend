import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  Chip
} from '@mui/material';
import {
  Add,
  Save,
  Delete,
  AutoAwesome,
  Palette,
  FormatColorFill,
  TextFields,
  Image,
  Gradient,
  ContentCopy,
  Check,
  Animation,
  Videocam,
  Flare,
  Waves,
  Grain
} from '@mui/icons-material';
import MotionBackground, { MOTION_PRESETS } from './MotionGraphics';

// OpenAI API integration for template generation
const generateTemplateWithAI = async (prompt, apiKey) => {
  if (!apiKey) {
    throw new Error('OpenAI API key is required');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are a professional worship presentation designer. Generate worship slide templates in JSON format.
          Each template should include:
          - name: A descriptive name
          - description: Brief description
          - category: One of (Worship, Modern, Nature, Seasonal, Simple)
          - colors: { background (CSS gradient or color), text (hex), accent (hex), secondary (hex) }
          - fonts: { heading (font name), body (font name) }
          - textPosition: One of (center, top, bottom, left, right)
          - textShadow: CSS text-shadow value
          - overlay: Optional overlay color with opacity
          
          Use professional worship-appropriate designs with gradients, appropriate colors for church settings.
          Return ONLY valid JSON array with 1-3 templates.`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate template');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;
  
  // Parse JSON from response
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Invalid response format from AI');
};

const TemplateDesigner = ({ open, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [template, setTemplate] = useState({
    name: 'My Custom Template',
    description: 'A custom worship template',
    category: 'Worship',
    colors: {
      background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #0a0a1a 100%)',
      text: '#ffffff',
      accent: '#ffd700',
      secondary: '#c9a227'
    },
    fonts: {
      heading: 'Georgia',
      body: 'Arial'
    },
    textPosition: 'center',
    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
    overlay: 'rgba(0,0,0,0.3)',
    motion: {
      particleType: 'none',
      particleColor: 'rgba(255,255,255,0.5)',
      particleCount: 30,
      lightRays: false,
      lightRayColor: 'rgba(255,215,0,0.15)',
      floatingElements: false,
      floatingType: 'circles',
      floatingColor: 'rgba(255,255,255,0.1)',
      waves: false,
      waveColor: 'rgba(255,255,255,0.05)',
      lensFlare: false,
      lensFlareColor: '#ffd700',
      animatedGradient: false,
      videoUrl: ''
    }
  });

  const [customTemplates, setCustomTemplates] = useState([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load saved templates and API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('customTemplates');
    if (saved) setCustomTemplates(JSON.parse(saved));
    
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleSaveTemplate = () => {
    const newTemplate = {
      ...template,
      id: `custom-${Date.now()}`,
      isCustom: true,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...customTemplates, newTemplate];
    setCustomTemplates(updated);
    localStorage.setItem('customTemplates', JSON.stringify(updated));
    setSuccess('Template saved successfully!');
    setTimeout(() => setSuccess(''), 3000);
    
    if (onSave) onSave(newTemplate);
  };

  const handleDeleteTemplate = (templateId) => {
    const updated = customTemplates.filter(t => t.id !== templateId);
    setCustomTemplates(updated);
    localStorage.setItem('customTemplates', JSON.stringify(updated));
  };

  const handleLoadTemplate = (loadedTemplate) => {
    setTemplate({
      ...loadedTemplate,
      name: loadedTemplate.name + ' (Copy)'
    });
    setActiveTab(0);
  };

  const handleGenerateWithAI = async () => {
    if (!aiPrompt.trim()) {
      setError('Please enter a description for the template');
      return;
    }
    if (!apiKey.trim()) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      // Save API key
      localStorage.setItem('openai_api_key', apiKey);
      
      const generated = await generateTemplateWithAI(aiPrompt, apiKey);
      
      if (generated && generated.length > 0) {
        // Add generated templates to custom templates
        const newTemplates = generated.map((t, i) => ({
          ...t,
          id: `ai-${Date.now()}-${i}`,
          isCustom: true,
          isAIGenerated: true,
          createdAt: new Date().toISOString()
        }));
        
        const updated = [...customTemplates, ...newTemplates];
        setCustomTemplates(updated);
        localStorage.setItem('customTemplates', JSON.stringify(updated));
        
        // Load first generated template into editor
        setTemplate(newTemplates[0]);
        setSuccess(`Generated ${newTemplates.length} template(s) with AI!`);
        setTimeout(() => setSuccess(''), 3000);
        setActiveTab(0);
      }
    } catch (err) {
      setError(err.message || 'Failed to generate template');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTemplate = () => {
    window.dispatchEvent(new CustomEvent('presentation:theme:selected', {
      detail: { theme: template }
    }));
    onClose();
  };

  const systemFonts = [
    'Arial', 'Arial Black', 'Georgia', 'Times New Roman', 'Verdana',
    'Trebuchet MS', 'Palatino', 'Garamond', 'Bookman', 'Impact',
    'Helvetica', 'Tahoma', 'Geneva', 'Courier New', 'Lucida Sans'
  ];

  const categories = ['Worship', 'Modern', 'Nature', 'Seasonal', 'Simple'];
  const textPositions = ['center', 'top', 'bottom', 'left', 'right'];

  const gradientPresets = [
    { name: 'Purple Night', value: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #0a0a1a 100%)' },
    { name: 'Blue Sky', value: 'linear-gradient(180deg, #87ceeb 0%, #4a90c2 40%, #1e5799 100%)' },
    { name: 'Golden Hour', value: 'linear-gradient(135deg, #1a1a1a 0%, #2d2410 50%, #4a3c1a 100%)' },
    { name: 'Ocean Deep', value: 'linear-gradient(180deg, #001a33 0%, #003366 50%, #001a33 100%)' },
    { name: 'Forest', value: 'linear-gradient(180deg, #0a1f0a 0%, #1a3a1a 50%, #0d2818 100%)' },
    { name: 'Sunset', value: 'linear-gradient(180deg, #1a0a1a 0%, #4a1a2e 30%, #ff6b35 70%, #ffd93d 100%)' },
    { name: 'Christmas', value: 'linear-gradient(180deg, #1a0a0a 0%, #4a1a1a 50%, #2d0a0a 100%)' },
    { name: 'Easter', value: 'linear-gradient(180deg, #2d1a4a 0%, #6b4a8a 40%, #ffd700 100%)' }
  ];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#1e1e1e',
          color: '#fff',
          minHeight: '80vh'
        }
      }}
    >
      <DialogTitle sx={{ borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 2 }}>
        <Palette />
        Template Designer
        <Chip label="ProPresenter Style" size="small" sx={{ bgcolor: '#4a0080', color: '#fff' }} />
      </DialogTitle>
      
      <DialogContent sx={{ p: 0 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          sx={{ 
            borderBottom: '1px solid #333',
            bgcolor: '#252526',
            '& .MuiTab-root': { color: '#888' },
            '& .Mui-selected': { color: '#fff' }
          }}
        >
          <Tab label="Design" />
          <Tab label="Motion" icon={<Animation sx={{ fontSize: 16 }} />} iconPosition="start" />
          <Tab label="AI Generate" />
          <Tab label="My Templates" />
        </Tabs>

        {error && (
          <Alert severity="error" sx={{ m: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ m: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Design Tab */}
        {activeTab === 0 && (
          <Box sx={{ display: 'flex', height: 'calc(80vh - 180px)' }}>
            {/* Preview Panel */}
            <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>Live Preview</Typography>
              <MotionBackground
                particleType={template.motion?.particleType || 'none'}
                particleColor={template.motion?.particleColor}
                particleCount={template.motion?.particleCount || 30}
                lightRays={template.motion?.lightRays}
                lightRayColor={template.motion?.lightRayColor}
                floatingElements={template.motion?.floatingElements}
                floatingType={template.motion?.floatingType}
                floatingColor={template.motion?.floatingColor}
                waves={template.motion?.waves}
                waveColor={template.motion?.waveColor}
                lensFlare={template.motion?.lensFlare}
                lensFlareColor={template.motion?.lensFlareColor}
                animatedGradient={template.motion?.animatedGradient}
                gradientColors={template.colors.background.includes('gradient') ? 
                  template.colors.background.match(/#[a-fA-F0-9]{6}/g) || ['#1a0a2e', '#2d1b4e'] : 
                  ['#1a0a2e', '#2d1b4e']}
                sx={{
                  flex: 1,
                  background: template.colors.background,
                  display: 'flex',
                  alignItems: template.textPosition === 'top' ? 'flex-start' :
                             template.textPosition === 'bottom' ? 'flex-end' : 'center',
                  justifyContent: template.textPosition === 'left' ? 'flex-start' :
                                 template.textPosition === 'right' ? 'flex-end' : 'center',
                  p: 4,
                  borderRadius: 2
                }}
              >
                {template.overlay && (
                  <Box sx={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: template.overlay,
                    zIndex: 0
                  }} />
                )}
                <Box sx={{ position: 'relative', zIndex: 2, textAlign: template.textPosition === 'left' ? 'left' : template.textPosition === 'right' ? 'right' : 'center' }}>
                  <Typography
                    variant="h3"
                    sx={{
                      fontFamily: template.fonts.heading,
                      color: template.colors.text,
                      textShadow: template.textShadow,
                      mb: 2
                    }}
                  >
                    Amazing Grace
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: template.fonts.body,
                      color: template.colors.text,
                      textShadow: template.textShadow,
                      opacity: 0.9
                    }}
                  >
                    How sweet the sound
                  </Typography>
                </Box>
              </MotionBackground>
            </Box>

            {/* Controls Panel */}
            <Box sx={{ width: 380, borderLeft: '1px solid #333', p: 2, overflowY: 'auto' }}>
              <Grid container spacing={2}>
                {/* Template Info */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Template Name"
                    value={template.name}
                    onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Description"
                    value={template.description}
                    onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Category</InputLabel>
                    <Select
                      value={template.category}
                      onChange={(e) => setTemplate({ ...template, category: e.target.value })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}
                    >
                      {categories.map(cat => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ bgcolor: '#444', my: 1 }} />
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                    <FormatColorFill sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    Background
                  </Typography>
                </Grid>

                {/* Gradient Presets */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {gradientPresets.map(preset => (
                      <Tooltip key={preset.name} title={preset.name}>
                        <Box
                          onClick={() => setTemplate({ 
                            ...template, 
                            colors: { ...template.colors, background: preset.value } 
                          })}
                          sx={{
                            width: 32,
                            height: 32,
                            background: preset.value,
                            borderRadius: 1,
                            cursor: 'pointer',
                            border: template.colors.background === preset.value ? '2px solid #fff' : '2px solid transparent',
                            '&:hover': { transform: 'scale(1.1)' }
                          }}
                        />
                      </Tooltip>
                    ))}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Custom Background (CSS)"
                    value={template.colors.background}
                    onChange={(e) => setTemplate({ 
                      ...template, 
                      colors: { ...template.colors, background: e.target.value } 
                    })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff', fontSize: '0.8rem' }, '& .MuiInputLabel-root': { color: '#888' } }}
                  />
                </Grid>

                {/* Colors */}
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Text Color</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="color"
                    value={template.colors.text}
                    onChange={(e) => setTemplate({ 
                      ...template, 
                      colors: { ...template.colors, text: e.target.value } 
                    })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', height: 40 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: '#888' }}>Accent Color</Typography>
                  <TextField
                    fullWidth
                    size="small"
                    type="color"
                    value={template.colors.accent}
                    onChange={(e) => setTemplate({ 
                      ...template, 
                      colors: { ...template.colors, accent: e.target.value } 
                    })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', height: 40 } }}
                  />
                </Grid>

                {/* Fonts */}
                <Grid item xs={12}>
                  <Divider sx={{ bgcolor: '#444', my: 1 }} />
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>
                    <TextFields sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                    Typography
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Heading Font</InputLabel>
                    <Select
                      value={template.fonts.heading}
                      onChange={(e) => setTemplate({ 
                        ...template, 
                        fonts: { ...template.fonts, heading: e.target.value } 
                      })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}
                    >
                      {systemFonts.map(font => (
                        <MenuItem key={font} value={font} sx={{ fontFamily: font }}>{font}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Body Font</InputLabel>
                    <Select
                      value={template.fonts.body}
                      onChange={(e) => setTemplate({ 
                        ...template, 
                        fonts: { ...template.fonts, body: e.target.value } 
                      })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}
                    >
                      {systemFonts.map(font => (
                        <MenuItem key={font} value={font} sx={{ fontFamily: font }}>{font}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Text Position */}
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Text Position</InputLabel>
                    <Select
                      value={template.textPosition}
                      onChange={(e) => setTemplate({ ...template, textPosition: e.target.value })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}
                    >
                      {textPositions.map(pos => (
                        <MenuItem key={pos} value={pos}>{pos.charAt(0).toUpperCase() + pos.slice(1)}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Text Shadow */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Text Shadow (CSS)"
                    value={template.textShadow}
                    onChange={(e) => setTemplate({ ...template, textShadow: e.target.value })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }}
                  />
                </Grid>

                {/* Overlay */}
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Overlay Color (rgba)"
                    value={template.overlay || ''}
                    onChange={(e) => setTemplate({ ...template, overlay: e.target.value })}
                    placeholder="rgba(0,0,0,0.3)"
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }}
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Motion Tab */}
        {activeTab === 1 && (
          <Box sx={{ display: 'flex', height: 'calc(80vh - 180px)' }}>
            <Box sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="subtitle2" sx={{ color: '#888', mb: 1 }}>Motion Preview</Typography>
              <MotionBackground
                particleType={template.motion?.particleType || 'none'}
                particleColor={template.motion?.particleColor}
                particleCount={template.motion?.particleCount || 30}
                lightRays={template.motion?.lightRays}
                lightRayColor={template.motion?.lightRayColor}
                floatingElements={template.motion?.floatingElements}
                floatingType={template.motion?.floatingType}
                floatingColor={template.motion?.floatingColor}
                waves={template.motion?.waves}
                waveColor={template.motion?.waveColor}
                lensFlare={template.motion?.lensFlare}
                lensFlareColor={template.motion?.lensFlareColor}
                animatedGradient={template.motion?.animatedGradient}
                sx={{ flex: 1, background: template.colors.background, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <Typography variant="h4" sx={{ fontFamily: template.fonts.heading, color: template.colors.text, textShadow: template.textShadow }}>
                  Motion Preview
                </Typography>
              </MotionBackground>
            </Box>
            <Box sx={{ width: 400, borderLeft: '1px solid #333', p: 2, overflowY: 'auto' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Grain /> Particle Effects
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Particle Type</InputLabel>
                    <Select
                      value={template.motion?.particleType || 'none'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, particleType: e.target.value } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}
                    >
                      <MenuItem value="none">None</MenuItem>
                      <MenuItem value="dust">Dust</MenuItem>
                      <MenuItem value="snow">Snow</MenuItem>
                      <MenuItem value="sparkle">Sparkle</MenuItem>
                      <MenuItem value="firefly">Fireflies</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" type="number" label="Count" value={template.motion?.particleCount || 30}
                    onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, particleCount: parseInt(e.target.value) } })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Particle Color" value={template.motion?.particleColor || 'rgba(255,255,255,0.5)'}
                    onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, particleColor: e.target.value } })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }} />
                </Grid>

                <Grid item xs={12}><Divider sx={{ bgcolor: '#444', my: 1 }} /></Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Flare /> Light Effects
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Light Rays</InputLabel>
                    <Select value={template.motion?.lightRays ? 'on' : 'off'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, lightRays: e.target.value === 'on' } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}>
                      <MenuItem value="off">Off</MenuItem>
                      <MenuItem value="on">On</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Lens Flare</InputLabel>
                    <Select value={template.motion?.lensFlare ? 'on' : 'off'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, lensFlare: e.target.value === 'on' } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}>
                      <MenuItem value="off">Off</MenuItem>
                      <MenuItem value="on">On</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" label="Ray Color" value={template.motion?.lightRayColor || 'rgba(255,215,0,0.15)'}
                    onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, lightRayColor: e.target.value } })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff', fontSize: '0.8rem' }, '& .MuiInputLabel-root': { color: '#888' } }} />
                </Grid>
                <Grid item xs={6}>
                  <TextField fullWidth size="small" label="Flare Color" value={template.motion?.lensFlareColor || '#ffd700'}
                    onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, lensFlareColor: e.target.value } })}
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }} />
                </Grid>

                <Grid item xs={12}><Divider sx={{ bgcolor: '#444', my: 1 }} /></Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Waves /> Background Motion
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Animated Gradient</InputLabel>
                    <Select value={template.motion?.animatedGradient ? 'on' : 'off'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, animatedGradient: e.target.value === 'on' } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}>
                      <MenuItem value="off">Off</MenuItem>
                      <MenuItem value="on">On</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Waves</InputLabel>
                    <Select value={template.motion?.waves ? 'on' : 'off'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, waves: e.target.value === 'on' } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}>
                      <MenuItem value="off">Off</MenuItem>
                      <MenuItem value="on">On</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Floating Elements</InputLabel>
                    <Select value={template.motion?.floatingElements ? 'on' : 'off'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, floatingElements: e.target.value === 'on' } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}>
                      <MenuItem value="off">Off</MenuItem>
                      <MenuItem value="on">On</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: '#888' }}>Element Type</InputLabel>
                    <Select value={template.motion?.floatingType || 'circles'}
                      onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, floatingType: e.target.value } })}
                      sx={{ bgcolor: '#2a2a2a', color: '#fff' }}>
                      <MenuItem value="circles">Circles</MenuItem>
                      <MenuItem value="squares">Squares</MenuItem>
                      <MenuItem value="crosses">Crosses</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}><Divider sx={{ bgcolor: '#444', my: 1 }} /></Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#888', mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Videocam /> Video Background
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth size="small" label="Video URL (MP4)" value={template.motion?.videoUrl || ''}
                    onChange={(e) => setTemplate({ ...template, motion: { ...template.motion, videoUrl: e.target.value } })}
                    placeholder="https://example.com/video.mp4"
                    sx={{ '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, '& .MuiInputLabel-root': { color: '#888' } }} />
                </Grid>

                <Grid item xs={12}><Divider sx={{ bgcolor: '#444', my: 1 }} /></Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ color: '#ffd700', mb: 1 }}>Quick Presets</Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {Object.entries(MOTION_PRESETS).filter(([k]) => k !== 'none').map(([key, preset]) => (
                      <Chip key={key} label={key} size="small"
                        onClick={() => setTemplate({ ...template, motion: { ...template.motion, ...preset } })}
                        sx={{ bgcolor: '#333', color: '#ccc', textTransform: 'capitalize', '&:hover': { bgcolor: '#444' } }} />
                    ))}
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* AI Generate Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AutoAwesome sx={{ color: '#ffd700' }} />
              AI Template Generator
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', mb: 3 }}>
              Describe the template you want and AI will generate it for you. Be specific about colors, mood, and occasion.
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  size="small"
                  label="OpenAI API Key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  helperText="Your API key is stored locally and never sent to our servers"
                  sx={{ 
                    '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, 
                    '& .MuiInputLabel-root': { color: '#888' },
                    '& .MuiFormHelperText-root': { color: '#666' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Describe your template"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="E.g., Create a peaceful worship template with soft blue gradients, golden accents, suitable for Sunday morning services. Include a subtle light ray effect from the top."
                  sx={{ 
                    '& .MuiInputBase-root': { bgcolor: '#2a2a2a', color: '#fff' }, 
                    '& .MuiInputLabel-root': { color: '#888' }
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                  <Typography variant="caption" sx={{ color: '#888', width: '100%' }}>Quick prompts:</Typography>
                  {[
                    'Christmas themed with red and gold',
                    'Easter sunrise with purple and gold',
                    'Modern youth service with neon colors',
                    'Traditional hymn style with deep blue',
                    'Peaceful meditation with soft greens',
                    'Thanksgiving autumn theme'
                  ].map(prompt => (
                    <Chip
                      key={prompt}
                      label={prompt}
                      size="small"
                      onClick={() => setAiPrompt(prompt)}
                      sx={{ bgcolor: '#333', color: '#ccc', '&:hover': { bgcolor: '#444' } }}
                    />
                  ))}
                </Box>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <AutoAwesome />}
                  onClick={handleGenerateWithAI}
                  disabled={isGenerating}
                  sx={{ bgcolor: '#4a0080', '&:hover': { bgcolor: '#6a00b0' } }}
                >
                  {isGenerating ? 'Generating...' : 'Generate with AI'}
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* My Templates Tab */}
        {activeTab === 3 && (
          <Box sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>My Custom Templates</Typography>
            {customTemplates.length === 0 ? (
              <Typography sx={{ color: '#888' }}>
                No custom templates yet. Create one in the Design tab or generate with AI.
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {customTemplates.map(t => (
                  <Grid item xs={12} sm={6} md={4} key={t.id}>
                    <Paper
                      sx={{
                        background: t.colors?.background || '#333',
                        height: 150,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        borderRadius: 2,
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': { transform: 'scale(1.02)' },
                        transition: 'transform 0.2s'
                      }}
                      onClick={() => handleLoadTemplate(t)}
                    >
                      {t.isAIGenerated && (
                        <Chip 
                          label="AI" 
                          size="small" 
                          sx={{ position: 'absolute', top: 8, right: 8, bgcolor: '#ffd700', color: '#000' }} 
                        />
                      )}
                      <Typography
                        sx={{
                          fontFamily: t.fonts?.heading || 'Arial',
                          color: t.colors?.text || '#fff',
                          fontWeight: 'bold'
                        }}
                      >
                        {t.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Use Template">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); handleLoadTemplate(t); }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton 
                            size="small" 
                            onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#ff6b6b' }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ borderTop: '1px solid #333', p: 2 }}>
        <Button onClick={onClose} sx={{ color: '#888' }}>Cancel</Button>
        {activeTab === 0 && (
          <>
            <Button 
              startIcon={<Save />} 
              onClick={handleSaveTemplate}
              sx={{ color: '#4ec9b0' }}
            >
              Save Template
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Check />}
              onClick={handleApplyTemplate}
              sx={{ bgcolor: '#0066cc' }}
            >
              Apply to Slides
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default TemplateDesigner;
