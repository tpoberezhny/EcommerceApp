import axios from "axios";
const url = process.env.baseURL || "http://localhost:5000";

export default axios.create({
  baseURL: url,
});
