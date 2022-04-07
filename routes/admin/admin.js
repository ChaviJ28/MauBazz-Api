let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions"),
    middleware = require("../../middleware/index");


// router.post("/login", async(req, res) => {
//     try {
//         var sql = 'SELECT * FROM user_admin WHERE username="' + req.body.data.username + '"';
//         connection.query(sql, async(err, results) => {
//             if (err) {
//                 res.json(await response.error(500));
//             } else {
//                 if (results.length > 0) {
//                     if (bcrypt.compareSync(req.body.data.password, results[0].pwd)) {
//                         if (results[0].status == 1) {
//                             delete results[0].pwd;
//                             results[0].access_type = "admin";
//                             res.json(await response.respond(results[0]));
//                         } else {
//                             res.json(
//                                 await response.error(403, "Account has been suspended")
//                             );
//                         }
//                     } else {
//                         res.json(await response.error(401, "Wrong Password"));
//                     }
//                 } else {
//                     res.json(await response.error(400, "User does not exist"));
//                 }
//             }
//         });
//     } catch (err) {
//         res.json(await response.error(500));
//     }
// })

router.post("/add-shop", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.shop) {
            var data = req.body.data.shop;
            var sql = "INSERT INTO shop(trade_name)VALUES('" + data.shopname + "');";
            var hash = bcrypt.hashSync(
                "default123",
                parseInt(process.env.HASH_SALT)
            );
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500, err));
                } else {
                    sql =
                        "INSERT INTO shop_owner(username, pwd, full_name, shop_id, contact, is_active, subscription_type) VALUES('" +
                        data.username +
                        "', '" + hash + "', '" +
                        data.ownername +
                        "', " +
                        results.insertId +
                        ", '" +
                        JSON.stringify(data.contact) +
                        "', false, '" +
                        data.type +
                        "');";
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            res.json(await response.error(500, err));
                        } else {
                            res.json(await response.success("shop added successfully"));
                        }
                    });
                }
            });
        } else {
            res.json(await response.error(400, "corrupt shopdata, try again"));
        }
    } catch (err) {
        console.log(err);
        res.json(await response.error(500));
    }
});

module.exports = router;