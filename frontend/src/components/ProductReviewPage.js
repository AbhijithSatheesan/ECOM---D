import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import ProductReviews from './ProductReview';

function ProductReviewsPage() {
  const { id } = useParams();
  const [productId, setProductId] = useState(null);

  useEffect(() => {
    // Fetch the product ID based on the route parameter
    setProductId(id);
  }, [id]);

  return (
    <Container>
      <h2>Product Reviews</h2>
      {productId && <ProductReviews productId={productId} />}
    </Container>
  );
}

export default ProductReviewsPage;