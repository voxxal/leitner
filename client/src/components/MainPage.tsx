import React from "react";
import { Container, Hero, Heading, Image } from "react-bulma-components";
import "@fortawesome/fontawesome-free/css/all.css";
//@ts-ignore
import Wave from "../assets/wave.svg";
export default () => {
  return (
    <Hero style={{ height: "100%" }}>
      <Hero.Body>
        <Container>
          <Heading size={1} subtitle>
            Learn Something <b>New</b>
          </Heading>
          <Heading size={2} textWeight="light">
            Use the leitner system to help you remember stuff.
          </Heading>
        </Container>
      </Hero.Body>
      <Image src={Wave} ></Image>
    </Hero>
  );
};
