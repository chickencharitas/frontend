import React from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import api from '../services/api';

export default function CalendarPage() {
  // Calendar state
  const [calendars, setCalendars] = React.useState([]);
  const [selectedCalendar, setSelectedCalendar] = React.useState('');
  const [calendarName, setCalendarName] = React.useState('');
  const [calendarDesc, setCalendarDesc] = React.useState('');
  const [calendarColor, setCalendarColor] = React.useState('#1976d2');
  const [timezone, setTimezone] = React.useState('UTC');

  // Event state
  const [events, setEvents] = React.useState([]);
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDesc, setEventDesc] = React.useState('');
  const [startTime, setStartTime] = React.useState('');
  const [endTime, setEndTime] = React.useState('');
  const [eventType, setEventType] = React.useState('meeting');
  const [reminderMinutes, setReminderMinutes] = React.useState(15);

  // UI state
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  const [openEventDialog, setOpenEventDialog] = React.useState(false);
  const [openCalendarDialog, setOpenCalendarDialog] = React.useState(false);
  const [editingEvent, setEditingEvent] = React.useState(null);

  // ============================================================
  // CALENDAR OPERATIONS
  // ============================================================

  const fetchCalendars = async () => {
    try {
      setLoading(true);
      const response = await api.get('/calendar/calendars');
      setCalendars(response.data);
      if (response.data.length > 0 && !selectedCalendar) {
        setSelectedCalendar(response.data[0].id);
      }
    } catch (err) {
      setError('Failed to fetch calendars: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCalendar = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!calendarName.trim()) {
        setError('Calendar name is required');
        return;
      }

      const response = await api.post('/calendar/calendars', {
        name: calendarName,
        description: calendarDesc,
        color: calendarColor,
        timezone
      });

      setSuccessMessage('Calendar created successfully');
      setCalendars([...calendars, response.data.calendar]);
      setSelectedCalendar(response.data.calendar.id);
      
      // Reset form
      setCalendarName('');
      setCalendarDesc('');
      setCalendarColor('#1976d2');
      setTimezone('UTC');
      setOpenCalendarDialog(false);

      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to create calendar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCalendar = async (calendarId) => {
    if (!window.confirm('Are you sure you want to delete this calendar?')) return;

    try {
      setLoading(true);
      await api.delete(`/calendar/calendars/${calendarId}`);
      
      setCalendars(calendars.filter(cal => cal.id !== calendarId));
      if (selectedCalendar === calendarId) {
        setSelectedCalendar(calendars.length > 0 ? calendars[0].id : '');
        setEvents([]);
      }
      
      setSuccessMessage('Calendar deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete calendar: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // EVENT OPERATIONS
  // ============================================================

  const fetchEvents = async (calendarId) => {
    if (!calendarId) return;

    try {
      setLoading(true);
      const response = await api.get(`/calendar/calendars/${calendarId}/events`);
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async () => {
    try {
      setLoading(true);
      setError('');

      if (!selectedCalendar) {
        setError('Please select a calendar first');
        return;
      }

      if (!eventTitle.trim() || !startTime || !endTime) {
        setError('Event title, start time, and end time are required');
        return;
      }

      const payload = {
        title: eventTitle,
        description: eventDesc,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        eventType,
        reminderMinutes: parseInt(reminderMinutes),
        attendees: []
      };

      if (editingEvent) {
        // Update event
        await api.put(`/calendar/events/${editingEvent.id}`, payload);
        setSuccessMessage('Event updated successfully');
      } else {
        // Create new event
        await api.post(`/calendar/calendars/${selectedCalendar}/events`, payload);
        setSuccessMessage('Event created successfully');
      }

      // Reset form
      setEventTitle('');
      setEventDesc('');
      setStartTime('');
      setEndTime('');
      setEventType('meeting');
      setReminderMinutes(15);
      setEditingEvent(null);
      setOpenEventDialog(false);

      // Refresh events
      await fetchEvents(selectedCalendar);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      setLoading(true);
      await api.delete(`/calendar/events/${eventId}`);
      
      setSuccessMessage('Event deleted successfully');
      await fetchEvents(selectedCalendar);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to delete event: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const editEvent = (event) => {
    setEditingEvent(event);
    setEventTitle(event.title);
    setEventDesc(event.description);
    setStartTime(event.start_time?.slice(0, 16) || '');
    setEndTime(event.end_time?.slice(0, 16) || '');
    setEventType(event.event_type);
    setReminderMinutes(event.reminder_minutes);
    setOpenEventDialog(true);
  };

  // ============================================================
  // EFFECTS
  // ============================================================

  React.useEffect(() => {
    fetchCalendars();
  }, []);

  React.useEffect(() => {
    if (selectedCalendar) {
      fetchEvents(selectedCalendar);
    }
  }, [selectedCalendar]);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Team Calendar</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenCalendarDialog(true)}
        >
          Create Calendar
        </Button>
      </Box>

      {/* Messages */}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}

      {/* Loading */}
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 2 }} />}

      {/* Calendars Grid */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {calendars.map(calendar => (
          <Grid item xs={12} sm={6} md={4} key={calendar.id}>
            <Card
              sx={{
                cursor: 'pointer',
                border: selectedCalendar === calendar.id ? `3px solid ${calendar.color}` : '1px solid #ddd',
                backgroundColor: selectedCalendar === calendar.id ? 'rgba(0,0,0,0.02)' : 'white'
              }}
              onClick={() => setSelectedCalendar(calendar.id)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <Box>
                    <Typography variant="h6">{calendar.name}</Typography>
                    <Typography variant="body2" color="textSecondary">{calendar.description}</Typography>
                    <Typography variant="caption" sx={{ mt: 1 }}>
                      {calendar.event_count || 0} events
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: calendar.color,
                      borderRadius: 1
                    }}
                  />
                </Box>
                <Button
                  size="small"
                  color="error"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteCalendar(calendar.id);
                  }}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Events Section */}
      {selectedCalendar && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h5">Events</Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                setEditingEvent(null);
                setEventTitle('');
                setEventDesc('');
                setStartTime('');
                setEndTime('');
                setEventType('meeting');
                setReminderMinutes(15);
                setOpenEventDialog(true);
              }}
            >
              Add Event
            </Button>
          </Box>

          {events.length > 0 ? (
            <List>
              {events.map(event => (
                <Card key={event.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{event.title}</Typography>
                        {event.description && (
                          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                            {event.description}
                          </Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          <Chip
                            label={event.event_type}
                            size="small"
                            sx={{ mr: 1 }}
                          />
                          <Chip
                            label={`${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleTimeString()}`}
                            size="small"
                            variant="outlined"
                          />
                        </Box>
                        {event.location && (
                          <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                            📍 {event.location}
                          </Typography>
                        )}
                      </Box>
                      <Box>
                        <Button
                          size="small"
                          startIcon={<EditIcon />}
                          onClick={() => editEvent(event)}
                          sx={{ mr: 1 }}
                        >
                          Edit
                        </Button>
                        <Button
                          size="small"
                          color="error"
                          startIcon={<DeleteIcon />}
                          onClick={() => deleteEvent(event.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </List>
          ) : (
            <Typography variant="body2" color="textSecondary">No events yet. Create one to get started!</Typography>
          )}
        </Box>
      )}

      {/* Create Calendar Dialog */}
      <Dialog open={openCalendarDialog} onClose={() => setOpenCalendarDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Calendar</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Calendar Name"
            value={calendarName}
            onChange={e => setCalendarName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={calendarDesc}
            onChange={e => setCalendarDesc(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption">Color</Typography>
              <TextField
                fullWidth
                type="color"
                value={calendarColor}
                onChange={e => setCalendarColor(e.target.value)}
              />
            </Box>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Timezone</InputLabel>
              <Select
                value={timezone}
                label="Timezone"
                onChange={e => setTimezone(e.target.value)}
              >
                <MenuItem value="UTC">UTC</MenuItem>
                <MenuItem value="EST">EST</MenuItem>
                <MenuItem value="CST">CST</MenuItem>
                <MenuItem value="MST">MST</MenuItem>
                <MenuItem value="PST">PST</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCalendarDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={createCalendar} disabled={loading}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Event Dialog */}
      <Dialog open={openEventDialog} onClose={() => setOpenEventDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingEvent ? 'Edit Event' : 'Create New Event'}</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Event Title"
            value={eventTitle}
            onChange={e => setEventTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={2}
            value={eventDesc}
            onChange={e => setEventDesc(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Start Time"
            type="datetime-local"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="End Time"
            type="datetime-local"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Event Type</InputLabel>
            <Select
              value={eventType}
              label="Event Type"
              onChange={e => setEventType(e.target.value)}
            >
              <MenuItem value="meeting">Meeting</MenuItem>
              <MenuItem value="worship">Worship</MenuItem>
              <MenuItem value="practice">Practice</MenuItem>
              <MenuItem value="event">Event</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Reminder (minutes before)</InputLabel>
            <Select
              value={reminderMinutes}
              label="Reminder (minutes before)"
              onChange={e => setReminderMinutes(e.target.value)}
            >
              <MenuItem value={0}>None</MenuItem>
              <MenuItem value={5}>5 minutes</MenuItem>
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>1 hour</MenuItem>
              <MenuItem value={1440}>1 day</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={addEvent} disabled={loading}>
            {editingEvent ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
