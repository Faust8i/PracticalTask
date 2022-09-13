import bcrypt from 'bcryptjs'
import config from './config.js'
import DAO    from './DAO.js'

class UserService {
    
    async checkNicknameRegistered(nickname) {
        return (await DAO.getNicknameExist(nickname)) ? true : false
    }

    async checkEmailRegistered(email) {
        return (await this.getUserUidByEmail(email)) ? true : false
    }

    async saveUser(email, password, nickname) {
        const hashedPassword = bcrypt.hashSync(password, config.level_hashing_password)
        await DAO.saveUser(email, hashedPassword, nickname)
        return await this.getUserUidByEmail(email)
    }

    async getUserPasswordByEmail(email) {
        return await DAO.getUserPasswordByEmail(email)
    }

    async getUserUidByEmail(email) {
        return await DAO.getUserUidByEmail(email)
    }

    async getUserInfoByUid(uid) {
        return await DAO.getUserInfoByUid(uid)
    }

    async updateUser(uid, email, password, nickname) {
        const hashedPassword = bcrypt.hashSync(password, config.level_hashing_password)
        await DAO.updateUser(uid, email, hashedPassword, nickname)
    }

    async getUserNicknameByUid(uid) {
        return await DAO.getUserNicknameByUid(uid)
    }

    async getUserEmailByUid(uid) {
        return await DAO.getUserEmailByUid(uid)
    }

    async deleteUser(uid) {
        return await DAO.deleteUser(uid)
    }

}

export default new UserService()