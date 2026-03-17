const express = require('express')
const router = express.Router()
const controller = require('../controllers/enrollment')

router.get('/user/:user_id', controller.getByUser)
router.get('/course/:course_id', controller.getByCourse)
router.post('/', controller.enroll)
router.delete('/:id', controller.cancel)

module.exports = router