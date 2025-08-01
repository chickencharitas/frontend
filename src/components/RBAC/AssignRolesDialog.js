import React, { useEffect, useState, useContext } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button,
  List, ListItem, ListItemText, ListItemIcon, Checkbox, CircularProgress, Box
} from "@mui/material";
import { AuthContext } from "../../contexts/AuthContext";
import { getRoles } from "../../services/roleService";
import { getRoles as getUserRoles, assignRole, removeRole } from "../../services/userService";

export default function AssignRolesDialog({ open, onClose, user }) {
  const { token } = useContext(AuthContext);
  const [roles, setRoles] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open && user) {
      setLoading(true);
      Promise.all([
        getRoles(token),
        getUserRoles(user.id, token)
      ])
        .then(([allRoles, userRoles]) => {
          setRoles(allRoles);
          setSelected(userRoles.map(r => r.id));
        })
        .finally(() => setLoading(false));
    }
  }, [open, user, token]);

  const handleToggle = (roleId) => {
    setSelected((prev) =>
      prev.includes(roleId)
        ? prev.filter((id) => id !== roleId)
        : [...prev, roleId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Assign new roles
      for (const role of roles) {
        const hasRole = selected.includes(role.id);
        const userHadRole = (await getUserRoles(user.id, token)).some(r => r.id === role.id);
        if (hasRole && !userHadRole) {
          await assignRole(user.id, role.id, token);
        } else if (!hasRole && userHadRole) {
          await removeRole(user.id, role.id, token);
        }
      }
      onClose(true);
    } catch (err) {
      onClose(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} fullWidth maxWidth="xs">
      <DialogTitle>Assign Roles to {user?.email || user?.name}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {roles.map((role) => (
              <ListItem key={role.id} button onClick={() => handleToggle(role.id)}>
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={selected.includes(role.id)}
                    tabIndex={-1}
                    disableRipple
                  />
                </ListItemIcon>
                <ListItemText primary={role.name} />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)} disabled={saving}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || loading} variant="contained">Save</Button>
      </DialogActions>
    </Dialog>
  );
}