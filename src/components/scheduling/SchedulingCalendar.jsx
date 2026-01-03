import React, { useState, useCallback } from 'react';
import {
  Box,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Tooltip,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Event,
  Schedule,
  Repeat,
  Person,
  LocationOn,
  Description,
  DateRange,
  AccessTime
} from '@mui/icons-material';

const SchedulingCalendar = ({ onEventCreate, onEventUpdate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [openEventDialog, setOpenEventDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Sunday Service',
      date: '2025-12-21',
      startTime: '10:00',
      endTime: '11:30',
      location: 'Main Sanctuary',
      description: 'Weekly worship service',
      type: 'service',
      status: 'scheduled',
      attendees: ['John Doe', 'Jane Smith'],
      resources: ['projector', 'sound-system'],
      recurring: 'weekly'
    },
    {
      id: 2,
      title: 'Choir Practice',
      date: '2025-12-22',
      startTime: '18:00',
      endTime: '19:30',
      location: 'Music Room',
      description: 'Weekly choir rehearsal',
      type: 'rehearsal',
      status: 'scheduled',
      attendees: ['Choir Members'],
      resources: [],
      recurring: null
    },
    {
      id: 3,
      title: 'Setup & Sound Check',
      date: '2025-12-21',
      startTime: '08:00',
      endTime: '09:30',
      location: 'Main Sanctuary',
      description: 'Pre-service setup',
      type: 'setup',
      status: 'scheduled',
      attendees: ['Tech Team'],
      resources: ['projector', 'sound-system', 'lighting'],
      recurring: 'weekly'
    }
  ]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '10:00',
    endTime: '11:00',
    location: '',
    description: '',
    type: 'service',
    status: 'scheduled',
    attendees: '',
    resources: [],
    recurring: 'none'
  });

  // Calendar days generation
  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day) => {
    if (!day) return [];
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const handleOpenDialog = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setFormData({
      title: '',
      date: dateStr,
      startTime: '10:00',
      endTime: '11:00',
      location: '',
      description: '',
      type: 'service',
      status: 'scheduled',
      attendees: '',
      resources: [],
      recurring: 'none'
    });
    setEditingEvent(null);
    setOpenEventDialog(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setFormData(event);
    setOpenEventDialog(true);
  };

  const handleSaveEvent = () => {
    if (!formData.title || !formData.date) {
      alert('Please fill in required fields');
      return;
    }

    if (editingEvent) {
      // Update existing event
      setEvents(events.map(e => e.id === editingEvent.id ? { ...formData, id: editingEvent.id } : e));
      onEventUpdate?.(formData);
    } else {
      // Create new event
      const newEvent = {
        ...formData,
        id: Math.max(...events.map(e => e.id), 0) + 1
      };
      setEvents([...events, newEvent]);
      onEventCreate?.(newEvent);
    }

    // Dispatch event
    window.dispatchEvent(
      new CustomEvent('scheduling:event-changed', { detail: formData })
    );

    setOpenEventDialog(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
    window.dispatchEvent(
      new CustomEvent('scheduling:event-deleted', { detail: { id } })
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (resource) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.includes(resource)
        ? prev.resources.filter(r => r !== resource)
        : [...prev.resources, resource]
    }));
  };

  const calendarDays = generateCalendarDays();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  return (
    <Box sx={{ bgcolor: '#1a1a1a', color: '#cccccc', p: 2 }}>
      {/* Header */}
      <Paper sx={{ backgroundColor: '#252526', p: 2, mb: 2, borderRadius: 0 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" sx={{ color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Event /> Service Schedule
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a' }}
          >
            New Event
          </Button>
        </Box>

        {/* Month Navigation */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            size="small"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            sx={{ color: '#81c784' }}
          >
            ← Previous
          </Button>
          <Typography variant="h6">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </Typography>
          <Button
            size="small"
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            sx={{ color: '#81c784' }}
          >
            Next →
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={2}>
        {/* Calendar Grid */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ backgroundColor: '#252526', borderRadius: 0, overflow: 'hidden' }}>
            {/* Day Headers */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', backgroundColor: '#2d2d2e' }}>
              {dayNames.map(day => (
                <Box
                  key={day}
                  sx={{
                    p: 1,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    borderRight: '1px solid #404040',
                    '&:last-child': { borderRight: 'none' },
                    color: '#81c784'
                  }}
                >
                  {day}
                </Box>
              ))}
            </Box>

            {/* Calendar Days */}
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
              {calendarDays.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                const isToday = day && new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth();

                return (
                  <Box
                    key={index}
                    onClick={() => day && handleOpenDialog(day)}
                    sx={{
                      minHeight: 120,
                      borderRight: '1px solid #404040',
                      borderBottom: '1px solid #404040',
                      p: 1,
                      backgroundColor: day ? '#1a1a1a' : '#2d2d2e',
                      cursor: day ? 'pointer' : 'default',
                      '&:hover': day ? { backgroundColor: '#2d2d2e' } : {},
                      transition: 'background-color 0.2s',
                      position: 'relative'
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        color: isToday ? '#81c784' : '#cccccc',
                        fontWeight: isToday ? 'bold' : 'normal',
                        mb: 1
                      }}
                    >
                      {day}
                    </Typography>

                    {/* Events in day */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      {dayEvents.slice(0, 2).map(event => (
                        <Chip
                          key={event.id}
                          label={event.title}
                          size="small"
                          sx={{
                            backgroundColor: '#404040',
                            color: '#cccccc',
                            fontSize: '10px',
                            height: 20
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(event);
                          }}
                        />
                      ))}
                      {dayEvents.length > 2 && (
                        <Typography variant="caption" sx={{ color: '#b0b0b0' }}>
                          +{dayEvents.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>

        {/* Upcoming Events List */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ backgroundColor: '#252526', borderRadius: 0, maxHeight: 500, overflow: 'auto' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #404040' }}>
              <Typography variant="h6" sx={{ color: '#81c784', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Schedule /> Upcoming Events
              </Typography>
            </Box>

            <List sx={{ p: 0 }}>
              {events
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((event, idx) => (
                  <Box key={event.id}>
                    <ListItem sx={{ bgcolor: '#1a1a1a', p: 2 }}>
                      <ListItemText
                        primary={
                          <Typography sx={{ color: '#81c784', fontWeight: 'bold' }}>
                            {event.title}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 1, color: '#b0b0b0' }}>
                            <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                              📅 {event.date} • {event.startTime} - {event.endTime}
                            </Typography>
                            <Typography variant="caption" sx={{ display: 'block' }}>
                              📍 {event.location}
                            </Typography>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction>
                        <Tooltip title="Edit">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleEditEvent(event)}
                            sx={{ color: '#81c784' }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            edge="end"
                            size="small"
                            onClick={() => handleDeleteEvent(event.id)}
                            sx={{ color: '#ff6b6b' }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {idx < events.length - 1 && <Divider sx={{ backgroundColor: '#404040' }} />}
                  </Box>
                ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Event Dialog */}
      <Dialog
        open={openEventDialog}
        onClose={() => setOpenEventDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { backgroundColor: '#252526', color: '#cccccc' } }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #404040' }}>
          {editingEvent ? 'Edit Event' : 'New Event'}
        </DialogTitle>

        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Title */}
            <TextField
              fullWidth
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Sunday Service"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />

            {/* Date & Time */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#cccccc',
                      '& fieldset': { borderColor: '#404040' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="Start"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#cccccc',
                      '& fieldset': { borderColor: '#404040' }
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  label="End"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#cccccc',
                      '& fieldset': { borderColor: '#404040' }
                    }
                  }}
                />
              </Grid>
            </Grid>

            {/* Location */}
            <TextField
              fullWidth
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Main Sanctuary"
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />

            {/* Type & Recurring */}
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cccccc' }}>Event Type</InputLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    label="Event Type"
                    sx={{
                      color: '#cccccc',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                    }}
                  >
                    <MenuItem value="service">Service</MenuItem>
                    <MenuItem value="rehearsal">Rehearsal</MenuItem>
                    <MenuItem value="setup">Setup</MenuItem>
                    <MenuItem value="meeting">Meeting</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel sx={{ color: '#cccccc' }}>Recurring</InputLabel>
                  <Select
                    name="recurring"
                    value={formData.recurring}
                    onChange={handleInputChange}
                    label="Recurring"
                    sx={{
                      color: '#cccccc',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#404040' }
                    }}
                  >
                    <MenuItem value="none">None</MenuItem>
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Description */}
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: '#cccccc',
                  '& fieldset': { borderColor: '#404040' }
                }
              }}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: '1px solid #404040', p: 2 }}>
          <Button onClick={() => setOpenEventDialog(false)} sx={{ color: '#b0b0b0' }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveEvent}
            variant="contained"
            sx={{ backgroundColor: '#81c784', color: '#1a1a1a' }}
          >
            {editingEvent ? 'Update' : 'Create'} Event
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SchedulingCalendar;
