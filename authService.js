import bcrypt      from 'bcryptjs'
import jwt         from 'jsonwebtoken'
import config      from './config.js'
import userService from './userService.js'

class AuthService {
    
    async checkValidPassword(email, password) {
        const hashedPassword = await userService.getUserPasswordByEmail(email)
        const validPassword = bcrypt.compareSync(password, hashedPassword)
        return (validPassword) ? true : false
    }

    genereteAccessToken(uid) {
        const payLoad = { uid }
        return jwt.sign(payLoad, config.secret_jwt_key, {expiresIn: config.expiresIn_jwt})
    }

    logout(uid) {
        // TODO
        return true
    }

}

export default new AuthService()