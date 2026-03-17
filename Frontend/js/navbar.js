function renderNavbar(activePage) {
  const user = getUser()
  const nav = document.getElementById('navbar')
  if (!nav) return

  const isTeacher = user?.role === 'teacher'

  nav.innerHTML = `
    <a href="../courses/courses.html" class="navbar-brand">🎓 The Codex</a>
    <ul class="navbar-nav">
      <li><a href="../courses/courses.html" class="${activePage === 'courses' ? 'active' : ''}">📚 คอร์สทั้งหมด</a></li>
      ${!isTeacher ? `<li><a href="../my-courses/my-courses.html" class="${activePage === 'my-courses' ? 'active' : ''}">🎯 คอร์สของฉัน</a></li>` : ''}
      <li><a href="../profile/profile.html" class="${activePage === 'profile' ? 'active' : ''}">👤 ${user?.firstname || 'โปรไฟล์'}</a></li>
      ${isTeacher ? `<li><a href="../management/management.html" class="${activePage === 'management' ? 'active' : ''}">⚙️ จัดการ</a></li>` : ''}
      <li><a href="#" class="btn-logout" onclick="Auth.logout()">ออกจากระบบ</a></li>
    </ul>
  `
}