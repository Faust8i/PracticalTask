import userService          from "./userService.js"
import { validationResult } from 'express-validator'

class UserController {
   
    async getUser(request, response) {
        try {
            const uid = request.user.uid  // authorized in Middleware and uid added in request there
            const userTag = await userService.getUserInfoByUid(uid)
            return response.json(userTag)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get user error.'})
        }
    }

    async updateUser(request, response) {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({message: 'Ошибка(и) при обновлении user.', errors})
            }

            const uid = request.user.uid
            const {email, password, nickname} = request.body
            if (await userService.checkNicknameRegistered(nickname)) {
                return response.status(400).json({message: 'Пользователь с таким nickname уже существует.'})
            }
            if (await userService.checkEmailRegistered(email)) {
                return response.status(400).json({message: 'Пользователь с таким email уже существует.'})
            }

            await userService.updateUser(uid, email, password, nickname)
            const updatedNickname = await userService.getUserNicknameByUid(uid)
            const updatedEmail    = await userService.getUserEmailByUid(uid)

            return response.json({"email": updatedEmail, "nickname": updatedNickname})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Update user error.'})
        }
    }

    async deleteUser(request, response) {
        try {
            const uid = request.user.uid
            await authService.logout(uid)
            await userService.deleteUser(uid)
            return response.json({message: 'User deleted.'})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Delete user error.'})
        }
        
    }

}

export default new UserController()