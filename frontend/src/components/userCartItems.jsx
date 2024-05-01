import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '../actions/userCartAction'; // Assuming you have an action to set cart items
import { Card, Col, Image, Button } from 'react-bootstrap';

const UserCartItems = () => {
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});
  const user_id = useSelector(state => state.login_logout.user_id);
  const cartItems = useSelector(state => state.user_cart.cartItems) || []; // Provide default value if cartItems is undefined
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await fetch(`/api/user_cart_items?user_id=${user_id}`);
        if (response.ok) {
          const data = await response.json();
          dispatch(setCartItems(data)); // Dispatch action to set cart items
          setLoading(false);
        } else {
          console.error('Failed to fetch cart items:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, [user_id, dispatch]);

  useEffect(() => {
    const fetchProductDetails = async () => {
      const promises = cartItems.map(item =>
        fetch(`/api/products/${item.product}`)
          .then(response => response.json())
          .then(productData => ({ ...item, productData }))
          .catch(error => {
            console.error(`Failed to fetch product details for product ID ${item.product}:`, error);
            return null;
          })
      );

      const updatedCartItems = await Promise.all(promises);
      const productDetailsMap = {};
      updatedCartItems.forEach(item => {
        if (item) {
          productDetailsMap[item.product] = item.productData;
        }
      });
      setProductDetails(productDetailsMap);
    };

    if (cartItems.length > 0) {
      fetchProductDetails();
    }
  }, [cartItems]);

  const removeCartItem = async (cartItemId) => {
    const cartItem = cartItems.find(item => item.id === cartItemId);
    if (!cartItem) {
      console.error('Cart item not found.');
      return;
    }
    console.log("Removing cart item with ID:", cartItemId);
    try {
      const response = await fetch(`/api/remove_cart_item/${cartItemId}/`, {
        method: 'POST', // Already set to POST
        headers: {
          'Content-Type': 'application/json' // Set content type for JSON data
        },
        body: JSON.stringify({ id: cartItemId }) // Send only the ID in JSON format
      });
  
      console.log(response);
  
      if (response.ok) {
        // Remove the item from the local state
        const updatedCartItems = cartItems.filter(item => item.id !== cartItemId);
        dispatch(setCartItems(updatedCartItems));
      } else {
        console.error('Failed to remove cart item:', response.statusText);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  // Filter out cart items with order_placed = true
  const filteredCartItems = cartItems.filter(item => !item.order_placed);

  return (
    <div>
      <h2>User Cart Items</h2>
      {loading ? (
        <p>Loading...</p>
      ) : filteredCartItems.length > 0 ? (
        <div>
          {filteredCartItems.map(item => (
            <Card key={item.product} className='my-3 p-3 rounded'>
              <Col md={3}>
                <Link to={`/product/${item.product}`}>
                  <Image src={productDetails[item.product]?.image} alt={productDetails[item.product]?.name} fluid />
                </Link>
              </Col>
              <Col md={6}>
                <Card.Body>
                  <Card.Title as='div'>
                    <strong>{productDetails[item.product]?.name}</strong>
                  </Card.Title>
                  <Card.Text as='div'>
                    <p>Product ID: {item.product}</p>
                    <p>Count In Stock: {productDetails[item.product]?.countInStock}</p>
                    <p>Price: ₹{productDetails[item.product]?.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Total Price: ₹{item.total_price}</p>
                    <p>Is Paid: {item.is_paid ? 'Yes' : 'No'}</p>
                    {item.quantity <= productDetails[item.product]?.countInStock ? (
                      <Link to={`/order/${item.id}`}>
                        <Button variant="primary">Order Item</Button>
                      </Link>
                    ) : (
                      <p style={{ color: 'red' }}>Sorry!! Insufficient items in stock, the option to order will be availabe</p>
                    )}
                    <Button variant="danger" onClick={() => removeCartItem(item.id, item.product)}>Remove</Button>
                  </Card.Text>
                </Card.Body>
              </Col>
            </Card>
          ))}
        </div>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default UserCartItems;




// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { setCartItems } from '../actions/userCartAction'; // Assuming you have an action to set cart items
// import { Card, Col, Image, Button } from 'react-bootstrap';

// const UserCartItems = () => {
//   const [loading, setLoading] = useState(true);
//   const [productDetails, setProductDetails] = useState({});
//   const user_id = useSelector(state => state.login_logout.user_id);
//   const cartItems = useSelector(state => state.user_cart.cartItems) || []; // Provide default value if cartItems is undefined
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const fetchCartItems = async () => {
//       try {
//         const response = await fetch(`/api/user_cart_items?user_id=${user_id}`);
//         if (response.ok) {
//           const data = await response.json();
//           dispatch(setCartItems(data)); // Dispatch action to set cart items
//           setLoading(false);
//         } else {
//           console.error('Failed to fetch cart items:', response.statusText);
//         }
//       } catch (error) {
//         console.error('Error fetching cart items:', error);
//       }
//     };

//     fetchCartItems();
//   }, [user_id, dispatch]);

//   useEffect(() => {
//     const fetchProductDetails = async () => {
//       const promises = cartItems.map(item =>
//         fetch(`/api/products/${item.product}`)
//           .then(response => response.json())
//           .then(productData => ({ ...item, productData }))
//           .catch(error => {
//             console.error(`Failed to fetch product details for product ID ${item.product}:`, error);
//             return null;
//           })
//       );

//       const updatedCartItems = await Promise.all(promises);
//       const productDetailsMap = {};
//       updatedCartItems.forEach(item => {
//         if (item) {
//           productDetailsMap[item.product] = item.productData;
//         }
//       });
//       setProductDetails(productDetailsMap);
//     };

//     if (cartItems.length > 0) {
//       fetchProductDetails();
//     }
//   }, [cartItems]);

  
//   const removeCartItem = async (cartItemId) => {
//     const cartItem = cartItems.find(item => item.id === cartItemId);
//     if (!cartItem) {
//       console.error('Cart item not found.');
//       return;
//     }
//     console.log("Removing cart item with ID:", cartItemId);
//     try {
//       const response = await fetch(`/api/remove_cart_item/${cartItemId}/`, {
//         method: 'POST', // Already set to POST
//         headers: {
//           'Content-Type': 'application/json' // Set content type for JSON data
//         },
//         body: JSON.stringify({ id: cartItemId }) // Send only the ID in JSON format
//       });
  
//       console.log(response);
  
//       if (response.ok) {
//         // Remove the item from the local state
//         const updatedCartItems = cartItems.filter(item => item.id !== cartItemId);
//         dispatch(setCartItems(updatedCartItems));
//       } else {
//         console.error('Failed to remove cart item:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error removing cart item:', error);
//     }
//   };
  


//   return (
//     <div>
//       <h2>User Cart Items</h2>
//       {loading ? (
//         <p>Loading...</p>
//       ) : cartItems.length > 0 ? (
//         <div>
//           {cartItems.map(item => (
//             <Card key={item.product} className='my-3 p-3 rounded'>
//               <Col md={3}>
//                 <Link to={`/product/${item.product}`}>
//                   <Image src={productDetails[item.product]?.image} alt={productDetails[item.product]?.name} fluid />
//                 </Link>
//               </Col>
//               <Col md={6}>
//                 <Card.Body>
//                   <Card.Title as='div'>
//                     <strong>{productDetails[item.product]?.name}</strong>
//                   </Card.Title>
//                   <Card.Text as='div'>
//                     <p>Product ID: {item.product}</p>
//                     <p>Count In Stock: {productDetails[item.product]?.countInStock}</p>
//                     <p>Price: ₹{productDetails[item.product]?.price}</p>
//                     <p>Quantity: {item.quantity}</p>
//                     <p>Total Price: ₹{item.total_price}</p>
//                     <p>Is Paid: {item.is_paid ? 'Yes' : 'No'}</p>
//                     <Button variant="danger" onClick={() => removeCartItem(item.id, item.product)}>Remove</Button>
//                   </Card.Text>
//                 </Card.Body>
//               </Col>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <p>Your cart is empty.</p>
//       )}
//     </div>
//   );
// };

// export default UserCartItems;
