import React from 'react';
import { Link } from 'react-router-dom';

const linkStyle = {
  textDecoration: 'none',
  color: '#007bff',
  margin: '5px',
  fontSize: '18px',
  transition: 'color 0.3s ease', // Smooth transition for color change
};

const AdminPage = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
      <h2 style={{ marginBottom: '20px', color: '#007bff', fontSize: '24px' }}>Welcome to Admin Page</h2>
      <div>
        <h3 style={{ marginBottom: '10px', color: '#007bff', fontSize: '20px' }}>Navigation</h3>
        <ul style={{ listStyleType: 'none', padding: '0' }}>
          <li>
            <Link to="/admin/users" style={linkStyle}>Users</Link>
          </li>
          <li>
            <Link to="/admin/products" style={linkStyle}>Products</Link>
          </li>
          <li>
            <Link to="/admin/addproducts" style={linkStyle}>Add Product</Link>
          </li>
          <li>
            <Link to="/admin/orders" style={linkStyle}>Orders</Link>
          </li>
          <li>
            <Link to="/admin/delivered" style={{ ...linkStyle, color: '#28a745' }}>Delivered</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default AdminPage;
