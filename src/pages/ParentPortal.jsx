import { useMemo,useRef,useState } from 'react'
import { Camera,ImagePlus } from 'lucide-react'
import { Card,ExportBar } from '../components/Common'
import { fileToOptimizedDataUrl } from '../utils/images'

export default function ParentPortal({data,setData,studentId}){
 const [selected,setSelected]=useState(studentId||data.students[0]?.id),[photoError,setPhotoError]=useState(''),[savingPhoto,setSavingPhoto]=useState(false)
 const fileInput=useRef(null)
 const s=data.students.find(x=>x.id===selected)
 const grades=(data.grades||[]).filter(g=>g.studentId===selected),att=(data.attendance||[]).filter(a=>a.studentId===selected)
 const avg=grades.length?Math.round(grades.reduce((a,b)=>a+Number(b.score||0),0)/grades.length):0
 const counts=['Hadir','Sakit','Izin','Alpa','Terlambat'].map(x=>[x,att.filter(a=>a.status===x).length])
 const latest=useMemo(()=>grades.slice(-12),[grades]);const rows=grades.map(g=>[g.subject,`Semester ${g.semester}`,g.field?.toUpperCase(),g.score])
 const changePhoto=async e=>{
  const file=e.target.files?.[0]
  e.target.value=''
  if(!file||!s)return
  try{
   setPhotoError('');setSavingPhoto(true)
   const photo=await fileToOptimizedDataUrl(file)
   setData(d=>({...d,students:d.students.map(item=>item.id===s.id?{...item,photo}:item)}))
  }catch(err){setPhotoError(err.message||'Foto gagal diproses.')}
  finally{setSavingPhoto(false)}
 }
 return <><div className="page-head"><div><h1>Portal Orang Tua</h1><p>Pantau profil, nilai, dan kehadiran siswa.</p></div>{!studentId&&<select value={selected} onChange={e=>setSelected(e.target.value)}>{data.students.map(x=><option key={x.id} value={x.id}>{x.name}</option>)}</select>}</div>{s&&<><Card className="student-profile"><div className="parent-photo-block"><div className="avatar parent-avatar">{s.photo?<img src={s.photo} alt={`Foto ${s.name}`}/>:<span>{s.name?.[0]||<Camera/>}</span>}</div><button className="secondary photo-button parent-photo-button" type="button" disabled={savingPhoto} onClick={()=>fileInput.current?.click()}><ImagePlus/>{savingPhoto?'Memproses...':'Ganti Foto'}</button><input ref={fileInput} className="hidden-file-input" type="file" accept="image/*" onChange={changePhoto}/>{photoError&&<small className="photo-error">{photoError}</small>}</div><div><h2>{s.name}</h2><p>NISN {s.nisn} · Kelas {data.settings.className}</p><small>Orang tua: {s.parent}</small><p className="photo-sync-note">Foto yang diganti di sini otomatis tampil pada halaman guru.</p></div><div className="score-ring"><b>{avg}</b><span>Rata-rata</span></div></Card><div className="grid2"><Card><h3>Ringkasan Kehadiran</h3><div className="attendance-bars">{counts.map(([x,n])=><div key={x}><span>{x}</span><div><i style={{width:`${Math.min(100,n*10)}%`}}/></div><b>{n}</b></div>)}</div></Card><Card><h3>Perkembangan Nilai</h3><div className="grade-chart">{latest.map(g=><div key={g.id} title={`${g.subject} ${g.field}: ${g.score}`}><i style={{height:`${g.score}%`}}/><small>{g.field?.toUpperCase()}</small></div>)}</div></Card></div><Card><div className="toolbar"><h3>Daftar Nilai</h3><ExportBar title={`Nilai ${s.name}`} columns={['Mata Pelajaran','Semester','Komponen','Nilai']} rows={rows}/></div><div className="table-wrap"><table><thead><tr><th>Mata Pelajaran</th><th>Semester</th><th>Komponen</th><th>Nilai</th></tr></thead><tbody>{grades.map(g=><tr key={g.id}><td>{g.subject}</td><td>{g.semester}</td><td>{g.field?.toUpperCase()}</td><td><b>{g.score}</b></td></tr>)}</tbody></table></div></Card></>}</>
}
