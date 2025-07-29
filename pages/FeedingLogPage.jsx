import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, Stack, TextField, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Autocomplete } from "@mui/material";
import { getFeedings, addFeeding, getFeedBatches } from "../services/feedingService";
import { getFlocks } from "../services/chickenService"; 

export default function FeedingLogPage() {
  const [feedings, setFeedings] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [feedBatches, setFeedBatches] = useState([]);
  const [selectedFlock, setSelectedFlock] = useState(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    flock: null,
    date: "",
    feed: null,
    ration: "",
    quantity: "",
    unit: "",
    notes: ""
  });

  useEffect(() => { getFlocks().then(setFlocks); getFeedBatches().then(setFeedBatches); }, []);
  useEffect(() => { if (selectedFlock) getFeedings({ flock_id: selectedFlock.id }).then(setFeedings); }, [selectedFlock, open]);

  const handleAdd = async () => {
    await addFeeding({
      flock_id: form.flock.id,
      date: form.date,
      feed_batch_id: form.feed.id,
      ration: form.ration,
      quantity: form.quantity,
      unit: form.unit,
      notes: form.notes
    });
    setOpen(false);
    setForm({ flock: null, date: "", feed: null, ration: "", quantity: "", unit: "", notes: "" });
    if (selectedFlock) getFeedings({ flock_id: selectedFlock.id }).then(setFeedings);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Feeding Logs</Typography>
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <Autocomplete
          options={flocks}
          getOptionLabel={opt => opt?.name || ""}
          value={selectedFlock}
          onChange={(_, v) => setSelectedFlock(v)}
          renderInput={params => <TextField {...params} label="Select Flock" />}
          sx={{ width: 250 }}
        />
        <Button variant="contained" onClick={() => setOpen(true)} disabled={!selectedFlock}>Log Feeding</Button>
      </Stack>
      <List>
        {feedings.map(f => (
          <ListItem key={f.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={`${f.feed_name || "Feed"} | ${f.ration} | ${f.quantity} ${f.unit}`}
              secondary={
                <>
                  <span>Date: {f.date}</span>
                  <br />
                  {f.notes}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Log Feeding</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={flocks}
              getOptionLabel={opt => opt?.name || ""}
              value={form.flock}
              onChange={(_, v) => setForm(f => ({ ...f, flock: v }))}
              renderInput={params => <TextField {...params} label="Flock" />}
            />
            <TextField label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <Autocomplete
              options={feedBatches}
              getOptionLabel={opt => opt?.name || ""}
              value={form.feed}
              onChange={(_, v) => setForm(f => ({ ...f, feed: v }))}
              renderInput={params => <TextField {...params} label="Feed Batch" />}
            />
            <TextField label="Ration" value={form.ration} onChange={e => setForm(f => ({ ...f, ration: e.target.value }))} />
            <TextField label="Quantity" type="number" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />
            <TextField label="Unit" value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.flock || !form.date || !form.feed || !form.quantity}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}