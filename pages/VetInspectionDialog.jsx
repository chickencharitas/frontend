import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField, Rating } from "@mui/material";
import { addHealthEvent } from "../services/healthService";

export default function VetInspectionDialog({ open, onClose, chicken, flock, onDone }) {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [score, setScore] = useState(3);

  async function handleAdd() {
    await addHealthEvent({
      event_type: "inspection",
      event_date: date,
      chicken_id: chicken?.id,
      flock_id: flock?.id,
      details: `Vet Score: ${score}`,
      notes
    });
    setDate("");
    setNotes("");
    setScore(3);
    onDone && onDone();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Veterinary Inspection</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            autoFocus
          />
          <Stack direction="row" alignItems="center" spacing={2}>
            <span>Health Score:</span>
            <Rating
              name="health-score"
              value={score}
              max={5}
              onChange={(_, val) => setScore(val)}
            />
          </Stack>
          <TextField
            label="Inspection Notes"
            value={notes}
            onChange={e => setNotes(e.target.value)}
            multiline
            minRows={2}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd} disabled={!date}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}