import React from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, MenuItem, Button } from '@mui/material';
import { RRule } from 'rrule';

const RECURRENCE_OPTIONS = [
  { value: '', label: 'No repeat' },
  { value: 'DAILY', label: 'Daily' },
  { value: 'WEEKLY', label: 'Weekly' },
  { value: 'MONTHLY', label: 'Monthly' },
];

export default function TaskDialogWithRecurrence({ open, onClose, onSave }) {
  const [form, setForm] = React.useState({
    recurrence_rule: '',
  });

  const handleSave = () => {
    onSave(form);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Schedule Task</DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          label="Recurrence"
          value={form.recurrence_rule}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              recurrence_rule: e.target.value
                ? `RRULE:FREQ=${e.target.value}`
                : '',
            }))
          }
          margin="normal"
        >
          {RECURRENCE_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </TextField>
        <Button onClick={handleSave}>Save</Button>
      </DialogContent>
    </Dialog>
  );
}
