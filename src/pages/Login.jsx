import { useEffect, useState } from 'react'
import { Eye, EyeOff, LogIn, User, Users, LockKeyhole } from 'lucide-react'

export default function Login({ data, onLogin }) {
  const remembered=localStorage.getItem('ak5b_remember_teacher')==='1'
  const [role, setRole] = useState('teacher')
  const [user, setUser] = useState(remembered?data.settings.teacherUsername:'guru')
  const [pass, setPass] = useState(remembered?data.settings.teacherPassword:'kelas5b')
  const [remember,setRemember]=useState(remembered)
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [notice,setNotice]=useState('')

  useEffect(()=>{if(role==='parent')setNotice('Masukkan NISN siswa untuk membuka portal orang tua.');else setNotice('')},[role])
  const changeRole = nextRole => {
    setRole(nextRole);setError('')
    if (nextRole === 'teacher') {setUser(data.settings.teacherUsername||'guru');setPass(data.settings.teacherPassword||'kelas5b')}
    else {setUser('');setPass('')}
  }
  const submit = event => {
    event.preventDefault();setError('')
    if (role === 'teacher') {
      if (user === data.settings.teacherUsername && pass === data.settings.teacherPassword) {
        localStorage.setItem('ak5b_remember_teacher',remember?'1':'0')
        onLogin({ role: 'teacher', name: data.settings.teacher })
      } else setError('Username atau kata sandi guru salah.')
      return
    }
    const student = data.students.find(item => String(item.nisn).trim() === String(user).trim())
    if (student) onLogin({ role: 'parent', studentId: student.id, name: student.parent })
    else setError('NISN tidak ditemukan pada data siswa.')
  }
  return <main className="master-login-page">
    <div className="master-login-overlay"/>
    <form className="master-login-card" onSubmit={submit}>
      <div className="gold-tutwuri-mark"><img src="/tutwuri-handayani-clean.png" alt="Logo Tut Wuri Handayani"/><span className="mini-stars">★　★　★　★</span></div>
      <p className="master-login-kicker">SISTEM ADMINISTRASI</p>
      <h1>KELAS 5B</h1>
      <p className="master-login-subtitle">Silakan masuk untuk melanjutkan</p>
      <div className="master-role-tabs">
        <button type="button" className={role==='teacher'?'selected':''} onClick={()=>changeRole('teacher')}><User size={21}/> LOGIN GURU</button>
        <button type="button" className={role==='parent'?'selected':''} onClick={()=>changeRole('parent')}><Users size={21}/> LOGIN ORANG TUA</button>
      </div>
      <label className="master-input-row"><User/><input aria-label={role==='teacher'?'Username':'NISN siswa'} placeholder={role==='teacher'?'Username':'NISN Siswa'} value={user} onChange={e=>setUser(e.target.value)} required inputMode={role==='parent'?'numeric':'text'}/></label>
      {role==='teacher'&&<label className="master-input-row"><LockKeyhole/><input aria-label="Kata sandi" placeholder="Kata Sandi" type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} required/><button type="button" className="show-password" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></label>}
      {role==='teacher'&&<div className="login-options"><label><input type="checkbox" checked={remember} onChange={e=>setRemember(e.target.checked)}/> Ingat saya</label><button type="button" onClick={()=>setNotice('Kata sandi guru dapat diubah melalui menu Pengaturan setelah login.')}>Lupa kata sandi?</button></div>}
      {notice&&<div className="login-notice">{notice}</div>}
      {error&&<div className="error final-error">{error}</div>}
      <button className="master-login-submit" type="submit"><LogIn/> MASUK</button>
      <small className="master-demo">Demo guru: guru / kelas5b<br/>Demo orang tua: gunakan <b>NISN siswa</b></small>
    </form>
    <footer className="master-login-footer">Dashboard didesain oleh <strong>FAHMI DJAWAS</strong>. © 2026 Semua hak dilindungi.</footer>
  </main>
}
