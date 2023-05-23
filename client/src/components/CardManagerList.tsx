import React from "react";
import { Table } from "react-bulma-components";
import api from "../api";
import CardManager from "./CardManager";
export default () => {
  const [newCard, setNewCard] = React.useState({ question: "", answer: "" });
  const [editCard, setEditCard] = React.useState({
    id: "",
    question: "",
    answer: "",
  });
  const [cards, setCards] = React.useState([]);
  const addCards = async () => {
    await api.post("/v1/cards", {
      action: "add",
      cards: [newCard],
    });
  };
  const getCards = async () => {
    await api.get("/v1/cards").then((response) => {
      setCards(response.data.result);
    });
    console.log(cards);
  };
  const editCards = async () => {
    await api.post("/v1/cards", {
      action: "edit",
      cards: [editCard],
    });
  };
  return (
    <>
      <Table>
        <thead>
          <tr>
            <th>id</th> <th>question</th> <th>answer</th> <th>lvl</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => {
            return <CardManager {...card} />;
          })}
        </tbody>
      </Table>
      <input
        onChange={(event) => {
          setNewCard({ ...newCard, question: event.target.value });
        }}
        placeholder="new card question"
      ></input>
      <br />
      <input
        onChange={(event) => {
          setNewCard({ ...newCard, answer: event.target.value });
        }}
        placeholder="new card answer"
      ></input>
      <button onClick={addCards}>add cards</button>
      <br />
      <button onClick={getCards}>get cards</button>
      <br />
      <input
        onChange={(event) => {
          setEditCard({ ...editCard, id: event.target.value });
        }}
        placeholder="edit card id"
      ></input>
      <br />
      <input
        onChange={(event) => {
          setEditCard({ ...editCard, question: event.target.value });
        }}
        placeholder="edit card question"
      ></input>
      <br />
      <input
        onChange={(event) => {
          setEditCard({ ...editCard, answer: event.target.value });
        }}
        placeholder="edit card answer"
      ></input>
      <button onClick={editCards}>edit card</button>
    </>
  );
};
