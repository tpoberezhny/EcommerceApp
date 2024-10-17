import axios from "axios";
const url = process.env.baseURL || "https://ecommerceapp-backend-6yo6.onrender.com";

export default axios.create({
  baseURL: url,
});
