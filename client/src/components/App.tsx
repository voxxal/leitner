import React from "react";
import {
  Link,
  Switch,
  Route,
  Redirect,
  BrowserRouter as Router,
} from "react-router-dom";
import SignUp from "./SignUp";
import Login from "./Login";
import Search from "./Search";
import Navbar from "./Navbar";
import MainPage from "./MainPage";
import Card from "./Card";
import ActiveLevels from "./ActiveLevels";
import CardManagerList from "./CardManagerList";
import api from "./../api";
export const App = () => {
  const a = async () =>
    console.log(await api.get("/v1/cards"));
  a()
  return (
    <Router>
      <Navbar />
      <Switch>
        <Route exact path="/" component={MainPage} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/dash">
          <ActiveLevels/>
          <Card></Card>
          <CardManagerList/>
        </Route>
        <Redirect to="/" />
      </Switch>
    </Router>
  );
};
