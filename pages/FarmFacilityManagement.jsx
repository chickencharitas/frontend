import React from 'react';
import { Grid } from '@mui/material';
import FarmList from './FarmList';
import FacilityList from './FacilityList';
import FacilityUserAssignment from './FacilityUserAssignment';

export default function FarmFacilityManagement() {
  const [selectedFarm, setSelectedFarm] = React.useState(null);
  const [selectedFacility, setSelectedFacility] = React.useState(null);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <FarmList onSelect={farm => {
          setSelectedFarm(farm);
          setSelectedFacility(null);
        }} />
      </Grid>
      <Grid item xs={12} md={8}>
        <FacilityList farm={selectedFarm} onSelect={setSelectedFacility} />
        <FacilityUserAssignment facility={selectedFacility} />
      </Grid>
    </Grid>
  );
}