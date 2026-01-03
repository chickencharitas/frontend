# Template System - Quick Start Guide

## 🚀 5-Minute Setup

### Step 1: Import TemplateGallery
```jsx
import TemplateGallery from './components/presenter/templates/TemplateGallery';

function App() {
  return <TemplateGallery />;
}
```

### Step 2: Listen to Events
```jsx
useEffect(() => {
  const handleTemplateApplied = (e) => {
    console.log('Template applied:', e.detail.name);
    // Apply template to your presentation
    applyTemplate(e.detail);
  };

  window.addEventListener('template:applied', handleTemplateApplied);
  return () => window.removeEventListener('template:applied', handleTemplateApplied);
}, []);
```

### Step 3: Done! 🎉
Users can now:
- Browse 50+ templates
- Search and filter
- Mark favorites
- Save custom templates
- Apply themes
- Download media

---

## 📚 What You Get

### 🎨 Slide Templates (14)
Pre-designed layouts for any slide type.
- Title slides
- Content layouts  
- Media arrangements
- Special purposes

### 📊 Presentations (12)
Complete presentation structures.
- Worship services
- Business pitches
- Training programs
- Event programs

### 🎭 Themes (8)
Professional color & typography.
- Modern Dark (default)
- Corporate Blue
- Vibrant colors
- Spiritual themes

### ⏰ Service Orders (10)
Worship service structures.
- Sunday services
- Prayer meetings
- Special events
- Ceremonies

### 🎬 Media (8)
Video & graphics templates.
- Intros/outros
- Transitions
- Background loops
- Graphics

---

## 🎯 Common Use Cases

### Save Custom Template
```jsx
const saveMyTemplate = async (name) => {
  const custom = {
    id: 'custom-' + Date.now(),
    name: name,
    data: currentPresentation,
    createdAt: new Date().toISOString(),
    custom: true
  };

  const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
  localStorage.setItem('savedTemplates', JSON.stringify([...saved, custom]));
};
```

### Apply Saved Template
```jsx
const saved = JSON.parse(localStorage.getItem('savedTemplates'));
const myTemplate = saved.find(t => t.name === 'My Template');
window.dispatchEvent(new CustomEvent('template:applied', { detail: myTemplate }));
```

### Get User Favorites
```jsx
const favorites = JSON.parse(localStorage.getItem('favoriteSlideTemplates'));
const favoriteTemplates = slideTemplates.filter(t => favorites.includes(t.id));
```

---

## 🎨 Customize Look

### Change Accent Color
Edit `templateData.js` color values or apply theme:
```jsx
// Replace #81c784 with your color
// Search & replace in component files
const accentColor = '#your-color';
```

### Add Your Templates
Add to `templateData.js`:
```javascript
export const slideTemplates = [
  ...existingTemplates,
  {
    id: 'custom-id',
    name: 'My Template',
    category: 'Custom',
    tags: ['my-tag'],
    layout: { /* config */ },
    preview: { /* config */ }
  }
];
```

---

## 📱 Responsive Behavior

✅ **Fully responsive:**
- Mobile: 1 column
- Tablet: 2-3 columns
- Desktop: 3-4 columns
- 4K: 4-5 columns

✅ **Touch-friendly:**
- Large tap targets
- Swipe navigation
- Long-press for options

---

## 💾 Storage Info

**localStorage usage:** ~50KB
**What's stored:**
- Favorite template IDs
- Custom templates
- Current theme
- Usage statistics

**Clear if needed:**
```javascript
localStorage.clear(); // Clears ALL app data
// OR specific:
localStorage.removeItem('savedTemplates');
localStorage.removeItem('favoriteSlideTemplates');
```

---

## 🔧 Integration Checklist

- [ ] Import TemplateGallery component
- [ ] Add event listeners for template events
- [ ] Implement template application logic
- [ ] Handle saved templates in your app
- [ ] Style templates to match your brand
- [ ] Test all 5 template types
- [ ] Test search and filtering
- [ ] Test localStorage persistence
- [ ] Mobile responsiveness
- [ ] Deploy!

---

## 🎓 Code Snippets

### Complete Integration Example
```jsx
import React, { useEffect, useState } from 'react';
import TemplateGallery from './templates/TemplateGallery';

export default function PresentationBuilder() {
  const [presentation, setPresentation] = useState(null);
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    // Template applied
    window.addEventListener('template:applied', (e) => {
      setPresentation(e.detail);
      updateSlides(e.detail);
    });

    // Theme applied
    window.addEventListener('theme:applied', (e) => {
      setTheme(e.detail);
      applyTheme(e.detail.colors, e.detail.fonts);
    });

    return () => {
      window.removeEventListener('template:applied', null);
      window.removeEventListener('theme:applied', null);
    };
  }, []);

  const updateSlides = (template) => {
    // Your logic to update slides
  };

  const applyTheme = (colors, fonts) => {
    // Your logic to apply theme
    document.documentElement.style.setProperty('--primary-color', colors.primary);
  };

  return (
    <div>
      <TemplateGallery />
      {presentation && <SlideEditor slides={presentation.slides} />}
    </div>
  );
}
```

### Save Template Button
```jsx
function SaveTemplateButton({ currentPresentation }) {
  const [name, setName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSave = () => {
    const template = {
      id: 'custom-' + Date.now(),
      name: name,
      data: currentPresentation,
      createdAt: new Date().toISOString(),
      custom: true
    };

    const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    localStorage.setItem('savedTemplates', JSON.stringify([...saved, template]));
    
    setName('');
    setDialogOpen(false);
  };

  return (
    <>
      <Button onClick={() => setDialogOpen(true)}>
        Save as Template
      </Button>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <TextField
          label="Template name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={handleSave}>Save</Button>
      </Dialog>
    </>
  );
}
```

---

## 🐛 Troubleshooting

### Templates not showing?
1. Check console for errors
2. Verify components imported correctly
3. Check localStorage is enabled
4. Clear browser cache

### Theme not applying?
1. Verify event listener is set up
2. Check theme colors in localStorage
3. Ensure CSS is updating correctly
4. Check browser DevTools console

### Custom templates lost?
1. Check localStorage in DevTools
2. Look for `savedTemplates` key
3. Export to JSON if needed
4. Restore from localStorage backup

---

## 📞 Need Help?

**Check the files:**
- `TEMPLATE_SYSTEM_DOCS.md` - Full documentation
- `Phase3TemplatesIntegration.jsx` - Working example
- `templateData.js` - All template definitions

**Debug commands:**
```javascript
// See all templates
const { allTemplates } = require('./data/templateData');
console.table(allTemplates.slides.map(t => ({name: t.name, category: t.category})));

// Check localStorage
console.log(JSON.parse(localStorage.getItem('savedTemplates')));

// Test events
window.dispatchEvent(new CustomEvent('template:applied', {
  detail: { name: 'Test Template' }
}));
```

---

## ✅ Quality Checklist

- ✅ 50+ templates ready to use
- ✅ Zero compilation errors
- ✅ Fully responsive design
- ✅ Dark theme optimized
- ✅ Event system working
- ✅ localStorage persistence
- ✅ Search & filtering
- ✅ Favorite system
- ✅ Custom templates
- ✅ Production ready!

---

**Happy templating! 🎨**
