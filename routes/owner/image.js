let express = require("express"),
    router = express.Router(),
    mysql = require("mysql"),
    multer = require("multer"),
    connection = mysql.createConnection(require("../../db")),
    response = require("../functions/functions"),
    image = require("../functions/image"),
    middleware = require("../../middleware/index");



router.post("/add-image", image.uploadImage, async(req, res) => {
    try {
        console.log(req.file);
        console.log(req.files);

        if (req.body.data) {
            var data = req.body.data;
            console.log(data);
        } else {
            res.json(await response.error(400, "corrupt data, try again"));
        }
    } catch (err) {
        console.log(err);
        res.json(await response.error(500));
    }
});


// router.post("/add-image-2", upload.single('image'), async(req, res) => {
//     try {
//         console.log(req.body);
//         console.log(req.file);
//         console.log(req.files);

//         if (req.body.data) {
//             var data = req.body.data;
//             console.log(data);
//         } else {
//             res.json(await response.error(400, "corrupt data, try again"));
//         }
//     } catch (err) {
//         console.log(err);
//         res.json(await response.error(500));
//     }
// });

module.exports = router;