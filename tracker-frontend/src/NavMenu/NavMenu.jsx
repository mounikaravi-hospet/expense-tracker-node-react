import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

const NavMenu = () => {
  const { auth, logout, loading } = useAuth();
  if (loading) {
    return null;
  }

  return (
    <div>
      <Navbar expand="lg" className="p-2" bg="success" data-bs-theme="dark">
        <Navbar.Brand as={Link} to="/dashboard">
          SpendifEye
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        {auth && (
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/dashboard">
                Dashboard
              </Nav.Link>
            </Nav>

            <Nav className="ms-auto align-items-center">
              <Navbar.Text className="me-2">Signed in as:</Navbar.Text>
              <Nav.Link as={Link} to="/edit-profile" className="p-0">
                {auth.name}
              </Nav.Link>
              <Nav.Link as={Link} to="/" onClick={logout} className="ms-2">
                Logout
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        )}
      </Navbar>
    </div>
  );
};

export default NavMenu;
