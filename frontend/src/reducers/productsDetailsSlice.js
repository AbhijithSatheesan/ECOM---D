import { createSlice } from '@reduxjs/toolkit';
import { getProductDetails } from '../actions/productDetailsActions';

const initialState = {
  product: null,
  loading: false,
  error: null,
};

export const productDetailsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default productDetailsSlice.reducer;


// actions and reducers are done, do next step