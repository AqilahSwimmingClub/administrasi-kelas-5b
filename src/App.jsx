import { useEffect,useRef,useState } from 'react'
import { loadData,saveData } from './utils/storage'
import { cloudEnabled,loadCloudData,saveCloudData,subscribeCloudData } from './utils/cloud'
import Login from './pages/Login';import ReportCompleteness from './pages/ReportCompleteness';import ReportPrint from './pages/ReportPrint';import {LearningObjectives,ReportInput,SavedGrades,AssessmentCheck} from './pages/EReport';import Layout from './components/Layout';import Dashboard from './pages/Dashboard';import Students from './pages/Students';import Attendance from './pages/Attendance';import Grades from './pages/Grades';import ParentPortal from './pages/ParentPortal';import Settings from './pages/Settings';import Schedule from './pages/Schedule';import Announcements from './pages/Announcements'

const PENDING_KEY='ak5b_pending_cloud_sync'

export default function App(){
 const [data,setData]=useState(loadData),[session,setSession]=useState(()=>JSON.parse(sessionStorage.getItem('ak5b_session')||'null')),[page,setPage]=useState('dashboard'),[splash,setSplash]=useState(true)
 const [sync,setSync]=useState({mode:cloudEnabled?'cloud':'local',status:cloudEnabled?'Menghubungkan...':'Lokal',last:null,error:''})
 const ready=useRef(false),applyingRemote=useRef(false),saveTimer=useRef(null),latestData=useRef(data)

 useEffect(()=>{latestData.current=data},[data])
 useEffect(()=>{const t=setTimeout(()=>setSplash(false),2200);return()=>clearTimeout(t)},[])

 async function pushCurrentData(payload=latestData.current){
  if(!cloudEnabled)return null
  setSync(s=>({...s,status:'Menyimpan...',error:''}))
  const result=await saveCloudData(payload)
  localStorage.removeItem(PENDING_KEY)
  setSync({mode:'cloud',status:'Tersinkron',last:result?.updated_at||new Date().toISOString(),error:''})
  return result
 }

 useEffect(()=>{
  let alive=true
  async function start(){
   if(!cloudEnabled){ready.current=true;return}
   try{
    const remote=await loadCloudData()
    if(!alive)return
    const hasPending=localStorage.getItem(PENDING_KEY)==='1'
    if(hasPending){
      await pushCurrentData(latestData.current)
    }else if(remote?.payload){
      applyingRemote.current=true
      setData(remote.payload)
      saveData(remote.payload)
      setSync({mode:'cloud',status:'Tersinkron',last:remote.updated_at,error:''})
    }else{
      await pushCurrentData(latestData.current)
    }
   }catch(e){
    localStorage.setItem(PENDING_KEY,'1')
    setSync({mode:'cloud',status:navigator.onLine?'Gagal sinkron':'Offline',last:null,error:e.message||'Gagal terhubung'})
   }
   ready.current=true
  }
  start()
  const stop=subscribeCloudData((payload,updatedAt)=>{
    if(!alive||!payload)return
    applyingRemote.current=true
    setData(payload)
    saveData(payload)
    localStorage.removeItem(PENDING_KEY)
    setSync({mode:'cloud',status:'Tersinkron',last:updatedAt,error:''})
  })
  const onOnline=async()=>{
    if(!ready.current||!cloudEnabled)return
    try{await pushCurrentData(latestData.current)}catch(e){setSync(s=>({...s,status:'Gagal sinkron',error:e.message||'Gagal menyimpan'}))}
  }
  const onOffline=()=>cloudEnabled&&setSync(s=>({...s,status:'Offline',error:'Tidak ada koneksi internet'}))
  window.addEventListener('online',onOnline)
  window.addEventListener('offline',onOffline)
  return()=>{alive=false;stop();clearTimeout(saveTimer.current);window.removeEventListener('online',onOnline);window.removeEventListener('offline',onOffline)}
 },[])

 useEffect(()=>{
  saveData(data)
  document.documentElement.style.setProperty('--primary',data.settings.accent||'#155e75')
  if(!cloudEnabled||!ready.current)return
  if(applyingRemote.current){applyingRemote.current=false;return}
  localStorage.setItem(PENDING_KEY,'1')
  clearTimeout(saveTimer.current)
  setSync(s=>({...s,status:navigator.onLine?'Menunggu simpan...':'Offline',error:navigator.onLine?'':'Tidak ada koneksi internet'}))
  saveTimer.current=setTimeout(async()=>{
    if(!navigator.onLine)return
    try{await pushCurrentData(data)}catch(e){setSync(s=>({...s,status:'Gagal sinkron',error:e.message||'Gagal menyimpan'}))}
  },700)
 },[data])

 const login=s=>{setSession(s);sessionStorage.setItem('ak5b_session',JSON.stringify(s));if(s.role==='parent')setPage('parents')}
 const logout=()=>{setSession(null);sessionStorage.removeItem('ak5b_session')}
 if(splash)return <div className="splash-screen"><div className="splash-emblem">★</div><h1>ADMINISTRASI KELAS 5B</h1><h2>SDN SATRIA JAYA 01</h2><p>by FAHMI DJAWAS, S.Pd</p><div className="splash-loader"><i/></div></div>
 if(!session)return <Login data={data} onLogin={login}/>
 if(session.role==='parent')return <div className="parent-only"><header><b>Portal Orang Tua — {data.settings.school}</b><span className={`sync-pill ${['Offline','Gagal sinkron'].includes(sync.status)?'sync-error':''}`}>{sync.mode==='cloud'?'☁':'●'} {sync.status}</span><button onClick={logout}>Keluar</button></header><main><ParentPortal data={data} setData={setData} studentId={session.studentId}/></main><footer className="app-footer parent-footer">Dashboard didesain oleh <strong>FAHMI DJAWAS</strong>. © 2026 Semua hak dilindungi</footer></div>
 const pages={dashboard:<Dashboard data={data} setPage={setPage}/>,students:<Students data={data} setData={setData}/>,attendance:<Attendance data={data} setData={setData}/>,grades:<Grades data={data} setData={setData}/>,schedule:<Schedule data={data} setData={setData}/>,announcements:<Announcements data={data} setData={setData}/>,settings:<Settings data={data} setData={setData} sync={sync}/>,learningObjectives:<LearningObjectives data={data} setData={setData}/>,reportInput:<ReportInput data={data} setData={setData}/>,savedGrades:<SavedGrades data={data} setData={setData}/>,assessmentCheck:<AssessmentCheck data={data}/>,reportCompleteness:<ReportCompleteness data={data} setData={setData}/>,reportPrint:<ReportPrint data={data}/>}
 return <Layout page={page} setPage={setPage} onLogout={logout} settings={data.settings} sync={sync} data={data} setData={setData}>{pages[page]}</Layout>
}
