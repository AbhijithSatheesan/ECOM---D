import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Table } from 'react-bootstrap';

function UsersList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users/');
      // Sort users array by is_staff property, with staff users first
      const sortedUsers = response.data.sort((a, b) => (b.is_staff - a.is_staff));
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}/`);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const toggleIsStaff = async (userId, isStaff) => {
    try {
      await axios.patch(`/api/users/${userId}/`, { is_staff: !isStaff });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div>
      <h2>User Management</h2>
      <Table bordered striped hover>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Is Staff</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className={user.is_staff ? 'table-warning' : ''}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.is_staff ? 'Yes' : 'No'}</td>
              <td>
                <Button variant="danger" className="me-2" onClick={() => deleteUser(user.id)}>Delete</Button>
                <Button 
                  variant={user.is_staff ? 'warning' : 'success'} 
                  onClick={() => toggleIsStaff(user.id, user.is_staff)}
                >
                  {user.is_staff ? 'Revoke Staff' : 'Grant Staff'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default UsersList;
