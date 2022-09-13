import { validationResult } from 'express-validator'
import config               from './config.js'
import authService          from './authService.js'
import userService          from './userService.js'
import jwt    from 'jsonwebtoken'

class AuthController {
    
    async registration(request, response) {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({message: 'Ошибка(и) при регистрации', errors})
            }

            const {email, password, nickname} = request.body
            if (await userService.checkNicknameRegistered(nickname)) {
                return response.status(400).json({message: 'Пользователь с таким nickname уже существует.'})
            }
            if (await userService.checkEmailRegistered(email)) {
                return response.status(400).json({message: 'Пользователь с таким email уже существует.'})
            }

            const uid = await userService.saveUser(email, password, nickname)
            const token = authService.genereteAccessToken(uid)
            response.json({    // def res.status(200) / registered new user
                token, 
                expire: config.expiresIn_jwt.toString()
            }) 

        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Registration error.'})
        }
    }

    async login(request, response) {
        try {
            const {email, password} = request.body
            const uid = await userService.getUserUidByEmail(email)
            if (!uid) {
                return response.status(400).json({message: `Пользователь с email ${email} не найден.`})
            }
            if (!authService.checkValidPassword(email, password)) {
                return response.status(400).json({message: 'Введен неверный пароль.'})
            }

            const token = authService.genereteAccessToken(uid)
            response.json({token, expire: config.expiresIn_jwt.toString()})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Login error.'})
        }
    }

    logout(request, response) {
        // TODO: delete token on front(client)
        // or DB Black list of tokens
        // or use Redis - https://stackoverflow.com/questions/37959945/how-to-destroy-jwt-tokens-on-logout
    }

    refreshToken(request, response) {
        const uid = request.user.uid  // authorized in Middleware and uid added in request there
        const token = authService.genereteAccessToken(uid)
        response.json({token, expire: config.expiresIn_jwt.toString()})
    }

}

export default new AuthController()