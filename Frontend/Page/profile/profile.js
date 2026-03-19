requireAuth()
renderNavbar('profile')
let user = getUser()

// ===== INIT =====
async function init() {
    updateAvatarDisplay()
    document.getElementById('profile-name').textContent = `${user.firstname} ${user.lastname}`
    document.getElementById('profile-email').textContent = user.email || ''
    document.getElementById('profile-desc').textContent = user.description || ''

    const badges = document.getElementById('profile-badges')
    badges.innerHTML = `
        <span class="badge ${user.role === 'teacher' ? 'badge-warning' : 'badge-success'}">
          ${user.role === 'teacher' ? '👨‍🏫 อาจารย์' : '👨‍🎓 นักเรียน'}
        </span>
        ${user.age ? `<span class="badge badge-primary">🎂 ${user.age} ปี</span>` : ''}
        ${user.gender ? `<span class="badge badge-primary">${user.gender === 'male' ? '♂️ ชาย' : '♀️ หญิง'}</span>` : ''}
      `

    try {
        const enrollments = await Enrollments.getByUser(user.id)
        document.getElementById('stat-enrolled').textContent = enrollments.length

        const progress = await Progress.getByUser(user.id)
        document.getElementById('stat-completed').textContent = progress.filter(p => p.is_completed).length

        const results = await ExerciseResults.getByUser(user.id)
        const correct = results.filter(r => r.is_correct).length
        document.getElementById('stat-score').textContent = results.length ? Math.round(correct / results.length * 100) + '%' : '0%'

        renderProgressByCourse(enrollments)
    } catch (e) { console.error(e) }
}

async function renderProgressByCourse(enrollments) {
    const list = document.getElementById('progress-list')
    if (!enrollments.length) {
        list.innerHTML = `<div class="empty-state"><div class="empty-state-icon">📭</div><div class="empty-state-text">ยังไม่ได้ลงทะเบียนคอร์สใด</div></div>`
        return
    }
    let html = ''
    for (const e of enrollments) {
        try {
            const prog = await Progress.getCourseProgress(user.id, e.course_id)
            const pct = prog.percent || 0
            html += `
            <div class="progress-course-item">
              <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem">
                <div style="font-weight:700; color:var(--white)">📚 ${e.course_name || e.name}</div>
                <div style="display:flex; align-items:center; gap:0.75rem">
                  <span style="color:var(--text-muted); font-size:0.85rem">${prog.completed}/${prog.total} บทเรียน</span>
                  <span class="badge ${pct === 100 ? 'badge-success' : pct > 0 ? 'badge-primary' : 'badge-warning'}">${pct}%</span>
                  <a href="../learn/learn.html?course=${e.course_id}" class="btn btn-primary btn-sm">เรียนต่อ →</a>
                </div>
              </div>
              <div class="progress"><div class="progress-bar" style="width:${pct}%; background:${pct === 100 ? 'linear-gradient(135deg,#43D9AD,#00B894)' : ''}"></div></div>
            </div>`
        } catch { }
    }
    list.innerHTML = html
}

// ===== AVATAR =====
function updateAvatarDisplay() {
    const el = document.getElementById('avatar-display')
    if (user.avatar) {
        el.innerHTML = `<img src="${user.avatar}" alt="avatar">`
    } else {
        el.textContent = (user.firstname || '?')[0].toUpperCase()
    }
}

// ===== CROP =====
let imgSrc = '', imgX = 0, imgY = 0, imgScale = 1
let dragging = false, startX, startY, startImgX, startImgY
let naturalW, naturalH

function openCropModal(event) {
    const file = event.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
        imgSrc = e.target.result
        const img = document.getElementById('crop-image')
        img.onload = () => {
            naturalW = img.naturalWidth
            naturalH = img.naturalHeight
            const container = document.getElementById('crop-container')
            const scale = Math.max(container.offsetWidth / naturalW, container.offsetHeight / naturalH)
            imgScale = scale
            imgX = (container.offsetWidth - naturalW * scale) / 2
            imgY = (container.offsetHeight - naturalH * scale) / 2
            document.getElementById('zoom-slider').value = scale
            document.getElementById('zoom-slider').min = scale * 0.5
            document.getElementById('zoom-slider').max = scale * 4
            updateTransform()
            updatePreview()
        }
        img.src = imgSrc
        document.getElementById('crop-modal').classList.add('show')
        event.target.value = ''
    }
    reader.readAsDataURL(file)
}

function updateZoom() {
    const container = document.getElementById('crop-container')
    const newScale = parseFloat(document.getElementById('zoom-slider').value)
    const cx = container.offsetWidth / 2
    const cy = container.offsetHeight / 2
    imgX = cx - (cx - imgX) * (newScale / imgScale)
    imgY = cy - (cy - imgY) * (newScale / imgScale)
    imgScale = newScale
    updateTransform()
    updatePreview()
}

function updateTransform() {
    const img = document.getElementById('crop-image')
    img.style.transform = `translate(${imgX}px, ${imgY}px) scale(${imgScale})`
    img.style.transformOrigin = '0 0'
    img.style.position = 'absolute'
    img.style.top = '0'
    img.style.left = '0'
    img.style.maxWidth = 'none'
}

function startDrag(e) {
    dragging = true
    const pos = e.touches ? e.touches[0] : e
    startX = pos.clientX
    startY = pos.clientY
    startImgX = imgX
    startImgY = imgY
    e.preventDefault()
}

function doDrag(e) {
    if (!dragging) return
    const pos = e.touches ? e.touches[0] : e
    imgX = startImgX + (pos.clientX - startX)
    imgY = startImgY + (pos.clientY - startY)
    updateTransform()
    updatePreview()
    e.preventDefault()
}

function stopDrag() { dragging = false }

function updatePreview() {
    const canvas = document.getElementById('preview-canvas')
    const ctx = canvas.getContext('2d')
    const container = document.getElementById('crop-container')
    const circleSize = 220
    const cx = (container.offsetWidth - circleSize) / 2
    const cy = (container.offsetHeight - circleSize) / 2

    ctx.clearRect(0, 0, 80, 80)
    ctx.save()
    ctx.beginPath()
    ctx.arc(40, 40, 40, 0, Math.PI * 2)
    ctx.clip()

    const img = new Image()
    img.src = imgSrc
    const ratio = 80 / circleSize
    ctx.drawImage(img,
        (cx - imgX) / imgScale, (cy - imgY) / imgScale,
        circleSize / imgScale, circleSize / imgScale,
        0, 0, 80, 80
    )
    ctx.restore()
}

async function applyCrop() {
    const canvas = document.createElement('canvas')
    canvas.width = 300; canvas.height = 300
    const ctx = canvas.getContext('2d')
    const container = document.getElementById('crop-container')
    const circleSize = 220
    const cx = (container.offsetWidth - circleSize) / 2
    const cy = (container.offsetHeight - circleSize) / 2

    ctx.save()
    ctx.beginPath()
    ctx.arc(150, 150, 150, 0, Math.PI * 2)
    ctx.clip()

    const img = new Image()
    img.src = imgSrc
    ctx.drawImage(img,
        (cx - imgX) / imgScale, (cy - imgY) / imgScale,
        circleSize / imgScale, circleSize / imgScale,
        0, 0, 300, 300
    )
    ctx.restore()

    const dataUrl = canvas.toDataURL('image/png')

    try {
        // บันทึกลง DB
        await Users.update(user.id, { avatar: dataUrl })
        // อัพเดท localStorage ด้วย
        const updated = { ...user, avatar: dataUrl }
        localStorage.setItem('user', JSON.stringify(updated))
        user = updated
        updateAvatarDisplay()
        closeCropModal()
    } catch (e) {
        alert('บันทึกรูปไม่สำเร็จ: ' + e.message)
    }
}

function closeCropModal() {
    document.getElementById('crop-modal').classList.remove('show')
}

// ===== EDIT PROFILE =====
function openEditModal() {
    document.getElementById('edit-firstname').value = user.firstname || ''
    document.getElementById('edit-lastname').value = user.lastname || ''
    document.getElementById('edit-email').value = user.email || ''
    document.getElementById('edit-age').value = user.age || ''
    document.getElementById('edit-gender').value = user.gender || ''
    document.getElementById('edit-description').value = user.description || ''
    document.getElementById('edit-modal').classList.add('show')
}

function closeModal(id) { document.getElementById(id).classList.remove('show') }

async function saveProfile() {
    const body = {
        firstname: document.getElementById('edit-firstname').value,
        lastname: document.getElementById('edit-lastname').value,
        email: document.getElementById('edit-email').value,
        age: document.getElementById('edit-age').value,
        gender: document.getElementById('edit-gender').value,
        description: document.getElementById('edit-description').value
    }
    try {
        await Users.update(user.id, body)
        const updated = { ...user, ...body }
        localStorage.setItem('user', JSON.stringify(updated))
        user = updated
        showAlert('edit-alert', 'บันทึกสำเร็จ!', 'success')
        setTimeout(() => { closeModal('edit-modal'); init() }, 800)
    } catch (e) { showAlert('edit-alert', e.message) }
}

init()