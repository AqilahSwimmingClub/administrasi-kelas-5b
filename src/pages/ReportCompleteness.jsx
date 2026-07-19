import { useMemo,useState } from 'react'
import { Card,Select } from '../components/Common'
import { Save, UsersRound, Trophy, NotebookPen, CalendarCheck2 } from 'lucide-react'

const uid=()=>globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(16).slice(2)}`
const semesterRange=(year,semester)=>{const start=Number(String(year||'2026/2027').slice(0,4));return semester==='1'?[`${start}-07-01`,`${start}-12-31`]:[`${start+1}-01-01`,`${start+1}-06-30`]}
const attendanceSummary=(data,studentId,semester)=>{const [a,b]=semesterRange(data.settings.year,semester);const rows=(data.attendance||[]).filter(x=>x.studentId===studentId&&x.date>=a&&x.date<=b);return{Hadir:rows.filter(x=>x.status==='Hadir').length,Sakit:rows.filter(x=>x.status==='Sakit').length,Izin:rows.filter(x=>x.status==='Izin').length,Alpa:rows.filter(x=>x.status==='Alpa').length,Terlambat:rows.filter(x=>x.status==='Terlambat').length}}

export default function ReportCompleteness({data,setData}){
 const [semester,setSemester]=useState(data.settings.semester||'1'),[studentId,setStudentId]=useState(data.students[0]?.id||''),[tab,setTab]=useState('extracurricular')
 const student=data.students.find(x=>x.id===studentId)
 const key=`${studentId}|${semester}`
 const saved=(data.reportCompleteness||{})[key]||{}
 const [form,setForm]=useState(saved)
 const switchStudent=(id)=>{setStudentId(id);setForm((data.reportCompleteness||{})[`${id}|${semester}`]||{})}
 const switchSemester=(v)=>{setSemester(v);setForm((data.reportCompleteness||{})[`${studentId}|${v}`]||{})}
 const set=(k,v)=>setForm(f=>({...f,[k]:v}))
 const save=()=>setData(d=>({...d,reportCompleteness:{...(d.reportCompleteness||{}),[key]:{...form,updatedAt:new Date().toISOString()}},notifications:[{id:uid(),title:'Kelengkapan rapor disimpan',message:`${student?.name} Semester ${semester}`,page:'reportCompleteness',createdAt:new Date().toISOString(),read:false},...(d.notifications||[])]}))
 const att=useMemo(()=>attendanceSummary(data,studentId,semester),[data,studentId,semester])
 const extras=form.extracurriculars||[{name:'',grade:'',description:''},{name:'',grade:'',description:''}]
 const achievements=form.achievements||[{name:'',level:'',description:''}]
 return <><div className="page-head"><div><h1>Input Kelengkapan Rapor</h1><p>Kehadiran otomatis dari Absensi. Tidak ada input identitas sekolah, tinggi/berat badan, atau kesehatan.</p></div><button className="primary" onClick={save}><Save/>Simpan Kelengkapan</button></div>
 <Card><div className="erapor-filters"><Select label="Kelas" value={data.settings.className} disabled><option>{data.settings.className}</option></Select><Select label="Semester" value={semester} onChange={e=>switchSemester(e.target.value)}><option value="1">Semester 1</option><option value="2">Semester 2</option></Select><Select label="Siswa" value={studentId} onChange={e=>switchStudent(e.target.value)}>{data.students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</Select></div>
 <div className="subtabs"><button className={tab==='extracurricular'?'active':''} onClick={()=>setTab('extracurricular')}><UsersRound/>Ekstrakurikuler</button><button className={tab==='achievement'?'active':''} onClick={()=>setTab('achievement')}><Trophy/>Prestasi</button><button className={tab==='note'?'active':''} onClick={()=>setTab('note')}><NotebookPen/>Catatan Wali Kelas</button><button className={tab==='attendance'?'active':''} onClick={()=>setTab('attendance')}><CalendarCheck2/>Rekap Kehadiran</button></div>
 {tab==='extracurricular'&&<div className="completeness-grid">{extras.map((x,i)=><div className="completeness-row" key={i}><input placeholder="Nama ekstrakurikuler" value={x.name||''} onChange={e=>set('extracurriculars',extras.map((v,j)=>j===i?{...v,name:e.target.value}:v))}/><select value={x.grade||''} onChange={e=>set('extracurriculars',extras.map((v,j)=>j===i?{...v,grade:e.target.value}:v))}><option value="">Predikat</option><option>A</option><option>B</option><option>C</option><option>D</option></select><input placeholder="Keterangan" value={x.description||''} onChange={e=>set('extracurriculars',extras.map((v,j)=>j===i?{...v,description:e.target.value}:v))}/></div>)}</div>}
 {tab==='achievement'&&<div className="completeness-grid">{achievements.map((x,i)=><div className="completeness-row" key={i}><input placeholder="Nama prestasi" value={x.name||''} onChange={e=>set('achievements',achievements.map((v,j)=>j===i?{...v,name:e.target.value}:v))}/><input placeholder="Tingkat" value={x.level||''} onChange={e=>set('achievements',achievements.map((v,j)=>j===i?{...v,level:e.target.value}:v))}/><input placeholder="Keterangan" value={x.description||''} onChange={e=>set('achievements',achievements.map((v,j)=>j===i?{...v,description:e.target.value}:v))}/></div>)}</div>}
 {tab==='note'&&<textarea className="large-textarea" value={form.teacherNote||''} onChange={e=>set('teacherNote',e.target.value)} placeholder="Catatan wali kelas untuk siswa..."/>}
 {tab==='attendance'&&<div className="attendance-auto-card"><h3>Rekap otomatis Semester {semester}</h3><div className="attendance-quick-summary">{Object.entries(att).map(([k,v])=><div key={k}><span>{k}</span><b>{v}</b></div>)}</div><p>Data ini hanya dibaca dari menu Absensi dan tidak dapat diketik manual.</p></div>}
 </Card></>
}
