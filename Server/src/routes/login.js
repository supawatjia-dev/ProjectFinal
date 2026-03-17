const express=require('express')
const router = express.Router()
const controller = require('../controllers/login')


router.post('/register', controller.register)
router.post('/login', controller.login)
router.get('/',controller.getAll)
router.get('/:id', controller.getById)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)


module.exports = router

