import jwt    from 'jsonwebtoken'
import config from './config.js'

function authMiddleware(request, response, next) {
    if (request.method === "OPTIONS") { 
        next() 
    }

    try {
        const token = request.headers.authorization.split(' ')[1]  // "Bearer ushcmt8374yncaeitcywm57a..."
        if (!token) {
            return response.status(403).json({message: 'Пользователь не авторизован.'})
        }
        const decodedData = jwt.verify(token, config.secret_jwt_key)
        request.user = decodedData  // + payload added in request = { uid, +iat, +exp } 
        next()
    } catch (error) {
        console.log(error)
        return response.status(403).json({message: 'Пользователь не авторизован.'})
    }
}

export default authMiddleware