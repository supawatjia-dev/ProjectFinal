const {getConnection} = require('../config/db')

const register = async (data) => {
  const conn = await getConnection()
  const { firstname, lastname, email, password, age, gender, description, role } = data
  const [result] = await conn.query(
    'INSERT INTO users (firstname, lastname, email, password, age, gender, description, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [firstname, lastname, email, password, age||null, gender||null, description||null, role||'student']
  )
  return result
}

const findByEmailAndPassword = async (email, password) => {
  const conn = await getConnection()
  const [rows] = await conn.query(
    'SELECT * FROM users WHERE email = ? AND password = ?',
    [email, password]
  )
  return rows[0]
}

const findAll = async ()=>{
    const conn = await getConnection()
    const [rows] = await conn.query('SELECT * FROM users')
    return rows
}
const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query('SELECT * FROM users WHERE id = ?', [id])
  return rows[0]
}

const create = async (data) => {
  const conn = await getConnection()
  const { firstname, lastname, age, gender, description } = data
  const [result] = await conn.query(
    'INSERT INTO users (firstname, lastname, age, gender, description) VALUES (?, ?, ?, ?, ?)',
    [firstname, lastname, age, gender, description]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { firstname, lastname, email, age, gender, description, role, avatar } = data
  const [result] = await conn.query(
    `UPDATE users SET 
      firstname = COALESCE(?, firstname),
      lastname = COALESCE(?, lastname),
      email = COALESCE(?, email),
      age = COALESCE(?, age),
      gender = COALESCE(?, gender),
      description = COALESCE(?, description),
      role = COALESCE(?, role),
      avatar = COALESCE(?, avatar)
    WHERE id = ?`,
    [firstname||null, lastname||null, email||null, age||null, 
     gender||null, description||null, role||null, avatar||null, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  // ลบ related data ก่อน
  await conn.query('DELETE FROM exercise_results WHERE user_id = ?', [id])
  await conn.query('DELETE FROM progress WHERE user_id = ?', [id])
  await conn.query('DELETE FROM enrollments WHERE user_id = ?', [id])
  // แล้วค่อยลบ user
  const [result] = await conn.query('DELETE FROM users WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = {findAll, findById, create,register,findByEmailAndPassword,update, remove}