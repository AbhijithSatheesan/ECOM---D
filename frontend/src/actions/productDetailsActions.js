import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const getProductDetails = createAsyncThunk(
  'products/getProductDetails',
  async (productId) => {
    const { data } = await axios.get(`/api/products/${productId}`);
    console.log(productId)
    return data;
  }
);
