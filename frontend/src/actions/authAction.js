import axios from 'axios';

export const register = (userData) => async (dispatch) => {
  dispatch({ type: 'USER_REGISTER_REQUEST' });

  try {
    const response = await axios.post('/api/register', userData);

    dispatch({ type: 'USER_REGISTER_SUCCESS', payload: response.data });
    
    // Redirect to the home page after successful registration
    window.location.href = '/login';
  } catch (error) {
    dispatch({ type: 'USER_REGISTER_FAIL', payload: error.response.data });
  }
};
