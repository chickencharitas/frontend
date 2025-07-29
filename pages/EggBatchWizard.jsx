import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stepper, Step, StepLabel, Stack, TextField, Autocomplete, Alert, Typography } from "@mui/material";
import { getBreedings, addEgg } from "../services/breedingService";

export default function EggBatchWizard({ group, open, onClose, onBatchAdded }) {
  const [step, setStep] = useState(0);
  const [breedings, setBreedings] = useState([]);
  const [selectedBreeding, setSelectedBreeding] = useState(null);
  const [eggCount, setEggCount] = useState(1);
  const [eggs, setEggs] = useState([]);
  const [success, setSuccess] = useState(false);

  React.useEffect(() => {
    if (open && group) getBreedings({ group_id: group.id }).then(setBreedings);
    if (!open) {
      setStep(0); setBreedings([]); setSelectedBreeding(null); setEggCount(1); setEggs([]); setSuccess(false);
    }
  }, [open, group]);

  const handleNext = async () => {
    if (step === 0 && selectedBreeding) setStep(1);
    else if (step === 1) {
      // Prepare egg records for review
      setEggs(Array.from({ length: eggCount }, (_, i) => ({
        egg_code: `EGG-${Date.now()}-${i + 1}`,
        laid_at: new Date().toISOString(),
        collected_at: "",
        fertile: null,
        hatched: null
      })));
      setStep(2);
    } else if (step === 2) {
      // Save all eggs
      await Promise.all(
        eggs.map(e =>
          addEgg({ ...e, breeding_id: selectedBreeding.id })
        )
      );
      setSuccess(true);
      onBatchAdded && onBatchAdded();
      setStep(3);
    }
  };

  const handleEggChange = (idx, field, value) => {
    setEggs(eggs => eggs.map((e, i) => (i === idx ? { ...e, [field]: value } : e)));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Egg Batch Wizard</DialogTitle>
      <DialogContent>
        <Stepper activeStep={step} sx={{ mb: 2 }}>
          <Step><StepLabel>Choose Mating/Breeding</StepLabel></Step>
          <Step><StepLabel>Batch Details</StepLabel></Step>
          <Step><StepLabel>Review & Confirm</StepLabel></Step>
          <Step><StepLabel>Done</StepLabel></Step>
        </Stepper>
        {step === 0 && (
          <Stack spacing={2}>
            <Autocomplete
              options={breedings}
              getOptionLabel={opt => opt ? `${opt.date} – ${opt.notes || ""}` : ""}
              value={selectedBreeding}
              onChange={(_, v) => setSelectedBreeding(v)}
              renderInput={params => <TextField {...params} label="Select Breeding Event" />}
            />
          </Stack>
        )}
        {step === 1 && (
          <Stack spacing={2}>
            <TextField
              label="Number of Eggs"
              type="number"
              value={eggCount}
              onChange={e => setEggCount(Math.max(1, Number(e.target.value)))}
              inputProps={{ min: 1, max: 100 }}
            />
            <Typography color="text.secondary">
              You will record {eggCount} eggs in this batch.
            </Typography>
          </Stack>
        )}
        {step === 2 && (
          <Stack spacing={2}>
            <Typography>Review/Edit Egg Details</Typography>
            {eggs.map((egg, idx) => (
              <Stack direction="row" spacing={2} key={idx} alignItems="center">
                <TextField
                  label="Egg Code"
                  value={egg.egg_code}
                  onChange={e => handleEggChange(idx, "egg_code", e.target.value)}
                />
                <TextField
                  label="Laid At"
                  type="datetime-local"
                  value={egg.laid_at.substring(0,16)}
                  onChange={e => handleEggChange(idx, "laid_at", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  sx={{ minWidth: 200 }}
                />
                <TextField
                  label="Fertile?"
                  select
                  value={egg.fertile ?? ""}
                  onChange={e => handleEggChange(idx, "fertile", e.target.value === "true")}
                  SelectProps={{ native: true }}
                  sx={{ minWidth: 100 }}
                >
                  <option value="">Unknown</option>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </TextField>
              </Stack>
            ))}
          </Stack>
        )}
        {step === 3 && (
          <Alert severity="success">Egg batch successfully recorded!</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        {step < 3 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (step === 0 && !selectedBreeding) ||
              (step === 1 && (!eggCount || eggCount < 1))
            }
          >
            {step === 2 ? "Save Batch" : "Next"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}