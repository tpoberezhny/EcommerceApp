const axios = require("axios");

// Ping backend every 1 minute
setInterval(() => {
  axios
    .get(process.env.baseURL)
    .then((response) => {
      console.log(
        `Reloaded at ${new Date().toISOString()}: Status Code ${
          response.status
        }`
      );
    })
    .catch((error) => console.log("Ping failed:", error.message));
}, 30000);

module.exports = {};
