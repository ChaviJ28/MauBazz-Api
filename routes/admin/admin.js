let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
    middleware = require("../../middleware/index");

//add-shop, deactivate-shop


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

//add-category
router.post("/add-category", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var sql = "INSERT INTO category(name)VALUES('" + req.body.data.name + "');";
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500, err));
                } else {
                    res.json(await response.success("category added successfully"));
                }
            });
        } else {
            res.json(await response.error(400, "corrupt data, try again"));
        }
    } catch (err) {
        console.log(err);
        res.json(await response.error(500));
    }
});

router.post('/activate-shop-owner', middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var sql =
                "UPDATE shop_owner SET is_active = " +
                req.body.data.status +
                "WHERE id= " +
                req.body.data.owner_id;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500, err));
                } else {
                    res.json(
                        await response.success("Shop owner updated successfully")
                    );
                }
            });
        } else {
            res.json(await response.error(400, "corrupt data, try again"));
        }
    } catch (err) {
        console.log(err);
        res.json(await response.error(500));
    }
})



module.exports = router;