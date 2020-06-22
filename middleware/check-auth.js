const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try{
        //token should be put into authorization in header, remember to include a "Bearer " in front
        const token = req.headers.authorization.split(" ")[1];
        const decode = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decode;
    }catch (err){
        return res.status(401).json({
            message: 'Authentication Failed'
        });
    }
    next();
};