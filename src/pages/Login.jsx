import { useState } from 'react'
import { Eye, EyeOff, LogIn, User, Users } from 'lucide-react'

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
    <main className="final-login-page">
      <div className="final-login-shade" />
      <form className="final-login-card" onSubmit={submit}>
        <div className="final-login-logo">★</div>
        <p className="final-login-kicker">SISTEM ADMINISTRASI</p>
        <h1>KELAS 5B</h1>
        <p className="final-login-subtitle">Silakan masuk untuk melanjutkan</p>

        <div className="final-role-tabs">
          <button type="button" className={role === 'teacher' ? 'selected' : ''} onClick={() => changeRole('teacher')}>
            <User size={20} /> LOGIN GURU
          </button>
          <button type="button" className={role === 'parent' ? 'selected' : ''} onClick={() => changeRole('parent')}>
            <Users size={20} /> LOGIN ORANG TUA
          </button>
        </div>

        <label className="final-input-row">
          <User size={20} />
          <input
            aria-label={role === 'teacher' ? 'Username' : 'NISN siswa'}
            placeholder={role === 'teacher' ? 'Username' : 'NISN Siswa'}
            value={user}
            onChange={event => setUser(event.target.value)}
            required
          />
        </label>

        {role === 'teacher' && (
          <label className="final-input-row">
            <span className="lock-symbol">▣</span>
            <input
              aria-label="Kata sandi"
              placeholder="Kata Sandi"
              type={show ? 'text' : 'password'}
              value={pass}
              onChange={event => setPass(event.target.value)}
              required
            />
            <button type="button" className="show-password" aria-label="Tampilkan kata sandi" onClick={() => setShow(!show)}>
              {show ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </label>
        )}

        {error && <div className="error final-error">{error}</div>}

        <button className="final-login-submit" type="submit"><LogIn size={21} /> MASUK</button>
        <small className="final-demo">
          Demo guru: guru / kelas5b<br />
          Demo orang tua: 0123456789 <b>(NISN)</b>
        </small>
      </form>

      <footer className="final-login-footer">
        Dashboard didesain oleh <strong>FAHMI DJAWAS</strong>. © 2026 Semua hak dilindungi.
      </footer>
    </main>
  )
}
