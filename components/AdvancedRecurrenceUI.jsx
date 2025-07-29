import React, { useState } from "react";
import { Stack, MenuItem, TextField, Button } from "@mui/material";
import { RRule } from "rrule";

const FREQUENCIES = [
  { value: RRule.DAILY, label: "Daily" },
  { value: RRule.WEEKLY, label: "Weekly" },
  { value: RRule.MONTHLY, label: "Monthly" },
  { value: RRule.YEARLY, label: "Yearly" }
];

export default function AdvancedRecurrenceUI({ value, onChange }) {
  const [freq, setFreq] = useState(value?.freq || RRule.WEEKLY);
  const [interval, setInterval] = useState(value?.interval || 1);

  // Add more UI for BYDAY, BYSETPOS, etc.

  function buildRule() {
    const rule = new RRule({ freq, interval });
    onChange && onChange(rule.toString());
  }

  return (
    <Stack spacing={2}>
      <TextField select label="Frequency" value={freq} onChange={e => setFreq(Number(e.target.value))}>
        {FREQUENCIES.map(f => <MenuItem key={f.value} value={f.value}>{f.label}</MenuItem>)}
      </TextField>
      <TextField label="Interval" type="number" value={interval} onChange={e => setInterval(Number(e.target.value))} />
      {/* Add fields for BYDAY (checkboxes), BYSETPOS, etc. */}
      <Button onClick={buildRule}>Set Recurrence</Button>
    </Stack>
  );
}