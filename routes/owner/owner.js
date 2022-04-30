let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
    middleware = require("../../middleware/index");

// DONE : update-shop, update-shop-owner, change-pwd, add-product
// TO-DO: forget pwd

//update-shop-owner
router.post("/update", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.owner) {
            if (
                req.body.data.owner.full_name &&
                req.body.data.owner.full_name != null &&
                req.body.data.owner.full_name.length > 0 &&
                req.body.data.owner.contact &&
                req.body.data.owner.contact != null
            ) {
                var sql =
                    "UPDATE shop_owner SET full_name = '" +
                    req.body.data.owner.full_name +
                    "', contact = '" +
                    JSON.stringify(req.body.data.owner.contact) +
                    "' WHERE id = '" +
                    req.body.auth.user.id +
                    "';";
                connection.query(sql, async(err, results) => {
                    if (err) {
                        res.json(await response.error(500, err));
                    } else {
                        res.json(await response.success("owner details updated successfully"));
                    }
                });
            } else {
                res.json(await response.error(400, "Incomplete Data"));
            }
        } else {
            res.json(await response.error(400, "No Data"));
        }
    } catch (err) {
        res.json(await response.error(500, err));
    }
});

//update-shop
router.post("/update-shop", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.shop) {

            if (
                req.body.data.shop.brand_name &&
                req.body.data.shop.brand_name != null &&
                req.body.data.shop.brand_name.length > 0 &&
                req.body.data.shop.trade_name &&
                req.body.data.shop.trade_name != null &&
                req.body.data.shop.trade_name.length > 0 &&
                req.body.data.shop.logo_url &&
                req.body.data.shop.logo_url != null &&
                req.body.data.shop.logo_url.length > 0 &&
                req.body.data.shop.color &&
                req.body.data.shop.color != null &&
                req.body.data.shop.color.length > 0
            ) {

                var sql =
                    "UPDATE shop SET brand_name = '" +
                    req.body.data.shop.brand_name +
                    "', trade_name = '" +
                    req.body.data.shop.trade_name +
                    "', logo_url = '" +
                    req.body.data.shop.logo_url +
                    "', color = '" +
                    req.body.data.shop.color +
                    "' WHERE shop_id = '" +
                    req.body.data.shop.shop_id +
                    "'; UPDATE shop_owner SET is_active=true WHERE shop_id = '" +
                    req.body.data.shop.shop_id +
                    "';";
                connection.query(sql, async(err, results) => {
                    if (err) {
                        res.json(await response.error(500, err));
                    } else {
                        res.json(await response.success("shop updated successfully"));
                    }
                });
            } else {
                res.json(await response.error(400, "Incomplete Data"));
            }
        } else {
            res.json(await response.error(400, "No Data"));
        }
    } catch (err) {
        res.json(await response.error(500, err));
    }
});

//  add-product, TODO: add category,
router.post("/add-product", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.product && req.body.data.shop) {
            var product = req.body.data.product;
            var shop = req.body.data.shop;
            var sql =
                "INSERT INTO product(title, descri, price, color, size, stock) VALUES('" +
                product.title +
                "', '" +
                product.description +
                "', " +
                product.price +
                ", '" +
                JSON.stringify(product.color) +
                "', '" +
                JSON.stringify(product.size) +
                "', " +
                product.stock +
                ");";
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500, err));
                } else {
                    sql =
                        "INSERT INTO product_shop(product_id, shop_id) VALUES(" +
                        results.insertId +
                        ", " +
                        shop.shop_id +
                        ");";
                    product.img.forEach(img => {
                        sql += "INSRT INTO product_image(product_id, img_url, color) VALUES(" + results.insertId + ", '" + img.url + "', '" + img.color + "'); ";
                    })
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            res.json(await response.error(500, err.msg));
                        } else {
                            res.json(await response.success("product added successfully"));
                        }
                    });
                }
            });
        } else {
            res.json(await response.error(400, "corrupt data, try again"));
        }
    } catch (err) {
        console.log(err);
        res.json(await response.error(500, err));
    }
});

//add-category
router.post("/add-shop-category", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.category && req.body.data.shop_id) {
            var data = req.body.data,
                sql = ""
            var arr = Array.from(data.category);
            arr.forEach(cat => {
                sql += "INSERT INTO shop_category(shop_id, cat_id) VALUES (" + data.shop_id + ", " + cat + "); "
            });
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500, err));
                } else {
                    res.json(
                        await response.success(
                            "shop category added successfully"
                        )
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
});

router.post("/add-product-category", async(req, res) => {
    try {
        if (req.body.data && req.body.data.category && req.body.data.product_id) {
            var data = req.body.data,
                sql = ""
            var arr = Array.from(data.category);
            arr.forEach(cat => {
                sql += "INSERT INTO product_category(product_id, cat_id) VALUES (" + data.product_id + ", " + cat + "); "
            });
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.json(await response.error(500, err));
                } else {
                    res.json(await response.success("product category added successfully"));
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