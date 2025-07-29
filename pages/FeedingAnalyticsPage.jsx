import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack, Chip } from "@mui/material";
import { getFeedings } from "../services/feedingService";
import { getFlocks } from "../services/chickenService"; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function FeedingAnalyticsPage() {
  const [feedings, setFeedings] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [selectedFlock, setSelectedFlock] = useState(null);

  useEffect(() => { getFlocks().then(setFlocks); }, []);
  useEffect(() => { if (selectedFlock) getFeedings({ flock_id: selectedFlock.id }).then(setFeedings); }, [selectedFlock]);

  // Aggregate daily consumption
  const daySum = {};
  feedings.forEach(f => {
    const d = f.date;
    daySum[d] = (daySum[d] || 0) + Number(f.quantity || 0);
  });
  const chartData = Object.entries(daySum).map(([date, qty]) => ({ date, qty }));

  // Total cost
  const cost = feedings.reduce((sum, f) => sum + Number(f.cost || 0), 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Feeding Analytics</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Consumption Timeline</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="qty" fill="#388e3c" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Total Feed Cost</Typography>
        <Chip label={`$${cost.toLocaleString()}`} color="primary" />
      </Box>
      <Box>
        <Typography variant="h6">Top Feedings</Typography>
        <Stack spacing={1}>
          {feedings.slice(0, 5).map(f => (
            <Box key={f.id}>{f.feed_name} | {f.quantity} {f.unit} on {f.date}</Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}