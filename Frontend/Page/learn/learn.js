requireAuth()
renderNavbar('my-courses')

const params = new URLSearchParams(location.search)
const courseId = params.get('course')
const user = getUser()
let lessons = []
let currentLesson = null
let completedLessons = new Set()

async function init() {
    if (!courseId) return window.location.href = 'courses.html'
    try {
        const course = await Courses.getById(courseId)
        document.getElementById('course-name').textContent = course.name
        document.title = `The Codex — ${course.name}`

        lessons = await Lessons.getByCourse(courseId)

        // โหลด progress
        const progress = await Progress.getByUser(user.id)
        progress.forEach(p => { if (p.is_completed) completedLessons.add(p.lesson_id) })

        renderLessonList()
        updateProgress()

        if (lessons.length) selectLesson(lessons[0])
    } catch (e) {
        document.getElementById('content-area').innerHTML = `<div class="empty-state"><div class="empty-state-icon">😢</div><div class="empty-state-text">${e.message}</div></div>`
    }
}

function renderLessonList() {
    document.getElementById('lesson-list').innerHTML = lessons.map((l, i) => `
        <div class="lesson-item ${completedLessons.has(l.id) ? 'completed' : ''}" 
             id="lesson-item-${l.id}" onclick="selectLesson(${JSON.stringify(l).replace(/"/g, '&quot;')})">
          <span class="lesson-icon">${completedLessons.has(l.id) ? '✅' : '📖'}</span>
          <span style="flex:1">${l.title}</span>
          <span class="lesson-num">${i + 1}</span>
        </div>
      `).join('')
}

function updateProgress() {
    const pct = lessons.length ? Math.round((completedLessons.size / lessons.length) * 100) : 0
    document.getElementById('progress-text').textContent = pct + '%'
    document.getElementById('progress-bar').style.width = pct + '%'
}

async function selectLesson(lesson) {
    currentLesson = lesson
    document.querySelectorAll('.lesson-item').forEach(el => el.classList.remove('active'))
    const el = document.getElementById(`lesson-item-${lesson.id}`)
    if (el) el.classList.add('active')

    const content = document.getElementById('content-area')
    content.innerHTML = `<div class="spinner"></div>`

    try {
        const exercises = await Exercises.getByLesson(lesson.id)
        const isCompleted = completedLessons.has(lesson.id)

        content.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem">
            <div class="lesson-title">📖 ${lesson.title}</div>
            ${isCompleted ? '<span class="badge badge-success">✅ เรียนแล้ว</span>' : ''}
          </div>
          <div class="lesson-content">${lesson.content || '<em style="color:var(--text-muted)">ยังไม่มีเนื้อหา</em>'}</div>
          ${exercises.length ? renderQuiz(exercises) : ''}
        `
    } catch (e) {
        content.innerHTML = `<div class="empty-state"><div class="empty-state-icon">😢</div><div class="empty-state-text">${e.message}</div></div>`
    }
}

function renderQuiz(exercises) {
    return `
        <div class="quiz-section">
          <div class="quiz-header">🎯 แบบฝึกหัด (${exercises.length} ข้อ)</div>
          ${exercises.map((ex, i) => `
            <div class="quiz-question" id="q-${ex.id}">
              <div class="question-text">ข้อ ${i + 1}. ${ex.question}</div>
              ${['a', 'b', 'c', 'd'].filter(k => ex['choice_' + k]).map(k => `
                <div class="quiz-option" id="opt-${ex.id}-${k}" onclick="selectAnswer(${ex.id}, '${k}', '${ex.answer}')">
                  <div class="option-label">${k.toUpperCase()}</div>
                  <span>${ex['choice_' + k]}</span>
                </div>
              `).join('')}
              <div id="result-${ex.id}" style="margin-top:0.75rem; display:none"></div>
            </div>
          `).join('')}
          <div id="score-area" style="display:none"></div>
          <button class="btn btn-primary" id="submit-btn" onclick="submitAll(${JSON.stringify(exercises).replace(/"/g, '&quot;')})">
            🚀 ส่งคำตอบทั้งหมด
          </button>
        </div>
      `
}

const answers = {}

function selectAnswer(exId, key, correct) {
    // clear old selection
    document.querySelectorAll(`[id^="opt-${exId}-"]`).forEach(el => el.classList.remove('selected'))
    document.getElementById(`opt-${exId}-${key}`).classList.add('selected')
    answers[exId] = { selected: key, correct }
}

async function submitAll(exercises) {
    let correctCount = 0
    for (const ex of exercises) {
        const ans = answers[ex.id]
        if (!ans) continue
        try {
            const res = await ExerciseResults.submit({ user_id: user.id, exercise_id: ex.id, selected_answer: ans.selected })
            const isCorrect = res.is_correct

            if (isCorrect) correctCount++

            // แสดงผล
            document.querySelectorAll(`[id^="opt-${ex.id}-"]`).forEach(el => {
                const k = el.id.split('-').pop()
                if (k === ex.answer) el.classList.add('correct')
                else if (k === ans.selected && !isCorrect) el.classList.add('wrong')
                el.style.pointerEvents = 'none'
            })

            const resultEl = document.getElementById(`result-${ex.id}`)
            resultEl.style.display = 'block'
            resultEl.innerHTML = isCorrect
                ? '<span class="result-badge result-correct">✅ ถูกต้อง!</span>'
                : `<span class="result-badge result-wrong">❌ ผิด เฉลย: ${ex.answer.toUpperCase()}</span>`
        } catch (e) { console.error(e) }
    }

    document.getElementById('submit-btn').style.display = 'none'
    const scoreArea = document.getElementById('score-area')
    scoreArea.style.display = 'block'
    scoreArea.innerHTML = `
        <div class="score-box-inner">
          <div style="font-weight:700; font-size:0.95rem">คะแนนที่ได้</div>
          <div style="font-size:3rem; font-weight:800; line-height:1.2">${correctCount}/${exercises.length}</div>
          <div>${Math.round(correctCount / exercises.length * 100)}%</div>
          <div style="margin-top:0.75rem; font-size:0.9rem; opacity:0.8">กำลังบันทึกและกลับหน้าคอร์ส...</div>
        </div>
      `

    // mark lesson completed อัตโนมัติ
    try {
        await Progress.markCompleted({ user_id: user.id, lesson_id: currentLesson.id })
    } catch (e) { console.error(e) }

    // redirect ไป my-courses หลัง 2 วินาที
    setTimeout(() => {
        window.location.href = 'my-courses.html'
    }, 2000)
}

async function markDone(lessonId) {
    try {
        await Progress.markCompleted({ user_id: user.id, lesson_id: lessonId })
        completedLessons.add(lessonId)
        renderLessonList()
        updateProgress()
        document.querySelector(`#lesson-item-${lessonId} .lesson-icon`).textContent = '✅'
        // re-render header
        selectLesson(currentLesson)
    } catch (e) { alert(e.message) }
}

init()