import React, { useState, useEffect } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  Box,
  Divider,
  Fade,
  Chip,
  IconButton
} from '@mui/material';
import {
  StyleRounded,
  ExpandMore as ExpandMoreIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';
// Removed custom useTheme import - will use MUI's useTheme instead
import TemplateDesigner from './TemplateDesigner';

const ThemePreview = ({ theme, onToggleFavorite, isFavorite }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', gap: 2 }}>
    <Box
      sx={{
        width: 40,
        height: 24,
        borderRadius: 1,
        background: theme.colors.background,
        border: '1px solid rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography sx={{ fontSize: '6px', color: theme.colors.text, fontWeight: 'bold' }}>Aa</Typography>
    </Box>
    <Box sx={{ flex: 1 }}>
      <Typography sx={{ fontWeight: 600, color: '#cccccc', fontSize: '0.9rem' }}>{theme.name}</Typography>
      <Typography sx={{ fontSize: '0.75rem', color: '#808080' }}>{theme.description}</Typography>
    </Box>
    <IconButton
      size="small"
      onClick={(e) => { e.stopPropagation(); onToggleFavorite(theme.id, e); }}
      sx={{ color: isFavorite(theme.id) ? '#569cd6' : '#808080', p: 0.5 }}
    >
      {isFavorite(theme.id) ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
    </IconButton>
  </Box>
);

const ThemeDropdown = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [designerOpen, setDesignerOpen] = useState(false);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [favorites, setFavorites] = useState(['worship-classic', 'modern-dark']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentTheme, setCurrentTheme] = useState(null);

  // Removed themeContext usage since it's not available

  useEffect(() => {
    const saved = localStorage.getItem('customTemplates');
    if (saved) setCustomTemplates(JSON.parse(saved));
  }, [designerOpen]);

  const presentationThemes = [
    { id: 'worship-classic', name: 'Classic Worship', description: 'Traditional church style', category: 'Worship', colors: { background: 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #0a0a1a 100%)', text: '#ffffff', accent: '#ffd700' }, fonts: { heading: 'Georgia', body: 'Arial' } },
    { id: 'worship-blue-sky', name: 'Blue Sky Worship', description: 'Heavenly blue sky', category: 'Worship', colors: { background: 'linear-gradient(180deg, #87ceeb 0%, #4a90c2 40%, #1e5799 100%)', text: '#ffffff', accent: '#ffd700' }, fonts: { heading: 'Trebuchet MS', body: 'Arial' } },
    { id: 'worship-golden-light', name: 'Golden Light', description: 'Warm golden rays', category: 'Worship', colors: { background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2410 50%, #4a3c1a 100%)', text: '#ffd700', accent: '#ffffff' }, fonts: { heading: 'Times New Roman', body: 'Georgia' } },
    { id: 'worship-purple-majesty', name: 'Purple Majesty', description: 'Royal purple theme', category: 'Worship', colors: { background: 'linear-gradient(180deg, #1a0033 0%, #4a0080 50%, #2d0052 100%)', text: '#ffffff', accent: '#e6b800' }, fonts: { heading: 'Palatino', body: 'Arial' } },
    { id: 'worship-stained-glass', name: 'Stained Glass', description: 'Church window colors', category: 'Worship', colors: { background: 'linear-gradient(135deg, #1a0a2e 0%, #2e1a47 30%, #0d3b66 70%, #1a0a2e 100%)', text: '#f0e6d2', accent: '#ff6b35' }, fonts: { heading: 'Bookman', body: 'Georgia' } },
    { id: 'modern-dark', name: 'Modern Dark', description: 'Sleek contemporary', category: 'Modern', colors: { background: 'linear-gradient(180deg, #0a0a0a 0%, #1a1a2e 50%, #0f0f1a 100%)', text: '#ffffff', accent: '#00d4ff' }, fonts: { heading: 'Arial Black', body: 'Arial' } },
    { id: 'modern-gradient', name: 'Neon Glow', description: 'Vibrant for youth', category: 'Modern', colors: { background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)', text: '#ffffff', accent: '#00ffff' }, fonts: { heading: 'Impact', body: 'Verdana' } },
    { id: 'modern-minimalist', name: 'Clean Slate', description: 'Minimal design', category: 'Modern', colors: { background: '#0a0a0a', text: '#ffffff', accent: '#0088ff' }, fonts: { heading: 'Helvetica', body: 'Arial' } },
    { id: 'nature-forest', name: 'Forest Peace', description: 'Serene greens', category: 'Nature', colors: { background: 'linear-gradient(180deg, #0a1f0a 0%, #1a3a1a 50%, #0d2818 100%)', text: '#e8f5e9', accent: '#81c784' }, fonts: { heading: 'Georgia', body: 'Verdana' } },
    { id: 'nature-ocean', name: 'Ocean Deep', description: 'Calming blues', category: 'Nature', colors: { background: 'linear-gradient(180deg, #001a33 0%, #003366 50%, #001a33 100%)', text: '#e0f7fa', accent: '#4dd0e1' }, fonts: { heading: 'Trebuchet MS', body: 'Arial' } },
    { id: 'nature-sunrise', name: 'New Dawn', description: 'Sunrise colors', category: 'Nature', colors: { background: 'linear-gradient(180deg, #1a0a1a 0%, #4a1a2e 30%, #ff6b35 70%, #ffd93d 100%)', text: '#ffffff', accent: '#ffd700' }, fonts: { heading: 'Palatino', body: 'Georgia' } },
    { id: 'christmas', name: 'Christmas Joy', description: 'Festive red & gold', category: 'Seasonal', colors: { background: 'linear-gradient(180deg, #1a0a0a 0%, #4a1a1a 50%, #2d0a0a 100%)', text: '#ffffff', accent: '#ffd700' }, fonts: { heading: 'Times New Roman', body: 'Georgia' } },
    { id: 'easter', name: 'Easter Morning', description: 'Resurrection sunrise', category: 'Seasonal', colors: { background: 'linear-gradient(180deg, #2d1a4a 0%, #6b4a8a 40%, #ffd700 100%)', text: '#ffffff', accent: '#ffd700' }, fonts: { heading: 'Georgia', body: 'Arial' } },
    { id: 'thanksgiving', name: 'Harvest Thanks', description: 'Autumn harvest', category: 'Seasonal', colors: { background: 'linear-gradient(180deg, #1a0f05 0%, #4a2810 50%, #2d1a0a 100%)', text: '#f5deb3', accent: '#ff8c00' }, fonts: { heading: 'Bookman', body: 'Georgia' } },
    { id: 'simple-black', name: 'Pure Black', description: 'Simple black', category: 'Simple', colors: { background: '#000000', text: '#ffffff', accent: '#ffffff' }, fonts: { heading: 'Arial', body: 'Arial' } },
    { id: 'simple-navy', name: 'Navy Blue', description: 'Classic navy', category: 'Simple', colors: { background: '#001f3f', text: '#ffffff', accent: '#7fdbff' }, fonts: { heading: 'Verdana', body: 'Arial' } },
    { id: 'simple-white', name: 'Pure White', description: 'Clean white', category: 'Simple', colors: { background: '#ffffff', text: '#1a1a1a', accent: '#0066cc' }, fonts: { heading: 'Arial Black', body: 'Arial' } }
  ];

  useEffect(() => {
    if (!currentTheme) setCurrentTheme(presentationThemes[0]);
  }, []);

  const categories = ['All', 'Worship', 'Modern', 'Nature', 'Seasonal', 'Simple'];

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleThemeSelect = (themeId) => {
    const allThemes = [...presentationThemes, ...customTemplates];
    const selectedTheme = allThemes.find(t => t.id === themeId);
    if (selectedTheme) {
      setCurrentTheme(selectedTheme);
      window.dispatchEvent(new CustomEvent('presentation:theme:selected', { detail: { theme: selectedTheme } }));
    }
    handleClose();
  };

  const handleToggleFavorite = (themeId, event) => {
    event.stopPropagation();
    const newFavorites = favorites.includes(themeId) ? favorites.filter(f => f !== themeId) : [...favorites, themeId];
    setFavorites(newFavorites);
    localStorage.setItem('themeFavorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (themeId) => favorites.includes(themeId);

  const filteredThemes = selectedCategory === 'All' ? presentationThemes : presentationThemes.filter(theme => theme.category === selectedCategory);

  return (
    <>
      <Button
        onClick={handleClick}
        sx={{
          flex: 1, minWidth: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          py: 0.75, px: 0.5, color: '#cccccc', backgroundColor: 'transparent', border: 'none', borderRadius: 0,
          textTransform: 'none', fontSize: '0.7rem', '&:hover': { backgroundColor: 'rgba(255,255,255,0.08)' }
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <StyleRounded fontSize="large" sx={{ mb: 0.25 }} />
          <ExpandMoreIcon fontSize="small" sx={{ mb: 0.25 }} />
        </Box>
        <Typography variant="caption" sx={{ fontSize: '0.65rem', mt: 0.25 }}>Theme</Typography>
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { backgroundColor: '#2d2d30', color: '#cccccc', borderRadius: 1, border: '1px solid #3e3e42', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', minWidth: 300, maxWidth: 380, overflow: 'hidden' } }}
        TransitionComponent={Fade}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #3e3e42' }}>
          <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>Presentation Themes</Typography>
          <Typography variant="caption" sx={{ color: '#808080', display: 'block', mt: 0.5 }}>ProPresenter & EasyWorship style templates</Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <Chip key={cat} label={cat} size="small" onClick={() => setSelectedCategory(cat)}
                sx={{ backgroundColor: selectedCategory === cat ? '#569cd6' : '#3e3e42', color: selectedCategory === cat ? '#fff' : '#ccc', fontSize: '0.7rem', height: 24 }} />
            ))}
          </Box>
        </Box>

        <Box sx={{ maxHeight: 350, overflow: 'auto' }}>
          {customTemplates.length > 0 && selectedCategory === 'All' && (
            <>
              <Box sx={{ px: 2, py: 1, backgroundColor: alpha('#ffd700', 0.1) }}>
                <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: '#ffd700', fontWeight: 600 }}>✨ My Templates</Typography>
              </Box>
              {customTemplates.map((theme) => (
                <MenuItem key={theme.id} onClick={() => handleThemeSelect(theme.id)} sx={{ py: 1.5, px: 2, borderBottom: '1px solid #252526' }}>
                  <ThemePreview theme={theme} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} />
                </MenuItem>
              ))}
              <Divider sx={{ bgcolor: '#3e3e42', my: 1 }} />
            </>
          )}

          <Box sx={{ px: 2, py: 1, backgroundColor: alpha('#cccccc', 0.1) }}>
            <Typography variant="subtitle2" sx={{ fontSize: '0.75rem', color: '#cccccc', fontWeight: 600 }}>
              {selectedCategory === 'All' ? '🎨 All Themes' : `${selectedCategory} Themes`}
            </Typography>
          </Box>
          {filteredThemes.map((theme) => (
            <MenuItem key={theme.id} onClick={() => handleThemeSelect(theme.id)}
              sx={{ py: 1.5, px: 2, borderBottom: '1px solid #252526', backgroundColor: currentTheme?.id === theme.id ? alpha('#569cd6', 0.2) : 'transparent', '&:hover': { backgroundColor: alpha('#cccccc', 0.1) } }}>
              <ThemePreview theme={theme} onToggleFavorite={handleToggleFavorite} isFavorite={isFavorite} />
            </MenuItem>
          ))}
        </Box>

        <Box sx={{ p: 1.5, borderTop: '1px solid #3e3e42', backgroundColor: '#252526', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="caption" sx={{ color: '#808080', fontSize: '0.7rem' }}>
            Current: <span style={{ color: '#cccccc', fontWeight: 'bold' }}>{currentTheme?.name || 'None'}</span>
          </Typography>
          <Button size="small" startIcon={<AddIcon />} onClick={() => { handleClose(); setDesignerOpen(true); }}
            sx={{ color: '#ffd700', fontSize: '0.7rem', textTransform: 'none', '&:hover': { bgcolor: 'rgba(255,215,0,0.1)' } }}>
            Design Custom
          </Button>
        </Box>
      </Menu>

      <TemplateDesigner open={designerOpen} onClose={() => setDesignerOpen(false)} onSave={(template) => setCustomTemplates(prev => [...prev, template])} />
    </>
  );
};

export default ThemeDropdown;
