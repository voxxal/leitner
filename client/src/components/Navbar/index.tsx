import React from "react";
import { Navbar, Button, Container, Box } from "react-bulma-components";
import { Link } from "react-router-dom";
import isLoggedIn from "util/isLoggedIn";
import SignedIn from "./SignedIn";
import SignedOut from "./SignedOut";
export default ({ loggedIn }: { loggedIn: boolean }) => {
  return loggedIn ? <SignedIn /> : <SignedOut />;
};
