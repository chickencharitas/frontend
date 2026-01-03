# Phase 2 Implementation Guide

## Overview
Phase 2 builds upon the Phase 1 foundation by adding advanced features for presenter control, media management, live output, and service scheduling. This guide covers the implementation and integration of Phase 2 components.

## Phase 2 Components

### 1. Presenter View Enhancements

#### DualMonitorSetup.jsx
**Location:** `src/components/presenter/dualmonitor/DualMonitorSetup.jsx`
**Purpose:** Manage multiple display configurations for presenter mode

**Features:**
- Display detection using `navigator.mediaDevices.enumerateDevices()`
- Primary/secondary display selection
- Display swap functionality
- Hardware detection with device information
- Settings persistence in localStorage
- Real-time configuration preview

**Integration:**
```javascript
import DualMonitorSetup from '@/components/presenter/dualmonitor/DualMonitorSetup';

// In PresenterView or parent component
<DualMonitorSetup onConfigChange={(config) => {
  // Handle configuration changes
  // Event: 'presenter:dual-monitor-enabled'
  // Event: 'presenter:dual-monitor-disabled'
}} />
```

**Custom Events:**
- `presenter:dual-monitor-enabled` - Fired when dual monitor setup is activated
- `presenter:dual-monitor-disabled` - Fired when disabled
- Details include selected displays and configuration

**localStorage Key:** `dualMonitorSetup`

---

#### StageDisplay.jsx
**Location:** `src/components/presenter/stagedisplay/StageDisplay.jsx`
**Purpose:** Customize the stage/output display appearance and content

**Features:**
- Theme selection (dark, light, custom, gradient)
- Display modes:
  - Current slide only
  - Current + Next slide
  - Lyrics mode
  - Timer/clock display
  - Hymnal view
- Size control (50-150% scaling)
- Content toggles (metadata, timer, notes)
- Real-time preview
- Responsive layout with customizable fonts

**Integration:**
```javascript
import StageDisplay from '@/components/presenter/stagedisplay/StageDisplay';

// In PresenterView or parent component
<StageDisplay 
  currentSlide={slideData}
  onDisplayModeChange={(mode) => {
    // Handle mode changes
  }}
/>
```

**Custom Events:**
- `presenter:stage-display-opened` - Fired when stage display panel opens
- `presenter:stage-display-closed` - Fired when closed
- `presenter:stage-display-updated` - Fired when settings change
- Details include theme, mode, and size settings

**localStorage Key:** `stageDisplaySettings`

---

### 2. Media Management

#### MediaLibrary.jsx
**Location:** `src/components/media/MediaLibrary.jsx`
**Purpose:** Browse, organize, and manage media files

**Features:**
- Multi-tab interface (All Media, Images, Videos, Audio, Folders)
- Upload functionality with progress tracking
- Grid and list view options
- Search and filter capabilities
- File organization with folders
- Media metadata display
- Drag-and-drop support (ready for implementation)
- Quick preview on hover
- Delete and manage operations

**Integration:**
```javascript
import MediaLibrary from '@/components/media/MediaLibrary';

// In PresentationBuilder or media panel
<MediaLibrary onMediaSelect={(media) => {
  // Handle media selection
  // Use in slides or presentations
}} />
```

**Custom Events:**
- `media:file-selected` - Fired when media is selected
- `media:file-uploaded` - Fired after successful upload
- `media:file-deleted` - Fired when media is deleted

---

#### MediaPlayer.jsx
**Location:** `src/components/media/MediaPlayer.jsx`
**Purpose:** Play audio and video content with controls

**Features:**
- Video and audio playback support
- Responsive player with 16:9 aspect ratio
- Transport controls (play, pause, stop, next, previous)
- Timeline scrubbing with visual feedback
- Volume control with slider
- Playback speed adjustment (0.5x to 2x)
- Fullscreen support
- Settings dialog with advanced options
- Auto-hide controls with mouse movement
- Time display and duration tracking
- Hardware acceleration option

**Integration:**
```javascript
import MediaPlayer from '@/components/media/MediaPlayer';

// In slide editor or presentation view
<MediaPlayer 
  mediaUrl="/path/to/media.mp4"
  mediaType="video"
  onTimeUpdate={(time) => {
    // Handle time updates
  }}
  onEnded={() => {
    // Handle playback end
  }}
/>
```

**Custom Events:**
- `media:play` - Fired when playback starts
- `media:pause` - Fired when paused
- `media:ended` - Fired when playback completes

---

### 3. Live Output Configuration

#### LiveOutputConfiguration.jsx
**Location:** `src/components/liveoutput/LiveOutputConfiguration.jsx`
**Purpose:** Configure live streaming and output settings

**Features:**
- Display and output selection
- Resolution and quality settings with presets
- Refresh rate and bitrate sliders
- Quality presets (Low, Medium, High, Ultra)
- Stream URL and key management
- Output content toggles (timer, metadata, recording)
- Hardware acceleration options
- Real-time output preview
- Stream enable/disable toggle

**Integration:**
```javascript
import LiveOutputConfiguration from '@/components/liveoutput/LiveOutputConfiguration';

// In PresenterView toolbar
<LiveOutputConfiguration onConfigChange={(config) => {
  // Handle output configuration changes
  // Event: 'presenter:output-config-changed'
  // Event: 'presenter:output-config-applied'
}} />
```

**Custom Events:**
- `presenter:output-config-changed` - Fired on any configuration change
- `presenter:output-config-applied` - Fired when settings are applied
- Details include resolution, bitrate, quality, streaming settings

**localStorage Key:** `liveOutputConfig`

---

### 4. Advanced Scheduling

#### SchedulingCalendar.jsx
**Location:** `src/components/scheduling/SchedulingCalendar.jsx`
**Purpose:** Plan and manage worship services and events

**Features:**
- Calendar grid with month navigation
- Event creation and editing
- Multiple event types (Service, Rehearsal, Setup, Meeting)
- Recurring event support (daily, weekly, monthly)
- Time slot management
- Location tracking
- Attendee management
- Resource allocation (projector, sound system, lighting)
- Conflict detection ready
- Upcoming events list with details
- Event status tracking

**Integration:**
```javascript
import SchedulingCalendar from '@/components/scheduling/SchedulingCalendar';

// In admin or planning section
<SchedulingCalendar 
  onEventCreate={(event) => {
    // Handle new event creation
    // Send to backend
  }}
  onEventUpdate={(event) => {
    // Handle event updates
  }}
/>
```

**Custom Events:**
- `scheduling:event-created` - Fired when new event is created
- `scheduling:event-changed` - Fired when event is modified
- `scheduling:event-deleted` - Fired when event is removed
- Details include event data

**localStorage Key:** `schedulingEvents`

---

## Integration Points with Phase 1

### PresentationBuilder Integration
Phase 2 components should be integrated into the main PresentationBuilder interface:

```javascript
import PresentationBuilder from '@/components/PresentationBuilder';
import DualMonitorSetup from '@/components/presenter/dualmonitor/DualMonitorSetup';
import StageDisplay from '@/components/presenter/stagedisplay/StageDisplay';
import MediaLibrary from '@/components/media/MediaLibrary';
import LiveOutputConfiguration from '@/components/liveoutput/LiveOutputConfiguration';
import SchedulingCalendar from '@/components/scheduling/SchedulingCalendar';

// In app configuration
const Phase2Features = {
  presenterEnhancements: {
    DualMonitorSetup,
    StageDisplay
  },
  mediaManagement: {
    MediaLibrary,
    MediaPlayer
  },
  liveOutput: {
    LiveOutputConfiguration
  },
  scheduling: {
    SchedulingCalendar
  }
};
```

### PresenterView Enhancement
Integrate dual monitor and stage display into existing PresenterView:

```javascript
// In PresenterView.jsx
import DualMonitorSetup from '@/components/presenter/dualmonitor/DualMonitorSetup';
import StageDisplay from '@/components/presenter/stagedisplay/StageDisplay';

export const PresenterViewEnhanced = () => {
  return (
    <Box>
      {/* Existing controls */}
      <DualMonitorSetup />
      <StageDisplay />
      {/* Rest of presenter view */}
    </Box>
  );
};
```

---

## Event System Architecture

Phase 2 uses a custom event system for component communication:

```javascript
// Dispatching events
window.dispatchEvent(
  new CustomEvent('presenter:dual-monitor-enabled', {
    detail: { /* event data */ }
  })
);

// Listening for events
window.addEventListener('presenter:dual-monitor-enabled', (e) => {
  console.log(e.detail); // Access event data
});
```

### Common Event Patterns
- **Format:** `domain:action` (e.g., `presenter:display-changed`)
- **Detail:** Object containing relevant data
- **Persistence:** Related data stored in localStorage with kebab-case keys

---

## localStorage Keys Reference

| Key | Component | Content |
|-----|-----------|---------|
| `dualMonitorSetup` | DualMonitorSetup | Display configuration |
| `stageDisplaySettings` | StageDisplay | Theme, mode, size settings |
| `liveOutputConfig` | LiveOutputConfiguration | Output settings |
| `schedulingEvents` | SchedulingCalendar | Calendar events |
| `mediaLibrary` | MediaLibrary | Media organization (future) |

---

## Styling Consistency

All Phase 2 components follow the established dark theme:

**Color Palette:**
- Primary: `#1a1a1a` (darkest background)
- Secondary: `#252526` (cards, panels)
- Tertiary: `#2d2d2e` (hover states)
- Accent: `#81c784` (green - primary action)
- Text: `#cccccc` (main text)
- Text Muted: `#b0b0b0` (secondary text)
- Border: `#404040` (dividers, borders)
- Error: `#ff6b6b` (delete, warning)

**Material-UI Theme:**
All components use MUI with custom styling applied through `sx` prop. Icons from `@mui/icons-material` are used throughout.

---

## API Integration (Phase 3)

Phase 2 components are designed with API integration in mind:

### Media Management
```javascript
// Future: Backend API calls
const uploadMedia = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch('/api/media/upload', {
    method: 'POST',
    body: formData
  });
  return response.json();
};
```

### Scheduling
```javascript
// Future: Sync events with backend
const saveEvent = async (event) => {
  const response = await fetch('/api/scheduling/events', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  return response.json();
};
```

### Live Output
```javascript
// Future: Stream configuration
const updateStreamSettings = async (config) => {
  const response = await fetch('/api/output/settings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config)
  });
  return response.json();
};
```

---

## Testing Checklist

- [ ] DualMonitorSetup detects displays correctly
- [ ] StageDisplay theme changes apply in real-time
- [ ] MediaLibrary upload and delete operations work
- [ ] MediaPlayer controls respond smoothly
- [ ] LiveOutputConfiguration saves and applies settings
- [ ] SchedulingCalendar events persist correctly
- [ ] All custom events fire with correct data
- [ ] localStorage persists after page refresh
- [ ] Responsive design works on different screen sizes
- [ ] Dark theme applied consistently

---

## Performance Considerations

1. **MediaLibrary:** Use virtualization for large file lists
2. **SchedulingCalendar:** Implement event pagination
3. **MediaPlayer:** Lazy load video elements
4. **LiveOutputConfiguration:** Debounce slider changes
5. **DualMonitorSetup:** Cache display information

---

## Known Limitations & Future Enhancements

1. **MediaPlayer:** 
   - No HLS streaming support yet
   - Subtitle/caption tracks not implemented
   - Playlist functionality pending

2. **MediaLibrary:**
   - Drag-and-drop folder organization pending
   - Batch operations not yet implemented
   - Cloud storage integration pending

3. **SchedulingCalendar:**
   - Conflict detection algorithm pending
   - Multi-user collaboration features pending
   - Email notifications pending

4. **LiveOutputConfiguration:**
   - RTMP validation pending
   - Hardware encoder detection pending
   - CDN integration pending

---

## Support & Documentation

For additional help:
- See Phase 1 documentation for core concepts
- Check keyboard shortcuts documentation for available bindings
- Reference MUI documentation for component prop options
- Review custom events in source code comments

