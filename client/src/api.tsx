import axios, { AxiosInstance } from "axios";
console.log(process.env.SERVER);
export const SERVER = process.env.SERVER || "http://localhost:3000";
let instance : AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: SERVER,
});

export default instance;
