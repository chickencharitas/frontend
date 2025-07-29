import React, { useEffect, useState } from "react";
import { Paper, Typography, Box, Grid, Card, CardContent, CircularProgress } from "@mui/material";
import { getChickens, getFlocks, getCullingLogs } from "../services/chickenService";

function StatCard({ label, value }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export default function ChickenFlockAnalytics({ farm }) {
  const [loading, setLoading] = useState(true);
  const [chickens, setChickens] = useState([]);
  const [flocks, setFlocks] = useState([]);
  const [culling, setCulling] = useState([]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getChickens({ farm_id: farm?.id }),
      getFlocks({ farm_id: farm?.id }),
      getCullingLogs({ farm_id: farm?.id })
    ]).then(([cs, fs, cl]) => {
      setChickens(cs);
      setFlocks(fs);
      setCulling(cl);
      setLoading(false);
    });
  }, [farm]);

  if (loading) return <CircularProgress />;

  // Example analytics
  const totalChickens = chickens.length;
  const aliveChickens = chickens.filter(c => c.alive).length;
  const totalFlocks = flocks.length;
  const recentCulls = culling.filter(c => c.type === "cull").length;
  const recentMortalities = culling.filter(c => c.type === "mortality").length;

  // Breed breakdown:
  const breedStats = chickens.reduce((acc, c) => {
    acc[c.breed_name] = (acc[c.breed_name] || 0) + 1;
    return acc;
  }, {});

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Farm Analytics</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={2}><StatCard label="Total Chickens" value={totalChickens} /></Grid>
        <Grid item xs={6} md={2}><StatCard label="Alive Chickens" value={aliveChickens} /></Grid>
        <Grid item xs={6} md={2}><StatCard label="Flocks" value={totalFlocks} /></Grid>
        <Grid item xs={6} md={2}><StatCard label="Culls (recent)" value={recentCulls} /></Grid>
        <Grid item xs={6} md={2}><StatCard label="Mortalities (recent)" value={recentMortalities} /></Grid>
      </Grid>
      <Box sx={{ mt: 4 }}>
        <Typography variant="subtitle1">By Breed</Typography>
        <Grid container spacing={1}>
          {Object.entries(breedStats).map(([breed, count]) => (
            <Grid item key={breed}><StatCard label={breed} value={count} /></Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
}