import api from "../api";
import React from "react";
import { SHA3 } from "crypto-js";
import { AxiosResponse } from "axios";
import {
  Form,
  Icon,
  Button,
  Box,
  Columns,
} from "react-bulma-components";
import "@fortawesome/fontawesome-free/css/all.css";
import resultClass from "../util/resultClass";
import { V1Result } from "common";
import Message from "./Message";
import isLoggedIn from "../util/isLoggedIn";
import { Redirect } from "react-router-dom";
export default () => {
  const [loggedIn, setLoggedIn] = React.useState(false);
  const mountedRef = React.useRef(true)

  React.useEffect( () => {
    const login = async () =>
      setLoggedIn(await isLoggedIn());

    login();
  })
  const [result, setResult] = React.useState<V1Result>({ status: "pending" });
  const [info, setInfo] = React.useState({
    username: "",
    password: "",
  });
  const handleChange = (event: React.FormEvent) => {
    setInfo({
      ...info,
      [(event.target as HTMLInputElement).name]: (
        event.target as HTMLInputElement
      ).value,
    });
  };
  const onSubmit = async (event: React.FormEvent) => {
    let passwordHash = SHA3(info.password).toString();
    await api
      .post(`/v1/login`, {
        username: info.username,
        passwordHash,
      })
      .then((response: AxiosResponse) => setResult(response.data));
  };
  console.log(loggedIn);
  return (
    <Columns.Column className="is-one-third is-offset-one-third">
      <Box>
        <Form.Field>
          <Form.Label>Username</Form.Label>
          <Form.Control>
            <Form.Input
              className={`${resultClass(result)}`}
              placeholder="Username"
              name="username"
              onChange={handleChange}
              required
            />
            <Icon align="left">
              <i className="fas fa-user" />
            </Icon>
          </Form.Control>
        </Form.Field>
        <Form.Field>
          <Form.Label>Password</Form.Label>
          <Form.Control>
            <Form.Input
              className={`${resultClass(result)}`}
              placeholder="Password"
              name="password"
              type="password"
              onChange={handleChange}
              required
            />
            <Icon align="left">
              <i className="fas fa-lock" />
            </Icon>
          </Form.Control>
        </Form.Field>
        {/* Forgot Password? */}
        <Button fullwidth color="primary" onClick={onSubmit} textWeight="bold">
          Login
        </Button>
        <Message failure hidden={!(result.reason === "login_was_wrong")}>
          The username or password was incorrect.
        </Message>
        <Message success hidden={!(result.status === "success")}>
          Success! You are now logged in.
        </Message>
      </Box>
      {loggedIn ? <Redirect to="/dash" /> : ""}
    </Columns.Column>
  );
};
