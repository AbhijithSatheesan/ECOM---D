import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductsAdmin = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = async (productId, newData) => {
    try {
      console.log('Data to be sent to backend:', newData);
      await axios.put(`/api/editproduct/${productId}`, newData);
      console.log('Product updated successfully');
      setProducts(products.map((p) => (p._id === productId ? { ...p, ...newData } : p)));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`/api/editproduct/${productId}`);
      console.log('Product deleted successfully');
      setProducts(products.filter(product => product._id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = (productId, newData) => {
    handleEditProduct(productId, newData);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Products Admin</h1>
      <div className="product-list">
        {products.map((product) => (
          <div
            key={product._id}
            className="product"
            style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center' }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '200px', height: '200px', objectFit: 'contain', marginRight: '20px' }}
            />
            <div>
              <h2>{product.name}</h2>
              <p>
                Count Left in Stock:
                <input
                  type="number"
                  value={product.countInStock}
                  onChange={(e) => {
                    const newCount = parseInt(e.target.value);
                    setProducts(products.map((p) => (p._id === product._id ? { ...p, countInStock: newCount } : p)));
                  }}
                />
              </p>
              <p>
                Price: ₹
                <input
                  type="number"
                  value={product.price}
                  onChange={(e) => {
                    const newPrice = parseFloat(e.target.value);
                    setProducts(products.map((p) => (p._id === product._id ? { ...p, price: newPrice } : p)));
                  }}
                />
              </p>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <button
                  onClick={() => handleSubmit(product._id, { id: product._id, countInStock: product.countInStock, price: product.price })}
                  style={{ marginRight: '10px', backgroundColor: 'blue', color: 'white', border:'none' }}
                >
                  Submit
                </button>
                <button onClick={() => handleDeleteProduct(product._id)} style={{ backgroundColor: 'red', color: 'white', border: 'none' }}>Delete Product</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsAdmin;
