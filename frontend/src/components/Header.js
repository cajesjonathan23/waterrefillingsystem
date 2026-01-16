import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Header = ({ isAdmin }) => {
  const savedHistory = JSON.parse(localStorage.getItem('myOrderHistory') || "[]");
  const lastId = savedHistory.length > 0 ? savedHistory[0].id : null;

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="shadow mb-4 sticky-top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">💧 AQUAFLOW</Navbar.Brand>
        <Nav className="ms-auto fw-bold">
          {!isAdmin ? (
            <>
              <Nav.Link as={Link} to="/"> <i className="bi bi-shop me-2"></i> Store</Nav.Link>
              <Nav.Link as={Link} to={lastId ? `/track?id=${lastId}` : "/track"}><i className="bi bi-geo-fill me-2"></i>Track Order</Nav.Link>
            </>
          ) : (
            <span className="badge bg-light text-dark px-3 py-2">ADMIN PANEL</span>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
};
export default Header;