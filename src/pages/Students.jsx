import { useMemo,useRef,useState } from 'react'
import { Plus,Search,Pencil,Trash2,X,Camera,ImagePlus } from 'lucide-react'
import { Card,Field,Select,ExportBar } from '../components/Common'
import { fileToOptimizedDataUrl } from '../utils/images'

const empty={nis:'',nisn:'',nik:'',gender:'L',name:'',birthPlace:'',birthDate:'',parent:'',phone:'',address:'',photo:''}

export default function Students({data,setData}){
 const [q,setQ]=useState(''),[editing,setEditing]=useState(null),[form,setForm]=useState(empty),[photoError,setPhotoError]=useState('')
 const fileInput=useRef(null)
 const list=useMemo(()=>data.students.filter(s=>`${s.name} ${s.nis} ${s.nisn}`.toLowerCase().includes(q.toLowerCase())),[data.students,q])
 const save=e=>{e.preventDefault(); const item={...form,id:editing||crypto.randomUUID()}; setData(d=>({...d,students:editing?d.students.map(s=>s.id===editing?item:s):[...d.students,item]}));setEditing(null);setForm(empty);setPhotoError('')}
 const edit=s=>{setEditing(s.id);setForm({...empty,...s});setPhotoError('')}
 const del=id=>{if(confirm('Hapus data siswa?'))setData(d=>({...d,students:d.students.filter(s=>s.id!==id)}))}
 const openNew=()=>{setEditing('new');setForm(empty);setPhotoError('')}
 const choosePhoto=()=>fileInput.current?.click()
 const changePhoto=async e=>{
  const file=e.target.files?.[0]
  e.target.value=''
  if(!file)return
  try{setPhotoError('');const photo=await fileToOptimizedDataUrl(file);setForm(current=>({...current,photo}))}
  catch(err){setPhotoError(err.message||'Foto gagal diproses.')}
 }
 const columns=['NIS','NISN','Nama','JK','Tempat/Tanggal Lahir','Orang Tua','Telepon','Alamat'], rows=list.map(s=>[s.nis,s.nisn,s.name,s.gender,`${s.birthPlace}, ${s.birthDate}`,s.parent,s.phone,s.address])
 return <><div className="page-head"><div><h1>Data Siswa</h1><p>Kelola identitas dan foto siswa.</p></div><button className="primary" onClick={openNew}><Plus/>Tambah Siswa</button></div><Card><div className="toolbar"><div className="search"><Search/><input placeholder="Cari nama, NIS, atau NISN" value={q} onChange={e=>setQ(e.target.value)}/></div><ExportBar title="Data Siswa Kelas 5B" columns={columns} rows={rows}/></div><div className="table-wrap"><table><thead><tr><th>Foto</th><th>NIS/NISN</th><th>Nama</th><th>JK</th><th>TTL</th><th>Orang Tua</th><th>Alamat</th><th>Aksi</th></tr></thead><tbody>{list.map(s=><tr key={s.id}><td><div className="student-thumb">{s.photo?<img src={s.photo} alt={`Foto ${s.name}`}/>:<span>{s.name?.[0]||'?'}</span>}</div></td><td><b>{s.nis}</b><small>{s.nisn}</small></td><td>{s.name}</td><td>{s.gender}</td><td>{s.birthPlace}<small>{s.birthDate}</small></td><td>{s.parent}<small>{s.phone}</small></td><td>{s.address}</td><td><div className="actions"><button aria-label={`Edit ${s.name}`} onClick={()=>edit(s)}><Pencil/></button><button aria-label={`Hapus ${s.name}`} onClick={()=>del(s.id)}><Trash2/></button></div></td></tr>)}</tbody></table></div></Card>
 {editing&&<div className="modal"><form className="modal-card" onSubmit={save}><div className="modal-head"><h2>{editing==='new'?'Tambah':'Edit'} Siswa</h2><button type="button" onClick={()=>setEditing(null)}><X/></button></div><section className="student-photo-editor"><div className="student-photo-preview">{form.photo?<img src={form.photo} alt="Pratinjau foto siswa"/>:<Camera/>}</div><div><h3>Foto Siswa</h3><p>Foto ini otomatis tampil pada data guru dan portal orang tua.</p><button type="button" className="secondary photo-button" onClick={choosePhoto}><ImagePlus/>{form.photo?'Ganti Foto':'Unggah Foto'}</button>{form.photo&&<button type="button" className="text-button" onClick={()=>setForm({...form,photo:''})}>Hapus foto</button>}<input ref={fileInput} className="hidden-file-input" type="file" accept="image/*" onChange={changePhoto}/>{photoError&&<small className="photo-error">{photoError}</small>}</div></section><div className="form-grid"><Field label="NIS" value={form.nis} onChange={e=>setForm({...form,nis:e.target.value})} required/><Field label="NISN" value={form.nisn} onChange={e=>setForm({...form,nisn:e.target.value})} required/><Field label="NIK" value={form.nik} onChange={e=>setForm({...form,nik:e.target.value})}/><Select label="Jenis Kelamin" value={form.gender} onChange={e=>setForm({...form,gender:e.target.value})}><option>L</option><option>P</option></Select><Field label="Nama Lengkap" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Field label="Tempat Lahir" value={form.birthPlace} onChange={e=>setForm({...form,birthPlace:e.target.value})}/><Field label="Tanggal Lahir" type="date" value={form.birthDate} onChange={e=>setForm({...form,birthDate:e.target.value})}/><Field label="Nama Orang Tua" value={form.parent} onChange={e=>setForm({...form,parent:e.target.value})}/><Field label="Telepon" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Field label="Alamat" value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></div><button className="primary wide">Simpan Data</button></form></div>}</>
}
