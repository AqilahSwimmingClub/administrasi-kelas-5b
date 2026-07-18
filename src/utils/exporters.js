import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { downloadBlob } from './storage'

const esc=s=>String(s??'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]))
export function exportPDF(title, columns, rows){
 const doc=new jsPDF({orientation:'landscape'}); doc.setFontSize(16); doc.text(title,14,16); doc.setFontSize(8)
 let y=25; const widths=columns.map(()=>270/columns.length)
 columns.forEach((c,i)=>doc.text(String(c),14+widths.slice(0,i).reduce((a,b)=>a+b,0),y)); y+=6
 rows.forEach(row=>{ if(y>195){doc.addPage();y=15} row.forEach((v,i)=>doc.text(String(v??'').slice(0,38),14+widths.slice(0,i).reduce((a,b)=>a+b,0),y)); y+=5 })
 doc.save(`${title.replaceAll(' ','-')}.pdf`)
}
export function exportExcel(title, columns, rows){
 const ws=XLSX.utils.aoa_to_sheet([columns,...rows]); const wb=XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb,ws,'Data'); XLSX.writeFile(wb,`${title.replaceAll(' ','-')}.xlsx`)
}
export function exportWord(title, columns, rows){
 const table=`<table border="1" cellspacing="0" cellpadding="6"><thead><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`
 const html=`<!doctype html><html><meta charset="utf-8"><body><h1>${esc(title)}</h1>${table}</body></html>`
 downloadBlob(html,`${title.replaceAll(' ','-')}.doc`,'application/msword')
}
export function printTable(title, columns, rows){
 const w=window.open('','_blank'); if(!w)return
 w.document.write(`<title>${esc(title)}</title><style>body{font-family:Arial;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px;font-size:12px}h1{font-size:20px}</style><h1>${esc(title)}</h1><table><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table>`); w.document.close(); w.print()
}
