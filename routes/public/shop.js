let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
    middleware = require("../../middleware/index");


router.post("/get-shop", async(req, res) => {
    try {
        var add = "";
        if (req.body.data.search) {
            if (req.body.data.search.id) {
                add = " WHERE shop_id=" + req.body.data.search.id;
            }
            if (req.body.data.search.brand_name) {
                add = " WHERE brand_name LIKE '%" + req.body.data.search.brand_name + "%'";
            }
        }
        var sql = "SELECT * FROM shop, category" + add;
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
        var add = "",
            table = "",
            sort = "";
        if (req.body.data.search) {
            if (req.body.data.search.id) {
                add = " WHERE product_id=" + req.body.data.search.id;
            }
            if (req.body.data.search.title) {
                add = " WHERE title LIKE '%" + req.body.data.search.title + "%'";
            }
            if (req.body.data.search.shop) {
                add = " WHERE shop_id=" + req.body.data.search.shop;
            }
        }
        if (req.body.data.populate) {
            table = ", shop";
        }
        if (req.body.data.sort && req.body.data.sort.by) {
            sort = " ORDER BY " + req.body.data.sort.by
            if (!req.body.data.sort.asc) {
                sort += " DESC ";
            }
        }
        var sql = "SELECT * FROM product, product_image" + table + add + sort;
        connection.query(sql, async(err, results) => {
            if (err) {
                res.json(await response.error(500, err));
            } else {
                results.forEach((product) => {
                    if (product.banner_url) {
                        product.banner_url = JSON.parse(product.banner_url);
                    }
                    product.size = JSON.parse(product.size);
                });
                res.json(await response.respond(results));
            }
        });
    } catch (err) {
        res.json(await response.error(500));
    }
});



module.exports = router;