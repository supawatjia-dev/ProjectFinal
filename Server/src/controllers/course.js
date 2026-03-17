const courseModel = require('../models/course')

const getAll = async (req, res, next) => {
  try {
    const courses = await courseModel.findAll()
    res.json(courses)
  } catch (error) {
    next(error)
  }
}

const getById = async (req, res, next) => {
  try {
    const course = await courseModel.findById(req.params.id)
    if (!course) return res.status(404).json({ message: 'ไม่พบ course' })
    res.json(course)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const { name, user_id } = req.body
    const errors = []
    if (!name) errors.push('กรุณากรอกชื่อ course')
    if (!user_id) errors.push('กรุณาระบุ user_id')
    if (errors.length > 0) return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })

    const result = await courseModel.create(req.body)
    res.json({ message: 'เพิ่มข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await courseModel.update(req.params.id, req.body)
    res.json({ message: 'อัพเดตข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await courseModel.remove(req.params.id)
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove }
