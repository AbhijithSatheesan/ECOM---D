import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDelivered = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);


  function formatDateTime(dateTimeString) {
    const dateTime = new Date(dateTimeString);
    const options = {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return dateTime.toLocaleDateString('en-IN', options); // Format date and time
  }


  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const response = await axios.get('/api/admin-order/');
        const delivered = response.data.filter(order => order.delivered);
        const sortedDelivered = delivered.sort((a, b) => new Date(b.date_delivered) - new Date(a.date_delivered)); // Sort in descending order
        setDeliveredOrders(sortedDelivered);
      } catch (error) {
        console.error('Error fetching delivered orders:', error);
      }
    };

    fetchDeliveredOrders();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: '0' }}>Delivered Orders</h1>
        <Link to="/admin/orders" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none' }}>Show Orders</Link>
      </div>
      <div className="order-list">
        {deliveredOrders.map(order => (
          <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>Order ID: {order.id}</h2>
            <p style={{ margin: '5px 0' }}>Name: {order.name}</p>
            <p style={{ margin: '5px 0' }}>Building Number: {order.building_number}</p>
            <p style={{ margin: '5px 0' }}>Locality: {order.locality}</p>
            <p style={{ margin: '5px 0' }}>Pin Code: {order.pin_code}</p>
            <p style={{ margin: '5px 0' }}>Total Price: {order.total_price}</p>
            <p style={{ margin: '5px 0' }}>Order Created: {formatDateTime(order.date_created)}</p>
            <p style={{ margin: '5px 0' }}>Date Delivered: {formatDateTime(order.date_delivered)}</p>           
            <p style={{ margin: '5px 0' }}>Is Paid: {order.is_paid ? 'Yes' : 'No'}</p>
            <p style={{ margin: '5px 0' }}>Delivered: {order.delivered ? 'Yes' : 'No'}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDelivered;
