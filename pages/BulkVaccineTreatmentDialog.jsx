import React, { useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack,
  TextField, Autocomplete, Checkbox, List, ListItem, ListItemText
} from "@mui/material";
import { getVaccines, getTreatments, addHealthEvent } from "../services/healthService";
import { getChickens } from "../services/chickenService"; // Assumed

export default function BulkVaccineTreatmentDialog({ open, onClose, flock, onDone }) {
  const [chickens, setChickens] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [selectedChickens, setSelectedChickens] = useState([]);
  const [eventType, setEventType] = useState("");
  const [date, setDate] = useState("");
  const [selectedVaccines, setSelectedVaccines] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open && flock) {
      getChickens({ flock_id: flock.id }).then(setChickens);
    }
    getVaccines("").then(setVaccines);
    getTreatments("").then(setTreatments);
  }, [open, flock]);

  const handleToggleChicken = (chicken) => {
    setSelectedChickens(c =>
      c.includes(chicken)
        ? c.filter(x => x.id !== chicken.id)
        : [...c, chicken]
    );
  };

  async function handleApply() {
    for (let chicken of selectedChickens) {
      await addHealthEvent({
        event_type: eventType,
        event_date: date,
        chicken_id: chicken.id,
        flock_id: flock.id,
        vaccines: selectedVaccines,
        treatments: selectedTreatments,
        notes,
      });
    }
    setSelectedChickens([]);
    setEventType("");
    setDate("");
    setSelectedVaccines([]);
    setSelectedTreatments([]);
    setNotes("");
    onDone && onDone();
    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Bulk Vaccination / Treatment</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <Autocomplete
            options={[
              { label: "Vaccination", value: "vaccination" },
              { label: "Treatment", value: "treatment" }
            ]}
            getOptionLabel={opt => opt.label}
            value={eventType ? { label: eventType.charAt(0).toUpperCase() + eventType.slice(1), value: eventType } : null}
            onChange={(_, v) => setEventType(v?.value || "")}
            renderInput={params => <TextField {...params} label="Event Type" />}
          />
          <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
          {eventType === "vaccination" && (
            <Autocomplete
              multiple
              options={vaccines}
              getOptionLabel={opt => opt?.name || ""}
              value={selectedVaccines}
              onChange={(_, v) => setSelectedVaccines(v)}
              renderInput={params => <TextField {...params} label="Vaccines" />}
            />
          )}
          {eventType === "treatment" && (
            <Autocomplete
              multiple
              options={treatments}
              getOptionLabel={opt => opt?.name || ""}
              value={selectedTreatments}
              onChange={(_, v) => setSelectedTreatments(v)}
              renderInput={params => <TextField {...params} label="Treatments" />}
            />
          )}
          <TextField label="Notes" value={notes} onChange={e => setNotes(e.target.value)} multiline />
          <List dense sx={{ maxHeight: 180, overflow: "auto", border: "1px solid #eee" }}>
            {chickens.map(chicken => (
              <ListItem
                key={chicken.id}
                dense
                button
                onClick={() => handleToggleChicken(chicken)}
                sx={{ bgcolor: selectedChickens.includes(chicken) ? "#e3f2fd" : undefined }}
              >
                <Checkbox
                  checked={selectedChickens.includes(chicken)}
                  tabIndex={-1}
                  disableRipple
                />
                <ListItemText primary={chicken.name || chicken.unique_tag || `#${chicken.id}`} />
              </ListItem>
            ))}
          </List>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleApply} disabled={!eventType || !date || selectedChickens.length === 0}>
          Apply to Selected
        </Button>
      </DialogActions>
    </Dialog>
  );
}