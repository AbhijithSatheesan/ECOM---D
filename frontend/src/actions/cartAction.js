export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

export const addToCart = (product, productId, Price) => ({
  type: ADD_TO_CART,
  payload: { product, productId, Price }, // Include total price in the payload
});


export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});



export const updateQuantity = (productId, quantity, totalPrice) => ({
  type: UPDATE_QUANTITY,
  payload: { productId, quantity, totalPrice },
});
