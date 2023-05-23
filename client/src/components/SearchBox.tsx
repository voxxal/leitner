import { AxiosResponse } from "axios";
import React from "react";
import api from "../api";

interface Props {
  getSearch: (value: any) => void;
}
export default (props: Props) => {
  const [search, setSearch] = React.useState("");
  const onChange = (event: any) => {
    setSearch(event.target.value);
  };
  const onSubmit = async () => {
    await api
      .get(`/v1/searchusers/${search}`)
      .then((response: AxiosResponse) => {
        props.getSearch(response.data.result);
      });
  };
  return (
    <div>
      <input type="text" onChange={onChange}></input>
      <button onClick={onSubmit}>Search</button>
    </div>
  );
};
