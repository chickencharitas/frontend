# Phase 3 Advanced Features - Complete Implementation Guide

## Overview

This guide covers the four advanced features for Phase 3:
1. **Brand Customization** - Customize colors, typography, and spacing
2. **Custom Template Creator** - Create and manage custom templates
3. **Backend API Integration** - Connect to backend services
4. **Team Library** - Collaborate with team members on templates

---

## 1. Brand Customization System

### Location
- Config: [`src/components/presenter/templates/config/brandConfig.js`](../../templates/config/brandConfig.js)

### Key Features

#### Color Palette Customization
```javascript
import { brandConfig } from './config/brandConfig';

// Access colors
const primaryColor = brandConfig.primary;
const accentColor = brandConfig.accent;

// Use in MUI sx prop
<Box sx={{ backgroundColor: brandConfig.secondary }}>
  Content
</Box>
```

#### Typography Configuration
```javascript
const fontConfig = brandConfig.typography;
// Includes: fontFamily, fontSize, fontWeight, lineHeight
```

#### Spacing System
```javascript
const spacing = brandConfig.spacing;
// xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, xxl: 48px
```

#### Preset Brand Themes
```javascript
import { brandConfig } from './config/brandConfig';

// Apply preset theme
const theme = brandConfig.themes.corporate;
// Available: default, corporate, modern, minimal, vibrant
```

#### CSS Variables Generation
```javascript
// Get CSS variables for global application
const cssVars = brandConfig.getCSSVariables();
// Returns object with --color-primary, --color-secondary, etc.

// Apply globally
document.documentElement.style.setProperty('--color-primary', brandConfig.primary);
```

#### Custom Theme Builder
```javascript
// Create custom theme
const customTheme = brandConfig.createCustomTheme({
  primary: '#FF6B6B',
  accent: '#4ECDC4',
  fontFamily: 'Arial, sans-serif'
});
```

### Color Categories
- `primary` - Main brand color (#1a1a1a)
- `secondary` - Secondary background (#252526)
- `tertiary` - Tertiary background (#2d2d2e)
- `accent` - Primary accent (#81c784)
- `accentSecondary` - Secondary accent (#4dd0e1)
- `accentTertiary` - Tertiary accent (#ba68c8)
- `success` - Success state (#4caf50)
- `warning` - Warning state (#ff9800)
- `danger` - Danger/error state (#f44336)
- `textPrimary` - Primary text (#ffffff)

---

## 2. Custom Template Creator

### Location
- Component: [`src/components/presenter/templates/CustomTemplateCreator.jsx`](../../templates/CustomTemplateCreator.jsx)

### Features

#### 4-Step Wizard
1. **Basic Info** - Name, description, type
2. **Tags & Settings** - Tagging, privacy settings
3. **Slides** - Configure slide structure
4. **Review** - Preview before saving

#### Usage

```javascript
import CustomTemplateCreator from './CustomTemplateCreator';

<CustomTemplateCreator
  onTemplateCreated={(template) => console.log('Created:', template)}
  onTemplateUpdated={(template) => console.log('Updated:', template)}
/>
```

#### Template Data Structure
```javascript
{
  id: 'custom-1234567890',
  name: 'My Template',
  description: 'Template description',
  category: 'Custom',
  type: 'presentation', // presentation, slide, theme, service
  tags: ['tag1', 'tag2'],
  slides: [
    { type: 'blank', title: 'Title', content: '' }
  ],
  slideCount: 1,
  isPublic: false,
  syncToBackend: true,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z',
  custom: true,
  author: 'user-id'
}
```

#### Local Storage
Templates are automatically saved to `localStorage['savedTemplates']`:
```javascript
const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
```

#### Backend Sync
If `syncToBackend` is enabled:
```javascript
// Uses templateAPI.customTemplates.save() or .update()
const savedTemplate = await templateAPI.customTemplates.save(template);
```

---

## 3. Backend API Integration

### Location
- Service: [`src/components/presenter/templates/services/templateAPI.js`](../../templates/services/templateAPI.js)
- Utils: [`src/components/presenter/templates/services/templateAPIUtils.js`](../../templates/services/templateAPIUtils.js)

### API Endpoints

#### Templates (CRUD)
```javascript
import { templateAPI } from './services/templateAPI';

// Get all templates
const templates = await templateAPI.templates.getAll();

// Get specific template
const template = await templateAPI.templates.getById('template-id');

// Create template
const created = await templateAPI.templates.create(templateData);

// Update template
const updated = await templateAPI.templates.update('template-id', templateData);

// Delete template
await templateAPI.templates.delete('template-id');
```

#### Custom Templates
```javascript
// Get my custom templates
const myTemplates = await templateAPI.customTemplates.getMy();

// Save custom template
const saved = await templateAPI.customTemplates.save(templateData);

// Delete custom template
await templateAPI.customTemplates.delete('template-id');
```

#### Favorites
```javascript
// Get all favorites
const favorites = await templateAPI.favorites.getAll();

// Add to favorites
await templateAPI.favorites.add('template-id');

// Remove from favorites
await templateAPI.favorites.remove('template-id');
```

#### Team Library
```javascript
// Get team templates
const teamTemplates = await templateAPI.teamLibrary.getTeamTemplates();

// Add template to team
const added = await templateAPI.teamLibrary.addToTeam('template-id', templateData);

// Remove from team
await templateAPI.teamLibrary.removeFromTeam('template-id');
```

#### Sharing
```javascript
// Share template with users
const shares = await templateAPI.sharing.share(
  'template-id',
  ['user@example.com', 'another@example.com'],
  'view' // permission: view, edit, admin
);

// Get share information
const shares = await templateAPI.sharing.getShares('template-id');

// Revoke access
await templateAPI.sharing.revoke('template-id', ['user@example.com']);
```

#### Analytics
```javascript
// Get usage statistics
const usage = await templateAPI.analytics.getUsage('template-id');

// Track template usage
await templateAPI.analytics.track('template-id', {
  action: 'viewed',
  timestamp: new Date().toISOString()
});
```

### Authentication
All requests use Bearer token authentication:
```javascript
// Token is automatically included in headers
// Stored in localStorage['authToken']

// Manual token management
templateAPIUtils.setAuthToken(token);
const token = templateAPIUtils.getAuthToken();
```

### Error Handling
```javascript
try {
  const template = await templateAPI.templates.getById('id');
} catch (err) {
  if (err instanceof templateAPI.TemplateAPIError) {
    console.error('API Error:', err.message);
    console.error('Status:', err.status);
  }
}
```

---

## 4. Advanced Utilities

### Retry Logic
```javascript
import { templateAPIUtils } from './services/templateAPIUtils';

// Automatic retry with exponential backoff
const response = await templateAPIUtils.fetchWithRetry(url, options);
// Retries up to 3 times with configurable delays
```

### Offline-First Sync
```javascript
// Queue requests for later sync
templateAPIUtils.queueRequest({
  method: 'POST',
  url: '/api/templates',
  headers: { 'Content-Type': 'application/json' },
  body: templateData
});

// Start background sync
templateAPIUtils.startBackgroundSync(30000); // 30 second interval

// Listen to sync events
templateAPIUtils.onSyncComplete((event) => {
  console.log('Sync complete:', event.detail);
});

templateAPIUtils.onSynced((event) => {
  console.log('Template synced:', event.detail);
});
```

### Conflict Resolution
```javascript
// Detect conflicts
const conflict = templateAPIUtils.detectConflict(local, backend);

if (conflict) {
  // Resolve conflict
  const resolved = templateAPIUtils.resolveConflict(
    conflict,
    'merge' // newer, local, backend, merge
  );
}
```

### Sync Status
```javascript
const status = templateAPIUtils.getSyncStatus();
// { isSyncing: boolean, queueLength: number, syncInterval: string }
```

---

## 5. Team Library Component

### Location
- Component: [`src/components/presenter/templates/TeamLibrary.jsx`](../../templates/TeamLibrary.jsx)

### Features

#### Browse Team Templates
```javascript
import TeamLibrary from './TeamLibrary';

<TeamLibrary
  onTemplateSelected={(template) => console.log('Selected:', template)}
  onTemplateImported={(template) => console.log('Imported:', template)}
/>
```

#### Template Sharing
- Share templates with team members
- Set permissions: view, edit, admin
- Remove collaborators
- View collaboration history

#### Search & Filter
- Search by name, description, tags
- Filter by author (My Templates, Shared with Me)
- Sort by date, popularity

#### Import Templates
- Import team templates to personal library
- One-click template duplication
- Merge with existing templates

---

## 6. Integration Example

### Complete Workflow

```javascript
import React, { useEffect, useState } from 'react';
import CustomTemplateCreator from './CustomTemplateCreator';
import TeamLibrary from './TeamLibrary';
import { templateAPI } from './services/templateAPI';
import { templateAPIUtils } from './services/templateAPIUtils';

function TemplateManager() {
  const [personalTemplates, setPersonalTemplates] = useState([]);
  const [syncStatus, setSyncStatus] = useState({});

  useEffect(() => {
    // Initialize
    initializeTemplateSystem();

    // Start background sync
    templateAPIUtils.startBackgroundSync();

    // Listen to sync events
    const unsubscribeSyncComplete = templateAPIUtils.onSyncComplete(() => {
      updateSyncStatus();
    });

    return () => {
      templateAPIUtils.stopBackgroundSync();
      unsubscribeSyncComplete();
    };
  }, []);

  const initializeTemplateSystem() {
    // Load personal templates
    const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
    setPersonalTemplates(saved);

    // Initialize utilities
    templateAPIUtils.loadSyncQueue();
  }

  const handleTemplateCreated = (template) => {
    setPersonalTemplates(prev => [template, ...prev]);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('template:created', {
      detail: { template }
    }));
  };

  const handleTemplateImported = (template) => {
    const imported = {
      ...template,
      id: `imported-${Date.now()}`,
      imported: true,
      originalId: template.id
    };

    setPersonalTemplates(prev => [imported, ...prev]);
    localStorage.setItem('savedTemplates', JSON.stringify(personalTemplates));

    window.dispatchEvent(new CustomEvent('template:imported', {
      detail: { template: imported }
    }));
  };

  const updateSyncStatus = () => {
    setSyncStatus(templateAPIUtils.getSyncStatus());
  };

  return (
    <div>
      <CustomTemplateCreator
        onTemplateCreated={handleTemplateCreated}
      />
      
      <TeamLibrary
        onTemplateImported={handleTemplateImported}
      />

      {syncStatus.isSyncing && <p>Syncing...</p>}
      {syncStatus.queueLength > 0 && <p>Pending: {syncStatus.queueLength}</p>}
    </div>
  );
}

export default TemplateManager;
```

---

## 7. Environment Configuration

### Required Environment Variables
```
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_AUTH_TOKEN=your-token-here
```

### Backend Requirements

#### Database Schema
Templates table:
```sql
CREATE TABLE templates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  type VARCHAR(50),
  category VARCHAR(100),
  slides JSON,
  tags JSON,
  author_id VARCHAR(255),
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE template_shares (
  id INT AUTO_INCREMENT PRIMARY KEY,
  template_id VARCHAR(255),
  shared_with VARCHAR(255),
  permission VARCHAR(50),
  shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (template_id) REFERENCES templates(id)
);
```

---

## 8. Troubleshooting

### Common Issues

#### Backend Sync Not Working
```javascript
// Check token
const token = templateAPIUtils.getAuthToken();
console.log('Token valid:', !templateAPIUtils.isTokenExpired(token));

// Check queue
const queue = templateAPIUtils.getSyncQueue();
console.log('Pending requests:', queue.length);

// Manual sync
await templateAPIUtils.syncQueuedRequests();
```

#### Templates Not Saving
```javascript
// Check localStorage
const saved = JSON.parse(localStorage.getItem('savedTemplates') || '[]');
console.log('Saved templates:', saved);

// Verify template structure
if (!template.name || !template.type) {
  console.error('Invalid template structure');
}
```

#### API Errors
```javascript
// Enable detailed logging
templateAPI.setDebugMode(true);

// Check response
console.log(templateAPIUtils.getSyncStatus());
```

---

## 9. File Structure

```
src/components/presenter/templates/
├── config/
│   └── brandConfig.js (180 lines)
├── services/
│   ├── templateAPI.js (400 lines)
│   └── templateAPIUtils.js (300+ lines)
├── CustomTemplateCreator.jsx (400+ lines)
├── TeamLibrary.jsx (450+ lines)
├── TemplateGallery.jsx (420 lines)
├── SlideTemplates.jsx (380 lines)
├── PresentationTemplates.jsx (420 lines)
├── ThemeTemplates.jsx (360 lines)
├── ServiceTemplates.jsx (400 lines)
└── MediaTemplates.jsx (350 lines)
```

---

## 10. Next Steps

1. **Backend Server Implementation**
   - Implement API endpoints
   - Setup database schema
   - Configure authentication

2. **Advanced Features**
   - Template versioning
   - Real-time collaboration
   - Advanced analytics dashboard
   - Template marketplace

3. **Performance Optimization**
   - Lazy load templates
   - Implement pagination
   - Cache strategy
   - Bundle optimization

4. **Security Enhancements**
   - Add role-based access control
   - Implement audit logging
   - Secure file uploads
   - Data encryption

---

**Documentation Version:** 1.0  
**Last Updated:** 2024-01-15  
**Status:** Phase 3 Advanced Features - Complete
