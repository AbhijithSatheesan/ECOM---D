import axios from "axios";
import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async () => {
        const { data } = await axios.get('/api/products');
        return data;
    }
)