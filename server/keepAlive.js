const axios = require("axios");

// Ping backend every 1 minute
setInterval(() => {
    axios.get(process.env.baseURL)
        .then(() => console.log("Ping successful to keep backend alive"))
        .catch((error) => console.log("Ping failed:", error.message));
}, 60 * 1000);

module.exports = {};