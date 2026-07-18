import { Download, FileText, Printer, FileSpreadsheet } from 'lucide-react'
import { exportPDF,exportExcel,exportWord,printTable } from '../utils/exporters'
export const Card=({children,className=''})=><div className={`card ${className}`}>{children}</div>
export const Field=({label,...props})=><label className="field"><span>{label}</span><input {...props}/></label>
export const Select=({label,children,...props})=><label className="field"><span>{label}</span><select {...props}>{children}</select></label>
export function ExportBar({title,columns,rows}){return <div className="exportbar">
 <button onClick={()=>printTable(title,columns,rows)}><Printer size={16}/>Cetak</button>
 <button onClick={()=>exportPDF(title,columns,rows)}><FileText size={16}/>PDF</button>
 <button onClick={()=>exportWord(title,columns,rows)}><Download size={16}/>Word</button>
 <button onClick={()=>exportExcel(title,columns,rows)}><FileSpreadsheet size={16}/>Excel</button>
 </div>}
