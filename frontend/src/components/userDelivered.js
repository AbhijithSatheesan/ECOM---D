import React, { useState, useEffect } from 'react'; 
import { useSelector } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import AddReviewComponent from './addReview';

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

const UserDelivered = () => {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const user_id = useSelector(state => state.login_logout.user_id);

  useEffect(() => {
    const fetchUserDeliveredOrders = async () => {
      try {
        const response = await fetch(`/api/user_delivered/?user_id=${user_id}`);
        if (response.ok) {
          const data = await response.json();
          data.sort((a, b) => new Date(b.date_delivered) - new Date(a.date_delivered));
          setOrderDetails(data);
          setLoading(false);
        } else {
          console.error('Failed to fetch user delivered orders:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user delivered orders:', error);
      }
    };

    fetchUserDeliveredOrders();
  }, [user_id, selectedOrderId]);

  const handleAddReviewClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowReviewForm(true);
  };

  const handleReviewSubmit = () => {
    setShowReviewForm(false);
    setSelectedOrderId(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Delivered Orders</h2>
      {loading ? (
        <p>Loading...</p>
      ) : orderDetails.length > 0 ? (
        <div>
          {orderDetails.map(order => (
            <div key={order.id} style={{ display: 'flex', marginBottom: '30px', borderBottom: '1px solid #ccc', paddingBottom: '20px' }}>
              <div style={{ flex: '1' }}>
                <div style={{ marginBottom: '10px' }}>
                  <h4 style={{ margin: '0' }}>{order.name}</h4>
                  <p style={{ fontWeight: 'bold', color: order.review_added ? 'blue' : 'black' }}>
                    {order.review_added ? 'Review Added' : 'No Review'}
                  </p>
                </div>
                <p style={{ marginBottom: '5px' }}><strong>Order ID:</strong> {order.id}</p>
                <p style={{ marginBottom: '5px' }}><strong>Address:</strong> {order.building_number}, {order.locality}, {order.pin_code}</p>
                <p style={{ marginBottom: '5px' }}><strong>Total Price:</strong> ₹{order.total_price}</p>
                <p style={{ marginBottom: '5px' }}><strong>Order Created:</strong> {formatDateTime(order.date_created)}</p>
                <p style={{ marginBottom: '5px' }}><strong>Status:</strong> {order.delivered ? 'Delivered' : 'Not Delivered'}</p>
                {order.delivered && <p style={{ marginBottom: '5px' }}><strong>Date Delivered:</strong> {formatDateTime(order.date_delivered)}</p>}
                <Button 
                  variant="primary" 
                  onClick={() => handleAddReviewClick(order.id)} 
                  disabled={order.review_added} 
                  style={{ marginRight: '10px', marginTop: '10px' }}
                >
                  Add Review
                </Button>
                {selectedOrderId === order.id && showReviewForm && (
                  <AddReviewComponent
                    productId={order.product_id}
                    orderId={order.id}
                    onSubmit={handleReviewSubmit}
                  />
                )}
              </div>
              {order.product_image && (
                <div style={{ flex: '1', textAlign: 'center' }}>
                  <img
                    src={order.product_image}
                    alt="Product"
                    style={{ maxWidth: '150px', height: 'auto' }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p style={{ color: 'red', textAlign: 'center' }}>No delivered orders found.</p>
      )}
    </div>
  );
};

export default UserDelivered;
