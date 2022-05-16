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
                add = " WHERE shop.shop_id=" + req.body.data.search.id;
            }
            if (req.body.data.search.brand_name) {
                add = " WHERE shop.brand_name LIKE '%" + req.body.data.search.brand_name + "%'";
            }
        }
        var sql =
            "SELECT * FROM shop " + add;
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (req.body.data.populate) {
                    var arr = [];
                    results.forEach(async(shop) => {
                        sql = "SELECT img_url FROM shop_banner WHERE shop_id=" + shop.shop_id;
                        connection.query(sql, async(err, banner) => {
                            if (err) {
                                res.status(500).json({ error: err });
                            } else {
                                var obj = {
                                    shop,
                                    banner,
                                };
                                arr.push(obj);
                            }
                        });
                    })
                    console.log(arr)
                    res.json(await response.respond(arr));
                } else {
                    res.json(await response.respond(results));
                }
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });

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
                res.status(500).json({ error: err });
            } else {
                results.forEach((product) => {
                    product.size = JSON.parse(product.size);
                });
                res.json(await response.respond(results));
            }
        });
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});


//get-category
router.post("/get-category", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            if (req.body.data.search) {
                if (req.body.data.search.shop_id) {
                    add = " WHERE shop_id=" + req.body.data.search.shop_id;
                }
                if (req.body.data.search.cat_id) {
                    add = " WHERE cat_id=" + req.body.data.search.cat_id;
                }
            }
            var sql =
                "SELECT * FROM category" + add;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.json(await response.respond(results));
                }
            });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});


module.exports = router;