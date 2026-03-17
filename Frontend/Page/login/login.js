if (getUser()) window.location.href = '../courses/courses.html'

function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach((t, i) => {
        t.classList.toggle('active', (tab === 'login' && i === 0) || (tab === 'register' && i === 1))
    })
    document.getElementById('tab-login').classList.toggle('active', tab === 'login')
    document.getElementById('tab-register').classList.toggle('active', tab === 'register')
}

async function doLogin() {
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value
    if (!email || !password) return showAlert('login-alert', 'กรุณากรอกข้อมูลให้ครบ')
    try {
        const res = await Auth.login({ email, password })
        localStorage.setItem('user', JSON.stringify(res.user || res))
        window.location.href = '../courses/courses.html'
    } catch (e) {
        showAlert('login-alert', e.message)
    }
}

async function doRegister() {
    const firstname = document.getElementById('reg-firstname').value
    const lastname = document.getElementById('reg-lastname').value
    const email = document.getElementById('reg-email').value
    const password = document.getElementById('reg-password').value
    const age = document.getElementById('reg-age').value
    const gender = document.getElementById('reg-gender').value
    const description = document.getElementById('reg-description').value
    const role = document.getElementById('reg-role').value
    if (!firstname || !lastname || !email || !password) return showAlert('register-alert', 'กรุณากรอกข้อมูลให้ครบ')
    try {
        await Auth.register({ firstname, lastname, email, password, age, gender, description, role })
        showAlert('register-alert', 'สมัครสำเร็จ! กรุณาเข้าสู่ระบบ', 'success')
        setTimeout(() => switchTab('login'), 1500)
    } catch (e) {
        showAlert('register-alert', e.message)
    }
}

// Enter key
document.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const active = document.querySelector('.tab-content.active').id
        active === 'tab-login' ? doLogin() : doRegister()
    }
})