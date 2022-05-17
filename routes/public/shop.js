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
                add = " WHERE shop.shop_id=" + req.body.data.search.id;
            }
            if (req.body.data.search.brand_name) {
                add = " WHERE shop.brand_name LIKE '%" + req.body.data.search.brand_name + "%'";
            }
        }
        if (req.body.data.populate) {
            add += "; SELECT * FROM shop_banner";
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
                        var banners = [];
                        results[1]
                            .filter(x => x.shop_id === shop.shop_id)
                            .forEach(o => {
                                banners.push(o.img_url)
                            });
                        shop.banners = banners
                        arr.push(shop)
                    });

                    // var arr = new Array();
                    // await results.forEach((shop) => {
                    //     sql =
                    //         "SELECT img_url FROM shop_banner WHERE shop_id=" +
                    //         shop.shop_id;
                    //     connection.query(sql, (err, banners) => {
                    //         if (err) {
                    //             res.status(500).json({ error: err });
                    //         } else {
                    //             var banner = [];
                    //             banners.forEach((ban) => {
                    //                 banner.push(ban.img_url);
                    //             });
                    //             var obj = {
                    //                 shop: shop.color,
                    //                 banner: banner,
                    //             };
                    //             console.log(obj);
                    //             arr.push(shop);
                    //             console.log(arr);
                    //         }
                    //     });
                    // })
                    // alert("ad")
                    // console.log(arr)
                    res.json({ data: arr });
                } else {
                    console.log(results);
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
                res.status(200).send({ data: results });
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

async function getShopBanner(shopid) {
    sql = "SELECT img_url FROM shop_banner WHERE shop_id=" + shopid;
    connection.query(sql, (err, banners) => {

        var banner = [];
        banners.forEach((ban) => {
            banner.push(ban.img_url);
        });
        console.log(banner)
        return banner;
    });
}


module.exports = router;