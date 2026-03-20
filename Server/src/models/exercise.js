const { getConnection } = require('../config/db')

const findByLesson = async (lesson_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(
    'SELECT * FROM exercises WHERE lesson_id = ?',
    [lesson_id]
  )
  return rows
}

const findById = async (id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(
    'SELECT * FROM exercises WHERE id = ?',
    [id]
  )
  return rows[0]
}

const create = async (data) => {
  const conn = await getConnection()
  const { lesson_id, question, choice_a, choice_b, choice_c, choice_d, answer } = data
  const [result] = await conn.query(
    'INSERT INTO exercises (lesson_id, question, choice_a, choice_b, choice_c, choice_d, answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [lesson_id, question, choice_a, choice_b, choice_c, choice_d, answer]
  )
  return result
}

const update = async (id, data) => {
  const conn = await getConnection()
  const { question, choice_a, choice_b, choice_c, choice_d, answer } = data
  const [result] = await conn.query(
    'UPDATE exercises SET question=?, choice_a=?, choice_b=?, choice_c=?, choice_d=?, answer=? WHERE id=?',
    [question, choice_a, choice_b, choice_c, choice_d, answer, id]
  )
  return result
}

const remove = async (id) => {
  const conn = await getConnection()
  
  await conn.query('DELETE FROM exercise_results WHERE exercise_id = ?', [parseInt(id)])

  const [result] = await conn.query('DELETE FROM exercises WHERE id = ?', [parseInt(id)])
  return result
}

const removeByLesson = async (lesson_id) => {
  const conn = await getConnection()
  const [result] = await conn.query(
    'DELETE FROM exercises WHERE lesson_id = ?',
    [parseInt(lesson_id)]
  )
  return result
}

module.exports = { findByLesson, findById, create, update, remove ,removeByLesson}