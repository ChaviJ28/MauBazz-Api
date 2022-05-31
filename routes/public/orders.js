let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    middleware = require("../../middleware/index");

//add order
router.post("/add-order", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var order = req.body.data,
                sql = "",
                total = 0,
                productList = req.body.data.products;
            productList.forEach(product => {
                total += product.price
            });
            sql =
                "INSERT INTO orders(usr_id, price, address, payment_type, paid_sts, delivery_comment, delivery_sts) VALUES(" +
                req.body.auth.user.user.usr_id +
                ", " +
                total +
                ", " +
                JSON.stringify(order.address) +
                ", " +
                JSON.stringify(order.payment_type) +
                ", '" +
                order.paid_sts +
                "', '" +
                order.delivery_comment +
                "', false)";
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    sql = "";
                    productList.forEach(product => {
                        sql +=
                            "INSERT INTO order_details(product_id, order_id, quantity) VALUES(" +
                            product.product_id +
                            ", " +
                            results.insertId +
                            ", " +
                            product.quantity +
                            "); ";
                    })
                    connection.query(sql, async(err, results) => {
                        if (err) {
                            res.status(500).json({ error: err });
                        } else {
                            res.status(200).send({ success: "order added" });
                        }
                    });
                }
            })
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});


//del order-to review
router.post("/delete-order", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var sql = "DELETE FROM cart WHERE id=" + req.body.data.id;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).send({ success: "removed from cart" });
                }
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});

//update order
router.post("/update-order", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var add = "",
                arr = Object.getOwnPropertyNames(req.body.data.params);
            arr.forEach(prop, i => {
                if (i > 0) {
                    add += ", "
                }
                if (typeof req.body.data.params[prop] == "string") {
                    add += prop + "='" + req.body.data.params[prop] + "'";
                } else if (typeof req.body.data.params[prop] == "object") {
                    add += prop + "=" + JSON.stringify(req.body.data.params[prop]);
                } else {
                    add += prop + "=" + req.body.data.params[prop];
                }
            })
            var sql = "UPDATE order SET " + add + " WHERE id=" + req.body.data.id;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    if (sts.affectedRows > 0) {
                        res.status(200).send({ success: "order updated" });
                    } else {
                        res.status(500).send({ success: "order data error" });
                    }
                }
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});


//list cart(not here cause its in public here) by id plitot
router.post("/list-orders", middleware.checkAuth, async(req, res) => {
    try {
        var add = ""
        if (req.body.data.search) {
            if (req.body.data.search.id) {
                add = " WHERE usr_id=" + req.body.data.search.usr_id;
            }
            if (req.body.data.search.id) {
                add = " WHERE paid_sts=" + req.body.data.search.paid_sts;
            }
            if (req.body.data.search.title) {
                add =
                    " WHERE address LIKE '%" +
                    req.body.data.search.address +
                    "%'";
            }
        }
        var sql = "SELECT * FROM orders" + add;
        connection.query(sql, async(err, results) => {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                if (req.body.data.populate) {
                    sql = "";
                    results.forEach(order => {
                        sql +=
                            "SELECT * FROM order_details WHERE order_id = " +
                            order.id;
                        connection.query(sql, async(err, results) => {
                            if (err) {
                                res.status(500).json({ error: err });
                            } else {
                                // add order_details to each order
                            }
                        })
                    })
                } else {
                    res.status(200).json({ data: results });
                }
            }
        })
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});

module.exports = router;