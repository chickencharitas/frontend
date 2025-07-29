import React from "react";
import { TextField, MenuItem, Stack } from "@mui/material";
const PATTERNS = [
  { value: "", label: "None" },
  { value: "EVERY_MONDAY", label: "Every Monday" },
  { value: "LAST_FRIDAY", label: "Last Friday of Month" },
  { value: "FIRST_DAY", label: "First Day of Month" },
  { value: "NTH_DAY", label: "Nth Day of Month" }
];
export default function RecurrencePatternSelector({ value, onChange }) {
  return (
    <Stack spacing={1}>
      <TextField
        select
        label="Recurrence Pattern"
        value={value.pattern || ""}
        onChange={e => onChange({ ...value, pattern: e.target.value })}
      >
        {PATTERNS.map(p => <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>)}
      </TextField>
      {value.pattern === "NTH_DAY" && (
        <TextField
          label="Day (1-31)"
          type="number"
          value={value.n || ""}
          onChange={e => onChange({ ...value, n: e.target.value })}
        />
      )}
    </Stack>
  );
}