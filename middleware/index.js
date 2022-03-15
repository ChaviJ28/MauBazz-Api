var obj = {};

// middleware for checking api_key
obj.checkApiKey = (req, res, next) => {
    if (req.body.api_key && req.body.api_key == process.env.API_KEY) {
        next();
    } else {
        res.json({
            error: {
                status: 403,
                code: "Forbidden",
                message: "API_KEY Error",
            },
        });
    }
};

module.exports = obj;