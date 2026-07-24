import {useMemo,useState} from 'react'
import {BookOpen,ClipboardCheck,FileText,Image,MessageCircle,School,Trash2} from 'lucide-react'
import {Card} from '../components/Common'

const TYPES=[
 ['schedule','Jadwal & Tugas',BookOpen],['exam','Nilai & Hasil Ujian',ClipboardCheck],['school','Informasi Sekolah',School],['note','Catatan Guru',FileText],['chat','Pesan Langsung',MessageCircle],['gallery','Galeri Kegiatan',Image]
]
const now=()=>new Date().toISOString()
const fileData=file=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=()=>reject(new Error('File gagal dibaca'));r.readAsDataURL(file)})

export default function FamilyInformation({data,setData}){
 const [tab,setTab]=useState('schedule'),[studentId,setStudentId]=useState('all'),[title,setTitle]=useState(''),[body,setBody]=useState(''),[date,setDate]=useState(new Date().toISOString().slice(0,10)),[media,setMedia]=useState(null),[error,setError]=useState('')
 const items=useMemo(()=>[...(data.familyInformation||[])].filter(x=>x.type===tab).sort((a,b)=>String(b.createdAt).localeCompare(String(a.createdAt))),[data.familyInformation,tab])
 const submit=async e=>{
  e.preventDefault();setError('')
  try{
   let mediaData=''
   if(media){if(media.size>3*1024*1024)throw new Error('Foto/video maksimal 3 MB agar sinkronisasi tetap ringan.');mediaData=await fileData(media)}
   const item={id:crypto.randomUUID(),type:tab,studentId,title:title.trim(),body:body.trim(),date,media:mediaData,mediaType:media?.type||'',createdAt:now()}
   if(!item.title&&!item.body&&!item.media)throw new Error('Isi informasi terlebih dahulu.')
   setData(d=>({...d,familyInformation:[...(d.familyInformation||[]),item],notifications:[...(d.notifications||[]),{id:crypto.randomUUID(),title:TYPES.find(x=>x[0]===tab)?.[1]||'Informasi baru',message:item.title||item.body.slice(0,80),type:'parent-info',page:'familyInformation',createdAt:now(),read:false}]}))
   setTitle('');setBody('');setMedia(null)
   e.target.reset()
  }catch(err){setError(err.message)}
 }
 const remove=id=>setData(d=>({...d,familyInformation:(d.familyInformation||[]).filter(x=>x.id!==id)}))
 return <><div className="page-head"><div><h1>Informasi Orang Tua</h1><p>Semua informasi otomatis tersinkron dan hanya dapat dilihat oleh orang tua yang dituju.</p></div></div>
 <div className="subtabs family-tabs">{TYPES.map(([key,label,Icon])=><button key={key} className={tab===key?'active':''} onClick={()=>setTab(key)}><Icon size={17}/>{label}</button>)}</div>
 <Card><form className="family-form" onSubmit={submit}>
  <label className="field"><span>Tujuan Informasi</span><select value={studentId} onChange={e=>setStudentId(e.target.value)}><option value="all">Semua Orang Tua</option>{data.students.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
  <label className="field"><span>Tanggal</span><input type="date" value={date} onChange={e=>setDate(e.target.value)}/></label>
  <label className="field family-wide"><span>Judul</span><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Contoh: PR Matematika halaman 25"/></label>
  <label className="field family-wide"><span>Isi Informasi</span><textarea value={body} onChange={e=>setBody(e.target.value)} placeholder="Tuliskan informasi untuk orang tua..."/></label>
  {tab==='gallery'&&<label className="field family-wide"><span>Foto atau video singkat (maks. 3 MB)</span><input type="file" accept="image/*,video/*" onChange={e=>setMedia(e.target.files?.[0]||null)}/></label>}
  {error&&<p className="form-error family-wide">{error}</p>}
  <div className="family-wide section-actions right"><button className="primary" type="submit">Kirim & Sinkronkan</button></div>
 </form></Card>
 <div className="family-list">{items.length?items.map(item=>{const target=item.studentId==='all'?'Semua Orang Tua':data.students.find(s=>s.id===item.studentId)?.name||'Siswa';return <Card key={item.id} className="family-item"><div className="family-item-head"><div><b>{item.title||TYPES.find(x=>x[0]===item.type)?.[1]}</b><small>{target} · {item.date}</small></div><button className="icon" onClick={()=>remove(item.id)} title="Hapus"><Trash2 size={18}/></button></div>{item.body&&<p>{item.body}</p>}{item.media&&(item.mediaType?.startsWith('video')?<video controls src={item.media}/>:<img src={item.media} alt={item.title||'Kegiatan kelas'}/>)}</Card>}):<Card><p>Belum ada informasi pada bagian ini.</p></Card>}</div></>
}
