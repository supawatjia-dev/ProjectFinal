const { getConnection } = require('../config/db')

// ดูผลทั้งหมดของ user
const findByUser = async (user_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT exercise_results.*, 
           exercises.question, exercises.answer AS correct_answer,
           lessons.title AS lesson_title
    FROM exercise_results
    JOIN exercises ON exercise_results.exercise_id = exercises.id
    JOIN lessons ON exercises.lesson_id = lessons.id
    WHERE exercise_results.user_id = ?
  `, [user_id])
  return rows
}

// ดูคะแนนรวมของ user ใน lesson
const getScoreByLesson = async (user_id, lesson_id) => {
  const conn = await getConnection()
  const [total] = await conn.query(`
    SELECT COUNT(*) AS total FROM exercises WHERE lesson_id = ?
  `, [lesson_id])

  const [correct] = await conn.query(`
    SELECT COUNT(*) AS correct FROM exercise_results
    JOIN exercises ON exercise_results.exercise_id = exercises.id
    WHERE exercise_results.user_id = ? 
    AND exercises.lesson_id = ?
    AND exercise_results.is_correct = true
  `, [user_id, lesson_id])

  return {
    total: total[0].total,
    correct: correct[0].correct,
    score: total[0].total === 0 ? 0 :
      Math.round((correct[0].correct / total[0].total) * 100)
  }
}

// ส่งคำตอบ
const submit = async (user_id, exercise_id, selected_answer) => {
  const conn = await getConnection()

  // เช็คคำตอบที่ถูก
  const [exercise] = await conn.query(
    'SELECT answer FROM exercises WHERE id = ?',
    [exercise_id]
  )
  const is_correct = exercise[0].answer === selected_answer

  const [result] = await conn.query(`
    INSERT INTO exercise_results (user_id, exercise_id, selected_answer, is_correct)
    VALUES (?, ?, ?, ?)
  `, [user_id, exercise_id, selected_answer, is_correct])

  return { ...result, is_correct }
}

module.exports = { findByUser, getScoreByLesson, submit }