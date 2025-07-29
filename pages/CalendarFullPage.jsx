import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack
} from "@mui/material";
import { getEvents, addEvent, updateEvent } from "../services/taskCalendarService"; // make sure updateEvent exists

export default function CalendarFullPage() {
  const [events, setEvents] = useState([]);
  const [dialog, setDialog] = useState({ open: false, date: "", title: "" });

  const loadEvents = async () => {
    const evs = await getEvents();
    const mapped = evs.map(e => ({
      id: e.id,
      title: e.title,
      start: e.event_date + (e.event_time ? `T${e.event_time}` : ""),
      allDay: !e.event_time,
      extendedProps: e
    }));
    setEvents(mapped);
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleDateClick = (info) => {
    setDialog({ open: true, date: info.dateStr, title: "" });
  };

  const handleEventAdd = async () => {
    await addEvent({ title: dialog.title, event_date: dialog.date });
    setDialog({ open: false, date: "", title: "" });
    await loadEvents();
  };

  const handleEventDrop = async (info) => {
    const updatedEvent = {
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      event_date: info.event.startStr.slice(0, 10)
    };
    await updateEvent(updatedEvent); // Should be implemented in service
    await loadEvents();
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable
        selectable
        droppable
        events={events}
        dateClick={handleDateClick}
        eventDrop={handleEventDrop}
      />

      <Dialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, date: "", title: "" })}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Add Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={dialog.title}
              onChange={(e) => setDialog(d => ({ ...d, title: e.target.value }))}
              autoFocus
            />
            <TextField
              label="Date"
              value={dialog.date}
              InputProps={{ readOnly: true }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog({ open: false, date: "", title: "" })}>
            Cancel
          </Button>
          <Button
            onClick={handleEventAdd}
            variant="contained"
            disabled={!dialog.title.trim()}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
