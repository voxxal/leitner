import { Card } from "common";
import React from "react";
import { Box, Columns, Container } from "react-bulma-components";
export default ({id, question, answer, level} : Card) => {
  return (
      <tr>
        <td>{id}</td>
        <td>{question}</td>
        <td>{answer}</td>
        <td>{level}</td>
      </tr>
  );
};
