import { seedStudents, seedAttendance, seedGrades, initialSettings } from '../data'
const KEY='ak5b_data_v1'
export function loadData(){
  try { return JSON.parse(localStorage.getItem(KEY)) || {students:seedStudents,attendance:seedAttendance,grades:seedGrades,settings:initialSettings} }
  catch { return {students:seedStudents,attendance:seedAttendance,grades:seedGrades,settings:initialSettings} }
}
export function saveData(data){ localStorage.setItem(KEY,JSON.stringify(data)) }
export function downloadBlob(content,filename,type='application/octet-stream'){
 const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=filename; a.click(); URL.revokeObjectURL(a.href)
}
