const EnrollmentModel = require('../models/enrollment')

const getByUser = async (req, res, next) => {
  try {
    const enrollments = await EnrollmentModel.findByUser(req.params.user_id)
    res.json(enrollments)
  } catch (error) {
    next(error)
  }
}
const getByCourse = async (req, res, next) => {
  try {
    const enrollments = await EnrollmentModel.findByCourse(req.params.course_id)
    res.json(enrollments)
  } catch (error) {
    next(error)
  }
}
const enroll = async (req, res, next) => {
  try {
    const { user_id, course_id } = req.body

    const existing = await EnrollmentModel.checkEnrollment(user_id, course_id)
    if (existing) {
      return res.status(400).json({ message: 'ลงทะเบียนคอร์สนี้แล้ว' })
    }

    const result = await EnrollmentModel.create(user_id, course_id)
    res.json({ message: 'ลงทะเบียนสำเร็จ', data: result })
  } catch (error) {
    next(error)
  }
}
const cancel = async (req, res, next) => {
  try {
    const result = await EnrollmentModel.remove(req.params.id)
    res.json({ message: 'ยกเลิกการลงทะเบียนแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getByUser, getByCourse, enroll, cancel }