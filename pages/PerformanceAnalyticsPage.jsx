import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Stack, Chip, Button } from "@mui/material";
import { getEggProductionStats, getHatchStats, getGrowthStats, getFeedConversionStats, getGeneticTraits } from "../services/analyticsService";
import { getFlocks } from "../services/chickenService"; 
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function PerformanceAnalyticsPage() {
  const [flocks, setFlocks] = useState([]);
  const [selectedFlock, setSelectedFlock] = useState(null);
  const [eggStats, setEggStats] = useState([]);
  const [hatchStats, setHatchStats] = useState([]);
  const [growthStats, setGrowthStats] = useState([]);
  const [feedConvStats, setFeedConvStats] = useState([]);
  const [geneticTraits, setGeneticTraits] = useState([]);

  useEffect(() => { getFlocks().then(setFlocks); }, []);
  useEffect(() => {
    if (selectedFlock) {
      getEggProductionStats({ flock_id: selectedFlock.id }).then(setEggStats);
      getHatchStats({ flock_id: selectedFlock.id }).then(setHatchStats);
      getGrowthStats({ flock_id: selectedFlock.id }).then(setGrowthStats);
      getFeedConversionStats({ flock_id: selectedFlock.id }).then(setFeedConvStats);
      getGeneticTraits({ flock_id: selectedFlock.id }).then(setGeneticTraits);
    }
  }, [selectedFlock]);

  // Compute hatchability and fertility rates
  const hatchabilityData = hatchStats.map(h => ({
    date: h.date,
    hatch_rate: h.hatched && h.total_eggs ? Math.round((h.hatched / h.total_eggs) * 100) : 0
  }));

  // Feed conversion ratio (FCR)
  const fcrData = feedConvStats.map(f => ({
    date: f.date,
    fcr: f.feed_consumed && f.weight_gain ? (f.feed_consumed / f.weight_gain).toFixed(2) : null
  }));

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Performance & Productivity Analytics</Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Egg Production</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={eggStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="collected" fill="#1976d2" />
            <Bar dataKey="broken" fill="#d32f2f" />
            <Bar dataKey="abnormal" fill="#ffa000" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Hatchability Rate</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hatchabilityData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Line type="monotone" dataKey="hatch_rate" stroke="#388e3c" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Growth Rate (Average Weight)</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={growthStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="avg_weight" stroke="#fbc02d" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6">Feed Conversion Ratio (FCR)</Typography>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={fcrData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="fcr" stroke="#1976d2" />
          </LineChart>
        </ResponsiveContainer>
      </Box>
      <Box>
        <Typography variant="h6">Genetic Traits (Latest)</Typography>
        <Stack spacing={1}>
          {geneticTraits.slice(-5).map((t, idx) => (
            <Box key={idx}>{t.date}: <strong>{t.trait}</strong> = {t.value} {t.notes ? `(${t.notes})` : ""}</Box>
          ))}
        </Stack>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Button variant="outlined" href="/export/analytics?flock_id={selectedFlock?.id}" disabled={!selectedFlock}>
          Export CSV
        </Button>
      </Box>
    </Paper>
  );
}