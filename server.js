require("dotenv").config();
// Import and require express
const express = require('express');

// Import and require Pool 
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;

const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Connect to database
const pool = new Pool(
    {
        // Enter PostgreSQL username
        user: process.env.DB_USER,
        // Enter PostgreSQL password
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME
    },
    console.log(`Connected to the ${process.env.DB_NAME}database!`)
)


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});


app.listen(PORT, () => console.log(`App listening on port ${PORT}`));