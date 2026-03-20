const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT lessons.*, course.name as course_name
    FROM lessons
    JOIN course ON lessons.course_id = course.id
  `)
  return rows
}

const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT lessons.*, course.name as course_name
    FROM lessons
    JOIN course ON lessons.course_id = course.id
    WHERE lessons.id = ?
  `, [id])
  return rows[0]
}

const findBycourseId = async (course_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT * FROM lessons
    WHERE course_id = ?
  `, [course_id])
  return rows
}

const create = async (data) => {
  const conn = await getConnection()
  const { course_id, title, content, order_no } = data
  const [result] = await conn.query(
    'INSERT INTO lessons (course_id, title, content) VALUES (?, ?, ?)',
    [course_id, title, content || '', order_no || 1]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { title, content, order_no } = data
  const [result] = await conn.query(
    'UPDATE lessons SET title=?, content=?, WHERE id=?',
    [title, content, order_no, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  
  const [exercises] = await conn.query('SELECT id FROM exercises WHERE lesson_id = ?', [id])
  
  for (const ex of exercises) {
  
    await conn.query('DELETE FROM exercise_results WHERE exercise_id = ?', [ex.id])
  }
  
  await conn.query('DELETE FROM exercises WHERE lesson_id = ?', [id])
  
  await conn.query('DELETE FROM progress WHERE lesson_id = ?', [id])

  const [result] = await conn.query('DELETE FROM lessons WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findAll, findById, findBycourseId, create, update, remove }