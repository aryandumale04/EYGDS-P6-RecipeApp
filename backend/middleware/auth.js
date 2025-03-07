const jwt = require("jsonwebtoken");

const verifytoken = async (req, res, next) => {
    let token = req.headers["authorization"];

    if (token) {
        token = token.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: "Invalid Token" });
            } else {
                console.log(decoded);
                req.user = decoded;
                next(); // Move next() here
            }
        });
    } else {
        return res.status(400).json({ message: "Invalid Token" });
    }
};

module.exports = verifytoken;
