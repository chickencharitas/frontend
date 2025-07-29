import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, TextField, Stack, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import { getHealthEvents, addHealthEvent, getVaccines, getTreatments } from "../services/healthService";

export default function HealthEventsPage({ flock, chicken }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [form, setForm] = useState({
    event_type: "",
    event_date: "",
    details: "",
    notes: "",
    vaccines: [],
    treatments: []
  });

  useEffect(() => {
    getHealthEvents({ flock_id: flock?.id, chicken_id: chicken?.id, search }).then(setEvents);
    getVaccines("").then(setVaccines);
    getTreatments("").then(setTreatments);
  }, [flock, chicken, search, open]);

  const handleAdd = async () => {
    await addHealthEvent({
      ...form,
      flock_id: flock?.id,
      chicken_id: chicken?.id,
      vaccines: form.vaccines,
      treatments: form.treatments
    });
    setOpen(false);
    setForm({
      event_type: "",
      event_date: "",
      details: "",
      notes: "",
      vaccines: [],
      treatments: []
    });
    getHealthEvents({ flock_id: flock?.id, chicken_id: chicken?.id, search }).then(setEvents);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Health Events</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField label="Search" value={search} onChange={e => setSearch(e.target.value)} />
        <Button variant="contained" onClick={() => setOpen(true)}>Add Event</Button>
      </Stack>
      <List>
        {events.map(e => (
          <ListItem key={e.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={
                <>
                  <Chip label={e.event_type} size="small" sx={{ mr: 1 }} />
                  {e.details}
                </>
              }
              secondary={
                <>
                  <span>{e.event_date}</span>
                  {e.notes && <><br />{e.notes}</>}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Health Event</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={[
                { label: "Vaccination", value: "vaccination" },
                { label: "Treatment", value: "treatment" },
                { label: "Disease", value: "disease" },
                { label: "Inspection", value: "inspection" },
                { label: "Mortality", value: "mortality" },
                { label: "Culling", value: "culling" }
              ]}
              getOptionLabel={opt => opt.label}
              value={form.event_type ? { label: form.event_type.charAt(0).toUpperCase() + form.event_type.slice(1), value: form.event_type } : null}
              onChange={(_, v) => setForm(f => ({ ...f, event_type: v?.value || "" }))}
              renderInput={params => <TextField {...params} label="Event Type" />}
            />
            <TextField label="Date" type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Details" value={form.details} onChange={e => setForm(f => ({ ...f, details: e.target.value }))} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
            {form.event_type === "vaccination" && (
              <Autocomplete
                multiple
                options={vaccines}
                getOptionLabel={opt => opt?.name || ""}
                value={form.vaccines}
                onChange={(_, v) => setForm(f => ({ ...f, vaccines: v }))}
                renderInput={params => <TextField {...params} label="Vaccines" />}
              />
            )}
            {form.event_type === "treatment" && (
              <Autocomplete
                multiple
                options={treatments}
                getOptionLabel={opt => opt?.name || ""}
                value={form.treatments}
                onChange={(_, v) => setForm(f => ({ ...f, treatments: v }))}
                renderInput={params => <TextField {...params} label="Treatments" />}
              />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.event_type || !form.event_date}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}