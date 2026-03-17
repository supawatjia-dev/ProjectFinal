const API_URL = 'http://localhost:7777'

// ดึง user จาก localStorage
const getUser = () => JSON.parse(localStorage.getItem('user') || 'null')
const getToken = () => localStorage.getItem('token')

// fetch wrapper
async function api(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'เกิดข้อผิดพลาด')
  return data
}

// AUTH
const Auth = {
  login: (body) => api('/users/login', { method: 'POST', body: JSON.stringify(body) }),
  register: (body) => api('/users/register', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => {
    // เก็บ avatar ไว้ก่อน
    const keys = Object.keys(localStorage).filter(k => k.startsWith('avatar_'))
    const avatars = {}
    keys.forEach(k => avatars[k] = localStorage.getItem(k))

    localStorage.clear()

    // คืน avatar กลับมา
    Object.entries(avatars).forEach(([k, v]) => localStorage.setItem(k, v))

    window.location.href = '../login/login.html'
  }
}

// USERS
const Users = {
  getAll: () => api('/users'),
  getById: (id) => api(`/users/${id}`),
  update: (id, body) => api(`/users/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/users/${id}`, { method: 'DELETE' })
}

// COURSES
const Courses = {
  getAll: () => api('/course'),
  getById: (id) => api(`/course/${id}`),
  create: (body) => api('/course', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/course/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/course/${id}`, { method: 'DELETE' })
}

// LESSONS
const Lessons = {
  getByCourse: (course_id) => api(`/lesson/lesson/${course_id}`),
  getById: (id) => api(`/lesson/${id}`),
  create: (body) => api('/lesson', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/lesson/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/lesson/${id}`, { method: 'DELETE' })
}

// EXERCISES
const Exercises = {
  getByLesson: (lesson_id) => api(`/exercise/lesson/${lesson_id}`),
  create: (body) => api('/exercise', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => api(`/exercise/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => api(`/exercise/${id}`, { method: 'DELETE' })
}

// ENROLLMENTS
const Enrollments = {
  getByUser: (user_id) => api(`/enrollment/user/${user_id}`),
  getByCourse: (course_id) => api(`/enrollment/course/${course_id}`),
  enroll: (body) => api('/enrollment', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (id) => api(`/enrollment/${id}`, { method: 'DELETE' })
}

// PROGRESS
const Progress = {
  getByUser: (user_id) => api(`/progress/user/${user_id}`),
  getCourseProgress: (user_id, course_id) => api(`/progress/user/${user_id}/course/${course_id}`),
  markCompleted: (body) => api(`/progress/user/${body.user_id}`, { method: 'POST', body: JSON.stringify(body) }),
}

// EXERCISE RESULTS
const ExerciseResults = {
  getByUser: (user_id) => api(`/exercise-results/user/${user_id}`),
  getScoreByLesson: (user_id, lesson_id) => api(`/exercise-results/user/${user_id}/lesson/${lesson_id}`),
  submit: (body) => api('/exercise-results', { method: 'POST', body: JSON.stringify(body) })
}

// guard — ถ้าไม่ได้ login redirect ไป login
function requireAuth() {
  if (!getUser()) window.location.href = '../login/login.html'
}

// show alert helper
function showAlert(id, message, type = 'danger') {
  const el = document.getElementById(id)
  if (!el) return
  el.className = `alert alert-${type} show`
  el.textContent = message
  setTimeout(() => el.classList.remove('show'), 3000)
}