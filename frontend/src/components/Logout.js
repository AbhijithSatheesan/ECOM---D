import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/loginAction';

const LogoutComponent = () => {
  const dispatch = useDispatch();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = () => {
    dispatch(logout());  // Dispatch logout action
    setIsLoggedOut(true); // Set the local state to indicate successful logout
    // Redirect to the home page after 1 second
    setTimeout(() => {
     
    }, 10);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '70vh', color: 'red' }}>
      <p>Are you sure you want to logout</p>
      {!isLoggedOut ? (
        <button style={{ backgroundColor: 'transparent', border: '1px solid red', color: 'red', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }} onClick={handleLogout}>Logout</button>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default LogoutComponent;
