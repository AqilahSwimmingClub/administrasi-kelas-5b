import { Download, FileText, Printer, FileSpreadsheet } from 'lucide-react'
import { exportPDF,exportExcel,exportWord,printTable } from '../utils/exporters'

export const Card=({children,className=''})=><div className={`card ${className}`}>{children}</div>
export const Field=({label,...props})=><label className="field"><span>{label}</span><input {...props}/></label>
export const Select=({label,children,...props})=><label className="field"><span>{label}</span><select {...props}>{children}</select></label>

const MONTHS=['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const pad=value=>String(value).padStart(2,'0')
const parseDateValue=value=>{
 if(!value)return {day:'',month:'',year:''}
 const iso=String(value).match(/^(\d{4})-(\d{2})-(\d{2})$/)
 if(iso)return {year:iso[1],month:String(Number(iso[2])),day:String(Number(iso[3]))}
 const id=String(value).match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/)
 if(id)return {day:String(Number(id[1])),month:String(Number(id[2])),year:id[3]}
 return {day:'',month:'',year:''}
}

export function DateSelect({label,value,onChange,minYear=1940,maxYear=new Date().getFullYear()+10,required=false}){
 const selected=parseDateValue(value)
 const year=Number(selected.year)||new Date().getFullYear()
 const month=Number(selected.month)||1
 const daysInMonth=new Date(year,month,0).getDate()
 const years=[]
 for(let y=maxYear;y>=minYear;y--)years.push(y)
 const update=(part,next)=>{
  const draft={...selected,[part]:next}
  const y=Number(draft.year),m=Number(draft.month),d=Number(draft.day)
  if(y&&m&&d){
   const safeDay=Math.min(d,new Date(y,m,0).getDate())
   onChange?.(`${y}-${pad(m)}-${pad(safeDay)}`)
  }else onChange?.('')
 }
 return <div className="field date-select-field">
  <span>{label}</span>
  <div className="date-select-row">
   <select aria-label={`${label} tanggal`} value={selected.day} onChange={e=>update('day',e.target.value)} required={required}>
    <option value="">Tanggal</option>{Array.from({length:daysInMonth},(_,i)=><option key={i+1} value={i+1}>{i+1}</option>)}
   </select>
   <select aria-label={`${label} bulan`} value={selected.month} onChange={e=>update('month',e.target.value)} required={required}>
    <option value="">Bulan</option>{MONTHS.map((name,i)=><option key={name} value={i+1}>{name}</option>)}
   </select>
   <select aria-label={`${label} tahun`} value={selected.year} onChange={e=>update('year',e.target.value)} required={required}>
    <option value="">Tahun</option>{years.map(y=><option key={y} value={y}>{y}</option>)}
   </select>
  </div>
 </div>
}

export function formatIndonesianDate(value){
 const parsed=parseDateValue(value)
 if(!parsed.day||!parsed.month||!parsed.year)return value||'-'
 return `${Number(parsed.day)} ${MONTHS[Number(parsed.month)-1]} ${parsed.year}`
}

export function ExportBar({title,columns,rows}){return <div className="exportbar">
 <button onClick={()=>printTable(title,columns,rows)}><Printer size={16}/>Cetak</button>
 <button onClick={()=>exportPDF(title,columns,rows)}><FileText size={16}/>PDF</button>
 <button onClick={()=>exportWord(title,columns,rows)}><Download size={16}/>Word</button>
 <button onClick={()=>exportExcel(title,columns,rows)}><FileSpreadsheet size={16}/>Excel</button>
 </div>}
