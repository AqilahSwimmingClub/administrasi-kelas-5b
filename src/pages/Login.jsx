import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
export default function Login({data,onLogin}){
 const [role,setRole]=useState('teacher'),[user,setUser]=useState('guru'),[pass,setPass]=useState('kelas5b'),[show,setShow]=useState(false),[error,setError]=useState('')
 const submit=e=>{e.preventDefault();setError(''); if(role==='teacher'){
  if(user===data.settings.teacherUsername&&pass===data.settings.teacherPassword)onLogin({role:'teacher',name:data.settings.teacher}); else setError('Username atau kata sandi guru salah.')
 }else{ const s=data.students.find(x=>x.nisn===user); if(s)onLogin({role:'parent',studentId:s.id,name:s.parent}); else setError('NISN tidak ditemukan.') }}
 return <div className="login-page"><div className="login-overlay"/><form className="login-card" onSubmit={submit}>
 <h2>Selamat Datang</h2><p>Masuk sebagai guru atau orang tua.</p><div className="role-tabs"><button type="button" className={role==='teacher'?'selected':''} onClick={()=>{setRole('teacher');setUser('guru');setPass('kelas5b')}}>Guru</button><button type="button" className={role==='parent'?'selected':''} onClick={()=>{setRole('parent');setUser('0123456789');setPass('')}}>Orang Tua</button></div>
 <label><span>{role==='teacher'?'Username':'NISN Siswa'}</span><input value={user} onChange={e=>setUser(e.target.value)} required/></label>{role==='teacher'&&<label><span>Kata Sandi</span><div className="password"><input type={show?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)} required/><button type="button" onClick={()=>setShow(!show)}>{show?<EyeOff/>:<Eye/>}</button></div></label>}
 {error&&<div className="error">{error}</div>}<button className="primary wide">Masuk</button><small className="demo">Demo guru: guru / kelas5b<br/>Demo orang tua: 0123456789</small></form></div>
}
