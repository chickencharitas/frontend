import React from "react";
import { Stack, MenuItem, TextField, Checkbox, FormControlLabel } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
const WEEKDAYS = ['MO','TU','WE','TH','FR','SA','SU'];

export default function AdvancedRecurrenceEditor({ value, onChange }) {
  return (
    <Stack spacing={1}>
      <TextField
        select
        label="Repeat"
        value={value?.freq || ""}
        onChange={e => onChange({ ...value, freq: e.target.value })}
      >
        <MenuItem value="">No repeat</MenuItem>
        <MenuItem value="DAILY">Daily</MenuItem>
        <MenuItem value="WEEKLY">Weekly</MenuItem>
        <MenuItem value="MONTHLY">Monthly</MenuItem>
      </TextField>
      {value?.freq === "WEEKLY" && (
        <Stack direction="row">
          {WEEKDAYS.map(day => (
            <FormControlLabel
              key={day}
              control={
                <Checkbox
                  checked={value.byday?.includes(day) || false}
                  onChange={e => {
                    const byday = [...(value.byday || [])];
                    if (e.target.checked) byday.push(day);
                    else byday.splice(byday.indexOf(day), 1);
                    onChange({ ...value, byday });
                  }}
                />
              }
              label={day}
            />
          ))}
        </Stack>
      )}
      <TextField
        label="Interval"
        type="number"
        value={value.interval || 1}
        onChange={e => onChange({ ...value, interval: e.target.value })}
      />
      <DatePicker
        label="Until"
        value={value.until || null}
        onChange={date => onChange({ ...value, until: date?.toISOString().slice(0,10) })}
      />
    </Stack>
  );
}