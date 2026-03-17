requireAuth()
renderNavbar('courses')

const COLORS = [
  ['#6C63FF', '#FF6584'], ['#43D9AD', '#6C63FF'],
  ['#FFB347', '#FF6B6B'], ['#A8EDEA', '#FED6E3'],
  ['#667EEA', '#764BA2'], ['#F093FB', '#F5576C']
]
const EMOJIS = ['🚀', '💡', '🎨', '⚡', '🔥', '🌟', '💎', '🎯', '🏆', '📖']

let allCourses = []

async function loadCourses() {
  try {
    allCourses = await Courses.getAll()
    renderCourses(allCourses)
  } catch (e) {
    document.getElementById('courses-grid').innerHTML = `
          <div style="grid-column:1/-1">
            <div class="empty-state">
              <div class="empty-state-icon">😢</div>
              <div class="empty-state-text">โหลดคอร์สไม่ได้: ${e.message}</div>
            </div>
          </div>`
  }
}

function renderCourses(courses) {
  const grid = document.getElementById('courses-grid')
  const isTeacher = getUser()?.role === 'teacher'
  if (!courses.length) {
    grid.innerHTML = `<div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">ยังไม่มีคอร์ส</div></div></div>`
    return
  }
  grid.innerHTML = courses.map((c, i) => {
    const [c1, c2] = COLORS[i % COLORS.length]
    const emoji = EMOJIS[i % EMOJIS.length]
    return `
          <div class="course-card" onclick="window.location.href='learn.html?course=${c.id}'">
            <div class="course-card-header" style="background:${c.thumbnail ? 'none' : `linear-gradient(135deg,${c1},${c2})`}; padding:0; overflow:hidden">
              ${c.thumbnail
        ? `<img src="${c.thumbnail}" style="width:100%;height:100%;object-fit:cover">`
        : `<span style="font-size:3rem">${emoji}</span>`
      }
            </div>
            <div class="course-card-body">
              <div class="course-card-title">${c.name}</div>
              <div class="course-card-desc">${c.description || 'ไม่มีคำอธิบาย'}</div>
              <div style="display:flex; align-items:center; justify-content:space-between">
                <span style="color:var(--text-muted); font-size:0.8rem">👨‍🏫 ${c.firstname || ''} ${c.lastname || ''}</span>
                ${isTeacher
        ? `<a href="management.html" class="btn btn-outline btn-sm" onclick="event.stopPropagation()">✏️ จัดการ</a>`
        : `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); enrollCourse(${c.id})">+ ลงทะเบียน</button>`
      }
              </div>
            </div>
          </div>`
  }).join('')
}

function filterCourses() {
  const q = document.getElementById('search').value.toLowerCase()
  renderCourses(allCourses.filter(c => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)))
}

async function enrollCourse(course_id) {
  const user = getUser()
  try {
    await Enrollments.enroll({ user_id: user.id, course_id })
    alert('✅ ลงทะเบียนสำเร็จ!')
  } catch (e) {
    alert('⚠️ ' + e.message)
  }
}

loadCourses()