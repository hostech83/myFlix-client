import { useState, useEffect } from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./navigation-bar.scss"; // Optional: For additional styles

export const NavigationBar = ({ user, onLogout }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <Navbar
        bg="light"
        expand="lg"
        expanded={expanded}
        className="navigation-bar"
      >
        <Navbar.Brand as={Link} to="/" onClick={() => setExpanded(false)}>
          MyFlix App
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="navbar-nav"
          onClick={() => setExpanded(expanded ? false : "expanded")}
        />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            {!user ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/login"
                  onClick={() => setExpanded(false)}
                >
                  Login
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/signup"
                  onClick={() => setExpanded(false)}
                >
                  Signup
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/profile"
                  onClick={() => setExpanded(false)}
                >
                  Profile
                </Nav.Link>
                <Nav.Link
                  onClick={() => {
                    onLogout();
                    setExpanded(false);
                  }}
                >
                  Logout
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div style={{ marginTop: "2px" }}>
        {" "}
        {/* Added margin-top */}
        {/* This will be the main content where MovieCard and other components will go */}
      </div>
    </>
  );
};
