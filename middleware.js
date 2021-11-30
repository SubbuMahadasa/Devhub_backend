const jwt = require('jsonwebtoken');

module.exports = function(req , res , next){
const token = req.header('x-token');
if (!token) {
    return res.status(400).send('Token not found')
}
let decode = jwt.verify(token , 'jwtSecret')
req.user = decode.user
next();
}
