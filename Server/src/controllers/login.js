const { get } = require('../app')
const UserModel = require('../models/login')

const validateUser = (data) => {
  const errors = []
  if (!data.firstname) errors.push('กรุณากรอกชื่อ')
  if (!data.lastname) errors.push('กรุณากรอกนามสกุล')
  if (!data.age) errors.push('กรุณากรอกอายุ')
  if (!data.gender) errors.push('กรุณาเลือกเพศ')
  if (!data.description) errors.push('กรุณากรอกคำอธิบาย')
  return errors
}

const register = async (req, res, next) => {
  try {
    const { firstname, lastname, email, password, age, gender, description, role } = req.body
    if (!firstname || !lastname || !email || !password)
      return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors: [] })
    const result = await UserModel.register({ firstname, lastname, email, password, age, gender, description, role })
    res.json({ message: 'สมัครสมาชิกสำเร็จ', data: result })
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await UserModel.findByEmailAndPassword(email, password)
    if (!user) return res.status(401).json({ message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', errors: [] })
    res.json({ message: 'login ok', user })
  } catch (error) {
    next(error)
  }
}


const getAll = async (req, res, next) => {
  try {
    const users = await UserModel.findAll()
    res.json(users)
  } catch (error) {
    next(error)
  }
}
const getById = async (req, res, next) => {
  try {
    const user = await UserModel.findById(req.params.id)
    if (!user) return res.status(404).json({ message: 'หาไม่เจอ' })
    res.json(user)
  } catch (error) {
    next(error)
  }
}

const create = async (req, res, next) => {
  try {
    const errors = validateUser(req.body)
    if (errors.length > 0) return res.status(400).json({ message: 'กรอกข้อมูลไม่ครบ', errors })
    const result = await UserModel.create(req.body)
    res.json({ message: 'เพิ่มข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

const update = async (req, res, next) => {
  try {
    const result = await UserModel.update(req.params.id, req.body)
    res.json({ message: 'อัพเดตข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

const remove = async (req, res, next) => {
  try {
    const result = await UserModel.remove(req.params.id)
    res.json({ message: 'ลบข้อมูลเรียบร้อยแล้ว', data: result })
  } catch (error) {
    next(error)
  }
}

module.exports = { getAll, getById, create, update, remove, register, login }

