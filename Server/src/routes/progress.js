const express = require('express')
const router = express.Router()
const controller = require('../controllers/progress')

router.get('/user/:user_id', controller.getByUser)
router.get('/user/:user_id/course/:course_id', controller.getCourseProgress)
router.post('/user/:user_id', controller.markCompleted)
router.delete('/user/:user_id/lesson/:lesson_id', controller.remove)

module.exports = router