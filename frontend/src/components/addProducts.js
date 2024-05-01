import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const AddProductForm = () => {
  const initialFormData = {
    name: '',
    image: null,
    brand: '',
    category: '',
    description: '',
    price: '',
    countInStock: '',
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const isFormValid = () => {
    return (
      formData.name.trim() !== '' &&
      formData.brand.trim() !== '' &&
      formData.category.trim() !== '' &&
      formData.description.trim() !== '' &&
      formData.price.trim() !== '' &&
      formData.countInStock.trim() !== '' &&
      formData.image !== null
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      alert('Please fill in all the fields.');
      return;
    }
    const data = new FormData();
    for (let key in formData) {
      data.append(key, formData[key]);
    }
    try {
      const response = await axios.post('/api/createproducts/', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
      console.log(response);
      setFormData(initialFormData); // Reset form fields to initial state
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className="text-center mb-4">Add Product</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="name">
              <Form.Label>Name:</Form.Label>
              <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="image">
              <Form.Label>Image:</Form.Label>
              <Form.Control type="file" name="image" onChange={handleImageChange} />
            </Form.Group>

            <Form.Group controlId="brand">
              <Form.Label>Brand:</Form.Label>
              <Form.Control type="text" name="brand" value={formData.brand} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="category">
              <Form.Label>Category:</Form.Label>
              <Form.Control type="text" name="category" value={formData.category} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="description">
              <Form.Label>Description:</Form.Label>
              <Form.Control as="textarea" name="description" value={formData.description} onChange={handleChange} rows={3} />
            </Form.Group>

            <Form.Group controlId="price">
              <Form.Label>Price:</Form.Label>
              <Form.Control type="text" name="price" value={formData.price} onChange={handleChange} />
            </Form.Group>

            <Form.Group controlId="countInStock">
              <Form.Label>Count in Stock:</Form.Label>
              <Form.Control type="text" name="countInStock" value={formData.countInStock} onChange={handleChange} />
            </Form.Group>

            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={!isFormValid()}>
                Add Product
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default AddProductForm;
