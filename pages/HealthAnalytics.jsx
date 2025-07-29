import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack, Chip } from "@mui/material";
import { getHealthEvents, getMortalityAnalysis } from "../services/healthService";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function HealthAnalytics({ flock }) {
  const [events, setEvents] = useState([]);
  const [mortality, setMortality] = useState([]);

  useEffect(() => {
    getHealthEvents({ flock_id: flock?.id }).then(setEvents);
    getMortalityAnalysis({ flock_id: flock?.id }).then(setMortality);
  }, [flock]);

  // Prepare event count by type
  const eventStats = {};
  events.forEach(e => {
    eventStats[e.event_type] = (eventStats[e.event_type] || 0) + 1;
  });
  const eventChartData = Object.entries(eventStats).map(([type, count]) => ({ type, count }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Health Analytics</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Event Counts</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={eventChartData}>
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box>
        <Typography variant="h6">Mortality / Culling Causes</Typography>
        <Stack spacing={1}>
          {mortality.map(m => (
            <Box key={m.details}>{m.details}: <Chip label={m.count} color="error" /></Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}