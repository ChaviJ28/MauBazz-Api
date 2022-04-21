//get arr imgs for product
//add img by prod_id
//del img by id
//function to add arr of imgs from specif prod(add_prod)

let express = require("express"),
    multer = require("multer");

exports.uploadImage = (req, res, next) => {
    //Image Settings
    const imageStorage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, "public/images");
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname);
        },
    });
    const imageFileFilter = (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error("You can upload only image files!"), false);
        }
        cb(null, true);
    };
    return multer({ imageFileFilter, imageStorage });
};