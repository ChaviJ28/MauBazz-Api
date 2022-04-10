let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions"),
    middleware = require("../../middleware/index");


router.post("/get-shop", async(req, res) => {
    try {
        var add = "";
        if (req.body.data.search && req.body.data.search.id) {
            add = " WHERE shop_id=" + req.body.data.search.id;
        }
        var sql = "SELECT * FROM shop" + add;
        connection.query(sql, async(err, results) => {
            if (err) {
                res.json(await response.error(500, err));
            } else {
                results.forEach((shop) => {
                    shop.banner_url = JSON.parse(shop.banner_url);
                });
                res.json(await response.respond(results));
            }
        });
    } catch (err) {
        res.json(await response.error(500));
    }
});

//get-product
router.post("/get-product", async(req, res) => {
    try {
        var add = "";
        if (req.body.data.search && req.body.data.search.id) {
            add = " WHERE product_id=" + req.body.data.search.id;
        }
        var sql = "SELECT * FROM product" + add;
        connection.query(sql, async(err, results) => {
            if (err) {
                res.json(await response.error(500, err));
            } else {
                res.json(await response.respond(results));
            }
        });
    } catch (err) {
        res.json(await response.error(500));
    }
});
module.exports = router;