var mysql = require("mysql"),
    connection = mysql.createConnection(require('../db')),
    multer = require("multer");

// middleware for checking api_key
exports.checkApiKey = async(req, res, next) => {
    if (req.Authorization && req.Authorization == process.env.API_KEY) {
        next();
    } else {
        res.status(403).json({ error: "api-key error" });
    }
};

exports.checkAuth = async(req, res, next) => {
    if (req.body.auth && req.body.auth.user) {
        if (req.body.auth.user.access_type == "admin") {
            var sql = 'SELECT status, username FROM user_admin WHERE username="' + req.body.auth.user.username + '"'
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    if (results.length > 0 && results[0].status == 1) {
                        next();
                    } else {
                        res.status(403).json({ error: "Account does not exist or has been suspended" });
                    }
                }
            })
        } else if (req.body.auth.user.access_type == "owner") {
            var sql = 'SELECT is_active, username, login_count FROM shop_owner WHERE username="' + req.body.auth.user.username + '"'
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    if (results.length > 0 && (results[0].is_active == 1 || results[0].login_count == 1)) {
                        next();
                    } else {
                        res.status(403).json({ error: "Account does not exist or has been suspended" });
                    }
                }
            })
        } else if (req.body.auth.user.access_type == "user") {
            var sql = 'SELECT username FROM user WHERE username="' + req.body.auth.user.username + '"'
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    if (results.length > 0) {
                        next();
                    } else {
                        res
                            .status(403)
                            .json({
                                error: "Account does not exist or has been suspended",
                            });
                    }
                }
            })
        } else {
            res.status(400).json({ error: "corrupt userdata, login again" });
        }
    } else {
        res.status(401).json({ error: "UserAuth does not exist" });
    }
};

exports.userExists = async(req, res, next) => {
    if (req.body.data && req.body.data.shop && req.body.data.shop.username) {
        var username = req.body.data.shop.username;
        var sql = "SELECT * FROM shop_owner WHERE username = '" + username + "';";
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                console.log(results)
                if (results.length == 0) {
                    next();
                } else {
                    res.status(400).json({ error: "Username Taken" });
                }
            }
        })
    }
    if (req.body.data && req.body.data.username) {
        var username = req.body.data.username;
        var sql =
            "SELECT * FROM user WHERE username = '" + username + "';";
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (results.length == 0) {
                    next();
                } else {
                    res.status(400).json({ error: "Username Taken" });
                }
            }
        });
    }
}

//check app-user login
exports.checkCient = async(req, res, next) => {}