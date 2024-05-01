import React from 'react';
import { useSelector } from 'react-redux';
import { Container, Nav, Navbar, Dropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import SearchComponent from './SearchComponent';

function Header() {
  const isAuthenticated = useSelector(state => state.login_logout.isAuthenticated);
  const user = useSelector(state => state.login_logout.user);
  const isAdmin = useSelector(state => state.login_logout.is_admin);

  return (
    <header>
      <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <Navbar.Brand href="/">MYSHOP </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to="/">
                <Nav.Link><i className="fas fa-home"></i>Home</Nav.Link>
              </LinkContainer>
              {isAuthenticated && (
                <>
                  <LinkContainer to="/cart">
                    <Nav.Link><i className="fas fa-shopping-cart"></i>Cart</Nav.Link>
                  </LinkContainer>
                  <Dropdown>
                    <Dropdown.Toggle variant="link" id="dropdown-basic" className="text-white">
                      <i className="fas fa-user"></i>{user}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <LinkContainer to="/logout">
                        <Dropdown.Item><i className="fas fa-sign-out-alt"></i>Logout</Dropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/myorders">
                        <Dropdown.Item><i className="fas fa-shopping-cart"></i>Your Orders</Dropdown.Item>
                      </LinkContainer>
                      {isAdmin && (
                        <LinkContainer to="/admin">
                          <Dropdown.Item><i className="fas fa-user-cog"></i>Admin</Dropdown.Item>
                        </LinkContainer>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </>
              )}
              {!isAuthenticated && (
                <LinkContainer to="/login">
                  <Nav.Link><i className="fas fa-user"></i>Login</Nav.Link>
                </LinkContainer>
              )}
              <LinkContainer to="/search">
                <Nav.Link><i className="fas fa-search"></i>Search</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}

export default Header;
