import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const OrderPage = () => {
  const { cartItemId } = useParams();
  const [formData, setFormData] = useState({
    name: '',
    buildingNumber: '',
    locality: '',
    pinCode: ''
  });

  // Update form data when input values change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Prepare data to be sent to the backend
    const requestData = {
      name: formData.name,
      building_number: formData.buildingNumber,
      locality: formData.locality,
      pin_code: formData.pinCode,
      user_cart: cartItemId  // Assuming cartItemId is the ID of the UserCart
    };
  
    console.log('Data to be sent to backend:', requestData); // Log the data
  
    try {
      // Make a POST request to the backend API endpoint for each item
      const response = await fetch('/api/place_order/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      // Handle the response
      if (response.ok) {
        // Order successfully placed, handle as needed
        console.log('Order placed successfully');
        window.location.href = '/#/myorders'; 
      } else {
        // Error occurred while placing order, handle as needed
        console.error('Error placing order:', response.statusText);
      }
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  

  return (
    <div style={{ maxWidth: '400px', marginTop: '20px', padding: '0 20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Order Page</h2>
      <p style={{ marginBottom: '10px' }}>Cart Item ID: {cartItemId}</p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <label style={{ marginBottom: '10px' }}>
          Name:<br />
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} style={{ marginLeft: '5px' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Building Number/Name:<br />
          <input type="text" name="buildingNumber" value={formData.buildingNumber} onChange={handleInputChange} style={{ marginLeft: '5px' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Locality:<br />
          <input type="text" name="locality" value={formData.locality} onChange={handleInputChange} style={{ marginLeft: '5px' }} />
        </label>
        <label style={{ marginBottom: '10px' }}>
          Pin Code:<br />
          <input type="text" name="pinCode" value={formData.pinCode} onChange={handleInputChange} style={{ marginLeft: '5px' }} />
        </label>
        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>Place Order</button>
      </form>
    </div>
  );
};

export default OrderPage;
