import React from "react";
interface Props {
  user: {
    username: string;
    id: string;
  };
}
export default ({ user: { username, id } }: Props) => {
  return (
    <div key={id}>
      <h2>{username}</h2>
      <p>{id}</p>
    </div>
  );
};
