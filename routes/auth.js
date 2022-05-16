let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../db")),
    response = require("./functions/functions"),
    middleware = require("../middleware/index")

// login
router.post("/login", async(req, res) => {
    try {
        console.log(req.body)
        var sql =
            'SELECT * FROM shop_owner, shop WHERE username="' +
            req.body.data.username +
            '" AND shop_owner.shop_id = shop.shop_id';
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (results.length > 0) {
                    if (bcrypt.compareSync(req.body.data.password, results[0].pwd)) {
                        if (
                            results[0].is_active == 1 ||
                            results[0].login_count == 0
                        ) {
                            delete results[0].pwd;
                            results[0].access_type = "owner";
                            results[0].contact = JSON.parse(results[0].contact);
                            //update login_count
                            var count = results[0].login_count + 1;
                            sql =
                                "UPDATE shop_owner SET login_count=" +
                                count +
                                " WHERE id = " +
                                results[0].id;
                            connection.query(sql, async(err, sts) => {
                                if (err) {
                                    res.status(500).json({ error: err });
                                } else {
                                    if (sts.affectedRows > 0) {
                                        results[0].login_count = count;
                                        res.json(
                                            await response.respond(results[0])
                                        );
                                    } else {
                                        res.status(500).json({ error: "Login Error, login_count fail" });
                                    }
                                }
                            });
                        } else {
                            res
                                .status(403)
                                .json({ error: "Account has been suspended" });
                        }
                    } else {
                        res.status(401).json({
                            error: "Wrong Password",
                        });
                    }
                } else {
                    // check for admin here
                    var sql = 'SELECT * FROM user_admin WHERE username="' + req.body.data.username + '"';
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            if (results.length > 0) {
                                if (bcrypt.compareSync(req.body.data.password, results[0].pwd)) {
                                    if (results[0].status == 1) {
                                        delete results[0].pwd;
                                        results[0].access_type = "admin";
                                        res.json(await response.respond(results[0]));
                                    } else {
                                        res.status(403).json({ error: "Account has been suspended" });
                                    }
                                } else {
                                    res.status(401).json({ error: "Wrong Password" });
                                }
                            } else {
                                res
                                    .status(500)
                                    .json({ error: "User does not exist" });
                            }
                        }
                    });
                }
            }
        });
    } catch (err) {
        console.log(err)
        res.json(await response.error(500));
    }
});

//owner-change-pwd
router.post("/owner/change-password", middleware.checkAuth, async(req, res) => {
    try {
        var sql =
            'SELECT * FROM shop_owner WHERE id="' +
            req.body.auth.user.id +
            '"';
        connection.query(sql, async(err, results) => {
            if (err) {
                res.json(await response.error(500));
            } else {
                if (results.length > 0) {
                    if (req.body.data.oldpassword && req.body.data.password && bcrypt.compareSync(req.body.data.oldpassword, results[0].pwd)) {
                        const hash = bcrypt.hashSync(req.body.data.password, parseInt(process.env.HASH_SALT));
                        var sql = "UPDATE shop_owner set pwd = '" + hash + "' WHERE id=" + results[0].id;
                        connection.query(sql, async(err, sts) => {
                            if (err) {
                                res.status(500).json({ error: err });
                            } else {
                                if (sts.affectedRows > 0) {
                                    res.json(await response.success("password updated successfully"));
                                } else {
                                    res.status(500).json({ error: "update error" });
                                }
                            }
                        });
                    } else {
                        res.status(400).json({ error: "Wrong password" });
                    }
                } else {
                    res.status(400).json({ error: "User does not exist" });
                }
            }
        })
    } catch (err) {
        res.json(await response.error(500, err));
    }
})

module.exports = router;