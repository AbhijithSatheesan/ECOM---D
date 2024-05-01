import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('/api/admin-order/');
        setOrders(response.data.filter(order => !order.delivered)); // Filter orders where delivered is false
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleOrderDelivered = async (orderId) => {
    try {
      await axios.put(`/api/admin-order/${orderId}/`);
      console.log('Order marked as delivered successfully');
      // Log the data sent to the backend
      console.log('Data sent to backend:', { orderId });
      // Update the orders state to reflect the changes made
      setOrders(orders.map(order => order.id === orderId ? { ...order, delivered: true } : order));
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', position: 'relative' }}>
      
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Admin Orders</h1>
      <Link to="/admin/delivered" style={{ backgroundColor: 'black', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', textDecoration: 'none', display: 'block', marginTop: '20px' }}>Show Delivered Items</Link>
      
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '18px', marginBottom: '5px' }}>Order ID: {order.id}</h2>
              <p style={{ margin: '5px 0' }}>Name: {order.name}</p>
              <p style={{ margin: '5px 0' }}>Building Number: {order.building_number}</p>
              <p style={{ margin: '5px 0' }}>Locality: {order.locality}</p>
              <p style={{ margin: '5px 0' }}>Pin Code: {order.pin_code}</p>
              <p style={{ margin: '5px 0' }}>Total Price: {order.total_price}</p>
              <p style={{ margin: '5px 0' }}>Is Paid: {order.is_paid ? 'Yes' : 'No'}</p>
              <p style={{ margin: '5px 0' }}>Delivered: {order.delivered ? 'Yes' : 'No'}</p>
              {!order.delivered && (
                <button style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }} onClick={() => handleOrderDelivered(order.id)}>Mark as Delivered</button>
              )}
            </div>
          ))
        ) : (
          <p style={{ color: 'red' }}>No Orders to Deliver</p>
        )}
      </div>
     
    </div>
  );
};

export default AdminOrder;
