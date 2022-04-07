let express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    bcrypt = require("bcrypt"),
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

app.get("*", (req, res) => {
    const hash = bcrypt.hashSync("default123", parseInt(process.env.HASH_SALT));
    res.send("<h2>404 - Not Found</h2><p>" + hash + "</p>");
});

const middleware = require("./middleware/index.js");
app.use(middleware.checkApiKey);

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/admin.js");
const ownerRoutes = require("./routes/owner/owner.js");
const publicRoutes = require("./routes/public/shop.js");

app.use("/api/", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/user", ownerRoutes);
app.use("/api/v1", publicRoutes);

app.post('/api/test', (req, res) => {
    connection.query(req.body.data.sql, async(err, results) => {
        if (err) {
            res.json(err);
        } else {
            res.json(results);
        }
    })
})

app.listen(port, (req, res) => {
    console.log("Node on " + port + ", " + process.env.NODE_ENV + " environment");
})