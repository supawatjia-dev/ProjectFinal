const { getConnection } = require('../config/db')

const findAll = async () => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT course.*, users.firstname, users.lastname
    FROM course
    JOIN users ON course.user_id = users.id
    ORDER BY course.created_at DESC
  `)
  return rows
}

const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT course.*, users.firstname, users.lastname
    FROM course
    JOIN users ON course.user_id = users.id
    WHERE course.id = ?
  `, [id])
  return rows[0]
}

const create = async (data) => {
  const conn = await getConnection()
  const { name, description, user_id, thumbnail } = data
  const [result] = await conn.query(
    'INSERT INTO course (name, description, user_id, thumbnail) VALUES (?, ?, ?, ?)',
    [name, description || '', user_id, thumbnail || null]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { name, description, thumbnail } = data
  const [result] = await conn.query(
    `UPDATE course SET 
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      thumbnail = COALESCE(?, thumbnail)
    WHERE id = ?`,
    [name || null, description || null, thumbnail || null, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()

  const [lessons] = await conn.query('SELECT id FROM lessons WHERE course_id = ?', [id])

  for (const lesson of lessons) {
    
    const [exercises] = await conn.query('SELECT id FROM exercises WHERE lesson_id = ?', [lesson.id])
    for (const ex of exercises) {
      await conn.query('DELETE FROM exercise_results WHERE exercise_id = ?', [ex.id])
    }
    
    await conn.query('DELETE FROM exercises WHERE lesson_id = ?', [lesson.id])

    await conn.query('DELETE FROM progress WHERE lesson_id = ?', [lesson.id])
  }

  await conn.query('DELETE FROM lessons WHERE course_id = ?', [id])

  await conn.query('DELETE FROM enrollments WHERE course_id = ?', [id])
  const [result] = await conn.query('DELETE FROM course WHERE id = ?', [parseInt(id)])
  return result
}

module.exports = { findAll, findById, create, update, remove }