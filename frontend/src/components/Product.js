import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import Rating from './Rating';


function Product({ product }) {
  return (
    <div>
     
      <Card className='my-3 p-3 rounded'>
        <Link to={`/product/${product._id}`}>
          {/* Apply inline styles for fixed image size */}
          <Card.Img src={product.image} style={{ width: '100%', height: '200px', objectFit: 'contain' }} />
        </Link>
      </Card>

      <Card.Body className='my-3 p-3 rounded'>
        <Link to={`/product/${product._id}`}>
          <Card.Title as='div'>
            <strong>{product.name} </strong>
          </Card.Title>
        </Link>
        <Card.Text as='div'>
          <div className='my-3'>
            {product.rating} from {product.numReviews} reviews
          </div>
        </Card.Text>

        <Card.Text as="div">
          <div className='my-3'>
            <Rating value={product.rating} text={`${product.numReviews} reviews`} color='#f8e825' />
          </div>
        </Card.Text>

        <Card.Text as="h3">
          ₹{product.price}
        </Card.Text>
      </Card.Body>
    </div>
  );
}

export default Product;
