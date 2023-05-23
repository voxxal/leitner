import React from "react";
import { Navbar, Button, Container, Box } from "react-bulma-components";
import { Link } from "react-router-dom";
export default () => {
  return (
    <Navbar fixed="top" className="has-shadow">
      <Container>
        <Navbar.Brand>
          <Navbar.Item renderAs={Link} to="/">
            <img
              alt="Bulma: a modern CSS framework based on Flexbox"
              height="28"
              src="https://bulma.io/images/bulma-logo.png"
              width="112"
            />
          </Navbar.Item>
          <Navbar.Burger />
        </Navbar.Brand>
        <Navbar.Menu>
          <Navbar.Container align="left">
            <Navbar.Item renderAs={Link} to="/">
              Home
            </Navbar.Item>
            <Navbar.Item renderAs={Link} to="/search">
              Search
            </Navbar.Item>
          </Navbar.Container>
          <Navbar.Container align="right">
            <Button.Group>
              <Button color="sapphire" renderAs={Link} to="/signup">
                Sign Up
              </Button>
              <Button color="seaweed" renderAs={Link} to="/login">
                Login
              </Button>
            </Button.Group>
          </Navbar.Container>
        </Navbar.Menu>
      </Container>
    </Navbar>
  );
};
