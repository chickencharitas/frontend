import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Card,
  CardContent,
  Switch,
  FormControlLabel,
  Autocomplete,
  Alert,
  Divider
} from '@mui/material';
import {
  Warning,
  Info,
  CheckCircle,
  Clock,
  Person,
  Devices,
  Delete,
  Edit,
  Close,
  ContentCopy
} from '@mui/icons-material';

const EventManager = ({ events = [], onEventSave, onEventDelete, onConflictDetect }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [conflicts, setConflicts] = useState([]);
  const [showConflictAlert, setShowConflictAlert] = useState(false);

  // Available resources
  const [availableResources] = useState([
    { id: 'projector', name: 'Projector', icon: '📽️', quantity: 2 },
    { id: 'sound-system', name: 'Sound System', icon: '🔊', quantity: 1 },
    { id: 'lighting', name: 'Lighting', icon: '💡', quantity: 3 },
    { id: 'video-camera', name: 'Video Camera', icon: '📹', quantity: 2 },
    { id: 'microphone', name: 'Microphone', icon: '🎤', quantity: 5 },
    { id: 'stage-monitor', name: 'Stage Monitor', icon: '📺', quantity: 2 }
  ]);

  // Available attendees
  const [availableAttendees] = useState([
    'John Doe',
    'Jane Smith',
    'Tech Lead',
    'Sound Tech',
    'Lighting Tech',
    'Camera Operator',
    'Worship Leader',
    'Pastor',
    'Choir Members',
    'Volunteers'
  ]);

  // Detect scheduling conflicts
  const detectConflicts = useCallback((event) => {
    const detectedConflicts = [];

    events.forEach(existingEvent => {
      if (existingEvent.id === event.id) return; // Skip self

      // Check if events are on the same date
      if (existingEvent.date === event.date) {
        const existingStart = parseInt(existingEvent.startTime.replace(':', ''));
        const existingEnd = parseInt(existingEvent.endTime.replace(':', ''));
        const newStart = parseInt(event.startTime.replace(':', ''));
        const newEnd = parseInt(event.endTime.replace(':', ''));

        // Check for time overlap
        if ((newStart < existingEnd && newEnd > existingStart)) {
          detectedConflicts.push({
            type: 'time-overlap',
            severity: 'high',
            conflictingEvent: existingEvent,
            message: `Time conflict with "${existingEvent.title}" (${existingEvent.startTime}-${existingEvent.endTime})`
          });
        }

        // Check for resource conflicts
        const sharedResources = event.resources.filter(r => 
          existingEvent.resources.includes(r)
        );
        if (sharedResources.length > 0) {
          detectedConflicts.push({
            type: 'resource-conflict',
            severity: 'medium',
            conflictingEvent: existingEvent,
            resources: sharedResources,
            message: `Resource conflict: ${sharedResources.join(', ')} also needed for "${existingEvent.title}"`
          });
        }
      }
    });

    setConflicts(detectedConflicts);
    if (detectedConflicts.length > 0) {
      setShowConflictAlert(true);
      onConflictDetect?.(detectedConflicts);
    }
    return detectedConflicts;
  }, [events, onConflictDetect]);

  const handleOpenEvent = (event) => {
    setSelectedEvent(event);
    setEditingEvent(JSON.parse(JSON.stringify(event)));
    const eventConflicts = detectConflicts(event);
    setOpenDialog(true);
  };

  const handleSaveEvent = () => {
    const eventConflicts = detectConflicts(editingEvent);
    
    if (eventConflicts.length > 0) {
      // Show warning but allow save
      const proceed = window.confirm(
        `${eventConflicts.length} conflict(s) detected. Continue anyway?`
      );
      if (!proceed) return;
    }

    onEventSave?.(editingEvent);
    window.dispatchEvent(
      new CustomEvent('scheduling:event-manager-updated', { detail: editingEvent })
    );
    setOpenDialog(false);
  };

  const handleDuplicateEvent = () => {
    const duplicated = {
      ...editingEvent,
      id: Math.max(...events.map(e => e.id), 0) + 1,
      title: `${editingEvent.title} (Copy)`,
      date: new Date(new Date(editingEvent.date).getTime() + 7 * 24 * 60 * 60 * 1000)
        .toISOString().split('T')[0] // Next week
    };
    onEventSave?.(duplicated);
    setOpenDialog(false);
  };

  const handleDeleteEvent = () => {
    if (window.confirm(`Delete "${editingEvent.title}"?`)) {
      onEventDelete?.(editingEvent.id);
      setOpenDialog(false);
    }
  };

  const getConflictIcon = (severity) => {
    switch (severity) {
      case 'high': return <Warning sx={{ color: '#ff6b6b' }} />;
      case 'medium': return <Info sx={{ color: '#ffa500' }} />;
      default: return <Info sx={{ color: '#81c784' }} />;
    }
  };

  const getResourceIcon = (resourceId) => {
    const resource = availableResources.find(r => r.id === resourceId);
    return resource?.icon || '📦';
  };

  const getEventStatus = (event) => {
    const eventDate = new Date(event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (eventDate < today) return 'completed';
    if (eventDate.toDateString() === today.toDateString()) return 'today';
    return 'upcoming';
  };

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: '#cccccc' }}>
      {/* Event List Header */}
      <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
        <Typography variant="h6" sx={{ color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Clock /> Event Manager
        </Typography>
        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
          Manage events, detect conflicts, allocate resources
        </Typography>
      </Paper>

      {/* Event List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {events.length === 0 ? (
          <Paper sx={{ backgroundColor: '#252526', p: 3, textAlign: 'center', borderRadius: 0 }}>
            <Typography sx={{ color: '#b0b0b0' }}>
              No events scheduled. Create one to get started.
            </Typography>
          </Paper>
        ) : (
          events.map(event => {
            const status = getEventStatus(event);
            const eventConflicts = conflicts.filter(c => c.conflictingEvent?.id === event.id);
            const statusColor = {
              completed: '#666',
              today: '#81c784',
              upcoming: '#2196f3'
            }[status];

            return (
              <Card
                key={event.id}
                sx={{
                  backgroundColor: '#252526',
                  borderRadius: 0,
                  borderLeft: `4px solid ${statusColor}`,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { backgroundColor: '#2d2d2e', transform: 'translateX(4px)' }
                }}
                onClick={() => handleOpenEvent(event)}
              >
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    {/* Event Title & Status */}
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography sx={{ color: '#81c784', fontWeight: 'bold' }}>
                          {event.title}
                        </Typography>
                        <Chip
                          label={status === 'completed' ? 'Completed' : status === 'today' ? 'Today' : 'Upcoming'}
                          size="small"
                          sx={{
                            backgroundColor: statusColor,
                            color: '#fff',
                            height: 20,
                            fontSize: '11px'
                          }}
                        />
                        {event.recurring !== 'none' && event.recurring && (
                          <Chip
                            label={event.recurring}
                            size="small"
                            variant="outlined"
                            sx={{
                              borderColor: '#81c784',
                              color: '#81c784',
                              height: 20,
                              fontSize: '11px'
                            }}
                          />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          📅 {event.date}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          🕐 {event.startTime} - {event.endTime}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          📍 {event.location}
                        </Typography>
                      </Box>
                    </Grid>

                    {/* Resources & Attendees */}
                    <Grid item xs={12} sm={6}>
                      {event.resources && event.resources.length > 0 && (
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
                            Resources:
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {event.resources.map(resource => (
                              <Chip
                                key={resource}
                                label={`${getResourceIcon(resource)} ${resource}`}
                                size="small"
                                sx={{
                                  backgroundColor: '#404040',
                                  color: '#cccccc',
                                  height: 20,
                                  fontSize: '11px'
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      )}

                      {event.attendees && event.attendees.length > 0 && (
                        <Box>
                          <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
                            Attendees: {event.attendees.length}
                          </Typography>
                        </Box>
                      )}
                    </Grid>

                    {/* Conflict Warning */}
                    {eventConflicts.length > 0 && (
                      <Grid item xs={12}>
                        <Alert
                          severity="warning"
                          sx={{
                            backgroundColor: 'rgba(255, 165, 0, 0.1)',
                            color: '#ffa500',
                            '& .MuiAlert-icon': { color: '#ffa500' }
                          }}
                        >
                          {eventConflicts.length} conflict(s) detected
                        </Alert>
                      </Grid>
                    )}

                    {/* Action Buttons */}
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Tooltip title="Edit">
                          <IconButton size="small" sx={{ color: '#81c784' }}>
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Duplicate">
                          <IconButton
                            size="small"
                            sx={{ color: '#2196f3' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEvent(event);
                              setTimeout(() => handleDuplicateEvent(), 100);
                            }}
                          >
                            <ContentCopy fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>

      {/* Event Detail Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#252526', color: '#cccccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #404040', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Event Details</span>
          <IconButton onClick={() => setOpenDialog(false)} size="small" sx={{ color: '#b0b0b0' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          {editingEvent && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Conflicts Alert */}
              {conflicts.length > 0 && (
                <Box>
                  {conflicts.map((conflict, idx) => (
                    <Alert
                      key={idx}
                      severity={conflict.severity === 'high' ? 'error' : 'warning'}
                      sx={{
                        mb: 1,
                        backgroundColor: conflict.severity === 'high' 
                          ? 'rgba(255, 107, 107, 0.1)' 
                          : 'rgba(255, 165, 0, 0.1)',
                        color: conflict.severity === 'high' ? '#ff6b6b' : '#ffa500'
                      }}
                    >
                      {getConflictIcon(conflict.severity)}
                      {' '}{conflict.message}
                    </Alert>
                  ))}
                </Box>
              )}

              {/* Event Summary */}
              <Paper sx={{ backgroundColor: '#1a1a1a', p: 2, borderRadius: 0 }}>
                <Typography variant="h6" sx={{ color: '#81c784', mb: 1 }}>
                  {editingEvent.title}
                </Typography>
                <Divider sx={{ backgroundColor: '#404040', mb: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
                      Date
                    </Typography>
                    <Typography sx={{ color: '#cccccc' }}>
                      {editingEvent.date}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
                      Time
                    </Typography>
                    <Typography sx={{ color: '#cccccc' }}>
                      {editingEvent.startTime} - {editingEvent.endTime}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
                      Location
                    </Typography>
                    <Typography sx={{ color: '#cccccc' }}>
                      {editingEvent.location}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" sx={{ color: '#b0b0b0', display: 'block', mb: 0.5 }}>
                      Type
                    </Typography>
                    <Chip
                      label={editingEvent.type}
                      size="small"
                      sx={{ backgroundColor: '#404040', color: '#cccccc' }}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Resources Section */}
              {editingEvent.resources && editingEvent.resources.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#81c784', mb: 1 }}>
                    <Devices sx={{ mr: 1, fontSize: 18 }} />
                    Resources Needed
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {editingEvent.resources.map(resource => (
                      <Chip
                        key={resource}
                        label={`${getResourceIcon(resource)} ${resource}`}
                        sx={{
                          backgroundColor: '#404040',
                          color: '#cccccc'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Attendees Section */}
              {editingEvent.attendees && editingEvent.attendees.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#81c784', mb: 1 }}>
                    <Person sx={{ mr: 1, fontSize: 18 }} />
                    Attendees ({editingEvent.attendees.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {(Array.isArray(editingEvent.attendees) ? editingEvent.attendees : [editingEvent.attendees]).map((attendee, idx) => (
                      <Chip
                        key={idx}
                        label={attendee}
                        size="small"
                        sx={{
                          backgroundColor: '#404040',
                          color: '#cccccc'
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              )}

              {/* Description */}
              {editingEvent.description && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#81c784', mb: 1 }}>
                    Description
                  </Typography>
                  <Typography sx={{ color: '#b0b0b0', fontSize: '14px' }}>
                    {editingEvent.description}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #404040', p: 2, gap: 1 }}>
          <Button
            onClick={handleDuplicateEvent}
            startIcon={<ContentCopy />}
            sx={{ color: '#2196f3' }}
          >
            Duplicate
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button
            onClick={handleDeleteEvent}
            startIcon={<Delete />}
            sx={{ color: '#ff6b6b' }}
          >
            Delete
          </Button>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{ color: '#b0b0b0' }}
          >
            Close
          </Button>
          <Button
            onClick={handleSaveEvent}
            variant="contained"
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a' }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EventManager;
