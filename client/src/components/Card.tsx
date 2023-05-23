import React from "react";
import { Card, Box, Columns, Container } from "react-bulma-components";
// Add text prop
import api from "../api";
export default ({ children }: { children?: React.ReactNode }) => {
  return (
      <Columns className="is-centered is-vcentered" style={{minHeight:"30rem"}}>
        <Columns.Column className="is-6" >
          <Box style={{minHeight:"25rem"}}>{children}</Box>
        </Columns.Column>
      </Columns>
  );
};
