let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    middleware = require("../../middleware/index");

//add cart
router.post("/add-cart", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var cart = req.body.data,
                sql = "INSERT INTO cart(product_id,usr_id,quantity) VALUES(" + cart.product + ", " + req.body.auth.user.usr_id + ", " + cart.quantity + ")";
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).send({ success: "added to cart" });
                }
            })
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});


//del cart
router.post("/delete-cart", middleware.checkAuth, async(req, res) => {
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

//update cart
router.post("/update-cart", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data) {
            var sql =
                "UPDATE cart SET quatity= " +
                req.body.data.quantity +
                " WHERE id=" +
                req.body.data.id;
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).send({ success: "quatity updated" });
                }
            });
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});


//list cart
router.post("/list-cart", middleware.checkAuth, async(req, res) => {

});

module.exports = router;