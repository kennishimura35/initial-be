const jwt = require('jsonwebtoken')
const secret = process.env.JWT_SECRET

const verifyJwt = (req, token) => {
    const decodes = jwt.decode(token)
    try {
        var decoded = jwt.verify(token, secret);
        // set userId into request
        req.app.locals.id_user = decoded.id_user
        req.app.locals.username = decoded.username

        return true
    } catch(err) {
        if(err.message == 'jwt expired'){
            console.log("invalid")
        }
        console.log(err.message)
        return false
    }
    
}

const createRefreshToken = (token) => {
    const decoded = jwt.decode(token)
    let data
    if (decoded !== null){
        data = {username: decoded.username}
        
    } else{
        return false
    }
    

    try {
        var decodes = jwt.verify(token, secret);
        if(decodes){
            return token
        }
        
    } catch (err) {
        console.log(err)
        if(err.message === 'jwt expired'){
            let expires = process.env.JWT_EXPIRED
            return jwt.sign(data, secret, {
                expiresIn: expires
            });
        } else {
            return false
        }
        
    }
}

const createJwtToken = (data) => {
    let expires = process.env.JWT_EXPIRED
    return jwt.sign(data, process.env.JWT_SECRET, {
        expiresIn: expires
    });
}

module.exports = { verifyJwt, createJwtToken, createRefreshToken }