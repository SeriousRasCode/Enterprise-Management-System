import React, { useState, useEffect } from 'react';
import {
  getAllUsers,
  assignRole,
  updateUserStatus,
  createRole,
} from '../../api/admin';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');
  const [roleToAssign, setRoleToAssign] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data.users); // Assuming the API returns { users: [...] }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      alert('Failed to fetch users.');
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!newRoleName) {
      alert('Role name is required.');
      return;
    }
    try {
      await createRole(newRoleName, newRoleDesc);
      alert(`Role '${newRoleName}' created successfully.`);
      setNewRoleName('');
      setNewRoleDesc('');
    } catch (error) {
      console.error('Failed to create role:', error);
      alert('Failed to create role.');
    }
  };

  const handleAssignRole = async (userId, roleName) => {
    if (!roleName) {
      alert('Role name cannot be empty.');
      return;
    }
    try {
      await assignRole(userId, roleName);
      alert(`Role for user ${userId} changed to ${roleName}`);
      fetchUsers(); // Refresh users to show new role
    } catch (error) {
      console.error(`Failed to assign role to user ${userId}:`, error);
      alert('Failed to assign role.');
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    try {
      await updateUserStatus(userId, !currentStatus);
      alert(`User ${userId} status updated.`);
      fetchUsers(); // Refresh users to show new status
    } catch (error) {
      console.error(`Failed to update status for user ${userId}:`, error);
      alert('Failed to update user status.');
    }
  };

  const handleRoleInputChange = (userId, value) => {
    setRoleToAssign({ ...roleToAssign, [userId]: value });
  };


  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      <div style={{ marginBottom: '40px' }}>
        <h2>Create New Role</h2>
        <form onSubmit={handleCreateRole}>
          <input
            type="text"
            placeholder="New Role Name"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <input
            type="text"
            placeholder="Role Description"
            value={newRoleDesc}
            onChange={(e) => setNewRoleDesc(e.target.value)}
            style={{ marginRight: '10px' }}
          />
          <button type="submit">Create Role</button>
        </form>
      </div>

      <div>
        <h2>All Users</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={tableHeaderStyle}>User ID</th>
              <th style={tableHeaderStyle}>Full Name</th>
              <th style={tableHeaderStyle}>Email</th>
              <th style={tableHeaderStyle}>Role</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={tableCellStyle}>{user.id}</td>
                <td style={tableCellStyle}>{user.full_name}</td>
                <td style={tableCellStyle}>{user.email}</td>
                <td style={tableCellStyle}>{user.role}</td>
                <td style={tableCellStyle}>{user.is_active ? 'Active' : 'Inactive'}</td>
                <td style={tableCellStyle}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input 
                      type="text"
                      placeholder="New role"
                      onChange={(e) => handleRoleInputChange(user.id, e.target.value)}
                      style={{ marginRight: '5px', width: '100px' }}
                    />
                    <button onClick={() => handleAssignRole(user.id, roleToAssign[user.id])}>
                      Assign Role
                    </button>
                    <button 
                      onClick={() => handleStatusChange(user.id, user.is_active)}
                      style={{ marginLeft: '10px' }}
                    >
                      {user.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tableHeaderStyle = {
  border: '1px solid #ddd',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const tableCellStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};


export default AdminDashboard;
