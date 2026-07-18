import { useMemo, useState } from 'react'
import { CalendarDays, Plus, Trash2, Clock3 } from 'lucide-react'
import { Card } from '../components/Common'

const empty={date:new Date().toISOString().slice(0,10),start:'07:00',end:'08:00',title:'',type:'Kegiatan Kelas'}
export default function Schedule({data,setData}){
 const [form,setForm]=useState(empty)
 const rows=useMemo(()=>[...(data.schedules||[])].sort((a,b)=>`${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)),[data.schedules])
 const submit=e=>{e.preventDefault();if(!form.title.trim())return;setData(d=>({...d,schedules:[...(d.schedules||[]),{...form,id:`ag${Date.now()}`}]}));setForm({...empty,date:form.date})}
 const remove=id=>setData(d=>({...d,schedules:(d.schedules||[]).filter(x=>x.id!==id)}))
 return <>
  <div className="page-head"><div><h1>Jadwal & Agenda</h1><p>Kelola kegiatan kelas, penilaian, dan agenda sekolah.</p></div></div>
  <div className="grid2 schedule-layout">
   <Card><h3>Tambah Agenda</h3><form onSubmit={submit} className="agenda-form">
    <label className="field"><span>Tanggal</span><input type="date" value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></label>
    <div className="form-grid"><label className="field"><span>Mulai</span><input type="time" value={form.start} onChange={e=>setForm({...form,start:e.target.value})}/></label><label className="field"><span>Selesai</span><input type="time" value={form.end} onChange={e=>setForm({...form,end:e.target.value})}/></label></div>
    <label className="field"><span>Nama Agenda</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Contoh: Ulangan Matematika"/></label>
    <label className="field"><span>Jenis</span><select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option>Kegiatan Kelas</option><option>Penilaian</option><option>Kegiatan Sekolah</option><option>Rapat</option></select></label>
    <button className="primary wide"><Plus size={18}/>Tambah Agenda</button>
   </form></Card>
   <Card><div className="panel-title"><CalendarDays/><h3>Agenda Terdekat</h3></div><div className="full-agenda-list">{rows.map(item=><div key={item.id}><time><b>{new Date(`${item.date}T00:00:00`).getDate()}</b><small>{new Date(`${item.date}T00:00:00`).toLocaleString('id-ID',{month:'short'}).toUpperCase()}</small></time><p><b>{item.title}</b><small><Clock3 size={13}/>{item.start}–{item.end} · {item.type}</small></p><button className="icon danger" onClick={()=>remove(item.id)} title="Hapus"><Trash2 size={17}/></button></div>)}</div></Card>
  </div>
 </>
}
