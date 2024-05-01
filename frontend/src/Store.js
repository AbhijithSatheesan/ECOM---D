import { configureStore } from '@reduxjs/toolkit';

import productsSlice from './reducers/productsSlice'; // Import your reducer
import productsDetailsSlice from './reducers/productsDetailsSlice';
import authReducer from './reducers/authReducer';
import loginReducer from './reducers/loginReducer';
import cartReducer from './reducers/cartReducer';
import userCartReducer from './reducers/userCartReducer';



const store = configureStore({
  reducer: {
    products: productsSlice, // added the product reducerr
    productDetails: productsDetailsSlice,
    auth: authReducer,
    login_logout: loginReducer,
    cart: cartReducer,
    user_cart: userCartReducer,
  }
})





// const usernameFromStorage = localStorage.getItem('username');
// const emailFromStorage = localStorage.getItem('email');
const payloadFromStorage = localStorage.getItem('payload');

const initialState = {
  payload: payloadFromStorage ? JSON.parse(payloadFromStorage) : null,
};



export default store;



