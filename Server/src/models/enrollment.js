const { getConnection } = require('../config/db')

const findByUser = async (user_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT enrollments.*, 
           users.firstname, users.lastname,
           course.name AS course_name, course.description
    FROM enrollments
    JOIN users ON enrollments.user_id = users.id
    JOIN course ON enrollments.course_id = course.id
    WHERE enrollments.user_id = ?
  `, [user_id])
  return rows
}

const findByCourse = async (course_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(`
    SELECT enrollments.*, users.firstname, users.lastname
    FROM enrollments
    JOIN users ON enrollments.user_id = users.id
    WHERE enrollments.course_id = ?
  `, [course_id])
  return rows
}

const checkEnrollment = async (user_id, course_id) => {
  const conn = await getConnection()
  const [rows] = await conn.query(
    'SELECT * FROM enrollments WHERE user_id = ? AND course_id = ?',
    [user_id, course_id]
  )
  return rows[0]
}

const create = async (user_id, course_id) => {
  const conn = await getConnection()
  await conn.query(
    'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
    [user_id, course_id]
  )
  
  const [rows] = await conn.query(`
    SELECT enrollments.*, 
           users.firstname, users.lastname,
           course.name AS course_name
    FROM enrollments
    JOIN users ON enrollments.user_id = users.id
    JOIN course ON enrollments.course_id = course.id
    WHERE enrollments.user_id = ? AND enrollments.course_id = ?
  `, [user_id, course_id])
  return rows[0]
}

const remove = async (id) => {
  const conn = await getConnection()
  const [result] = await conn.query(
    'DELETE FROM enrollments WHERE id = ?',
    [parseInt(id)]
  )
  return result
}

module.exports = { findByUser, findByCourse, checkEnrollment, create, remove }