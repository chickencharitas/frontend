import React from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Stack, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function RecurrenceExceptionPicker({ exceptions, onChange }) {
  return (
    <Stack spacing={1}>
      {exceptions.map((ex, i) => (
        <Stack direction="row" key={i} alignItems="center">
          <DatePicker value={ex} onChange={date => {
            let newExceptions = [...exceptions];
            newExceptions[i] = date;
            onChange(newExceptions);
          }} />
          <IconButton size="small" onClick={() => onChange(exceptions.filter((_, idx) => idx !== i))}><DeleteIcon /></IconButton>
        </Stack>
      ))}
      <DatePicker label="Add Exception" value={null} onChange={date => date && onChange([...exceptions, date])} />
    </Stack>
  );
}