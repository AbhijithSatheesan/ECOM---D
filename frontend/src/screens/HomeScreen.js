// src/components/HomeScreen.js (updated)
import React, { useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../actions/productsActions';
import Product from '../components/Product';

function HomeScreen() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts()); // Dispatch the thunk to fetch products
  }, [dispatch]);

  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);

  return (
    <div>
      {loading && <h4>Loading Products...</h4>}
      {error && <h4>Error fetching products: {error.message}</h4>}
      {products.length > 0 && (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col> ))}
        </Row>
        )}
    </div>
  );
          }
export default HomeScreen;
