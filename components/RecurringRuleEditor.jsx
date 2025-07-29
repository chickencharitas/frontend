import React from "react";
import { Stack, MenuItem, TextField } from "@mui/material";
const RECURRENCE_OPTIONS = [
  { value: "", label: "No Repeat" },
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" }
];

export default function RecurringRuleEditor({ value, onChange }) {
  return (
    <Stack spacing={1}>
      <TextField
        select
        label="Repeat"
        value={value?.freq || ""}
        onChange={e => onChange({ ...value, freq: e.target.value })}
      >
        {RECURRENCE_OPTIONS.map(opt => <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>)}
      </TextField>
      {value?.freq && value.freq !== "DAILY" && (
        <TextField
          label="Every N"
          type="number"
          value={value.interval || 1}
          onChange={e => onChange({ ...value, interval: e.target.value })}
        />
      )}
    </Stack>
  );
}