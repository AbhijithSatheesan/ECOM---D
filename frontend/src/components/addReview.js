import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Button, Row, Col } from 'react-bootstrap';

const AddReviewComponent = ({ productId, orderId, onSubmit }) => {
  const [formData, setFormData] = useState({
    rating: null,
    comment: ''
  });
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const user_id = useSelector(state => state.login_logout.user_id);
  const user = useSelector(state => state.login_logout.user);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStarClick = ratingValue => {
    setFormData({ ...formData, rating: ratingValue });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const formDataToSend = {
        ...formData,
        product: String(productId),
        name: String(user),
        user: String(user_id),
        orderId: String(orderId) // Pass orderId to the backend
      };
      console.log('data sent to backend:', formDataToSend)

      const response = await fetch('/api/add_review/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSend),
      });
      if (response.ok) {
        console.log('Review added successfully!');
        setFormData({ rating: null, comment: '' });
        setReviewSubmitted(true);
        onSubmit(); // Call onSubmit function provided by UserDelivered
      } else {
        console.error('Failed to add review:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding review:', error);
    }
  };

  return (
    <div>
      <br></br>
      <br></br>
      {reviewSubmitted ? (
        <p style={{ color: 'blue' }}>Thank you for sharing your opinion!</p>
      ) : (
        <div>
          <h5>Add a Review</h5>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="rating">
              <Form.Label>Rating:</Form.Label>
              <Row>
                {[...Array(5)].map((star, index) => {
                  const ratingValue = index + 1;
                  return (
                    <Col key={index} style={{ fontSize: '3vw', marginRight: '2px' }}>
                      <span
                        onClick={() => handleStarClick(ratingValue)}
                        style={{ cursor: "pointer" }}
                      >
                        {ratingValue <= formData.rating ? '★' : '☆'}
                      </span>
                    </Col>
                  );
                })}
              </Row>
              <input type="hidden" name="rating" value={formData.rating} />
            </Form.Group>
            <Form.Group controlId="comment">
              <Form.Label>Comment:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit Review
            </Button>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AddReviewComponent;
