let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
    middleware = require("../../middleware/index");

router.post("/add-image", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.product_id) {
            var data = req.body.data.shop;
        } else {
            res.json(await response.error(400, "corrupt data, try again"));
        }
    } catch (err) {
        console.log(err);
        res.json(await response.error(500));
    }
});