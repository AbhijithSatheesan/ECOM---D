import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ element: Component, ...rest }) => {
  const is_admin = useSelector(state => state.login_logout.is_admin);

  return (
    <Route
      {...rest}
      element={is_admin ? <Component /> : <Navigate to="/" replace />}
    />
  );
};

export default AdminRoute;
