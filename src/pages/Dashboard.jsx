import { Users,UserCheck,ClipboardCheck,TrendingUp } from 'lucide-react'
import { Card } from '../components/Common'
export default function Dashboard({data}){
 const today=new Date().toISOString().slice(0,10), todayA=data.attendance.filter(a=>a.date===today), present=todayA.filter(a=>a.status==='Hadir').length
 const avg=data.grades.length?Math.round(data.grades.reduce((a,b)=>a+Number(b.score),0)/data.grades.length):0
 const stats=[['Total Siswa',data.students.length,Users],['Hadir Hari Ini',present,UserCheck],['Data Nilai',data.grades.length,ClipboardCheck],['Rata-rata Nilai',avg,TrendingUp]]
 return <><div className="page-head"><div><h1>Dashboard</h1><p>Ringkasan kegiatan administrasi Kelas {data.settings.className}.</p></div></div><div className="stats">{stats.map(([l,v,I])=><Card key={l} className="stat"><I/><div><b>{v}</b><span>{l}</span></div></Card>)}</div><div className="grid2"><Card><h3>Informasi Kelas</h3><dl><div><dt>Sekolah</dt><dd>{data.settings.school}</dd></div><div><dt>Wali Kelas</dt><dd>{data.settings.teacher}</dd></div><div><dt>Tahun Ajaran</dt><dd>{data.settings.year}</dd></div><div><dt>Jumlah Siswa</dt><dd>{data.students.length}</dd></div></dl></Card><Card><h3>Aktivitas Terbaru</h3><div className="activity">{[...data.attendance].slice(-5).reverse().map(a=><div key={a.id}><span className={`badge ${a.status.toLowerCase()}`}>{a.status}</span><p>{data.students.find(s=>s.id===a.studentId)?.name}<small>{a.date}</small></p></div>)}</div></Card></div></>
}
