import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import { updateEquipmentStatus } from "../services/inventoryService";

export default function EquipmentMaintenanceDialog({ open, onClose, equipment, onScheduled }) {
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSchedule = async () => {
    // Set equipment status to "maintenance" and log scheduled date/notes as needed.
    await updateEquipmentStatus({ id: equipment.id, status: "maintenance" });
    // Optionally, save maintenance event to a new table.
    onScheduled && onScheduled();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Maintenance: {equipment.name}</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Scheduled Date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            autoFocus
          />
          <TextField
            label="Notes"
            value={notes}
            multiline
            onChange={e => setNotes(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSchedule} variant="contained" disabled={!date}>Schedule</Button>
      </DialogActions>
    </Dialog>
  );
}