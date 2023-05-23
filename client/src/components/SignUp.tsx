import api from "../api";
import "../styles/result.scss";
import React from "react";
import { SHA3 } from "crypto-js";
import { AxiosResponse } from "axios";
import { Box, Button, Columns, Form, Icon } from "react-bulma-components";
import { V1Result } from "common";
import Message from "./Message";
import resultClass from "../util/resultClass";
import isLoggedIn from "../util/isLoggedIn";
import { Redirect, useHistory } from "react-router-dom";
export default () => {
  const history = useHistory();
  const [tooken, setTooken] = React.useState(false);
  const [result, setResult] = React.useState<V1Result>({ status: "pending" });
  const [info, setInfo] = React.useState({
    username: "",
    password: "",
    confirm: "",
    email: "",
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
    if (info.password !== info.confirm) {
      return { status: "failure", reason: "passwords_do_not_match" };
    }
    let passwordHash = SHA3(info.password).toString();
    await api
      .post(`/v1/signup`, {
        username: info.username,
        passwordHash,
        email: info.email,
      })
      .then((response: AxiosResponse) => setResult(response.data));
  };
  const redirectToLogin = () => {
    setTimeout(() => history.push("/login"), 3000);
  };
  if (isLoggedIn()) return <Redirect to="/dash" />;
  return (
    <Columns.Column className="is-one-third is-offset-one-third is-vcentered">
      <Box>
        <Form.Field>
          {/* Make it check if the username is tooken */}
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
          {/* Check for name */}
          <Message hidden={!tooken}>
            That username is already tooken. Try another
          </Message>
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
        <Form.Field>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control>
            <Form.Input
              className={`${resultClass(result)}`}
              placeholder="Confirm Password"
              name="confirm"
              type="password"
              onChange={handleChange}
              required
            />
            <Icon align="left">
              <i className="fas fa-lock" />
            </Icon>
          </Form.Control>
        </Form.Field>
        <Form.Field>
          <Form.Label>Email (Optional)</Form.Label>
          <Form.Control>
            <Form.Input
              className={`${resultClass(result)}`}
              placeholder="Email (Optional)"
              name="email"
              onChange={handleChange}
            />
            <Icon align="left">
              <i className="fas fa-envelope" />
            </Icon>
          </Form.Control>
        </Form.Field>
        <Button fullwidth color="primary" onClick={onSubmit} textWeight="bold">
          Sign Up
        </Button>
        <Message failure hidden={!(result.reason === "name_conflict")}>
          That name is already tooken. Please choose another.
        </Message>
        <Message success hidden={!(result.status === "success")}>
          Success! Account has been created. Redirecting.
        </Message>
        {result.status === "success" ? redirectToLogin() : ""}
      </Box>
    </Columns.Column>
  );
};
