import React from 'react';
import { Paper, Typography, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import UserAutocomplete from '../components/UserAutocomplete';
import { getFacilityUsers, assignUserToFacility, removeUserFromFacility } from '../services/farmService';

export default function FacilityUserAssignment({ facility }) {
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const fetchUsers = async () => setUsers(await getFacilityUsers(facility.id));
  React.useEffect(() => { if (facility) fetchUsers(); }, [facility]);

  const handleAssign = async () => {
    if (selectedUser) {
      await assignUserToFacility(facility.id, selectedUser.id);
      setSelectedUser(null);
      fetchUsers();
    }
  };

  const handleRemove = async userId => {
    await removeUserFromFacility(facility.id, userId);
    fetchUsers();
  };

  if (!facility) return null;

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      <Typography variant="h6">Assigned Users</Typography>
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', my: 2 }}>
        <UserAutocomplete value={selectedUser} onChange={setSelectedUser} />
        <IconButton color="primary" disabled={!selectedUser} onClick={handleAssign}>Assign</IconButton>
      </Box>
      <List>
        {users.map(user => (
          <ListItem key={user.id} secondaryAction={
            <IconButton edge="end" aria-label="remove" onClick={() => handleRemove(user.id)}>
              <DeleteIcon />
            </IconButton>
          }>
            <ListItemText primary={user.name} secondary={user.email} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}