import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart, removeFromCart, updateQuantity } from '../actions/cartAction';

const Cart = ({ productId, countInStock, productPrice }) => {
  const cart = useSelector((state) => state.cart.cart);
  const dispatch = useDispatch();
  const [isSaved, setIsSaved] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart({ productId, countInStock, productPrice }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    // Calculate the total price based on the new quantity
    const totalPrice = getTotalPrice(productPrice, quantity);
    // Ensure quantity is not higher than countInStock
    if (quantity > countInStock) {
      quantity = countInStock;
    }
    // Dispatch the updateQuantity action with the productId, quantity, and total price
    dispatch(updateQuantity(productId, quantity, totalPrice));
  };

  const getTotalPrice = (price, quantity) => {
    return (price * quantity).toFixed(2); // Calculate total price with 2 decimal places
  };

  // Get the current logged-in user from the Redux state
  const currentUser = useSelector(state => state.login_logout.user_id);

  // Frontend code to save cart items to backend
  const saveCartItemsToBackend = async (cartItems) => {
    try {
      // Iterate over each cart item
      for (const item of cartItems) {
        const dataToSend = {
          user: currentUser,
          product: item.product.productId,
          quantity: item.quantity,
          total_price: getTotalPrice(productPrice, item.quantity),
        };

        console.log(dataToSend);

        // Send each cart item individually
        const response = await fetch('/api/save_cart_items/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
        console.log(response);

        if (!response.ok) {
          throw new Error('Failed to save cart items');
        }
        console.log(response);
        const data = await response.json();
        console.log('Cart item saved successfully:', data);
      }
      setIsSaved(true); // Set isSaved to true after successful save
      // Reset isSaved after 2 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 2000);
    } catch (error) {
      console.error('Error saving cart items:', error.message);
    }
  };

  // Function to handle saving cart items
  const handleSaveCartItems = async () => {
    try {
      await saveCartItemsToBackend(cart);
      // Delay removing items from frontend state by 500 milliseconds
      setTimeout(() => {
        cart.forEach((item) => handleRemoveItem(item.id));
      }, 8);
    } catch (error) {
      console.error('Error saving cart items:', error.message);
    }
  };

  const cartItems = cart.map((item) => (
    <div key={item.id}>
      {/* Display item details */}
      <button
        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
        disabled={item.quantity === 1}
      >
        -
      </button>
      <input
        type="number"
        value={item.quantity}
        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
        min="1" // Set minimum quantity to 1
        max={countInStock} // Set maximum quantity to countInStock
      />
      <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
        +
      </button>
      <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
      {/* Display total price */}
      <p>Total Price: ₹{getTotalPrice(productPrice, item.quantity)}</p>
    </div>
  ));

  // Render message to login if user is not authenticated
  if (!currentUser) {
    return (
      <div>
        <h2>Add to cart</h2>
        <p>Login to add items to cart</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Add to cart</h2>
      {/* Button to add product to cart */}
      <button onClick={handleAddToCart}>select quantity</button>
      {/* Conditionally render Save button */}
      {cartItems.length > 0 && (
        <button onClick={handleSaveCartItems}>Save to Cart</button>
      )}
      {cartItems.length > 0 ? (
        cartItems
      ) : (
        <p>Add new items.</p>
      )}
      {/* Conditionally render the message */}
      {isSaved && <p>Item saved to cart successfully</p>}
    </div>
  );
};

export default Cart;
