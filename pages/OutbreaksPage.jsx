import React, { useEffect, useState } from "react";
import { Paper, Typography, Button, TextField, Stack, List, ListItem, ListItemText, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { getOutbreaks, addOutbreak } from "../services/healthService";

export default function OutbreaksPage() {
  const [outbreaks, setOutbreaks] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    disease: "",
    description: "",
    start_date: "",
    end_date: "",
    affected_flock_ids: [],
    notes: ""
  });

  useEffect(() => { getOutbreaks().then(setOutbreaks); }, [open]);

  const handleAdd = async () => {
    await addOutbreak(form);
    setOpen(false);
    setForm({ disease: "", description: "", start_date: "", end_date: "", affected_flock_ids: [], notes: "" });
    getOutbreaks().then(setOutbreaks);
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Disease Outbreaks</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" onClick={() => setOpen(true)}>Log Outbreak</Button>
      </Stack>
      <List>
        {outbreaks.map(o => (
          <ListItem key={o.id} sx={{ borderBottom: "1px solid #eee" }}>
            <ListItemText
              primary={
                <>{o.disease} <Chip label={(o.end_date ? "Closed" : "Active")} color={o.end_date ? "default" : "error"} size="small" sx={{ ml: 1 }} /></>
              }
              secondary={
                <>
                  <span>{o.start_date} - {o.end_date || "present"}</span>
                  <br />
                  {o.description}
                </>
              }
            />
          </ListItem>
        ))}
      </List>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Log Disease Outbreak</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Disease" value={form.disease} onChange={e => setForm(f => ({ ...f, disease: e.target.value }))} autoFocus />
            <TextField label="Description" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} multiline />
            <TextField label="Start Date" type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="End Date" type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} InputLabelProps={{ shrink: true }} />
            <TextField label="Notes" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} multiline />
            {/* Flock selection could go here */}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleAdd} variant="contained" disabled={!form.disease || !form.start_date}>Add</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}