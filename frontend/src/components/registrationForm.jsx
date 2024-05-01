import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', formData);
      console.log(response.data);
      setError('');
      window.location.href = '/';
      // Optionally redirect to login or success page
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', textAlign: 'center' }}>
      <h2>User Registration</h2>
      {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Username" onChange={handleChange} required style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
        <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ marginBottom: '0.5rem', padding: '0.5rem', width: '100%' }} />
        <button type="submit" style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', width: '100%' }}>Register</button>
      </form>
    </div>
  );
};

export default RegistrationForm;
