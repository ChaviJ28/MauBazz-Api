exports.error = async(status, msg) => {
    var code;
    switch (status) {
        case 400:
            code = "Bad Request";
            break;
        case 401:
            code = "Unauthorized";
            break;
        case 403:
            code = "Forbidden";
            break;
        case 404:
            code = "Not Found";
            break;
        default:
            code = "Internal Server Error";
            break;
    }
    if (msg == undefined) {
        msg = "Please try again later"
    } {
        json = {
            status,
            error: {
                code,
                msg,
            },
        };
    }
    return json;
};

exports.respond = async(data) => {
    {
        json = {
            status: 200,
            data,
        };
    }
    return json;
};

exports.success = async(msg) => {
    {
        json = {
            status: 200,
            success: {
                msg,
            },
        };
    }
    return json;
}