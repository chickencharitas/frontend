import React from 'react';
import { Box, TextField, Select, MenuItem, InputLabel, FormControl, Slider } from '@mui/material';

export default function FacilityFilters({ filters, setFilters }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Search"
        value={filters.search}
        onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
      />
      <FormControl>
        <InputLabel>Type</InputLabel>
        <Select
          label="Type"
          value={filters.type || ''}
          onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Hatchery">Hatchery</MenuItem>
          <MenuItem value="Breeding Pen">Breeding Pen</MenuItem>
          {/* ... */}
        </Select>
      </FormControl>
      <Box sx={{ width: 120 }}>
        <Slider
          value={filters.capacity || [0, 1000]}
          onChange={(_, v) => setFilters(f => ({ ...f, capacity: v }))}
          valueLabelDisplay="auto"
          min={0} max={5000}
          sx={{ mt: 3 }}
        />
      </Box>
    </Box>
  );
}