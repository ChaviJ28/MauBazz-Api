let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    multer = require("multer"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
    middleware = require("../../middleware/index");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

router.post("/add-image", upload.array("image"), async(req, res) => {
    console.log(req.files);
    try {
        if (req.files) {
            var arr = []
            req.files.forEach(img => {
                arr.push(img.filename);
            })
            res.json(await response.respond(arr));
        } else {
            res.status(400).json({ error: "corrupt data, try again" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Please Try Again later" });
    }
});

//NOT IN USE/ USELESS IN CURRENT CONTEXT ?
router.post("/get-image", async(req, res) => {
    try {
        if (req.body.data) {
            var data = req.body.data,
                add = "",
                sql = "SELECT * FROM product_image";
            if (req.body.data.product_id) {
                add = "WHERE product_id = " + req.body.data.product_id;
            }
            connection.query(sql + add, async(err, results) => {
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