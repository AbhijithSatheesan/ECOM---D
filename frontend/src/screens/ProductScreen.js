import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { getProductDetails } from '../actions/productDetailsActions';
import { Row, Col, Image, Card, Button } from 'react-bootstrap';
import Rating from '../components/Rating';
import Cart from '../components/Cart';
import ProductReviews from '../components/ProductReview'; // Import ProductReviews component

const mapStateToProps = (state) => ({
  product: state.productDetails.product,
  loading: state.productDetails.loading,
  error: state.productDetails.error,
});

const ProductScreen = (props) => {
  const { id } = useParams();
  const { product, loading, error, dispatch } = props;
  const [showReviews, setShowReviews] = useState(false); // State to toggle reviews visibility

  useEffect(() => {
    dispatch(getProductDetails(id));
  }, [dispatch, id]);

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Home
      </Link>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : product ? (
        <Row>
          <Col md={6}>
            {/* Apply inline styles for fixed image size */}
            <Image src={product.image} alt={product.name} style={{ width: '100%', height: '400px', objectFit: 'contain' }} />
          </Col>
          <Col md={6}>
            <Card.Title as="div">
              <strong>{product.name}</strong>
              <br />
              <small>Product ID: {product._id}</small>
            </Card.Title>
            <Card.Text>{product.description}</Card.Text>
            <Card.Text>Price: ₹{product.price}</Card.Text>
            <Card.Text as="div">
              <div className="my-3">
                {product.rating} from {product.numReviews} reviews
              </div>
            </Card.Text>
            <Card.Text as="div">
              <div className="my-3">
                <Rating value={product.rating} text={`${product.numReviews} reviews`} color="#f8e825" />
              </div>
            </Card.Text>
            <Card.Text>Count In Stock: {product.countInStock}</Card.Text>
          </Col>
          {/* Pass productId as prop to Cart component */}
          <Cart
            productId={product._id}
            countInStock={product.countInStock}
            productPrice={product.price}
          />
        </Row>
      ) : null}

      {/* Button to toggle reviews visibility */}
      <Button onClick={() => setShowReviews(!showReviews)}>
        {showReviews ? 'Hide Reviews' : 'See Reviews'}
      </Button>

      {/* Render ProductReviews component if showReviews is true */}
      {showReviews && <ProductReviews productId={id} />}
    </div>
  );
};

export default connect(mapStateToProps)(ProductScreen);
