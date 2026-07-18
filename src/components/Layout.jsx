import { LayoutDashboard, Users, CalendarCheck, ClipboardList, UserRound, Settings, LogOut, GraduationCap, Menu, X } from 'lucide-react'
import { useState } from 'react'
const items=[['dashboard','Dashboard',LayoutDashboard],['students','Data Siswa',Users],['attendance','Absensi',CalendarCheck],['grades','Penilaian',ClipboardList],['parents','Portal Orang Tua',UserRound],['settings','Pengaturan',Settings]]
export default function Layout({page,setPage,onLogout,settings,children}){
 const [open,setOpen]=useState(false)
 return <div className="app-shell">
  <aside className={open?'sidebar open':'sidebar'}>
   <div className="brand"><GraduationCap size={32}/><div><b>ADMINISTRASI</b><small>KELAS {settings.className}</small></div><button className="icon mobile-close" onClick={()=>setOpen(false)}><X/></button></div>
   <nav>{items.map(([key,label,Icon])=><button key={key} className={page===key?'nav active':'nav'} onClick={()=>{setPage(key);setOpen(false)}}><Icon size={19}/>{label}</button>)}</nav>
   <button className="nav logout" onClick={onLogout}><LogOut size={19}/>Keluar</button>
  </aside>
  <main className="main-column"><header className="topbar"><button className="icon menu" onClick={()=>setOpen(true)}><Menu/></button><div><b>{settings.school}</b><small>Tahun Ajaran {settings.year}</small></div><span className="teacher">{settings.teacher}</span></header><section className="content">{children}</section><footer className="app-footer">Dashboard didesain oleh <strong>FAHMI DJAWAS</strong>. © 2026 Semua hak dilindungi</footer></main>
 </div>
}
