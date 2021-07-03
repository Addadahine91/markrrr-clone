const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, 'jwt_secret');
        req.userData = {userId: decodedToken.userId};
        next();
    } catch(error) {
        console.log('error: '+ error);
        res.status(401).json({
            message: "Auths Failed"
        });
    }
}