import axios from 'axios';

export const login = (username, password) => async (dispatch) => {
  try {
    const csrftoken = getCsrfToken(); // Function to retrieve CSRF token (explained below)
    const response = await axios.post('/api/login', { username, password }, {
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrftoken, // Include CSRF token in header
      },
    });

    // Extract access token from the response and dispatch it along with other data
    const { access } = response.data;
    dispatch({ type: 'LOGIN_SUCCESS', payload: { ...response.data, accessToken: access, username} });
    window.location.href = '/';
  } catch (error) {
    dispatch({ type: 'LOGIN_FAIL', payload: error.response.data.message });
  }
};

export const logout = () => async (dispatch) => {
  try {
    await axios.post('/api/logout');
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.error(error);
  }
};

// Function to retrieve CSRF token (implementation details may vary)
function getCsrfToken() {
  // Option 1: Retrieve from cookie (if Django stores it there)
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].trim().split('=');
    if (key === 'csrftoken') {
      return value;
    }
  }
  // Option 2: Retrieve from hidden form field (if provided by Django template tag)
  const csrfTokenInput = document.querySelector('input[name="csrfmiddlewaretoken"]');
  if (csrfTokenInput) {
    return csrfTokenInput.value;
  }
  throw new Error('CSRF token not found'); // Handle missing token error
}











// // Optional: Fetch user data
// export const getUserData = () => async (dispatch, getState) => {
//     const token = getState().auth.token;
//     const config = { headers: { Authorization: `Token ${token}` } };
//     try {
//         const response = await axios.get('/api/user/', config);
//         dispatch({ type: 'GET_USER_DATA', payload: response.data });
//     } catch (error) {
//         console.error(error);
//     }
// };
