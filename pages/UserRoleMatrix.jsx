import React, { useEffect, useState, useContext } from 'react';
import {
  Box, Typography, CircularProgress, Card, CardContent,
  Stack, Switch, Tooltip, Avatar, InputBase, Paper, IconButton, Fade
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AuthContext } from '../contexts/AuthContext';
import {
  getUsers,
  getRoles as getUserRoles,
  assignRole,
  removeRole
} from '../services/userService';
import { getRoles } from '../services/roleService';

export default function UserRoleMatrix() {
  const { token } = useContext(AuthContext); // FIXED: use 'token' instead of 'accessToken'
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [matrix, setMatrix] = useState({});
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState({});
  const [flash, setFlash] = useState({});
  const [search, setSearch] = useState('');

  async function fetchMatrix() {
    setLoading(true);
    const [usersRes, rolesRes] = await Promise.all([
      getUsers(token),
      getRoles(token),
    ]);
    setUsers(usersRes);
    setRoles(rolesRes);

    const matrixObj = {};
    await Promise.all(usersRes.map(async (user) => {
      const userRoles = await getUserRoles(user.id, token);
      matrixObj[user.id] = new Set(userRoles.map(r => r.id));
    }));
    setMatrix(matrixObj);
    setLoading(false);
  }

  useEffect(() => {
    fetchMatrix();
  }, [token]);

  const handleToggle = async (userId, roleId) => {
    const key = `${userId}-${roleId}`;
    setToggling(prev => ({ ...prev, [key]: true }));

    try {
      if (matrix[userId]?.has(roleId)) {
        await removeRole(userId, roleId, token);
        setMatrix(prev => ({
          ...prev,
          [userId]: new Set([...prev[userId]].filter(id => id !== roleId))
        }));
      } else {
        await assignRole(userId, roleId, token);
        setMatrix(prev => ({
          ...prev,
          [userId]: new Set([...prev[userId], roleId])
        }));
        setFlash(f => ({ ...f, [key]: true }));
        setTimeout(() => setFlash(f => ({ ...f, [key]: false })), 800);
      }
    } catch (error) {
      console.error('Error toggling role:', error);
    }

    setToggling(prev => ({ ...prev, [key]: false }));
  };

  const filteredUsers = users.filter(user =>
    (user.name || user.email).toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Box textAlign="center" mt={8}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box p={{ xs: 2, md: 4 }} maxWidth="95vw" mx="auto">
      <Typography variant="h4" mb={3} fontWeight={700} textAlign="center" color="primary">
        User-Role Assignment Matrix
      </Typography>

      <Paper
        component="form"
        sx={{
          mb: 4,
          p: '4px 8px',
          display: 'flex',
          alignItems: 'center',
          maxWidth: 500,
          mx: 'auto',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled>
          <SearchIcon />
        </IconButton>
      </Paper>

      <Stack spacing={3}>
        {filteredUsers.map(user => (
          <Card
            key={user.id}
            variant="outlined"
            sx={{
              borderRadius: 2,
              boxShadow: 1,
              transition: '0.3s',
              '&:hover': { boxShadow: 3 },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar sx={{ mr: 2 }}>
                  {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {user.name || user.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', overflowX: 'auto', gap: 2, pb: 1 }}>
                {roles.map(role => {
                  const key = `${user.id}-${role.id}`;
                  const checked = matrix[user.id]?.has(role.id);
                  const isLoading = toggling[key];
                  const isFlash = flash[key];

                  return (
                    <Tooltip key={role.id} title={role.name} arrow>
                      <Fade in>
                        <Box
                          sx={{
                            minWidth: 120,
                            textAlign: 'center',
                            flexShrink: 0,
                            backgroundColor: isFlash
                              ? 'rgba(76, 175, 80, 0.2)'
                              : 'transparent',
                            borderRadius: 2,
                            p: 1,
                            transition: 'background-color 0.3s ease-in-out',
                          }}
                        >
                          <Typography variant="body2" noWrap sx={{ mb: 0.5 }}>
                            {role.name}
                          </Typography>
                          <Switch
                            color="primary"
                            checked={checked}
                            onChange={() => handleToggle(user.id, role.id)}
                            disabled={isLoading}
                          />
                        </Box>
                      </Fade>
                    </Tooltip>
                  );
                })}
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </Box>
  );
}