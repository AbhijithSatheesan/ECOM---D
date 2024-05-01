import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Nav, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../actions/loginAction';

const LoginComponent = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isFormValid, setIsFormValid] = useState(false);
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if both fields are filled
    setIsFormValid(username.trim() && password.trim());
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(login(username, password)); // Dispatch login action
    setUsername('');
    setPassword('');
    setTimeout(() => {
      setErrorMessage( '              Login failed'); // Display "Login failed" after 1.5 seconds
    }, 1500);
  };

  useEffect(() => {
    // Handle login success/failure from redux state
    if (auth.isAuthenticated) {
      // Redirect to protected area
      window.location.href = '/';
    }
  }, [auth.isAuthenticated]); // Update effect when auth.isAuthenticated changes

  return (
    <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem', marginTop:'10rem', marginRight:'10rem' }}>
        <label htmlFor="username" style={{ marginRight: '0.08rem' }}>Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
      </div>
      <div style={{ marginBottom: '1rem' , marginRight:'10rem' }}>
        <label htmlFor="password" style={{ marginRight: '0.08rem' }}>Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: '0.5rem' }}
        />
      </div>
      <button type="submit" disabled={!isFormValid} style={{marginRight:'5rem' , padding: '0.5rem 1rem', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Login</button>
      {errorMessage && <p style={{ color: 'red', marginTop: '0.5rem' }}>{errorMessage}</p>}
      <Container style={{ marginTop: '1rem', textAlign: 'center'}}>
        <p style={{ marginBottom: '0.5rem', marginRight:'5rem' }}>First time here? Register new account?</p>
        <LinkContainer to="/register">
          <Nav.Link>
            <button type="submit" style={{marginRight:'5rem' ,padding: '0.5rem 1rem', backgroundColor: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>Register</button>
          </Nav.Link>
        </LinkContainer>
      </Container>
    </form>
  );
};

export default LoginComponent;
