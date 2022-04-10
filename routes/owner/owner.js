let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions"),
    middleware = require("../../middleware/index");

// DONE : update-shop, update-shop-owner, change-pwd, add-product
// TO-DO: forget pwd

//change-pwd
router.post("/change-password", middleware.checkAuth, async(req, res) => {
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
                                res.json(await response.error(500));
                            } else {
                                if (sts.affectedRows > 0) {
                                    res.json(await response.success("password updated successfully"));
                                } else {
                                    res.json(
                                        await response.error(500, "update error")
                                    );
                                }
                            }
                        });
                    } else {
                        res.json(await response.error(400, "Wrong password"));
                    }
                } else {
                    res.json(await response.error(400, "User does not exist"));
                }
            }
        })
    } catch (err) {
        res.json(await response.error(500, err));
    }
})

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
                req.body.data.shop.color.length > 0 &&
                req.body.data.shop.banner_url &&
                req.body.data.shop.banner_url != null &&
                req.body.data.shop.banner_url.length > 0
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
                    "', banner_url = '" +
                    JSON.stringify(req.body.data.shop.banner_url) +
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
                "INSERT INTO product(title, descri, price, color, size, stock, img_url) VALUES('" +
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
                ", '" +
                JSON.stringify(product.img_url) +
                "');";
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


module.exports = router;