const ProgressModel = require('../models/progress')

const getByUser = async (req, res, next) => {
  try {
    const progress = await ProgressModel.findByUser(req.params.user_id)
    res.json(progress)
  } catch (error) {
    next(error)
  }
}

const getCourseProgress = async (req, res, next) => {
  try {
    const result = await ProgressModel.getCourseProgress(
      req.params.user_id,
      req.params.course_id
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}

const markCompleted = async (req, res, next) => {
  try {
    const { user_id, lesson_id } = req.body
    const result = await ProgressModel.markCompleted(user_id, lesson_id)
    res.json({ message: 'บันทึกความคืบหน้าแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await ProgressModel.remove(
      req.params.user_id,
      req.params.lesson_id
    )
    res.json({ message: 'ลบความคืบหน้าแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getByUser, getCourseProgress, markCompleted, remove }