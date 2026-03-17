const express = require('express')
const router = express.Router()
const controller = require('../controllers/exerciseResult')

router.get('/user/:user_id', controller.getByUser)
router.get('/user/:user_id/lesson/:lesson_id', controller.getScoreByLesson)
router.post('/', controller.submit)

module.exports = router