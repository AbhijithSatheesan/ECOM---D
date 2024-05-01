import { createReducer } from '@reduxjs/toolkit';
import { ADD_TO_CART, REMOVE_FROM_CART, UPDATE_QUANTITY } from '../actions/cartAction';

const initialState = {
  cart: [],
};

const cartReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(ADD_TO_CART, (state, action) => {
      const existingItem = state.cart.find((item) => item.productId === action.payload.productId);
      if (existingItem) {
        existingItem.quantity++; // No need for quantity check here
      } else {
        state.cart.push({ ...action.payload, quantity: 1 }); // Ensure quantity is always 1 for new items
      }
    })
    .addCase(REMOVE_FROM_CART, (state, action) => {
      state.cart = state.cart.filter((item) => item.productId !== action.payload);
    })
    .addCase(UPDATE_QUANTITY, (state, action) => {
      const item = state.cart.find((item) => item.productId === action.payload.productId);
      if (item) {
        // Enforce non-negative quantity
        item.quantity = Math.max(0, action.payload.quantity);
        // Also update other properties if needed
        // For example, if the payload contains other fields like price, update them as well
        item.price = action.payload.price;
        // Update other fields as needed
      }
    });
});

export default cartReducer;
