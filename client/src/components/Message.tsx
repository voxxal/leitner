import React from "react";
// Possibly a better way of handling this. For now its fine
interface Props {
  children?: React.ReactNode;
  success?: boolean;
  failure?: boolean;
  hidden?: boolean;
}
export default ({ children, success, failure, hidden }: Props) => {
  return (
    <p
      className={`${
        success ? "has-text-success" : failure ? "has-text-danger" : ""
      } 
      ${hidden ? "is-hidden" : ""}
      `}
    >
      {children}
    </p>
  );
};
