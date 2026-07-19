import { useMemo,useState } from 'react'
import { Save,Printer,FileSpreadsheet,CalendarDays,BarChart3,History,AlertTriangle } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Card, formatIndonesianDate } from '../components/Common'
import { printAttendance } from '../utils/exporters'

const STATUSES=['Hadir','Sakit','Izin','Alpa','Terlambat']
const short={Hadir:'H',Sakit:'S',Izin:'I',Alpa:'A',Terlambat:'T'}
const todayLocal=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const monthNames=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const parseAcademicYear=year=>{const nums=String(year||'').match(/\d{4}/g)||[];const start=Number(nums[0])||new Date().getFullYear();return [start,Number(nums[1])||start+1]}
const inRange=(date,start,end)=>date>=start&&date<=end

function summarize(students,records){
 return students.map(s=>{
  const list=records.filter(a=>a.studentId===s.id)
  const counts=Object.fromEntries(STATUSES.map(status=>[short[status],list.filter(a=>a.status===status).length]))
  const total=list.length
  const pct=total?Math.round(((counts.H+counts.T)/total)*100):0
  return {s,...counts,total,pct}
 })
}

export default function Attendance({data,setData}){
 const date=todayLocal()
 const [draft,setDraft]=useState({}),[tab,setTab]=useState('daily'),[month,setMonth]=useState(date.slice(0,7)),[semester,setSemester]=useState('1')
 const [startYear,endYear]=parseAcademicYear(data.settings.year)
 const existing=id=>(data.attendance||[]).find(a=>a.date===date&&a.studentId===id)
 const get=(id,k)=>draft[id]?.[k]??existing(id)?.[k]??(k==='status'?'Hadir':'')
 const day=new Date(`${date}T12:00:00`).getDay()
 const isWeekend=day===0||day===6
 const holiday=(data.settings.holidays||[]).find(h=>(typeof h==='string'?h:h.date)===date)
 const blocked=isWeekend||Boolean(holiday)

 const save=()=>{
  if(blocked){alert('Absensi tidak dapat diisi pada hari libur.');return}
  setData(d=>{
   const before=(d.attendance||[]).filter(a=>a.date===date)
   const keep=(d.attendance||[]).filter(a=>a.date!==date)
   const added=d.students.map(s=>({id:existing(s.id)?.id||crypto.randomUUID(),date,studentId:s.id,status:get(s.id,'status'),note:get(s.id,'note')}))
   const changes=added.filter(next=>{const prev=before.find(x=>x.studentId===next.studentId);return !prev||prev.status!==next.status||prev.note!==next.note})
   const auditEntry={id:crypto.randomUUID(),date,createdAt:new Date().toISOString(),actor:'Guru',action:before.length?'Mengubah absensi harian':'Mengisi absensi harian',changes:changes.map(x=>({studentId:x.studentId,from:before.find(b=>b.studentId===x.studentId)?.status||'-',to:x.status}))}
   const notif={id:crypto.randomUUID(),title:'Absensi tersimpan',message:`Absensi ${formatIndonesianDate(date)} tersimpan untuk ${added.length} siswa.`,type:'attendance',page:'attendance',createdAt:new Date().toISOString(),read:false}
   return {...d,attendance:[...keep,...added],attendanceAudit:[auditEntry,...(d.attendanceAudit||[])].slice(0,300),notifications:[notif,...(d.notifications||[])]}
  })
  setDraft({});alert('Absensi tersimpan dan seluruh rekap diperbarui.')
 }

 const allRecords=data.attendance||[]
 const dailyRecords=allRecords.filter(a=>a.date===date)
 const monthRecords=allRecords.filter(a=>a.date.startsWith(month))
 const semesterRange=semester==='1'
  ? [`${startYear}-07-01`,`${startYear}-12-31`]
  : [`${endYear}-01-01`,`${endYear}-06-30`]
 const semesterRecords=allRecords.filter(a=>inRange(a.date,...semesterRange))
 const yearRecords=allRecords.filter(a=>inRange(a.date,`${startYear}-07-01`,`${endYear}-06-30`))
 const activeRecords=tab==='daily'?dailyRecords:tab==='monthly'?monthRecords:tab==='semester'?semesterRecords:yearRecords
 const summary=useMemo(()=>summarize(data.students,activeRecords),[data.students,activeRecords])
 const classTotals=useMemo(()=>Object.fromEntries(STATUSES.map(s=>[s,activeRecords.filter(a=>a.status===s).length])),[activeRecords])
 const lowAttendance=summary.filter(x=>x.total>=3&&x.pct<90)
 const consecutiveAlpa=useMemo(()=>data.students.filter(s=>{
  const dates=allRecords.filter(a=>a.studentId===s.id&&a.status==='Alpa').map(a=>a.date).sort().reverse()
  if(dates.length<3)return false
  for(let i=0;i<dates.length-2;i++){
   const a=new Date(dates[i]),c=new Date(dates[i+2]);if((a-c)/86400000<=4)return true
  }
  return false
 }),[allRecords,data.students])

 const exportExcel=()=>{
  const label=tab==='monthly'?month:tab==='semester'?`Semester ${semester}`:tab==='yearly'?`Tahun Pelajaran ${data.settings.year}`:formatIndonesianDate(date)
  const ws=XLSX.utils.aoa_to_sheet([
   [`Rekap Absensi - ${label}`],[],
   ['No','NIS','NISN','Nama','Hadir','Sakit','Izin','Alpa','Terlambat','Total','Persentase'],
   ...summary.map((x,i)=>[i+1,x.s.nis,x.s.nisn,x.s.name,x.H,x.S,x.I,x.A,x.T,x.total,`${x.pct}%`])
  ])
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Rekap Absensi');XLSX.writeFile(wb,`Rekap-Absensi-${label.replaceAll(' ','-').replaceAll('/','-')}.xlsx`)
 }

 const rekapTable=<div className="table-wrap"><table><thead><tr><th>No</th><th>NIS / NISN</th><th>Nama</th><th>H</th><th>S</th><th>I</th><th>A</th><th>T</th><th>Total</th><th>Kehadiran</th></tr></thead><tbody>{summary.map((x,i)=><tr key={x.s.id}><td>{i+1}</td><td>{x.s.nis}<small>{x.s.nisn}</small></td><td><b>{x.s.name}</b></td><td>{x.H}</td><td>{x.S}</td><td>{x.I}</td><td>{x.A}</td><td>{x.T}</td><td>{x.total}</td><td><b className={x.pct<90?'attendance-low':''}>{x.pct}%</b></td></tr>)}</tbody></table></div>

 return <>
  <div className="page-head"><div><h1>Absensi Siswa</h1><p>Absensi otomatis dan rekap tahun pelajaran {data.settings.year}.</p></div><div className="grade-actions"><button onClick={exportExcel}><FileSpreadsheet/>Excel</button><button onClick={()=>printAttendance({...data,attendance:activeRecords})}><Printer/>Cetak/PDF</button></div></div>
  <div className="attendance-tabs">
   <button className={tab==='daily'?'active':''} onClick={()=>setTab('daily')}><CalendarDays/>Harian</button>
   <button className={tab==='monthly'?'active':''} onClick={()=>setTab('monthly')}><BarChart3/>Bulanan</button>
   <button className={tab==='semester'?'active':''} onClick={()=>setTab('semester')}><BarChart3/>Semester</button>
   <button className={tab==='yearly'?'active':''} onClick={()=>setTab('yearly')}><BarChart3/>Tahunan</button>
   <button className={tab==='history'?'active':''} onClick={()=>setTab('history')}><History/>Riwayat</button>
  </div>

  {tab==='daily'&&<Card><div className="toolbar"><div className="automatic-date"><span>Tanggal Absensi</span><strong>{formatIndonesianDate(date)}</strong><small>Otomatis mengikuti tanggal perangkat</small></div><span>{data.students.length} siswa</span></div>
   {blocked&&<div className="attendance-warning"><AlertTriangle/><div><b>Hari libur</b><span>{holiday?.name||holiday||'Sabtu/Minggu'} — input absensi dinonaktifkan.</span></div></div>}
   <div className="attendance-quick-summary">{STATUSES.map(s=><div key={s}><span>{s}</span><b>{dailyRecords.filter(a=>a.status===s).length}</b></div>)}</div>
   <div className="table-wrap"><table><thead><tr><th>No</th><th>NIS</th><th>Nama Siswa</th><th>Status</th><th>Keterangan</th></tr></thead><tbody>{data.students.map((s,i)=><tr key={s.id}><td>{i+1}</td><td>{s.nis}</td><td><b>{s.name}</b><small>{s.nisn}</small></td><td><select disabled={blocked} className={`status-select ${get(s.id,'status').toLowerCase()}`} value={get(s.id,'status')} onChange={e=>setDraft({...draft,[s.id]:{...draft[s.id],status:e.target.value}})}>{STATUSES.map(x=><option key={x}>{x}</option>)}</select></td><td><input disabled={blocked} className="table-input" value={get(s.id,'note')} onChange={e=>setDraft({...draft,[s.id]:{...draft[s.id],note:e.target.value}})} placeholder="Keterangan opsional"/></td></tr>)}</tbody></table></div><button disabled={blocked} className="primary save" onClick={save}><Save/>Simpan Absensi</button></Card>}

  {tab==='monthly'&&<Card><div className="attendance-filter"><label><span>Pilih Bulan</span><input type="month" value={month} onChange={e=>setMonth(e.target.value)}/></label><div><b>{monthNames[Number(month.slice(5,7))-1]} {month.slice(0,4)}</b><small>{monthRecords.length} catatan absensi</small></div></div><div className="attendance-quick-summary">{STATUSES.map(s=><div key={s}><span>{s}</span><b>{classTotals[s]}</b></div>)}</div>{rekapTable}</Card>}

  {tab==='semester'&&<Card><div className="attendance-filter"><label><span>Pilih Semester</span><select value={semester} onChange={e=>setSemester(e.target.value)}><option value="1">Semester 1 (Juli–Desember {startYear})</option><option value="2">Semester 2 (Januari–Juni {endYear})</option></select></label><div><b>Semester {semester}</b><small>{semesterRecords.length} catatan absensi</small></div></div><div className="attendance-quick-summary">{STATUSES.map(s=><div key={s}><span>{s}</span><b>{classTotals[s]}</b></div>)}</div>{rekapTable}</Card>}

  {tab==='yearly'&&<Card><div className="attendance-filter"><div><b>Tahun Pelajaran {data.settings.year}</b><small>Periode Juli {startYear} sampai Juni {endYear}</small></div></div><div className="attendance-quick-summary">{STATUSES.map(s=><div key={s}><span>{s}</span><b>{classTotals[s]}</b></div>)}</div>{rekapTable}</Card>}

  {tab!=='daily'&&tab!=='history'&&(lowAttendance.length>0||consecutiveAlpa.length>0)&&<Card className="attendance-alerts"><h3>Peringatan Kehadiran</h3>{lowAttendance.length>0&&<p><AlertTriangle/> Kehadiran di bawah 90%: <b>{lowAttendance.map(x=>x.s.name).join(', ')}</b></p>}{consecutiveAlpa.length>0&&<p><AlertTriangle/> Terdeteksi alpa berulang/berdekatan: <b>{consecutiveAlpa.map(x=>x.name).join(', ')}</b></p>}</Card>}

  {tab==='history'&&<Card><h3>Riwayat Perubahan Absensi</h3><div className="table-wrap"><table><thead><tr><th>Waktu</th><th>Tanggal Absensi</th><th>Pengguna</th><th>Tindakan</th><th>Perubahan</th></tr></thead><tbody>{(data.attendanceAudit||[]).map(a=><tr key={a.id}><td>{new Date(a.createdAt).toLocaleString('id-ID')}</td><td>{formatIndonesianDate(a.date)}</td><td>{a.actor}</td><td>{a.action}</td><td>{a.changes?.length||0} siswa</td></tr>)}{!(data.attendanceAudit||[]).length&&<tr><td colSpan="5">Belum ada riwayat perubahan.</td></tr>}</tbody></table></div></Card>}
 </>
}
