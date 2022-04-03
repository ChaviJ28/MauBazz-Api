let express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    mysql = require("mysql");

// set port, JSON, .env
require("dotenv").config();
var port = process.env.PORT;
app.use(bodyparser.json());

//create & run sql connection
let connection = mysql.createConnection(require('./db.js'))
connection.connect(function(err) {
    if (err) {
        return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server.");
});

const m = require("./middleware/index.js");
app.use(m.checkApiKey);

const adminRoutes = require("./routes/admin/admin.js")

app.use("/api/admin", adminRoutes);

app.post('/api/test', (req, res) => {
    res.send(req.body);
})

app.get("*", (req, res) => {
    res.send("<h2>404 - Not Found</h2>");
});

app.listen(port, (req, res) => {
    console.log("Node on " + port + ", " + process.env.NODE_ENV + " environment");
})