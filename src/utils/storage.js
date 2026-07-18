import { seedStudents, seedAttendance, seedGrades, initialSettings } from '../data'
const KEY='ak5b_data_v2'
const fresh=()=>({students:seedStudents,attendance:seedAttendance,grades:seedGrades,settings:initialSettings})
export function loadData(){
 try{
  const saved=JSON.parse(localStorage.getItem(KEY)||'null')
  if(!saved)return fresh()
  return {students:Array.isArray(saved.students)?saved.students:seedStudents,attendance:Array.isArray(saved.attendance)?saved.attendance:[],grades:Array.isArray(saved.grades)?saved.grades:[],settings:{...initialSettings,...(saved.settings||{})}}
 }catch{return fresh()}
}
export function saveData(data){localStorage.setItem(KEY,JSON.stringify(data))}
export function downloadBlob(content,filename,type='application/octet-stream'){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=filename;a.click();URL.revokeObjectURL(a.href)}
