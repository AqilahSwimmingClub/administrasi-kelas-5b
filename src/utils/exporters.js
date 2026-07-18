import { jsPDF } from 'jspdf'
import * as XLSX from 'xlsx'
import { downloadBlob } from './storage'
import { subjects } from '../data'

const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))
const dateID=()=>new Intl.DateTimeFormat('id-ID',{day:'numeric',month:'long',year:'numeric'}).format(new Date())
const gradeFields=[...Array.from({length:5},(_,lm)=>Array.from({length:4},(_,tp)=>`lm${lm+1}tp${tp+1}`)).flat(),...Array.from({length:5},(_,i)=>`lm${i+1}`),'sas']
const gradeMap=data=>Object.fromEntries((data.grades||[]).map(g=>[`${g.studentId}|${g.subject}|${g.semester}|${g.field}`,g.score]))

export function exportPDF(title, columns, rows){
 const doc=new jsPDF({orientation:'landscape'}); doc.setFontSize(16); doc.text(title,14,16); doc.setFontSize(8)
 let y=25; const widths=columns.map(()=>270/columns.length)
 columns.forEach((c,i)=>doc.text(String(c),14+widths.slice(0,i).reduce((a,b)=>a+b,0),y)); y+=6
 rows.forEach(row=>{ if(y>195){doc.addPage();y=15} row.forEach((v,i)=>doc.text(String(v??'').slice(0,38),14+widths.slice(0,i).reduce((a,b)=>a+b,0),y)); y+=5 })
 doc.save(`${title.replaceAll(' ','-')}.pdf`)
}
export function exportExcel(title, columns, rows){const ws=XLSX.utils.aoa_to_sheet([columns,...rows]);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Data');XLSX.writeFile(wb,`${title.replaceAll(' ','-')}.xlsx`)}
export function exportWord(title, columns, rows){const table=`<table border="1" cellspacing="0" cellpadding="6"><thead><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;downloadBlob(`<!doctype html><html><meta charset="utf-8"><body><h1>${esc(title)}</h1>${table}</body></html>`,`${title.replaceAll(' ','-')}.doc`,'application/msword')}
export function printTable(title, columns, rows){const w=window.open('','_blank');if(!w)return;w.document.write(`<title>${esc(title)}</title><style>body{font-family:Arial;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px;font-size:12px}h1{font-size:20px}</style><h1>${esc(title)}</h1><table><tr>${columns.map(c=>`<th>${esc(c)}</th>`).join('')}</tr>${rows.map(r=>`<tr>${r.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</table>`);w.document.close();setTimeout(()=>w.print(),300)}

const cover=(s,semester)=>`<section class="page cover formal-page">
<img class="page-frame portrait-frame" src="/formal-border-frame.png" alt="">
<div class="cover-content">
<img class="cover-logo" src="/tutwuri-handayani-clean.png" alt="Logo Tut Wuri Handayani">
<h1>DAFTAR NILAI SEMESTER ${semester}<br>KURIKULUM MERDEKA</h1>
<table class="identity-cover">
<tr><th>NAMA SEKOLAH</th><td>:</td><td>${esc(s.school)}</td></tr><tr><th>STATUS SEKOLAH</th><td>:</td><td>${esc(s.status)}</td></tr>
<tr><th>ALAMAT</th><td>:</td><td>${esc(s.address)}</td></tr><tr><th>DESA/KELURAHAN</th><td>:</td><td>${esc(s.village)}</td></tr>
<tr><th>KECAMATAN</th><td>:</td><td>${esc(s.district)}</td></tr><tr><th>KABUPATEN/KOTA</th><td>:</td><td>${esc(s.city)}</td></tr>
<tr><th>PROVINSI</th><td>:</td><td>${esc(s.province)}</td></tr></table>
<table class="term"><tr><th>KELAS</th><td>:</td><td>${esc(s.className)}</td></tr><tr><th>SEMESTER</th><td>:</td><td>${semester} (${semester==='1'?'Satu':'Dua'})</td></tr><tr><th>TAHUN PELAJARAN</th><td>:</td><td>${esc(s.year)}</td></tr></table>
<div class="prepared">Disusun oleh :<br><b>${esc(s.teacher)}</b></div></div></section>`

const identity=(s)=>`<section class="page identity formal-page"><img class="page-frame portrait-frame" src="/formal-border-frame.png" alt=""><div class="identity-content"><h1>IDENTITAS</h1><div class="id-box"><h2>Wali Kelas</h2><p>${esc(s.teacher)}</p><p>NIP : ${esc(s.teacherNip)}</p></div><p class="compiled">Daftar Nilai ini Disusun Oleh : <b>${esc(s.teacher)}</b></p></div></section>`

const gradePage=(data,semester,subject,map)=>`<section class="page grade-page formal-page"><img class="page-frame landscape-frame" src="/formal-border-landscape.png" alt=""><div class="grade-content">
<h2>DAFTAR NILAI SEMESTER ${semester}</h2><h3>${esc(data.settings.school)}</h3>
<div class="meta"><b>KELAS</b><span>: ${esc(data.settings.className)}</span><b>MATA PELAJARAN</b><span>: ${esc(subject)}</span></div>
<table class="grade-print"><thead><tr><th rowspan="3">NO.<br>URUT</th><th rowspan="3">NIS</th><th rowspan="3">NISN</th><th rowspan="3" class="name">NAMA</th><th colspan="20">FORMATIF</th><th colspan="5">SUMATIF LINGKUP<br>MATERI</th><th rowspan="3">SUMATIF<br>AKHIR<br>SEMESTER</th></tr>
<tr>${[1,2,3,4,5].map(x=>`<th colspan="4">Lingkup Materi ${x}</th>`).join('')}<th colspan="5">LM</th></tr>
<tr>${[1,2,3,4,5].flatMap(()=>[1,2,3,4].map(x=>`<th>TP${x}</th>`)).join('')}${[1,2,3,4,5].map(x=>`<th>LM${x}</th>`).join('')}</tr></thead>
<tbody>${data.students.map((s,i)=>`<tr><td>${i+1}</td><td>${esc(s.nis)}</td><td>${esc(s.nisn||'-')}</td><td class="left">${esc(s.name)}</td>${gradeFields.map(f=>`<td>${esc(map[`${s.id}|${subject}|${semester}|${f}`]??'')}</td>`).join('')}</tr>`).join('')}</tbody></table>
<div class="footer-sign"><div><b>Keterangan :</b><br><i>TP = Tujuan Pembelajaran</i><br><i>LM = Lingkup Materi</i></div><div>Bekasi, ${dateID()}<br>Wali Kelas,<br><br><br><b><u>${esc(data.settings.teacher)}</u></b><br>NIP. ${esc(data.settings.teacherNip)}</div></div></div></section>`

export function printGradeBook(data,semester,onlySubject=null){
 const w=window.open('','_blank');if(!w)return;const map=gradeMap(data);const list=onlySubject?[onlySubject]:subjects
 w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Daftar Nilai Semester ${semester}</title><style>
 @page{size:A4 portrait;margin:0}@page grade{size:A4 landscape;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;color:#000;background:#fff}body{font-family:"Times New Roman",serif}.page{page-break-after:always;position:relative;overflow:hidden;background:#fff}.formal-page{isolation:isolate}.page-frame{position:absolute;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}.portrait-frame{object-fit:fill}.landscape-frame{object-fit:fill}.cover,.identity{width:210mm;height:297mm}.cover-content,.identity-content{position:relative;z-index:1;height:100%;padding:18mm 23mm 16mm}.cover-logo{display:block;width:45mm;height:45mm;object-fit:contain;margin:3mm auto 7mm}.cover h1{text-align:center;font-size:25px;line-height:1.35;margin:0 0 16mm;font-weight:700}.identity-cover,.term{border-collapse:collapse;margin:0 auto;font-size:14px;line-height:1.25}.identity-cover{width:78%}.identity-cover th,.term th{text-align:left;white-space:nowrap}.identity-cover td,.identity-cover th,.term td,.term th{padding:1.5px 4px}.identity-cover td:nth-child(2),.term td:nth-child(2){width:8mm;text-align:center}.term{margin-top:25mm;width:52%}.prepared{text-align:center;margin-top:18mm;font-size:14px;line-height:1.8}.identity h1{text-align:center;margin-top:15mm;font-size:25px}.id-box{text-align:center;margin-top:35mm;font-size:20px}.compiled{margin:75mm 15mm 0;font-size:16px}.grade-page{page:grade;width:297mm;height:210mm}.grade-content{position:relative;z-index:1;height:100%;padding:10mm 12mm 8mm}.grade-page h2,.grade-page h3{text-align:center;margin:0;font-size:16px;line-height:1.2}.grade-page h3{font-size:15px;margin-bottom:3mm}.meta{display:grid;grid-template-columns:42mm 1fr;max-width:180mm;margin:2mm 0 2mm;font-size:11px}.grade-print{width:100%;border-collapse:collapse;table-layout:fixed;font-family:Arial,sans-serif;font-size:6.2px}.grade-print th,.grade-print td{border:1px solid #000;text-align:center;padding:.6px;height:4.1mm}.grade-print th{font-weight:700}.grade-print .name{width:30mm}.grade-print th:nth-child(1){width:7mm}.grade-print th:nth-child(2){width:13mm}.grade-print th:nth-child(3){width:18mm}.grade-print .left{text-align:left;padding-left:2px;font-size:6.8px}.footer-sign{display:flex;justify-content:space-between;align-items:flex-start;margin:4mm 8mm 0;font-size:10px}.footer-sign>div:last-child{text-align:left;min-width:58mm}@media print{body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.page{break-after:page}} </style></head><body>${cover(data.settings,semester)}${identity(data.settings)}${list.map(x=>gradePage(data,semester,x,map)).join('')}</body></html>`);w.document.close();setTimeout(()=>w.print(),500)
}

export function printAttendance(data){
 const summary=data.students.map(s=>{const a=(data.attendance||[]).filter(x=>x.studentId===s.id);return[s,a.filter(x=>x.status==='Hadir').length,a.filter(x=>x.status==='Sakit').length,a.filter(x=>x.status==='Izin').length,a.filter(x=>x.status==='Alpa').length,a.filter(x=>x.status==='Terlambat').length]})
 const w=window.open('','_blank');if(!w)return;w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Rekap Absensi</title><style>@page{size:A4 landscape;margin:12mm}body{font-family:Arial}h1,h2{text-align:center;margin:2px}table{width:100%;border-collapse:collapse;margin-top:14px}th,td{border:1px solid #000;padding:6px;font-size:11px;text-align:center}td.name{text-align:left}.sign{width:280px;margin:25px 0 0 auto;line-height:1.5}</style></head><body><h1>REKAP ABSENSI SISWA</h1><h2>${esc(data.settings.school)} - KELAS ${esc(data.settings.className)}</h2><p>Tahun Pelajaran: ${esc(data.settings.year)}</p><table><tr><th>No</th><th>NIS</th><th>Nama</th><th>Hadir</th><th>Sakit</th><th>Izin</th><th>Alpa</th><th>Terlambat</th></tr>${summary.map((r,i)=>`<tr><td>${i+1}</td><td>${esc(r[0].nis)}</td><td class="name">${esc(r[0].name)}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td><td>${r[4]}</td><td>${r[5]}</td></tr>`).join('')}</table><div class="sign">Bekasi, ${dateID()}<br>Wali Kelas,<br><br><br><b><u>${esc(data.settings.teacher)}</u></b><br>NIP. ${esc(data.settings.teacherNip)}</div></body></html>`);w.document.close();setTimeout(()=>w.print(),400)
}
