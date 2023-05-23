import express from "express";
import { Pool } from "pg";
import { SHA3 } from "crypto-js";
import cryptoRandomString from "crypto-random-string";
import { pool } from "./pool";
import { Card, V1Result, V1ResultSuccess } from "../common";
import format from "pg-format";
export const v1 = express.Router();
class Model {
  pool: Pool;
  constructor(pool: Pool) {
    this.pool = pool;
  }
  async reset() {
    await this.pool.query(`
    DROP TABLE IF EXISTS cards;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS users;
    CREATE TABLE IF NOT EXISTS users 
    (
       id VARCHAR PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
       username VARCHAR NOT NULL UNIQUE,
       email VARCHAR,
       creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       password_hash VARCHAR NOT NULL,
       password_salt VARCHAR NOT NULL
     );
    CREATE TABLE IF NOT EXISTS sessions
     (
       token VARCHAR NOT NULL,
       owner VARCHAR REFERENCES users(id) NOT NULL,
       creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW()
     );
     CREATE TABLE IF NOT EXISTS cards
     (
       id VARCHAR PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
       owner VARCHAR REFERENCES users(id) NOT NULL,
       creation_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
       question VARCHAR NOT NULL,
       answer VARCHAR NOT NULL,
       level SMALLINT NOT NULL DEFAULT 1
     );
     `);
    //CREATE OTHER TABLES LATER
  }
  async searchUsers(query: string) {
    return await this.pool.query(
      `
    SELECT id,username,creation_date,email FROM users WHERE username LIKE $1;
    `,
      [`%${query}%`]
    );
  }
  async findUser(username: string) {
    return await this.pool.query(
      `
    SELECT id,username,creation_date,email FROM users WHERE username = $1
    `,
      [username]
    );
  }
  async findUserById(id: string) {
    return await this.pool.query(
      `
    SELECT * FROM users WHERE id = $1
    `,
      [id]
    );
  }
  async validToken(token: string) {
    const result = await this.pool.query(
      `SELECT owner FROM sessions WHERE token = $1`,
      [token]
    );
    return !!result.rowCount;
  }
  async getOwnerOfToken(token: string) {
    const result = await this.pool.query(
      `SELECT owner FROM sessions WHERE token = $1`,
      [token]
    );
    return result.rows[0]?.owner || false;
  }
  async createAccount(
    username: string,
    passwordHash: string,
    email: string | null = null
  ) {
    const salt = cryptoRandomString({ length: 10, type: "ascii-printable" });
    passwordHash = SHA3(passwordHash + salt).toString();
    if ((await this.findUser(username)).rowCount > 0) {
      // ALSO ADD EMAIL CHECK
      return { status: "failure", reason: "name_conflict" };
    }
    await this.pool.query(
      `
    INSERT INTO users (username, password_hash, password_salt, email) VALUES ($1, $2, $3, $4)
      `,
      [username, passwordHash, salt, email == "" ? "NULL" : email]
    );
    return { status: "success" };
  }
  async getSalt(username: string) {
    const result = await this.pool.query(
      `
    SELECT (password_salt) FROM users WHERE username = $1
    `,
      [username]
    );
    if (result.rowCount < 1) {
      return { status: "failure", reason: "user_not_found" };
    }

    return { status: "success", result: result.rows[0].password_salt };
  }
  async getDateCreated(uuid: string) {
    const result = await this.pool.query(
      `
    SELECT (creation_date) FROM users WHERE id = $1
    `,
      [uuid]
    );
    if (result.rowCount < 1) {
      return { status: "failure", reason: "user_not_found" };
    }

    return { status: "success", result: result.rows[0].creation_date };
  }
  async login(username: string, password: string) {
    const user = await this.pool.query(
      `
    SELECT id, password_hash, password_salt FROM users WHERE username = $1
    `,
      [username]
    );
    if (
      user.rows[0]?.password_hash ===
      SHA3(password + user.rows[0]?.password_salt).toString()
    ) {
      const token = cryptoRandomString({ length: 32 });
      await this.pool.query(
        `
      INSERT INTO sessions (token, owner) VALUES ($1, $2)
      `,
        [token, user.rows[0]?.id]
      );
      return { status: "success", result: token };
    } else {
      return { status: "failure", reason: "login_was_wrong" };
    }
  }
  async getCards(uuid: string) {
    return await this.pool.query(`SELECT * FROM cards WHERE owner = $1`, [
      uuid,
    ]);
  } // TODO check if they own the card
  async addCards(owner: string, cards: Card[]) {
    let cardsAsArray = cards.map((card) => {
      return [owner, card.question, card.answer];
    });
    const result = await this.pool.query(
      format(
        `INSERT INTO cards (owner, question, answer) VALUES %L`,
        cardsAsArray
      )
    );
    return { status: "success" } as V1ResultSuccess;
  }
  async editCards(owner: string, cards: Card[]) {
    let cardsAsArray = Object.entries(cards)
    // let cardsAsArray = cards.map((card) => {
    //   return [card.id, card.question, card.answer, owner];
    // });
    const result = await this.pool.query(
      format(
        `UPDATE cards AS card SET id = new_card.id, question = new_card.question, answer = new_card.answer FROM (VALUES %L) AS new_card(id ,question, answer, owner) WHERE new_card.id = card.id AND new_card.owner = card.owner`,
        cardsAsArray
      )
    );
    return { status: "success" } as V1ResultSuccess;
  }
  async levelCards(owner: string, cards: Card[]) {
    let cardsAsArray = cards.map((card) => {
      return [card.id, card.level, owner];
    });
    const result = await this.pool.query(
      format(
        `UPDATE cards AS card SET id = new_card.id, level = new_card.level FROM (VALUES %L) AS new_card(id ,level,owner) WHERE new_card.id = card.id AND new_card.owner = card.owner`,
        cardsAsArray
      )
    );
    return { status: "success" } as V1ResultSuccess;
  }
  async deleteCards(owner: string, cards: Card[]) {
    let cardsAsArray = cards.map((card) => {
      // Not in an array but ok
      return card.id;
    });
    const result = await this.pool.query(
      format(`DELETE FROM cards WHERE id IN (%L) AND owner = $1`, cardsAsArray),
      [owner]
    );
    return { status: "success" } as V1ResultSuccess;
  }
}
const DB = new Model(pool);
const daysDiffrence = (date1: Date, date2: Date) =>
  Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));

v1.get("/", (req, res) => res.json({ status: "success" }));

v1.get("/days", async (req, res) => {
  const owner = await DB.getOwnerOfToken(req.cookies.token);
  if (!owner)
    res.status(401).json({ status: "failure", reason: "unauthorized" });
  else {
    const daysSince = Math.floor(daysDiffrence(
      (await DB.getDateCreated(owner)).result,
      new Date()
    ));
    console.log(daysSince);
    res.json({
      status: "success",
      result: {
        one: true,
        two: daysSince % 2 ** 1 === 0,
        three: daysSince % 2 ** 2 === 0,
        four: daysSince % 2 ** 3 === 0,
        five: daysSince % 2 ** 4 === 0,
        six: daysSince % 2 ** 5 === 0,
        seven: daysSince % 2 ** 6 === 0,
      },
    });
  }
});

v1.get("/searchusers/:query", async (req, res) => {
  const result = await DB.searchUsers(req.params.query);
  res.json({ result: result.rows, status: "success" });
});

v1.get("/cards", async (req, res) => {
  const cookies = req.cookies;
  const owner = await DB.getOwnerOfToken(cookies.token);
  if (!owner)
    res.status(401).json({ status: "failure", reason: "unauthorized" });
  else
    res.json({
      status: "success",
      result: (await DB.getCards(owner)).rows,
    });
});

v1.post("/cards", async (req, res) => {
  // Body: {action: "edit" | "add" | "delete", "level", cards:[]}
  const cookies = req.cookies;
  const owner = await DB.getOwnerOfToken(cookies.token);
  if (!owner)
    res.status(401).json({ status: "failure", reason: "unauthorized" });
  else {
    let result: V1Result = { status: "pending" };
    switch (req.body.action) {
      case "add":
        result = await DB.addCards(owner, req.body.cards);
        break;
      case "edit":
        result = await DB.editCards(owner, req.body.cards);
        break;
      case "level":
        result = await DB.levelCards(owner, req.body.cards);
        break;
      case "delete":
        result = await DB.deleteCards(owner, req.body.cards);
    }
    res.json(result);
  }
});

v1.get("/validToken", async (req, res) => {
  // If it is cached, use it.
  if (req.cookies.loggedIn)
    return res.json({ status: "success", result: true });

  const valid = await DB.validToken(req.cookies.token);
  if (valid)
    res.cookie("loggedIn", true, {
      maxAge: 24 * 60 * 60 * 1000,
    });
  res.json({
    status: "success",
    result: valid,
  });
});

v1.get("/reset", async (req, res) => {
  await DB.reset();
  res.json({ status: "success" });
});

v1.post("/signup", async (req, res) => {
  res.json(
    await DB.createAccount(
      req.body.username,
      req.body.passwordHash,
      req.body.email
    )
  );
});

v1.post("/login", async (req, res) => {
  const result = await DB.login(req.body.username, req.body.passwordHash);
  if (result.status === "success") {
    res.cookie("token", result.result, {
      maxAge: 24 * 30 * 60 * 60 * 1000,
    });
    res.json({ status: "success" });
  } else if (result.status === "failure") {
    res.json(result);
  }
});

v1.get("/teapot", async (req, res) => res.send(418));
