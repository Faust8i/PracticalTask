import DAO    from './DAO.js'
import config from './config.js'

class TagService {

    async checkTagnameRegistered(name) {
        return (await DAO.getTagByName(name)) ? true : false
    }

    async saveTag(uid, name, sortOrder = '0') {
        await DAO.saveTag(uid, name, sortOrder)
        return await DAO.getTagByName(name)
    }

    async getTagById(id) {
        return await DAO.getTagById(id)
    }

    async checkCanModifyTag(userUid, tagId) {
        return await DAO.checkCanModifyTag(userUid, tagId)
    }

    async updateTag(tagId, name, sortOrder) {
        await DAO.updateTag(tagId, name, sortOrder)
        return await this.getTagById(tagId)
    }

    async deleteTag(id) {
        return await DAO.deleteTag(id)
    }

    async bindTags(uid, bindedTags) {
        return await DAO.bindTags(uid, bindedTags)
    }

    async getUserTags(uid) {
        return await DAO.getUserTags(uid)
    }

    async udbindTag(userUid, tagId) {
        return await DAO.udbindTag(userUid, tagId)
    }

    async getTags(sortByOrder, sortByName, page = config.def_page_num, pageSize = config.def_page_size) {
        return await DAO.getTags(sortByOrder, sortByName, page, pageSize)
    }

}

export default new TagService()