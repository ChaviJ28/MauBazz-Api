let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    connection = mysql.createConnection(require('../../db.js')),
    response = require('../functions');


router.post('/get', (req, res) => {
    try {
        var sql = "SELECT * FROM user_admin";
        connection.query(sql, (err, results) => {
            if (err) {
                res.json(err);
            } else {
                res.json(results);
            }
        });
    } catch {

    }
})

router.post("/login", async(req, res) => {
    var sql = 'SELECT * FROM user_admin WHERE username="' + req.body.data.username + '"'
    connection.query(sql, async(err, results) => {
        if (err) {
            res.json(await response.error(500));
        } else {
            if (results.length > 0) {
                if (results[0].pwd == req.body.data.password) {
                    if (results[0].status == 1) {
                        res.json(await response.respond(results[0]));
                    } else {
                        res.json(await response.error(403, "Account has been suspended"));
                    }
                } else {
                    res.json(await response.error(401, "Wrong Password"));
                }
            } else {
                res.json(await response.error(400, "User does not exist"));

            }
        }
    })
})

module.exports = router;