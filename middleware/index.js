const jwt = require('jsonwebtoken')
module.exports = function(req,res,next){
    const token = req.header('x-auth-token')
    if(!token){
        return res.status(401).json({msg :"authorization denied"})
    }
    try{
        const decoded =jwt.verify(token, 'SECRETKEY')
        console.log("decoded", decoded)
        req.user = decoded.usr
        next ()
    }catch(err){
        res.status(401).json({msg :"token is not valid"})
    }
}