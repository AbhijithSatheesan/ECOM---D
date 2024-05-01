const initialState = {
    isAuthenticated: false,
    user: null,
    User_Id: null,
    token: null,
    email: null,
    cartItems: [], 
    accessToken: null,
    loading: false,
    error: null,
};

const loadInitialState = () => {
    const storedState = localStorage.getItem('authState');
    return storedState ? JSON.parse(storedState) : initialState;
};

const loginReducer = (state = loadInitialState(), action) => {
    switch (action.type) {
        case 'LOGIN_SUCCESS':
            case 'LOGIN_SUCCESS':
    localStorage.setItem('authState', JSON.stringify({
        ...state,
        isAuthenticated: true,
        user: action.payload.username,
        user_id: action.payload.User_Id,
        email: action.payload.email,
        token: action.payload.accessToken,
        is_admin: action.payload.is_admin,
        cartItems: action.payload.cart_items, // Assuming cartItems are present in the payload
        loading: false,
        error: null,
    }));
    return {
        ...state,
        isAuthenticated: true,
        user: action.payload.username,
        user_id: action.payload.User_Id,
        email: action.payload.email,
        token: action.payload.accessToken,
        is_admin:action.payload.is_admin,
        cartItems: action.payload.cart_items, // Update cartItems in the state
        loading: false,
        error: null,
    };

            return {
                ...state,
                isAuthenticated: false,
                token: null,
                loading: false,
                error: action.payload,
            };
        case 'LOGOUT':
            localStorage.removeItem('authState');
            return initialState;
        default:
            return state;
    }
};

export default loginReducer;
