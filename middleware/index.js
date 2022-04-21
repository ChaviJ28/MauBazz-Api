var response = require("../routes/functions/functions"),
    mysql = require("mysql"),
    connection = mysql.createConnection(require('../db')),
    multer = require("multer");

// middleware for checking api_key
exports.checkApiKey = async(req, res, next) => {
    if (req.body.auth && req.body.auth.api_key && req.body.auth.api_key == process.env.API_KEY) {
        next();
    } else {
        res.json(await response.error(403, "api-key error"));
    }
};

exports.checkAuth = async(req, res, next) => {
    if (req.body.auth && req.body.auth.user) {
        if (req.body.auth.user.access_type == "admin") {
            var sql = 'SELECT status, username FROM user_admin WHERE username="' + req.body.auth.user.username + '"'
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500));
                } else {
                    if (results.length > 0 && results[0].status == 1) {
                        next();
                    } else {
                        res.json(await response.error(403, "Account does not exist or has been suspended"));
                    }
                }
            })
        } else if (req.body.auth.user.access_type == "owner") {
            var sql = 'SELECT is_active, username, login_count FROM shop_owner WHERE username="' + req.body.auth.user.username + '"'
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500));
                } else {
                    if (results.length > 0 && (results[0].is_active == 1 || results[0].login_count == 1)) {
                        next();
                    } else {
                        res.json(await response.error(403, "Account does not exist or has been suspended"));
                    }
                }
            })
        } else {
            res.json(await response.error(400, "corrupt userdata, login again"));
        }
    } else {
        res.json(await response.error(401, "User does not exist"));
    }
};