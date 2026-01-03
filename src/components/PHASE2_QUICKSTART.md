# Phase 2 Quick Start Guide

## 30-Second Overview
Phase 2 adds **presenter control, media management, live streaming, and scheduling** to your presentation system. Four major component groups with ~350 lines each, following Phase 1 patterns.

## Phase 2 Components at a Glance

| Component | Purpose | Key Feature |
|-----------|---------|------------|
| **DualMonitorSetup** | Display Management | Detect & switch between monitors |
| **StageDisplay** | Output Customization | Theme, mode, size control |
| **MediaLibrary** | Media Organization | Upload, browse, organize files |
| **MediaPlayer** | Playback Controls | Video/audio with transport controls |
| **LiveOutputConfiguration** | Streaming Setup | Resolution, bitrate, stream URL |
| **SchedulingCalendar** | Event Planning | Service planning & resource allocation |

## Quick Integration

### 1. Import Phase 2 Components
```javascript
import DualMonitorSetup from '@/components/presenter/dualmonitor/DualMonitorSetup';
import StageDisplay from '@/components/presenter/stagedisplay/StageDisplay';
import MediaLibrary from '@/components/media/MediaLibrary';
import MediaPlayer from '@/components/media/MediaPlayer';
import LiveOutputConfiguration from '@/components/liveoutput/LiveOutputConfiguration';
import SchedulingCalendar from '@/components/scheduling/SchedulingCalendar';
```

### 2. Add to PresenterView or PresentationBuilder
```javascript
// In your main presenter component
<Box sx={{ bgcolor: '#1a1a1a' }}>
  <DualMonitorSetup />
  <StageDisplay />
  <LiveOutputConfiguration />
  <MediaLibrary />
  <SchedulingCalendar />
</Box>
```

### 3. Listen for Component Events
```javascript
// Any custom event from Phase 2
useEffect(() => {
  const handleDualMonitor = (e) => {
    console.log('Dual monitor config:', e.detail);
  };

  window.addEventListener('presenter:dual-monitor-enabled', handleDualMonitor);
  return () => window.removeEventListener('presenter:dual-monitor-enabled', handleDualMonitor);
}, []);
```

## Feature Highlights

### Presenter Mode Enhancements
- **Dual Monitor Support:** Auto-detect displays, swap primary/secondary
- **Stage Display:** Customize appearance with 5 themes and 5 display modes
- **Smart Scaling:** Size output 50-150% for different screen sizes

### Media Management
- **Upload & Organize:** Drag files or click to upload, organize by type
- **Smart Preview:** Grid view with hover previews and quick actions
- **Media Player:** Professional playback with speed, volume, fullscreen

### Live Streaming
- **Output Configuration:** Select resolution (720p-4K), set bitrate, choose quality
- **Stream Settings:** Enter RTMP URL and stream key
- **Real-time Preview:** See output configuration before streaming

### Service Scheduling
- **Interactive Calendar:** Month view with event management
- **Event Types:** Service, Rehearsal, Setup, Meeting
- **Recurring Support:** Daily, weekly, monthly recurring events
- **Resource Tracking:** Allocate projectors, sound systems, lighting

## Key Design Patterns

### 1. Event System
All components dispatch custom events for state changes:
```javascript
// Component dispatches
window.dispatchEvent(new CustomEvent('presenter:stage-display-updated', {
  detail: { theme: 'dark', mode: 'current-next', size: 100 }
}));
```

### 2. localStorage Persistence
Settings automatically saved and restored:
```javascript
localStorage.setItem('stageDisplaySettings', JSON.stringify(settings));
```

### 3. Dark Theme Consistency
All components use standard color scheme:
- Background: `#1a1a1a`, `#252526`
- Accent: `#81c784` (green)
- Text: `#cccccc`, `#b0b0b0`

### 4. Responsive Design
Components adapt to container size using MUI Grid and Box

## Common Tasks

### Display Output on Specific Monitor
```javascript
<LiveOutputConfiguration onConfigChange={(config) => {
  // Send to streaming service
  const { resolution, bitrate, streamUrl } = config;
  startStream(streamUrl, { resolution, bitrate });
}} />
```

### Handle Media Selection
```javascript
<MediaLibrary onMediaSelect={(media) => {
  // Add to slide
  addToSlide({
    type: media.type,
    url: media.url,
    title: media.name
  });
}} />
```

### Create Service Events
```javascript
<SchedulingCalendar onEventCreate={(event) => {
  // Save to database
  saveEvent({
    title: event.title,
    date: event.date,
    time: `${event.startTime}-${event.endTime}`,
    location: event.location,
    resources: event.resources
  });
}} />
```

## Data Flow Example

```
User clicks "New Event" in SchedulingCalendar
     ↓
Opens dialog with form
     ↓
User fills in details and clicks "Create"
     ↓
Event saved to component state & localStorage
     ↓
Custom event 'scheduling:event-created' dispatched
     ↓
Parent component receives event in listener
     ↓
Sends to backend API
```

## Styling a Component

All components use Material-UI `sx` prop:
```javascript
<Box sx={{
  bgcolor: '#1a1a1a',        // dark background
  color: '#cccccc',          // light text
  p: 2,                      // padding
  borderRadius: 0,           // sharp edges
  '&:hover': {
    bgcolor: '#252526'       // slightly lighter on hover
  }
}}>
  Content
</Box>
```

## Keyboard Shortcuts Integration

Phase 2 components work with Phase 1 shortcuts:
- Existing shortcuts trigger Phase 2 actions
- New shortcuts can be added to `defaults.js`

Example in `ShortcutsProvider.jsx`:
```javascript
case 'shortcut:toggle-media-library':
  window.dispatchEvent(new CustomEvent('ui:toggle-media-panel'));
  break;
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Component not responding | Check if event listener is attached |
| Settings not persisting | Verify localStorage key name |
| Styling looks wrong | Ensure dark theme colors applied |
| Media won't upload | Check file size and type restrictions |
| Calendar not showing events | Verify date format (YYYY-MM-DD) |

## Next Steps

1. ✅ Review component source code
2. ✅ Import into main presentation builder
3. ✅ Add to toolbar/menu
4. ✅ Connect event listeners to parent component
5. ✅ Test with sample data
6. ⏭️ Connect to backend APIs (Phase 3)
7. ⏭️ Implement real-time sync
8. ⏭️ Add conflict detection for scheduling

## File Structure
```
src/components/
├── presenter/
│   ├── dualmonitor/
│   │   └── DualMonitorSetup.jsx
│   └── stagedisplay/
│       └── StageDisplay.jsx
├── media/
│   ├── MediaLibrary.jsx
│   ├── MediaPlayer.jsx
│   └── MediaUploader.jsx (ready)
├── liveoutput/
│   └── LiveOutputConfiguration.jsx
├── scheduling/
│   └── SchedulingCalendar.jsx
└── PHASE2_IMPLEMENTATION.md
```

## API Endpoints (Ready for Phase 3)

Phase 2 components are designed to work with these backend endpoints:

```
POST   /api/media/upload              - Upload media files
GET    /api/media/list                - List all media
DELETE /api/media/:id                 - Delete media

GET    /api/scheduling/events         - List events
POST   /api/scheduling/events         - Create event
PUT    /api/scheduling/events/:id     - Update event
DELETE /api/scheduling/events/:id     - Delete event

GET    /api/output/config             - Get output settings
PUT    /api/output/config             - Update output settings
POST   /api/streaming/start           - Start stream
POST   /api/streaming/stop            - Stop stream
```

---

**Status:** Phase 2 components ready for integration ✅
**Lines of Code:** ~1,400 (all components combined)
**Dependencies:** React 18, Material-UI, @mui/icons-material
**Theme:** Dark (consistent with Phase 1)
**Testing:** Manual testing recommended before production use

