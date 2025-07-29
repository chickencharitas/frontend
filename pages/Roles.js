import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Dialog, DialogTitle, DialogContent,
  Stack, IconButton, Tooltip, Button, List, ListItem, ListItemText, ListItemSecondaryAction, Divider, TextField, Alert, DialogActions
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getRoles, createRole, removeRole } from '../services/roleService';

export default function Roles() {
  const [roles, setRoles] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => { getRoles().then(setRoles); }, []);

  const handleOpen = (role = null) => {
    setForm({ name: role?.name || '' });
    setEditId(role?.id || null);
    setError('');
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (editId) {
        // You can implement updateRole here if needed
      } else {
        await createRole(form.name);
      }
      setOpen(false);
      setEditId(null);
      setRoles(await getRoles());
    } catch (err) { setError(err.message); }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeRole(deleteId);
      setRoles(await getRoles());
    } catch (err) {
      setError(err.message);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <Box p={4}>
      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="h4" fontWeight="bold">Roles</Typography>
        <Button variant="contained" onClick={() => handleOpen(null)}>
          Add Role
        </Button>
      </Box>

      <Card sx={{ boxShadow: 2, width: "100%", maxWidth: 600, mx: "auto" }}>
        <CardContent>
          {roles.length === 0 ? (
            <Typography>No roles found.</Typography>
          ) : (
            <List sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}>
              {roles.map((role, idx) => (
                <React.Fragment key={role.id}>
                  <ListItem
                    secondaryAction={
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => handleOpen(role)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDeleteClick(role.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    }
                  >
                    <ListItemText primary={role.name} />
                  </ListItem>
                  {idx < roles.length - 1 && <Divider component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Role" : "Add Role"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            autoFocus
          />
          {error && <Alert severity="error">{error}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>{editId ? "Update" : "Create"}</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Role</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this role?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}