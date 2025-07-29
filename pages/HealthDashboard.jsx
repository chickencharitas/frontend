import React, { useEffect, useState } from "react";
import { Paper, Typography, Stack, Button, Chip, Box, Alert } from "@mui/material";
import { getHealthEvents, getOutbreaks, getMortalityAnalysis } from "../services/healthService";

export default function HealthDashboard({ flock, chicken }) {
  const [events, setEvents] = useState([]);
  const [outbreaks, setOutbreaks] = useState([]);
  const [mortality, setMortality] = useState([]);

  useEffect(() => {
    getHealthEvents({ flock_id: flock?.id, chicken_id: chicken?.id }).then(setEvents);
    getOutbreaks().then(setOutbreaks);
    getMortalityAnalysis({ flock_id: flock?.id }).then(setMortality);
  }, [flock, chicken]);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Health & Medical Dashboard</Typography>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        <Button variant="contained" href="/health/events">All Events</Button>
        <Button variant="contained" href="/health/outbreaks">Outbreaks</Button>
        <Button variant="outlined" href="/health/analytics">Analytics</Button>
      </Stack>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Recent Health Events</Typography>
        <Stack spacing={1}>
          {events.slice(0, 6).map(e => (
            <Alert key={e.id} severity={
              e.event_type === "mortality" || e.event_type === "disease" ? "error" :
              e.event_type === "treatment" ? "info" :
              "success"
            }>
              {e.event_type}: {e.details} ({e.event_date})
            </Alert>
          ))}
        </Stack>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Current Outbreaks</Typography>
        <Stack spacing={1}>
          {outbreaks.slice(0, 3).map(o => (
            <Alert key={o.id} severity="error">
              {o.disease} ({o.start_date} - {o.end_date || "ongoing"})
            </Alert>
          ))}
        </Stack>
      </Box>
      <Box>
        <Typography variant="h6">Mortality/Culling Analysis</Typography>
        <Stack spacing={1}>
          {mortality.map(m => (
            <Box key={m.details}>{m.details}: <Chip label={m.count} color="error" /></Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}