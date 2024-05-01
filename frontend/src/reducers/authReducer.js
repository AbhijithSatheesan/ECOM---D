import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  userInfo: null,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    USER_REGISTER_REQUEST: (state) => {
      state.loading = true;
    },
    USER_REGISTER_SUCCESS: (state, action) => {
      state.loading = false;
      state.userInfo = action.payload;
    },
    USER_REGISTER_FAIL: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export default authSlice.reducer;
