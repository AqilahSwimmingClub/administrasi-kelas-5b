import { seedStudents, seedAttendance, seedGrades, seedSchedules, seedAnnouncements, initialSettings } from '../data'
const KEY='ak5b_data_v2'
const fresh=()=>({students:seedStudents,attendance:seedAttendance,grades:seedGrades,schedules:seedSchedules,announcements:seedAnnouncements,settings:initialSettings})
export function loadData(){
 try{
  const saved=JSON.parse(localStorage.getItem(KEY)||'null')
  if(!saved)return fresh()
  return {
   students:Array.isArray(saved.students)?saved.students:seedStudents,
   attendance:Array.isArray(saved.attendance)?saved.attendance:[],
   grades:Array.isArray(saved.grades)?saved.grades:[],
   schedules:Array.isArray(saved.schedules)?saved.schedules:seedSchedules,
   announcements:Array.isArray(saved.announcements)?saved.announcements:seedAnnouncements,
   settings:{...initialSettings,...(saved.settings||{})}
  }
 }catch{return fresh()}
}
export function saveData(data){localStorage.setItem(KEY,JSON.stringify(data))}
export function downloadBlob(content,filename,type='application/octet-stream'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
