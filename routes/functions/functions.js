exports.error = async(msg) => {
    if (msg == undefined) {
        msg = "Please try again later";
    }

    return {
        error: {
            msg
        }
    };
};

exports.respond = async(data) => {
    // {
    //     json = {
    //         status: 200,
    //         data,
    //     };
    // }
    // return json;

    res.status(200).send({
        data
    });
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