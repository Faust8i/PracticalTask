import Router         from "express"
import authController from './authController.js'
import { check }      from 'express-validator'
import authMiddleware from "./authMiddleware.js"
import userController from "./userController.js"
import tagController  from "./tagController.js"

const router = new Router()

router.post('/signin', [
    check('nickname', 'Nickname не может быть пустым').trim().notEmpty(),
    check('email',    'Email написан некорректно.').isEmail(),
    check('password', 'Пароль должен быть более 8 символов, содержать минимум 1 цифру, большую и маленькую буквы')
      .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0}),
], authController.registration)
router.post('/login', authController.login)
router.post('/logout', authMiddleware, authController.logout)
router.get('/refreshtoken', authMiddleware, authController.refreshToken)

router.get('/user', authMiddleware, userController.getUser)
router.put('/user', [
    check('nickname', 'Nickname не может быть пустым').trim().notEmpty(),
    check('email',    'Email написан некорректно.').isEmail(),
    check('password', 'Пароль должен быть более 8 символов, содержать минимум 1 цифру, большую и маленькую буквы')
      .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0}),
  ], authMiddleware, userController.updateUser)
router.delete('/user', authMiddleware, userController.deleteUser)

router.post('/tag', [
    check('sortOrder', 'SortOrder не должен быть длиннее 40 символов.').isLength({max: 40})
  ], authMiddleware, tagController.createTag)
router.get('/tag/:id', authMiddleware, tagController.getTagById)
router.put('/tag/:id', authMiddleware, tagController.updateTag)
router.delete('/tag/:id', authMiddleware, tagController.deleteTag)
router.get('/tag', authMiddleware, tagController.getTags)

router.post('/user/tag', authMiddleware, tagController.bindTags)
router.delete('/user/tag/:id', authMiddleware, tagController.udbindTag)
router.get('/user/tag/my', authMiddleware, tagController.getUserTags)

router.get('/', (request, response) => {
    response.json({ info: 'Реализация по постановке задачи: https://github.com/kisilya/test-tasks/tree/main/nodeJS' })

})

export default router