var express = require("express"),
    app = express(),
    bodyparser = require("body-parser");

var port = '3000';
app.use(bodyparser.json());

app.get('*', (req, res) => {
    res.send('<h2>Hi</h2>');
})

app.listen(port, (req, res) => {
    console.log("Node on " + port);
})