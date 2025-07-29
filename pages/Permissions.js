import React, { useEffect, useState, useMemo } from 'react';
import {
  Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Alert,
  Card, CardContent, CardHeader, InputAdornment, IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPermissions, createPermission, updatePermission, deletePermission } from '../services/permissionService';

export default function Permissions() {
  const [permissions, setPermissions] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deleteDialog, setDeleteDialog] = useState({ open: false, id: null });

  useEffect(() => { getPermissions().then(setPermissions); }, []);

  const handleOpen = (perm = null) => {
    setForm({ name: perm?.name || '' });
    setEditId(perm?.id || null);
    setError('');
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await updatePermission(editId, form.name);
      } else {
        await createPermission(form.name);
      }
      setOpen(false);
      setEditId(null);
      setPermissions(await getPermissions());
    } catch (err) { setError(err.message); }
  };

  const handleDelete = async () => {
    try {
      await deletePermission(deleteDialog.id);
      setDeleteDialog({ open: false, id: null });
      setPermissions(await getPermissions());
    } catch (err) {
      setError(err.message);
      setDeleteDialog({ open: false, id: null });
    }
  };

  const filteredPermissions = useMemo(
    () =>
      permissions.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      ),
    [permissions, search]
  );

  return (
    <Box sx={{ maxWidth: 900, margin: "auto", mt: 5 }}>
      <Card sx={{ mb: 3, boxShadow: 3 }}>
        <CardContent>
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            gap={2}
            alignItems={{ xs: "stretch", sm: "center" }}
            width="100%"
          >
            <TextField
              label="Search by Name"
              value={search}
              onChange={e => setSearch(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 2, minWidth: 180 }}
            />
            <Button
              variant="contained"
              onClick={() => handleOpen()}
              sx={{ flex: 1, minWidth: 160, whiteSpace: "nowrap" }}
            >
              Add Permission
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ boxShadow: 3 }}>
        <CardHeader
          title={<Typography variant="h4" fontWeight="bold">Permissions</Typography>}
        />
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPermissions.length === 0 ? (
                <TableRow>
                  <TableCell align="center" colSpan={2} sx={{ py: 3 }}>
                    No permissions found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredPermissions.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => handleOpen(p)} size="small" title="Edit">
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => setDeleteDialog({ open: true, id: p.id })}
                        size="small"
                        color="error"
                        title="Delete"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Permission" : "Add Permission"}</DialogTitle>
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

      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, id: null })}>
        <DialogTitle>Delete Permission</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this permission?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, id: null })}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}