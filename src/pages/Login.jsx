import { useState } from 'react'
import { Eye, EyeOff, User, Users } from 'lucide-react'

export default function Login({ data, onLogin }) {
  const [role, setRole] = useState('teacher')
  const [user, setUser] = useState('guru')
  const [pass, setPass] = useState('kelas5b')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')

  const changeRole = nextRole => {
    setRole(nextRole)
    setError('')
    if (nextRole === 'teacher') {
      setUser('guru')
      setPass('kelas5b')
    } else {
      setUser('0123456789')
      setPass('')
    }
  }

  const submit = event => {
    event.preventDefault()
    setError('')

    if (role === 'teacher') {
      if (user === data.settings.teacherUsername && pass === data.settings.teacherPassword) {
        onLogin({ role: 'teacher', name: data.settings.teacher })
      } else {
        setError('Username atau kata sandi guru salah.')
      }
      return
    }

    const student = data.students.find(item => String(item.nisn).trim() === String(user).trim())
    if (student) {
      onLogin({ role: 'parent', studentId: student.id, name: student.parent })
    } else {
      setError('NISN tidak ditemukan.')
    }
  }

  return (
    <div className="login-page">
      <div className="login-overlay" />
      <div className="login-glow login-glow-one" />
      <div className="login-glow login-glow-two" />

      <section className="login-identity" aria-label="Identitas pembuat aplikasi">
        <img src="/fahmi-djawas.jpg" alt="Fahmi Djawas, S.Pd" className="login-portrait" />
        <div className="login-nameplate">
          <strong>FAHMI DJAWAS, S.Pd</strong>
          <span>Wali Kelas V • SDN Satria Jaya 01</span>
        </div>
      </section>

      <form className="login-card" onSubmit={submit}>
        <div className="login-emblem">★</div>
        <h2>Selamat Datang</h2>
        <p>Masuk sebagai guru atau orang tua.</p>

        <div className="role-tabs">
          <button type="button" className={role === 'teacher' ? 'selected' : ''} onClick={() => changeRole('teacher')}>
            <User size={19} /> Guru
          </button>
          <button type="button" className={role === 'parent' ? 'selected' : ''} onClick={() => changeRole('parent')}>
            <Users size={19} /> Orang Tua
          </button>
        </div>

        <label>
          <span>{role === 'teacher' ? 'Username' : 'NISN Siswa'}</span>
          <input value={user} onChange={event => setUser(event.target.value)} required />
        </label>

        {role === 'teacher' && (
          <label>
            <span>Kata Sandi</span>
            <div className="password">
              <input type={show ? 'text' : 'password'} value={pass} onChange={event => setPass(event.target.value)} required />
              <button type="button" aria-label="Tampilkan kata sandi" onClick={() => setShow(!show)}>
                {show ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </label>
        )}

        {error && <div className="error">{error}</div>}
        <button className="primary wide">Masuk</button>
        <small className="demo">Demo guru: guru / kelas5b<br />Demo orang tua: 0123456789</small>
      </form>
    </div>
  )
}
