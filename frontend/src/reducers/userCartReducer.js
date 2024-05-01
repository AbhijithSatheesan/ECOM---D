// userCartReducer.js

import {SET_CART_ITEMS} from '../actions/userCartAction';

const initialState = {
  cartItems: [],
};

const userCartReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
};

export default userCartReducer;
