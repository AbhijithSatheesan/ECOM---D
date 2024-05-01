import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import axios from 'axios';

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
  return date.toLocaleDateString('en-IN', options); // Format date as DD-MM-YYYY
}

function ProductReviews({ productId }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/product/${productId}/reviews/`);
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, [productId]);

  return (
    <div>
      <h3>Reviews</h3>
      {reviews.map(review => (
        <Card key={review._id} className="my-3 p-3 rounded">
          <Card.Body>
            <Card.Title>{review.name}</Card.Title>
            <Card.Text>Rating: {review.rating}</Card.Text>
            <Card.Text>Comment: {review.comment}</Card.Text>
            <Card.Text>{formatDate(review.createdAt)}</Card.Text>
          </Card.Body>
        </Card>
      ))}
      {reviews.length === 0 && <p>No reviews found.</p>}
    </div>
  );
}

export default ProductReviews;
