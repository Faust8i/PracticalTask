import tagService           from "./tagService.js"
import { validationResult } from 'express-validator'

class TagController {
   
    async createTag(request, response) {
        try {
            const errors = validationResult(request)
            if (!errors.isEmpty()) {
                return response.status(400).json({message: 'Ошибка(и) при добавлении tag.', errors})
            }
            
            const uid = request.user.uid  // authorized in Middleware and uid added in request there
            const {name, sortOrder} = request.body
            
            if (await tagService.checkTagnameRegistered(name)) {
                return response.status(400).json({message: 'Tag с таким name уже существует.'})
            }

            const tag = await tagService.saveTag(uid, name, sortOrder)
            return response.json(tag)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Create tag error.'})
        }
    }

    async getTagById(request, response) {
        try {
            const tag = await tagService.getTagById(request.params.id)
            return response.json(tag)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get tag by ID error.'})
        }
    }

    async updateTag(request, response) {
        try {
            const tagId   = request.params.id
            const {name, sortOrder} = request.body
            const userUid = request.user.uid
            
            if (!(await tagService.checkCanModifyTag(userUid, tagId))) {
                return response.status(400).json({message: 'Редактировать tag может только тот, кто его создал.'})
            }
            
            const tag = await tagService.updateTag(tagId, name, sortOrder)
            return response.json(tag)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get tag by ID error.'})
        }
    }

    async deleteTag(request, response) {
        try {
            const tagId   = request.params.id
            const userUid = request.user.uid
            
            if (!(await tagService.checkCanModifyTag(userUid, tagId))) {
                return response.status(400).json({message: 'Удалить tag может только тот, кто его создал.'})
            }
            
            await tagService.deleteTag(tagId)
            return response.json({message: 'Tag deleted.'})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get tag by ID error.'})
        }
    }

    async bindTags(request, response) {
        try {
            const uid        = request.user.uid
            const bindedTags = request.body.tags
            // TODO: переделать на проверку на стороне сервера в одну итерацию
            for (let i = 0; i < bindedTags.length; i++) {
                if (!(await tagService.getTagById(bindedTags[i]))) {
                    return response.status(400).json({message: `Tag (id=${bindedTags[i]}) not exist.`})
                }
            } // TODO.
            await tagService.bindTags(uid, bindedTags)
            const tagsInfo = await tagService.getUserTags(uid)
            return response.json(tagsInfo)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Bind tags error.'})
        }
    }

    async udbindTag(request, response) {
        try {
            const tagId   = request.params.id
            const userUid = request.user.uid
            
            await tagService.udbindTag(userUid, tagId)
            return response.json({message: 'Tag unlinked.'})
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Unbindig tag error.'})
        }
    }

    async getUserTags(request, response) {
        try {
            const uid = request.user.uid
            const tagsInfo = await tagService.getUserTags(uid)
            return response.json(tagsInfo)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get my tags error.'})
        }
    }

    async getTags(request, response) {
        try {
            const {sortByOrder, sortByName, page, pageSize} = request.query
            const tags = await tagService.getTags(sortByOrder, sortByName, page, pageSize)
            return response.json(tags)
        } catch (error) {
            console.log(error)
            response.status(400).json({message: 'Get tags error.'})
        }
    }

}

export default new TagController()