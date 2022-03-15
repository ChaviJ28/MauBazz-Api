let express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mysql = require("mysql");

// set port, JSON, .env
var port = '3000';
app.use(bodyparser.json());
require("dotenv").config();

//create & run sql connection
mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
}).connect(function(err) {
    if (err) {
        return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server.");
});

app.get('*', (req, res) => {
    res.send("<h2>404 - Not Found</h2>");
})

const m = require('./middleware/index.js');
app.use(m.checkApiKey);

app.post('/', (req, res) => {
    res.json('Hi')
})

app.listen(port, (req, res) => {
    console.log("Node on " + port);
})