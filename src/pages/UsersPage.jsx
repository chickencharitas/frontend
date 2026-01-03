import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Menu,
  Chip,
  Typography,
  Alert,
  Divider,
  Box as MuiBox,
  Grid,
  Avatar,
  Tooltip,
  CircularProgress
} from '@mui/material';
import {
  MoreVert,
  Delete,
  Edit,
  PersonAdd,
  Mail,
  Check,
  Close,
  Security
} from '@mui/icons-material';
import api from '../services/api';

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [openDialog, setOpenDialog] = useState(false);
  const [openInviteDialog, setOpenInviteDialog] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    firstName: '',
    lastName: '',
    role: 'volunteer' 
  });
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'volunteer'
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { data: usersResponse, isLoading } = useQuery('organization-users', () =>
    api.get('/users')
  );

  const users = usersResponse?.data?. data || [];

  const createMutation = useMutation(
    (data) => api.post('/users', data),
    { 
      onSuccess: () => {
        queryClient.invalidateQueries('organization-users');
        setOpenDialog(false);
        setFormData({ email: '', firstName: '', lastName: '', role: 'volunteer' });
        setSuccessMessage('User added successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: (error) => {
        setErrorMessage(error.response?.data?.error || 'Failed to add user');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  const inviteMutation = useMutation(
    (data) => api.post('/users/invite', data),
    { 
      onSuccess: () => {
        queryClient.invalidateQueries('organization-users');
        setOpenInviteDialog(false);
        setInviteData({ email: '', role: 'volunteer' });
        setSuccessMessage('Invitation sent successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      },
      onError: (error) => {
        setErrorMessage(error. response?.data?.error || 'Failed to send invitation');
        setTimeout(() => setErrorMessage(''), 3000);
      }
    }
  );

  const updateRoleMutation = useMutation(
    (data) => api. put(`/users/${data.id}/role`, { role: data.role }),
    { 
      onSuccess: () => {
        queryClient.invalidateQueries('organization-users');
        setAnchorEl(null);
        setSuccessMessage('User role updated');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  );

  const deleteMutation = useMutation(
    (id) => api.delete(`/users/${id}`),
    { 
      onSuccess: () => {
        queryClient. invalidateQueries('organization-users');
        setAnchorEl(null);
        setSuccessMessage('User removed successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
      }
    }
  );

  const handleAddUser = () => {
    if (! formData.email || !formData.firstName || !formData.lastName) {
      setErrorMessage('Please fill in all required fields');
      return;
    }
    createMutation.mutate(formData);
  };

  const handleInviteUser = () => {
    if (!inviteData.email) {
      setErrorMessage('Please enter an email address');
      return;
    }
    inviteMutation.mutate(inviteData);
  };

  const handleMenuClick = (event, user) => {
    setSelectedUser(user);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'error',
      pastor: 'primary',
      worship_leader: 'info',
      av_tech: 'warning',
      volunteer: 'default'
    };
    return colors[role] || 'default';
  };

  const getRoleDescription = (role) => {
    const descriptions = {
      admin: 'Full system access and administration',
      pastor: 'Can create presentations and playlists',
      worship_leader: 'Can create presentations and playlists',
      av_tech: 'Can control displays and integrations',
      volunteer: 'View-only access to media'
    };
    return descriptions[role] || '';
  };

  const getRolePermissions = (role) => {
    const permissions = {
      admin: ['Manage Users', 'Manage Settings', 'All Integrations', 'View Reports'],
      pastor: ['Create Presentations', 'Create Playlists', 'View Media', 'View Reports'],
      worship_leader: ['Create Presentations', 'Create Playlists', 'View Media'],
      av_tech: ['Control Display', 'Manage Outputs', 'Manage Integrations'],
      volunteer: ['View Media', 'View Scripture']
    };
    return permissions[role] || [];
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Users & Permissions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Mail />}
            onClick={() => setOpenInviteDialog(true)}
          >
            Invite User
          </Button>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={() => setOpenDialog(true)}
          >
            Add User
          </Button>
        </Box>
      </Box>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>
          {errorMessage}
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Joined</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#1976d2' }}>
                          {user.first_name?. charAt(0)}{user.last_name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {user.first_name} {user. last_name}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={user.role}
                        color={getRoleColor(user.role)}
                        size="small"
                        icon={<Security />}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, user)}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {users.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography color="textSecondary">
                        No users yet. Add your first team member! 
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Role Information Cards */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        User Roles & Permissions
      </Typography>
      <Grid container spacing={2}>
        {['admin', 'pastor', 'worship_leader', 'av_tech', 'volunteer'].map((role) => (
          <Grid item xs={12} sm={6} md={4} key={role}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Chip
                    label={role}
                    color={getRoleColor(role)}
                    size="small"
                    sx={{ textTransform: 'capitalize' }}
                  />
                </Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {getRoleDescription(role)}
                </Typography>
                <Typography variant="caption" color="textSecondary" display="block" sx={{ mb: 1 }}>
                  Permissions:
                </Typography>
                <MuiBox sx={{ pl: 1 }}>
                  {getRolePermissions(role).map((perm, idx) => (
                    <Typography key={idx} variant="caption" display="block">
                      • {perm}
                    </Typography>
                  ))}
                </MuiBox>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* User Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem disabled>
          <Typography variant="subtitle2">Change Role</Typography>
        </MenuItem>
        {['admin', 'pastor', 'worship_leader', 'av_tech', 'volunteer'].map((role) => (
          <MenuItem
            key={role}
            onClick={() => {
              updateRoleMutation.mutate({ id: selectedUser?. id, role });
            }}
            selected={selectedUser?.role === role}
            sx={{ pl: 4 }}
          >
            <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
              {role}
            </Typography>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => {
          deleteMutation.mutate(selectedUser?.id);
          handleMenuClose();
        }} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} /> Remove User
        </MenuItem>
      </Menu>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              required
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target. value })}
              required
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ... formData, email: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ... formData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="pastor">Pastor</MenuItem>
                <MenuItem value="worship_leader">Worship Leader</MenuItem>
                <MenuItem value="av_tech">AV Technician</MenuItem>
                <MenuItem value="volunteer">Volunteer</MenuItem>
              </Select>
            </FormControl>
            <Alert severity="info">
              A temporary password will be sent to their email address. 
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            loading={createMutation.isLoading}
          >
            Add User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Invite User Dialog */}
      <Dialog open={openInviteDialog} onClose={() => setOpenInviteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Invite User</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={inviteData.email}
              onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
              placeholder="user@example.com"
              required
            />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
                value={inviteData.role}
                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                label="Role"
              >
                <MenuItem value="pastor">Pastor</MenuItem>
                <MenuItem value="worship_leader">Worship Leader</MenuItem>
                <MenuItem value="av_tech">AV Technician</MenuItem>
                <MenuItem value="volunteer">Volunteer</MenuItem>
              </Select>
            </FormControl>
            <Alert severity="info">
              An invitation email will be sent with instructions to join your church.
            </Alert>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenInviteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleInviteUser}
            variant="contained"
            loading={inviteMutation.isLoading}
          >
            Send Invitation
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}