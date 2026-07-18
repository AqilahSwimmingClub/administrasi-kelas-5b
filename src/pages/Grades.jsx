import { useMemo,useState } from 'react'
import { Printer, Save, FileSpreadsheet } from 'lucide-react'
import * as XLSX from 'xlsx'
import { Card,Select } from '../components/Common'
import { subjects } from '../data'
import { printGradeBook } from '../utils/exporters'

const fields=[
 ...Array.from({length:5},(_,lm)=>Array.from({length:4},(_,tp)=>`lm${lm+1}tp${tp+1}`)).flat(),
 ...Array.from({length:5},(_,i)=>`lm${i+1}`),'sas'
]
const n=v=>v===''?'':Math.max(0,Math.min(100,Number(v)||0))

export default function Grades({data,setData}){
 const [subject,setSubject]=useState(subjects[0])
 const [semester,setSemester]=useState(data.settings.semester||'1')
 const key=(studentId,field)=>`${studentId}|${subject}|${semester}|${field}`
 const map=useMemo(()=>Object.fromEntries((data.grades||[]).map(g=>[`${g.studentId}|${g.subject}|${g.semester}|${g.field}`,g.score])),[data.grades])
 const [draft,setDraft]=useState({})
 const value=(sid,f)=>draft[key(sid,f)]??map[key(sid,f)]??''
 const setScore=(sid,f,v)=>setDraft(d=>({...d,[key(sid,f)]:v}))
 const save=()=>{
  setData(d=>{
   const changed={...draft}; const keep=(d.grades||[]).filter(g=>changed[`${g.studentId}|${g.subject}|${g.semester}|${g.field}`]===undefined)
   const added=Object.entries(changed).filter(([,v])=>v!=='').map(([k,v])=>{const [studentId,sub,sem,field]=k.split('|');return{id:crypto.randomUUID(),studentId,subject:sub,semester:sem,field,score:n(v)}})
   return {...d,grades:[...keep,...added]}
  });setDraft({});alert('Nilai tersimpan.')
 }
 const exportExcel=()=>{
  const rows=data.students.map((s,i)=>[i+1,s.nis,s.nisn,s.name,...fields.map(f=>value(s.id,f))])
  const headers=['No','NIS','NISN','Nama',...fields.map(f=>f.toUpperCase())]
  const ws=XLSX.utils.aoa_to_sheet([headers,...rows]); ws['!cols']=[{wch:5},{wch:13},{wch:14},{wch:30},...fields.map(()=>({wch:7}))]
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,`${subject.slice(0,25)} S${semester}`);XLSX.writeFile(wb,`Nilai-${subject}-Semester-${semester}.xlsx`)
 }
 return <><div className="page-head"><div><h1>Daftar Nilai Kurikulum Merdeka</h1><p>Format TP1-TP4, LM1-LM5, dan Sumatif Akhir Semester.</p></div><div className="grade-actions"><button className="primary" onClick={save}><Save/>Simpan</button><button onClick={exportExcel}><FileSpreadsheet/>Excel</button><button onClick={()=>printGradeBook(data,semester,subject)}><Printer/>Cetak/PDF</button></div></div>
 <Card><div className="toolbar grade-filter"><Select label="Semester" value={semester} onChange={e=>setSemester(e.target.value)}><option value="1">1 (Satu)</option><option value="2">2 (Dua)</option></Select><Select label="Mata Pelajaran" value={subject} onChange={e=>setSubject(e.target.value)}>{subjects.map(x=><option key={x}>{x}</option>)}</Select><button onClick={()=>printGradeBook(data,semester,null)}><Printer/>Cetak Buku Nilai Lengkap</button></div>
 <div className="grade-table-wrap"><table className="grade-table"><thead><tr><th rowSpan="3">No</th><th rowSpan="3">NIS</th><th rowSpan="3">NISN</th><th rowSpan="3" className="name-col">Nama</th><th colSpan="20">Formatif</th><th colSpan="5">Sumatif Lingkup Materi</th><th rowSpan="3">Sumatif Akhir Semester</th></tr><tr>{[1,2,3,4,5].map(x=><th colSpan="4" key={x}>Lingkup Materi {x}</th>)}<th colSpan="5">LM</th></tr><tr>{[1,2,3,4,5].flatMap(lm=>[1,2,3,4].map(tp=><th key={`${lm}-${tp}`}>TP{tp}</th>))}{[1,2,3,4,5].map(x=><th key={x}>LM{x}</th>)}</tr></thead><tbody>{data.students.map((s,i)=><tr key={s.id}><td>{i+1}</td><td>{s.nis}</td><td>{s.nisn||'-'}</td><td className="student-name">{s.name}</td>{fields.map(f=><td key={f}><input type="number" min="0" max="100" value={value(s.id,f)} onChange={e=>setScore(s.id,f,e.target.value)}/></td>)}</tr>)}</tbody></table></div></Card></>
}
