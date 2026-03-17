const LessonModel = require('../models/lesson')

const getAll = async (req, res, next) => {
  try {
    const lessons = await LessonModel.findAll()
    res.json(lessons)
  } catch (error) { next(error) }
}

const getById = async (req, res, next) => {
  try {
    const lesson = await LessonModel.findById(req.params.id)
    if (!lesson) return res.status(404).json({ message: 'ไม่พบ lesson' })
    res.json(lesson)
  } catch (error) { next(error) }
}

const getBycourseId = async (req, res, next) => {
  try {
    const lessons = await LessonModel.findBycourseId(req.params.course_id)
    res.json(lessons)
  } catch (error) { next(error) }
}

const create = async (req, res, next) => {
  try {
    const result = await LessonModel.create(req.body)
    res.json({ message: 'สร้างข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) { next(error) }
}

const update = async (req, res, next) => {
  try {
    const result = await LessonModel.update(req.params.id, req.body)
    res.json({ message: 'อัพเดตข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) { next(error) }
}

const remove = async (req, res, next) => {
  try {
    const result = await LessonModel.remove(req.params.id)
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) { next(error) }
}

module.exports = { getAll, getById, getBycourseId, create, update, remove }