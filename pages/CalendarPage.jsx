import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from "@mui/material";
import { getEvents, addEvent } from "../services/taskCalendarService";
import { format, parseISO } from "date-fns";

const EVENT_TYPES = [
  { value: "breeding", label: "Breeding" },
  { value: "hatching", label: "Hatching" },
  { value: "vaccination", label: "Vaccination" },
  { value: "other", label: "Other" }
];

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "", description: "", event_date: "", event_time: "", type: "breeding"
  });

  useEffect(() => { getEvents({}).then(setEvents); }, [open]);

  const handleAdd = async () => {
    await addEvent(form);
    setOpen(false);
    setForm({ title: "", description: "", event_date: "", event_time: "", type: "breeding" });
    getEvents({}).then(setEvents);
  };

  return (
    <Paper sx={{ p: { xs: 1, sm: 3 } }}>
      <Typography variant="h5" gutterBottom>Calendar</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Add Event</Button>
      </Stack>
      <ul>
        {events.map(e => (
          <li key={e.id}>
            <strong>{e.title}</strong> ({EVENT_TYPES.find(t => t.value === e.type)?.label || e.type}) - {format(parseISO(e.event_date), "PPP")}{e.event_time && ` ${e.event_time}`}
            <br />
            <span>{e.description}</span>
          </li>
        ))}
      </ul>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Calendar Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} autoFocus />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline />
            <TextField label="Date" type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Time" type="time" value={form.event_time} onChange={e => setForm(f => ({ ...f, event_time: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Type" select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {EVENT_TYPES.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
            </TextField>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.title || !form.event_date}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}