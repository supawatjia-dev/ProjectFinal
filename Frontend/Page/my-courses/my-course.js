requireAuth()
renderNavbar('my-courses')
const user = getUser()

const COLORS = [
  ['#6C63FF', '#FF6584'], ['#43D9AD', '#6C63FF'],
  ['#FFB347', '#FF6B6B'], ['#A8EDEA', '#FED6E3'],
]
const EMOJIS = ['🚀', '💡', '🎨', '⚡', '🔥', '🌟', '💎', '🎯']

async function loadMyCourses() {
  try {
    const enrollments = await Enrollments.getByUser(user.id)
    const grid = document.getElementById('my-courses-grid')

    if (!enrollments.length) {
      grid.innerHTML = `
            <div style="grid-column:1/-1">
              <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-text">ยังไม่ได้ลงทะเบียนคอร์สใด</div>
                <a href="courses.html" class="btn btn-primary" style="margin-top:1rem">ดูคอร์สทั้งหมด</a>
              </div>
            </div>`
      return
    }

    let html = ''
    for (let i = 0; i < enrollments.length; i++) {
      const e = enrollments[i]
      const [c1, c2] = COLORS[i % COLORS.length]
      const emoji = EMOJIS[i % EMOJIS.length]
      let prog = { percent: 0, completed: 0, total: 0 }
      try { prog = await Progress.getCourseProgress(user.id, e.course_id) } catch { }

      html += `
            <div class="course-card" onclick="window.location.href='../learn.html?course=${e.course_id}'">
              <div class="course-card-header" style="background:${e.thumbnail ? 'none' : `linear-gradient(135deg,${c1},${c2})`}; padding:0; overflow:hidden">
  ${e.thumbnail
          ? `<img src="${e.thumbnail}" style="width:100%;height:100%;object-fit:cover">`
          : `<span style="font-size:3rem">${emoji}</span>`
        }
</div>
              <div class="course-card-body">
                <div class="course-card-title">${e.course_name || e.name}</div>
                <div class="course-card-desc">${e.description || 'ไม่มีคำอธิบาย'}</div>
                <div style="margin-bottom:0.75rem">
                  <div style="display:flex; justify-content:space-between; font-size:0.8rem; color:var(--text-muted); margin-bottom:0.4rem">
                    <span>${prog.completed}/${prog.total} บทเรียน</span>
                    <span>${prog.percent}%</span>
                  </div>
                  <div class="progress"><div class="progress-bar" style="width:${prog.percent}%; background:${prog.percent === 100 ? 'linear-gradient(135deg,#43D9AD,#00B894)' : ''}"></div></div>
                </div>
                <div style="display:flex; gap:0.5rem">
                  <a href="learn.html?course=${e.course_id}" class="btn btn-primary btn-sm" style="flex:1; justify-content:center">
                    ${prog.percent > 0 ? '▶️ เรียนต่อ' : '🚀 เริ่มเรียน'}
                  </a>
                  <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); cancelEnroll(${e.id})">ยกเลิก</button>
                </div>
              </div>
            </div>`
    }
    grid.innerHTML = html
  } catch (e) {
    document.getElementById('my-courses-grid').innerHTML = `
          <div style="grid-column:1/-1"><div class="empty-state"><div class="empty-state-icon">😢</div><div class="empty-state-text">${e.message}</div></div></div>`
  }
}

async function cancelEnroll(enrollId) {
  if (!confirm('ยกเลิกการลงทะเบียนคอร์สนี้?')) return
  try {
    await Enrollments.cancel(enrollId)
    loadMyCourses()
  } catch (e) { alert(e.message) }
}

loadMyCourses()