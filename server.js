const express = require('express');

const app = express();
const port = 3000;

app.use(express.json());

const registerRoute = require('./routes/register');
app.use(registerRoute);

app.listen(port, () => {
  console.log(`Server is running on PORT:${port}`);
});
