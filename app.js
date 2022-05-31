let express = require("express"),
    app = express(),
    bodyparser = require("body-parser"),
    bcrypt = require("bcrypt"),
    mysql = require("mysql"),
    path = require("path");

// set port, JSON, .env
require("dotenv").config();
var port = process.env.PORT;
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }));

//create & run sql connection
let connection = mysql.createConnection(require('./db.js'))
connection.connect(function(err) {
    if (err) {
        return console.error("error: " + err.message);
    }
    console.log("Connected to the MySQL server.");
});

app.use(express.static(path.join(__dirname, "uploads")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/views/error.html"));

});

const middleware = require("./middleware/index.js");
// app.use(middleware.checkApiKey);

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin/admin.js");
const ownerRoutes = require("./routes/owner/owner.js");
const imageRoutes = require("./routes/owner/image.js");
const bannerRoutes = require("./routes/owner/banner.js");
const publicShopRoutes = require("./routes/public/shop.js");
const userRoutes = require("./routes/public/user.js");

app.use("/api/", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/banner", bannerRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/v1", publicShopRoutes);
app.use("/api/v1", userRoutes);

app.post('/api/test', (req, res) => {
    if (process.env.NODE_ENV != "production") {
        connection.query(req.body.data.sql, async(err, results) => {
            if (err) {
                res.json(err);
            } else {
                res.json(results);
            }
        });
    } else {
        res.json(req.body);
    }
})

app.listen(port, (req, res) => {
    console.log("Node on " + port + ", " + process.env.NODE_ENV + " environment");
})