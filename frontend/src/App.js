import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // use HashRouter only after merging
import { useSelector } from 'react-redux';

import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import RegistrationForm from './components/registrationForm';
import LoginComponent from './components/Login';
import LogoutComponent from './components/Logout';
import UserCartItems from './components/userCartItems';
import OrderPage from './screens/orderScreen';
import UserOrders from './components/userOrders';
import AdminPage from './components/AdminPage';
import UsersList from './components/Users';
import AddProductForm from './components/addProducts';
import ProductEditDelete from './components/ProductsAdmin';
import AdminOrder from './components/AdminOrder';
import AdminDelivered from './components/AdminDelivered';
import UserDelivered from './components/userDelivered';
import ProductReviews from './components/ProductReview';
import ProductReviewsPage from './components/ProductReviewPage';

import SearchPage from './screens/SearchScreen';




const NotMatch = () => {
  return (
    <div>
      <h1>URL does not match</h1>
      <p>Please check the URL or contact the administrator.</p>
    </div>
  );
};

function App() {
  const isAuthenticated = useSelector(state => state.login_logout.isAuthenticated);
  const isAdmin = useSelector(state => state.login_logout.is_admin);

  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<HomeScreen />} exact />
            <Route path='/product/:id' element={<ProductScreen />} />
            <Route path='/product/review' element={<ProductReviews />} />
            <Route path="/product/:id/reviews" component={ProductReviewsPage} />
            <Route path="/search" element={<SearchPage />} />
            

            {!isAuthenticated && <Route path='/register' element={<RegistrationForm />} />}
            {!isAuthenticated && <Route path='/login' element={<LoginComponent />} />}
            {isAuthenticated && <Route path='/logout' element={<LogoutComponent />} />}
            <Route path='/cart' element={<UserCartItems />} />
            <Route path='/order/:cartItemId' element={<OrderPage />} />
            <Route path='/myorders' element={<UserOrders />} />
            <Route path='/delivered' element={<UserDelivered />} />
           

            {/* Only render the AdminPage and UsersList if the user is authenticated and is an admin */}
            {isAuthenticated && isAdmin && (
              <>
                <Route path='/admin' element={<AdminPage />} />
                <Route path='/admin/users' element={<UsersList />} />
                <Route path='/admin/addproducts' element={<AddProductForm />} />
                <Route path='/admin/products' element={<ProductEditDelete/>} />
                <Route path='/admin/orders' element={<AdminOrder/>} />
                <Route path='/admin/delivered' element={<AdminDelivered/>} />
              </>
            )}

            {/* Render NotMatch component when the URL does not match */}
            {!isAuthenticated || !isAdmin ? (
              <Route path='*' element={<HomeScreen />} />
            ) : null}
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
