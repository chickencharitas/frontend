import React from 'react';
import { useAuth } from '../context/AuthContext';

export default function RoleBasedGuard({ roles, children }) {
  const { user } = useAuth();
  if (!user || !roles.some(r => user.roles.includes(r))) return null;
  return children;
}