let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    connection = mysql.createConnection(require("../../db")),
    middleware = require("../../middleware/index");


router.post("/get-shop", async(req, res) => {
    try {
        var add = "";
        if (req.body.data.search) {
            if (req.body.data.search.id) {
                add =
                    ", shop_owner WHERE shop.shop_id = shop_owner.shop_id && shop.shop_id=" +
                    req.body.data.search.id;
            }
            if (req.body.data.search.brand_name) {
                add = " WHERE shop.brand_name LIKE '%" + req.body.data.search.brand_name + "%'";
            }
        }
        if (req.body.data.populate) {
            add += "; SELECT * FROM shop_banner; SELECT * FROM shop_category; SELECT * FROM shop_owner;";
        }
        var sql =
            "SELECT * FROM shop " + add;
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (req.body.data.populate) {
                    let arr = [];
                    results[0].forEach(async(shop) => {
                        var banners = [],
                            owner = {},
                            category = [];
                        results[1]
                            .filter(x => x.shop_id === shop.shop_id)
                            .forEach(o => {
                                banners.push(o.img_url)
                            });
                        results[2]
                            .filter((x) => x.shop_id === shop.shop_id)
                            .forEach((o) => {
                                category.push(o.cat_id);
                            });
                        results[3]
                            .filter((x) => x.shop_id === shop.shop_id)
                            .forEach((o) => {
                                shop.contact = JSON.parse(o.contact)
                                shop.is_active = o.is_active;
                                shop.type = o.subscription_type;
                                owner.username = o.username;
                                owner.name = o.full_name;
                                shop.owner = owner;
                            });
                        shop.banners = banners;
                        shop.category = category;
                        arr.push(shop)
                    });
                    res.json({ data: arr });
                } else {
                    res.status(200).send({ data: results });
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

        if (req.body.data.sort && req.body.data.sort.by) {
            sort = " ORDER BY " + req.body.data.sort.by
            if (!req.body.data.sort.asc) {
                sort += " DESC ";
            }
        }
        var sql =
            "SELECT * FROM product_image; SELECT * FROM product_shop;  SELECT * FROM product_category; SELECT * FROM product" +
            add +
            sort;
        if (req.body.data.populate) {
            sql += "; SELECT * FROM shop";
        }
        // console.log(sql)
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                let arr = [];
                results[3].forEach((product) => {
                    var images = [],
                        category = [];
                    product.size = JSON.parse(product.size);
                    product.color = JSON.parse(product.color);

                    results[0]
                        .filter((x) => x.product_id === product.product_id)
                        .forEach((o) => {
                            images.push({
                                img_url: o.img_url,
                                color: o.color,
                            });
                        });
                    product.images = images;

                    results[2]
                        .filter((x) => x.product_id === product.product_id)
                        .forEach((o) => {
                            category.push(o.cat_id);
                        });
                    product.category = category;

                    var shop_id = results[1].filter((x) => x.product_id === product.product_id)[0].shop_id;
                    if (req.body.data.populate) {
                        product.shop = results[4].filter((x) => x.shop_id === shop_id)[0];
                    } else {
                        product.shop = { shop_id };
                    }

                    arr.push(product);
                });
                res.status(200).send({ data: arr });
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
            var add = ""
            if (req.body.data.search) {
                if (req.body.data.search.shop_id) {
                    add = " WHERE shop_id=" + req.body.data.search.shop_id;
                }
                if (req.body.data.search.cat_id) {
                    add = " WHERE cat_id=" + req.body.data.search.cat_id;
                }
            }
            var sql = "SELECT * FROM category" + add;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).send({ data: results });
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