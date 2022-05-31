let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    middleware = require("../../middleware/index");

// login for app
router.post("/register", middleware.userExists, async(req, res) => {
    try {
        if (req.body.data) {
            var user = req.body.data,
                password = "",
                sql = ""
            if (user.pass1 === user.pass2) {
                password = bcrypt.hashSync(user.pass1.toString(), parseInt(process.env.HASH_SALT));
                sql = "INSERT INTO user(full_name, email, username, pwd)VALUES('" + user.name + "', '" + user.email + "', '" + user.username + "', '" + password + "')"

                connection.query(sql, async(err, results) => {
                    if (err) {
                        res.status(500).json({ error: err });
                    } else {
                        res.status(200).send({ success: "user registered" });
                    }
                })
            } else {
                res.status(400).json({ error: "passwords do not match" });
            }
        } else {
            res.status(500).json({ error: "corrupt shopdata, try again" });
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
})

router.post("/login", async(req, res) => {
    try {
        var base = "SELECT * FROM user WHERE ";
        //email check
        var sql = base + "email = '" + req.body.data.email + "'";
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (results.length > 0) {
                    var user = results[0];
                    if (bcrypt.compareSync(req.body.data.password, user.pwd)) {
                        delete user.pwd;
                        user.contact = JSON.parse(user.contact);
                        user.card_details = JSON.parse(user.card_details);
                        res.status(200).json({ data: user });
                    } else {
                        res.status(401).json({
                            error: "Wrong Password",
                        });
                    }
                } else {
                    //username check
                    var sql = base + "username = '" + req.body.data.email + "'";
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            if (results.length > 0) {
                                var user = results[0];
                                if (
                                    bcrypt.compareSync(
                                        req.body.data.password,
                                        user.pwd
                                    )
                                ) {
                                    delete user.pwd;
                                    user.contact = JSON.parse(user.contact);
                                    user.card_details = JSON.parse(user.card_details);
                                    res.status(200).json({ data: user });
                                } else {
                                    res.status(401).json({
                                        error: "Wrong Password",
                                    });
                                }
                            } else {
                                res.status(400).json({
                                    error: "User does not exist",
                                });
                            }
                        }
                    })
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
})

//check if user has contact, gender, dob, img, address, card_details
router.post("/user/get-status", middleware.checkAuth, async(req, res) => {
    try {
        var sql = "SELECT * FROM user "
        if (req.body.data.id) {
            sql += "WHERE usr_id =" + req.body.data.id;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    var user = results[0]
                    user.contact = JSON.parse(user.contact);
                    user.card_details = JSON.parse(user.card_details);
                    if (
                        user.updated_on != null &&
                        user.updated_on.length > 0 &&
                        user.contact != null &&
                        user.contact.length > 0 &&
                        user.gender != null &&
                        user.gender.length > 0 &&
                        user.dob != null &&
                        user.dob.length > 0 &&
                        user.profile_url != null &&
                        user.profile_url.length > 0 &&
                        user.card_details != null &&
                        user.card_details.length > 0 &&
                        user.address != null &&
                        user.address.length > 0
                    ) {
                        res.status(200).send({
                            data: {
                                status: "true",
                            },
                        });
                    } else {
                        res.status(200).send({
                            data: {
                                status: "false",
                            },
                        });
                    }
                }
            });
        } else {
            res.status(500).json({ error: "user id required, try again" });
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});

router.post("/user/get-user", middleware.checkAuth, async(req, res) => {
    //populate with cart&orders
    try {
        var add = "";
        if (req.body.data.search) {
            if (req.body.data.search.id) {
                add = " WHERE id=" +
                    req.body.data.search.id;
            }
            if (req.body.data.search.email) {
                add = " WHERE email LIKE '%" + req.body.data.search.email + "%'";
            }
            if (req.body.data.search.username) {
                add =
                    " WHERE username LIKE '%" +
                    req.body.data.search.username +
                    "%'";
            }
        }
        if (req.body.data.populate) {
            add += "; SELECT * FROM cart; SELECT * FROM orders";
        }
        // if (req.body.data.populate) {
        //     add += "; SELECT * FROM cart; SELECT * FROM orders";
        // }
        var sql = "SELECT * FROM user" + add;

        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (req.body.data.populate) {
                    res.status(200).json({ data: results });
                } else {
                    results.forEach((user) => {
                        delete user.pwd;
                        user.contact = JSON.parse(user.contact);
                        user.card_details = JSON.parse(user.card_details);
                    });
                    res.status(200).json({ data: results });
                }
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});

router.post("/update-user");

module.exports = router;