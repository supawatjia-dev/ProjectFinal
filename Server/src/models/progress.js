const { getConnection } = require('../config/db')

const findByUser = async (user_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT progress.*, lessons.title AS lesson_title,
           course.name AS course_name
    FROM progress
    JOIN lessons ON progress.lesson_id = lessons.id
    JOIN course ON lessons.course_id = course.id
    WHERE progress.user_id = ?
  `, [user_id])
  return rows
}

const getCourseProgress = async (user_id, course_id) => {
  const conn = await getConnection()
  const [total] = await conn.query(`
    SELECT COUNT(*) AS total FROM lessons WHERE course_id = ?
  `, [course_id])

  const [completed] = await conn.query(`
    SELECT COUNT(*) AS completed FROM progress
    JOIN lessons ON progress.lesson_id = lessons.id
    WHERE progress.user_id = ? AND lessons.course_id = ? AND progress.is_completed = true
  `, [user_id, course_id])

  return {
    total: total[0].total,
    completed: completed[0].completed,
    percent: total[0].total === 0 ? 0 : 
      Math.round((completed[0].completed / total[0].total) * 100)
  }
}


const markCompleted = async (user_id, lesson_id) => {
  const conn = await getConnection()
  

  const [existing] = await conn.query(
    'SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?',
    [user_id, lesson_id]
  )

  if (existing.length > 0) {

    const [result] = await conn.query(`
      UPDATE progress SET is_completed = true, completed_at = NOW()
      WHERE user_id = ? AND lesson_id = ?
    `, [user_id, lesson_id])
    return result
  } else {

    const [result] = await conn.query(`
      INSERT INTO progress (user_id, lesson_id, is_completed, completed_at)
      VALUES (?, ?, true, NOW())
    `, [user_id, lesson_id])
    return result
  }
}

const remove = async (user_id, lesson_id) => {
  const conn = await getConnection()
  const [result] = await conn.query(
    'DELETE FROM progress WHERE user_id = ? AND lesson_id = ?',
    [user_id, lesson_id]
  )
  return result
}

module.exports = { findByUser, getCourseProgress, markCompleted, remove }