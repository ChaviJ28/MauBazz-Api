let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    bcrypt = require("bcrypt"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
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
                    res.json(await response.error(500, err));
                } else {
                    res.json(await response.success("banner added successfully"));
                }
            });
        } else {
            res.json(await response.error(400, "corrupt data, try again"));
        }
    } catch (err) {
        res.json(await response.error(500, err));
    }
});

module.exports = router;