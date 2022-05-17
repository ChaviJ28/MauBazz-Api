let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    middleware = require("../../middleware/index");


router.post("/add-banner", middleware.checkAuth, async(req, res) => {
    try {
        if (req.body.data && req.body.data.img_url) {
            var body = req.body;
            var sql =
                "INSERT INTO shop_banner(shop_id, img_url) VALUES( " +
                body.auth.user.shop_id +
                ", '" +
                body.data.img_url +
                "')";
            connection.query(sql, async(err, results) => {
                if (err) {
                    res.status(500).json({ error: err });
                } else {
                    res.status(200).send({ success: "banner added successfully" });
                }
            });
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        res.status(500).json({ error: "Please Try Again later" });
    }
});

module.exports = router;