import {
  Users, UserCheck, ClipboardCheck, Megaphone, CalendarDays,
  BookOpenCheck, TrendingUp, Award, ArrowRight, CheckCircle2,
  FileText, Clock3
} from 'lucide-react'
import { Card } from '../components/Common'

const MONTHS=['Jul','Agu','Sep','Okt','Nov','Des']
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v))

function MiniLineChart({values}){
 const safe=values.length?values:[0,0,0,0,0,0]
 const max=Math.max(...safe,100),min=0,range=Math.max(1,max-min)
 const points=safe.map((v,i)=>`${safe.length===1?50:(i/(safe.length-1))*100},${92-((v-min)/range)*78}`).join(' ')
 return <div className="army-line-chart"><div className="chart-grid"/><svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Grafik kehadiran"><polyline points={points} fill="none" stroke="url(#goldLine)" strokeWidth="2.4" vectorEffect="non-scaling-stroke"/><defs><linearGradient id="goldLine" x1="0" x2="1"><stop stopColor="#8f651d"/><stop offset="1" stopColor="#ffd56f"/></linearGradient></defs>{safe.map((v,i)=><circle key={i} cx={safe.length===1?50:(i/(safe.length-1))*100} cy={92-((v-min)/range)*78} r="1.8" fill="#ffd56f"/>)}</svg><div className="chart-labels">{MONTHS.map(m=><span key={m}>{m}</span>)}</div></div>
}
function Donut({value=0}){const safe=clamp(Math.round(value),0,100);return <div className="army-donut" style={{'--value':`${safe*3.6}deg`}}><div><b>{safe}%</b><span>Rata-rata</span></div></div>}
const formatDate=d=>{try{return new Date(`${d}T00:00:00`).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}catch{return d}}

export default function Dashboard({data,setPage}){
 const students=data.students||[], attendance=data.attendance||[], grades=data.grades||[], schedules=data.schedules||[], notices=data.announcements||[]
 const today=new Date().toISOString().slice(0,10)
 const todayA=attendance.filter(a=>a.date===today)
 const present=todayA.filter(a=>a.status==='Hadir').length
 const presentPct=students.length?Math.round((present/students.length)*100):0
 const validGrades=grades.map(g=>Number(g.score)).filter(n=>Number.isFinite(n)&&n>0)
 const avg=validGrades.length?validGrades.reduce((a,b)=>a+b,0)/validGrades.length:0
 const male=students.filter(s=>s.gender==='L').length, female=students.length-male
 const gradedStudents=new Set(grades.filter(g=>Number(g.score)>0).map(g=>g.studentId)).size
 const incomplete=Math.max(0,students.length-gradedStudents)
 const activeNotices=notices.filter(n=>n.active)
 const todayAgenda=schedules.filter(s=>s.date===today).length

 const monthly=MONTHS.map((_,index)=>{
  const month=index+7
  const rows=attendance.filter(a=>new Date(`${a.date}T00:00:00`).getMonth()+1===month)
  if(!rows.length)return 0
  return Math.round(rows.filter(a=>a.status==='Hadir').length/rows.length*100)
 })
 const nonZero=monthly.filter(Boolean), averageAttendance=nonZero.length?Math.round(nonZero.reduce((a,b)=>a+b,0)/nonZero.length):presentPct
 const highest=nonZero.length?Math.max(...nonZero):0,lowest=nonZero.length?Math.min(...nonZero):0

 const perStudent=students.map(s=>{const scores=grades.filter(g=>g.studentId===s.id).map(g=>Number(g.score)).filter(n=>Number.isFinite(n)&&n>0);return {...s,average:scores.length?scores.reduce((a,b)=>a+b,0)/scores.length:0,count:scores.length}})
 const topStudents=perStudent.filter(x=>x.count).sort((a,b)=>b.average-a.average).slice(0,5)
 const fallbackTop=perStudent.slice(0,5)
 const shownTop=topStudents.length?topStudents:fallbackTop
 const buckets={high:validGrades.filter(n=>n>=90).length,good:validGrades.filter(n=>n>=80&&n<90).length,mid:validGrades.filter(n=>n>=70&&n<80).length,low:validGrades.filter(n=>n<70).length}

 const recent=[
  ...attendance.slice(-5).map(a=>({id:`a-${a.id}`,title:`Absensi ${a.status}`,subtitle:`${students.find(s=>s.id===a.studentId)?.name||'Siswa'} · ${formatDate(a.date)}`,kind:'attendance'})),
  ...grades.slice(-5).map(g=>({id:`g-${g.id}`,title:`Nilai ${g.subject}`,subtitle:`${students.find(s=>s.id===g.studentId)?.name||'Siswa'} · ${g.field?.toUpperCase()||'Komponen'}`,kind:'grade'})),
  ...notices.slice(0,3).map(n=>({id:`n-${n.id}`,title:'Pengumuman diterbitkan',subtitle:`${n.title} · ${formatDate(n.date)}`,kind:'notice'}))
 ].slice(-6).reverse().slice(0,3)
 const upcoming=[...schedules].filter(s=>s.date>=today).sort((a,b)=>`${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)).slice(0,3)
 const stats=[
  ['Jumlah Siswa',students.length,`${male} Laki-laki · ${female} Perempuan`,Users,'gold'],
  ['Kehadiran Hari Ini',present,`${presentPct}% dari ${students.length} siswa`,UserCheck,'green'],
  ['Data Nilai',grades.length,'Nilai tersimpan',ClipboardCheck,'blue'],
  ['Belum Diinput',incomplete,'Perlu perhatian',FileText,'red'],
  ['Pengumuman',activeNotices.length,'Informasi aktif',Megaphone,'purple'],
  ['Agenda Hari Ini',todayAgenda,'Lihat jadwal',CalendarDays,'gold']
 ]
 return <>
  <section className="army-hero"><div><p>Selamat datang kembali,</p><h1>{data.settings.teacher}</h1><h2>Guru Kelas 5B</h2><blockquote>“ Satu Tim · Satu Tujuan · Meraih Kemenangan! ”</blockquote></div><div className="hero-badge"><Award/><span>TAHUN PELAJARAN</span><b>{data.settings.year}</b></div></section>
  <div className="army-stats">{stats.map(([l,v,sub,Icon,tone])=><Card key={l} className={`army-stat tone-${tone}`}><Icon/><div><span>{l}</span><b>{v}</b><small>{sub}</small></div></Card>)}</div>
  <div className="army-dashboard-grid">
   <Card className="army-panel attendance-panel"><div className="panel-title"><TrendingUp/><h3>Grafik Kehadiran Bulan Ini</h3></div><MiniLineChart values={monthly}/><div className="metric-row"><div><CheckCircle2/><span>Rata-rata Kehadiran</span><b>{averageAttendance}%</b></div><div><TrendingUp/><span>Tertinggi</span><b>{highest}%</b></div><div><TrendingUp className="down"/><span>Terendah</span><b>{lowest}%</b></div></div><button className="panel-action" onClick={()=>setPage('attendance')}>Kelola Absensi <ArrowRight/></button></Card>
   <Card className="army-panel score-panel"><div className="panel-title"><BookOpenCheck/><h3>Distribusi Nilai</h3></div><div className="score-overview"><Donut value={avg}/><ul><li><i className="legend l1"/>90–100 <b>{buckets.high} nilai</b></li><li><i className="legend l2"/>80–89 <b>{buckets.good} nilai</b></li><li><i className="legend l3"/>70–79 <b>{buckets.mid} nilai</b></li><li><i className="legend l4"/>&lt; 70 <b>{buckets.low} nilai</b></li></ul></div><button className="panel-action" onClick={()=>setPage('grades')}>Lihat Detail Nilai <ArrowRight/></button></Card>
   <Card className="army-panel top-panel"><div className="panel-title"><Award/><h3>5 Siswa Terbaik</h3></div><div className="top-list">{shownTop.map((s,i)=><div key={s.id}><span className="rank-avatar">{i+1}</span><p><b>{s.name}</b><small>{s.count?`${s.count} nilai tercatat`:'Belum ada nilai'}</small></p><strong>{s.average?s.average.toFixed(2):'0.00'}</strong></div>)}</div><button className="panel-action" onClick={()=>setPage('students')}>Lihat Semua Siswa <ArrowRight/></button></Card>
   <Card className="army-panel activity-panel"><div className="panel-title"><Clock3/><h3>Aktivitas Terbaru</h3></div><div className="activity-list">{recent.length?recent.map(item=><div key={item.id}><span className="activity-icon"><CheckCircle2/></span><p><b>{item.title}</b><small>{item.subtitle}</small></p><em>Berhasil</em></div>):<div><span className="activity-icon"><ClipboardCheck/></span><p><b>Belum ada aktivitas</b><small>Absensi, nilai, atau pengumuman baru akan tampil di sini.</small></p></div>}</div></Card>
   <Card className="army-panel announcement-panel"><div className="panel-title"><Megaphone/><h3>Pengumuman Terbaru</h3></div><div className="notice-list">{activeNotices.slice(0,3).map(n=><div key={n.id}><Megaphone/><p><b>{n.title}</b><small>{n.body}</small></p><span>Aktif</span></div>)}</div><button className="panel-action" onClick={()=>setPage('announcements')}>Kelola Pengumuman <ArrowRight/></button></Card>
   <Card className="army-panel agenda-panel"><div className="panel-title"><CalendarDays/><h3>Agenda Terdekat</h3></div><div className="agenda-list">{upcoming.map(item=>{const d=new Date(`${item.date}T00:00:00`);return <div key={item.id}><time><b>{d.getDate()}</b><small>{d.toLocaleString('id-ID',{month:'short'}).toUpperCase()}</small></time><p><b>{item.title}</b><small>{item.start}–{item.end} · {item.type}</small></p><span>{formatDate(item.date)}</span></div>})}</div><button className="panel-action" onClick={()=>setPage('schedule')}>Kelola Jadwal <ArrowRight/></button></Card>
  </div>
 </>
}
