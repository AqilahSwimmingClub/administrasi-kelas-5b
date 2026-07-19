import { useState } from 'react'
import { Megaphone, Plus, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Card, DateSelect, formatIndonesianDate } from '../components/Common'
const localDate=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`}
const empty={title:'',body:'',date:localDate(),active:true}
const notice=(title,message)=>({id:`nt-${Date.now()}-${Math.random().toString(36).slice(2,7)}`,title,message,page:'announcements',type:'announcement',createdAt:new Date().toISOString(),read:false})
export default function Announcements({data,setData}){
 const [form,setForm]=useState(empty)
 const submit=e=>{e.preventDefault();if(!form.title.trim())return;setData(d=>({...d,announcements:[{...form,id:`pn${Date.now()}`},...(d.announcements||[])],notifications:[notice('Pengumuman baru',form.title.trim()),...(d.notifications||[])]}));setForm(empty)}
 const remove=id=>setData(d=>({...d,announcements:(d.announcements||[]).filter(x=>x.id!==id)}))
 const toggle=id=>setData(d=>({...d,announcements:(d.announcements||[]).map(x=>x.id===id?{...x,active:!x.active}:x)}))
 return <>
  <div className="page-head"><div><h1>Pengumuman</h1><p>Buat informasi terbaru yang juga terlihat pada dashboard.</p></div></div>
  <div className="grid2 announcement-layout">
   <Card><h3>Tambah Pengumuman</h3><form onSubmit={submit}>
    <label className="field"><span>Judul</span><input value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Judul pengumuman"/></label>
    <label className="field"><span>Isi Informasi</span><textarea rows="5" value={form.body} onChange={e=>setForm({...form,body:e.target.value})} placeholder="Tuliskan informasi..."/></label>
    <DateSelect label="Tanggal" value={form.date} minYear={new Date().getFullYear()-1} maxYear={new Date().getFullYear()+5} required onChange={date=>setForm({...form,date})}/>
    <button className="primary wide"><Plus size={18}/>Terbitkan</button>
   </form></Card>
   <Card><div className="panel-title"><Megaphone/><h3>Daftar Pengumuman</h3></div><div className="manage-notices">{(data.announcements||[]).map(item=><article key={item.id} className={item.active?'':'inactive'}><div><b>{item.title}</b><small>{formatIndonesianDate(item.date)}</small><p>{item.body}</p></div><div><button className="icon" onClick={()=>toggle(item.id)} title="Aktif/nonaktif">{item.active?<ToggleRight/>:<ToggleLeft/>}</button><button className="icon danger" onClick={()=>remove(item.id)} title="Hapus"><Trash2/></button></div></article>)}</div></Card>
  </div>
 </>
}
