import React from 'react';
import { Drawer, Tabs, Tab, Box, Typography, Divider, Chip } from '@mui/material';
import FacilityUserAssignment from './FacilityUserAssignment';
import { getFacilityById } from '../services/farmService';
import { useWebSocket } from '../hooks/useWebSocket'; // custom hook

export default function FacilityDetailDrawer({ facilityId, open, onClose }) {
  const [tab, setTab] = React.useState(0);
  const [facility, setFacility] = React.useState(null);
  const [log, setLog] = React.useState([]);

  React.useEffect(() => {
    if (facilityId) getFacilityById(facilityId).then(setFacility);
    else setFacility(null);
  }, [facilityId]);

  // Real-time updates
  useWebSocket(`/ws/facility/${facilityId}`, (msg) => {
    if (msg.type === 'update') setFacility(msg.data);
    if (msg.type === 'log') setLog(l => [msg.data, ...l]);
  }, [facilityId]);

  if (!facility) return null;

  return (
    <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{ sx: { width: 400 } }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6">{facility.name}</Typography>
        <Chip label={facility.type} size="small" sx={{ mb: 1, ml: 1 }} />
        <Typography variant="body2" color="text.secondary">{facility.description}</Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          Capacity: {facility.capacity} <br />
          Current Flocks: {facility.currentFlockCount}
        </Typography>
      </Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} centered>
        <Tab label="Overview" />
        <Tab label="Users" />
        <Tab label="Activity Log" />
      </Tabs>
      <Divider />
      <Box sx={{ p: 2 }}>
        {tab === 0 && (
          <Box>
            <Typography variant="subtitle1">Facility Info</Typography>
            {/* Add more detailed facility data here */}
          </Box>
        )}
        {tab === 1 && <FacilityUserAssignment facility={facility} />}
        {tab === 2 && (
          <Box>
            <Typography variant="subtitle1">Recent Activity</Typography>
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {log.map((l, idx) => (
                <Typography key={idx} sx={{ fontSize: 14, mb: 1 }}>{l}</Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    </Drawer>
  );
}