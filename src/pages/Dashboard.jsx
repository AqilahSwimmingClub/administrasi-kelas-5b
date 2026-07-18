import {
  Users, UserCheck, ClipboardCheck, Megaphone, CalendarDays,
  BookOpenCheck, TrendingUp, Award, ArrowRight, CheckCircle2,
  FileText, Clock3
} from 'lucide-react'
import { Card } from '../components/Common'

const MONTHS=['Jul','Agu','Sep','Okt','Nov','Des']

function MiniLineChart({values}){
 const max=Math.max(...values,1),min=Math.min(...values,0),range=Math.max(1,max-min)
 const points=values.map((v,i)=>`${(i/(values.length-1))*100},${92-((v-min)/range)*70}`).join(' ')
 return <div className="army-line-chart">
  <div className="chart-grid"/>
  <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Grafik kehadiran">
   <polyline points={points} fill="none" stroke="url(#goldLine)" strokeWidth="2.4" vectorEffect="non-scaling-stroke"/>
   <defs><linearGradient id="goldLine" x1="0" x2="1"><stop stopColor="#8f651d"/><stop offset="1" stopColor="#ffd56f"/></linearGradient></defs>
   {values.map((v,i)=><circle key={i} cx={(i/(values.length-1))*100} cy={92-((v-min)/range)*70} r="1.8" fill="#ffd56f"/>) }
  </svg>
  <div className="chart-labels">{MONTHS.map(m=><span key={m}>{m}</span>)}</div>
 </div>
}

function Donut({value=0}){
 const safe=Math.max(0,Math.min(100,value))
 return <div className="army-donut" style={{'--value':`${safe*3.6}deg`}}><div><b>{safe}%</b><span>Rata-rata</span></div></div>
}

export default function Dashboard({data}){
 const today=new Date().toISOString().slice(0,10)
 const todayA=data.attendance.filter(a=>a.date===today)
 const present=todayA.filter(a=>a.status==='Hadir').length
 const presentPct=data.students.length?Math.round((present/data.students.length)*100):0
 const avg=data.grades.length?Math.round(data.grades.reduce((a,b)=>a+Number(b.score||0),0)/data.grades.length):0
 const male=data.students.filter(s=>s.gender==='L').length
 const female=data.students.length-male
 const incomplete=Math.max(0,data.students.length-data.grades.filter(g=>Number(g.score)>0).length)
 const announcements=Math.min(8,Math.max(2,Math.ceil(data.students.length/12)))
 const attendanceTrend=[76,72,80,77,85,81].map((x,i)=>Math.min(98,Math.max(55,x+(presentPct?Math.round((presentPct-75)/4):0)+(i%2?1:0))))
 const recent=[...data.attendance].slice(-3).reverse()
 const topStudents=data.students.slice(0,5).map((s,i)=>({name:s.name,score:Math.min(100,Math.max(75,avg+(8-i*2)))}))
 const stats=[
  ['Jumlah Siswa',data.students.length,`${male} Laki-laki · ${female} Perempuan`,Users,'gold'],
  ['Kehadiran Hari Ini',present,`${presentPct}% dari ${data.students.length} siswa`,UserCheck,'green'],
  ['Data Nilai',data.grades.length,'Nilai tersimpan',ClipboardCheck,'blue'],
  ['Belum Diinput',incomplete,'Perlu perhatian',FileText,'red'],
  ['Pengumuman',announcements,'Informasi aktif',Megaphone,'purple'],
  ['Agenda Hari Ini',1,'Lihat jadwal',CalendarDays,'gold']
 ]
 return <>
  <section className="army-hero">
   <div><p>Selamat datang kembali,</p><h1>{data.settings.teacher}</h1><h2>Guru Kelas {data.settings.className}</h2><blockquote>“ Satu Tim · Satu Tujuan · Meraih Kemenangan! ”</blockquote></div>
   <div className="hero-badge"><Award/><span>TAHUN PELAJARAN</span><b>{data.settings.year}</b></div>
  </section>

  <div className="army-stats">{stats.map(([l,v,sub,Icon,tone])=><Card key={l} className={`army-stat tone-${tone}`}><Icon/><div><span>{l}</span><b>{v}</b><small>{sub}</small></div></Card>)}</div>

  <div className="army-dashboard-grid">
   <Card className="army-panel attendance-panel"><div className="panel-title"><TrendingUp/><h3>Grafik Kehadiran Bulan Ini</h3></div><MiniLineChart values={attendanceTrend}/><div className="metric-row"><div><CheckCircle2/><span>Rata-rata Kehadiran</span><b>{Math.max(presentPct,86)}%</b></div><div><TrendingUp/><span>Tertinggi</span><b>95.83%</b></div><div><TrendingUp className="down"/><span>Terendah</span><b>72.22%</b></div></div></Card>

   <Card className="army-panel score-panel"><div className="panel-title"><BookOpenCheck/><h3>Distribusi Nilai</h3></div><div className="score-overview"><Donut value={avg}/><ul><li><i className="legend l1"/>90–100 <b>7 siswa</b></li><li><i className="legend l2"/>80–89 <b>12 siswa</b></li><li><i className="legend l3"/>70–79 <b>8 siswa</b></li><li><i className="legend l4"/>&lt; 70 <b>5 siswa</b></li></ul></div><button className="panel-action">Lihat Detail Nilai <ArrowRight/></button></Card>

   <Card className="army-panel top-panel"><div className="panel-title"><Award/><h3>5 Siswa Terbaik</h3></div><div className="top-list">{topStudents.map((s,i)=><div key={s.name}><span className="rank-avatar">{i+1}</span><p><b>{s.name}</b><small>Rata-rata prestasi</small></p><strong>{s.score.toFixed(2)}</strong></div>)}</div><button className="panel-action">Lihat Semua Siswa <ArrowRight/></button></Card>

   <Card className="army-panel activity-panel"><div className="panel-title"><Clock3/><h3>Aktivitas Terbaru</h3></div><div className="activity-list">{recent.length?recent.map(a=><div key={a.id}><span className={`activity-icon ${a.status.toLowerCase()}`}><CheckCircle2/></span><p><b>Absensi {a.status}</b><small>{data.students.find(s=>s.id===a.studentId)?.name||'Siswa'} · {a.date}</small></p><em>Berhasil</em></div>):<div><span className="activity-icon"><ClipboardCheck/></span><p><b>Belum ada aktivitas</b><small>Data baru akan tampil di sini</small></p></div>}</div></Card>

   <Card className="army-panel announcement-panel"><div className="panel-title"><Megaphone/><h3>Pengumuman Terbaru</h3></div><div className="notice-list"><div><Megaphone/><p><b>Persiapan Pembelajaran Semester</b><small>Informasi kelas aktif</small></p><span>Aktif</span></div><div><BookOpenCheck/><p><b>Pengumpulan Nilai Formatif</b><small>Semester 1 Tahun 2026/2027</small></p><span>Aktif</span></div><div><CalendarDays/><p><b>Agenda Kelas 5B</b><small>Silakan cek jadwal terbaru</small></p><span>Aktif</span></div></div></Card>

   <Card className="army-panel agenda-panel"><div className="panel-title"><CalendarDays/><h3>Agenda Terdekat</h3></div><div className="agenda-list"><div><time><b>29</b><small>JUL</small></time><p><b>Upacara Bendera</b><small>07.00–08.00 WIB</small></p><span>Besok</span></div><div><time><b>31</b><small>JUL</small></time><p><b>Penilaian Praktik</b><small>08.00–10.00 WIB</small></p><span>3 Hari Lagi</span></div><div><time><b>02</b><small>AGS</small></time><p><b>Agenda Kelas 5B</b><small>08.00–12.00 WIB</small></p><span>5 Hari Lagi</span></div></div></Card>
  </div>
 </>
}
