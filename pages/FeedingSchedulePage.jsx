import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, TextField, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import { getFeedingSchedules, addFeedingSchedule, getFeedBatches } from "../services/feedingService";
import { getFlocks } from "../services/chickenService"; 

export default function FeedingSchedulePage() {
  const [flocks, setFlocks] = useState([]);
  const [feedBatches, setFeedBatches] = useState([]);
  const [selectedFlock, setSelectedFlock] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    feed: null,
    schedule_type: "",
    start_age_days: "",
    end_age_days: "",
    ration: "",
    quantity_per_day: "",
    unit: "",
    notes: ""
  });

  useEffect(() => { getFlocks().then(setFlocks); getFeedBatches().then(setFeedBatches); }, []);
  useEffect(() => { if (selectedFlock) getFeedingSchedules({ flock_id: selectedFlock.id }).then(setSchedules); }, [selectedFlock, open]);

  const handleAdd = async () => {
    await addFeedingSchedule({
      flock_id: selectedFlock.id,
      feed_batch_id: form.feed.id,
      schedule_type: form.schedule_type,
      start_age_days: form.start_age_days,
      end_age_days: form.end_age_days,
      ration: form.ration,
      quantity_per_day: form.quantity_per_day,
      unit: form.unit,
      notes: form.notes
    });
    setOpen(false);
    setForm({ feed: null, schedule_type: "", start_age_days: "", end_age_days: "", ration: "", quantity_per_day: "", unit: "", notes: "" });
    if (selectedFlock) getFeedingSchedules({ flock_id: selectedFlock.id }).then(setSchedules);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Feeding Schedules</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Autocomplete
          options={flocks}
          getOptionLabel={opt => opt?.name || ""}
          value={selectedFlock}
          onChange={(_, v) => setSelectedFlock(v)}
          renderInput={params => <TextField {...params} label="Select Flock" />}
          sx={{ width: 250 }}
        />
        <Button variant="contained" onClick={() => setOpen(true)} disabled={!selectedFlock}>Add Schedule</Button>
      </Stack>
      <List>
        {schedules.map(s => (
          <ListItem key={s.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={
                <>{s.feed_name} | {s.ration} | {s.quantity_per_day} {s.unit} per day</>
              }
              secondary={
                <>
                  <span>{s.schedule_type ? `Type: ${s.schedule_type}` : ""} | Age: {s.start_age_days}–{s.end_age_days} days</span>
                  <br />
                  {s.notes}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Feeding Schedule</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={feedBatches}
              getOptionLabel={opt => opt?.name || ""}
              value={form.feed}
              onChange={(_, v) => setForm(f => ({ ...f, feed: v }))}
              renderInput={params => <TextField {...params} label="Feed Batch" />}
            />
            <TextField label="Schedule Type" value={form.schedule_type} onChange={e => setForm(f => ({ ...f, schedule_type: e.target.value }))} />
            <TextField label="Start Age (days)" type="number" value={form.start_age_days} onChange={e => setForm(f => ({ ...f, start_age_days: e.target.value }))} />
            <TextField label="End Age (days)" type="number" value={form.end_age_days} onChange={e => setForm(f => ({ ...f, end_age_days: e.target.value }))} />
            <TextField label="Ration" value={form.ration} onChange={e => setForm(f => ({ ...f, ration: e.target.value }))} />
            <TextField label="Quantity Per Day" type="number" value={form.quantity_per_day} onChange={e => setForm(f => ({ ...f, quantity_per_day: e.target.value }))} />
            <TextField label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.feed || !form.start_age_days || !form.end_age_days || !form.quantity_per_day}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}