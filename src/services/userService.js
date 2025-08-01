const API_URL = process.env.REACT_APP_API_URL || '';

async function handleResponse(res, defaultMsg) {
  if (!res.ok) {
    let errorMsg = defaultMsg;
    try {
      const error = await res.json();
      errorMsg = error.error || error.message || defaultMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return await res.json();
}

export const getUsers = async (token) => {
  const res = await fetch(`${API_URL}/api/users`, {
    headers: { 'Authorization': `Bearer ${token || localStorage.getItem('token')}` }
  });
  return handleResponse(res, 'Failed to fetch users');
};

export const createUser = async (data) => {
  const res = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to create user');
};

export const updateUser = async (id, data) => {
  const res = await fetch(`${API_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to update user');
};

export const getProfile = async () => {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
  });
  return handleResponse(res, 'Failed to fetch profile');
};

export const updateProfile = async (data) => {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  return handleResponse(res, 'Failed to update profile');
};

export const getRoles = async (userId, token) => {
  const res = await fetch(`${API_URL}/api/users/${userId}/roles`, {
    headers: { 'Authorization': `Bearer ${token || localStorage.getItem('token')}` }
  });
  return handleResponse(res, 'Failed to fetch user roles');
};

export const assignRole = async (userId, roleId, token) => {
  const res = await fetch(`${API_URL}/api/users/${userId}/roles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || localStorage.getItem('token')}`
    },
    body: JSON.stringify({ roleId })
  });
  return handleResponse(res, 'Failed to assign role');
};

export const removeRole = async (userId, roleId, token) => {
  const res = await fetch(`${API_URL}/api/users/${userId}/roles`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token || localStorage.getItem('token')}`
    },
    body: JSON.stringify({ roleId })
  });
  if (!res.ok) {
    let errorMsg = 'Failed to remove role';
    try {
      const error = await res.json();
      errorMsg = error.error || error.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return true;
};
