import { LayoutDashboard, Users, CalendarCheck, ClipboardList, Settings, LogOut, GraduationCap, Menu, X, Bell, ShieldCheck, CalendarDays, Megaphone } from 'lucide-react'
import { useState } from 'react'
const items=[
 ['dashboard','Beranda',LayoutDashboard],
 ['students','Data Siswa',Users],
 ['attendance','Absensi',CalendarCheck],
 ['grades','Penilaian',ClipboardList],
 ['schedule','Jadwal',CalendarDays],
 ['announcements','Pengumuman',Megaphone],
 ['settings','Pengaturan',Settings]
]
export default function Layout({page,setPage,onLogout,settings,children,data}){
 const [open,setOpen]=useState(false)
 const activeNotices=(data?.announcements||[]).filter(x=>x.active).length
 return <div className="app-shell">
  <aside className={open?'sidebar open':'sidebar'}>
   <div className="brand"><ShieldCheck size={36}/><div><b>ADMINISTRASI</b><small>KELAS 5B</small></div><button className="icon mobile-close" onClick={()=>setOpen(false)}><X/></button></div>
   <div className="sidebar-star">★</div>
   <nav>{items.map(([key,label,Icon])=><button key={key} className={page===key?'nav active':'nav'} onClick={()=>{setPage(key);setOpen(false)}}><Icon size={19}/>{label}</button>)}</nav>
   <button className="nav logout" onClick={onLogout}><LogOut size={19}/>Keluar</button>
   <div className="sidebar-credit"><ShieldCheck/><span>Dashboard didesain oleh</span><b>FAHMI DJAWAS.</b><small>© 2026 Semua hak dilindungi.</small></div>
  </aside>
  <main className="main-column">
   <header className="topbar"><button className="icon menu" onClick={()=>setOpen(true)}><Menu/></button><div className="school-head"><GraduationCap/><span><b>{settings.school}</b><small>Tahun Pelajaran {settings.year}</small></span></div><div className="top-actions"><button className="icon notification" onClick={()=>setPage('announcements')}><Bell/><i>{activeNotices}</i></button><div className="teacher-profile"><div className="mini-avatar">FD</div><span><b>{settings.teacher}</b><small>Guru Kelas 5B</small></span></div></div></header>
   <section className="content">{children}</section>
   <footer className="app-footer">Dashboard didesain oleh <strong>FAHMI DJAWAS</strong>. © 2026 Semua hak dilindungi</footer>
  </main>
 </div>
}
