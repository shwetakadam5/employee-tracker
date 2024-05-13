require("dotenv").config();

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;

const app = express();


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));