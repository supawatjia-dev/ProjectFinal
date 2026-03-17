const express = require('express')
const router = express.Router()
const controller = require('../controllers/exercise')

router.get('/lesson/:lesson_id', controller.getByLesson)
router.get('/lesson/:lesson_id/:id', controller.getById)
router.post('/', controller.create)
router.put('/lesson/:lesson_id/:id', controller.update)
router.delete('/lesson/:lesson_id/:id', controller.remove)
router.delete('/lesson/:lesson_id', controller.removeByLesson)

module.exports = router