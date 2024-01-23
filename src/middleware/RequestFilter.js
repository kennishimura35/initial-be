const { Unauthorized, Ok } = require('../helper/ResponseUtil')
const { verifyJwt, createRefreshToken } = require('../helper/JwtUtil')


const getToken = (bearer) => {
    return bearer.slice(7, bearer.length)
}

const JwtFilter = (req, res, next) => {
    if(req.headers.authorization) {
        const token = getToken(req.headers.authorization)
        if(verifyJwt(req, token)) {
            next()
        } else {
            Unauthorized(res, 'Token is not valid')
        }
    } else {
        Unauthorized(res, 'Token is missing')
    }    
}

const RefreshToken = (req, res, next) => {
    if(req.headers.authorization) {
        const token = getToken(req.headers.authorization)
        const data = createRefreshToken(token)
        if(data) {
           return Ok(res, ['refresh token created'], data) 
        } else {
            Unauthorized(res, 'Token is not valid')
        }
    } else {
        Unauthorized(res, 'Token is missing')
    }  
}

const PermissionFilter = (perm) => {
    
    
    return (req, res, next) => {
        
        const data = req.app.locals.permission
        let error
        const http_method = perm[0];
        const api_url_name = perm[1];
        data.forEach(permission => {  
            if(http_method == permission.http_method && api_url_name == permission.api_url_name){
                error = "No"
                return next()
            }
           
          });
        
          if(error != "No"){
            error = "Yes"
            return Unauthorized(res, 'No Permission Access')
            }
        
    }
    
}



module.exports = { JwtFilter, PermissionFilter, RefreshToken }