import React, { useState, useEffect } from "react";
import { getBreedings, getEggs, getGroupMembers, getInbreedingCoefficient } from "../services/breedingService";
import { Card, CardContent, Typography, Grid } from "@mui/material";

export default function BreedingAnalyticsTab({ group }) {
  const [fertility, setFertility] = useState(0);
  const [hatch, setHatch] = useState(0);
  const [avgInbreeding, setAvgInbreeding] = useState(0);

  useEffect(() => {
    getBreedings({ group_id: group.id }).then(async (breedings) => {
      let eggs = [];
      for (let b of breedings) {
        const e = await getEggs({ breeding_id: b.id });
        eggs = eggs.concat(e);
      }
      const totalEggs = eggs.length;
      const fertileEggs = eggs.filter(e => e.fertile).length;
      const hatchedEggs = eggs.filter(e => e.hatched).length;
      setFertility(totalEggs ? (fertileEggs / totalEggs * 100).toFixed(1) : 0);
      setHatch(totalEggs ? (hatchedEggs / totalEggs * 100).toFixed(1) : 0);
    });
    getGroupMembers(group.id).then(async (members) => {
      let sum = 0;
      for (let m of members) {
        const res = await getInbreedingCoefficient(m.id);
        sum += res.coefficient || 0;
      }
      setAvgInbreeding(members.length ? (sum / members.length).toFixed(3) : 0);
    });
  }, [group.id]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <Card><CardContent>
          <Typography variant="subtitle2">Fertility Rate (%)</Typography>
          <Typography variant="h5">{fertility}</Typography>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card><CardContent>
          <Typography variant="subtitle2">Hatchability (%)</Typography>
          <Typography variant="h5">{hatch}</Typography>
        </CardContent></Card>
      </Grid>
      <Grid item xs={12} md={4}>
        <Card><CardContent>
          <Typography variant="subtitle2">Avg. Inbreeding Coefficient</Typography>
          <Typography variant="h5">{avgInbreeding}</Typography>
        </CardContent></Card>
      </Grid>
    </Grid>
  );
}