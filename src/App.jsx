import { useEffect,useRef,useState } from 'react'
import { loadData,saveData } from './utils/storage'
import { cloudEnabled,loadCloudData,saveCloudData,subscribeCloudData } from './utils/cloud'
import Login from './pages/Login';import Layout from './components/Layout';import Dashboard from './pages/Dashboard';import Students from './pages/Students';import Attendance from './pages/Attendance';import Grades from './pages/Grades';import ParentPortal from './pages/ParentPortal';import Settings from './pages/Settings'
export default function App(){
 const [data,setData]=useState(loadData),[session,setSession]=useState(()=>JSON.parse(sessionStorage.getItem('ak5b_session')||'null')),[page,setPage]=useState('dashboard')
 const [sync,setSync]=useState({mode:cloudEnabled?'cloud':'local',status:cloudEnabled?'Menghubungkan...':'Lokal',last:null,error:''})
 const ready=useRef(false),applyingRemote=useRef(false),saveTimer=useRef(null)
 useEffect(()=>{
  let alive=true
  async function start(){
   if(!cloudEnabled){ready.current=true;return}
   try{
    const remote=await loadCloudData()
    if(!alive)return
    if(remote?.payload){applyingRemote.current=true;setData(remote.payload);saveData(remote.payload);setSync({mode:'cloud',status:'Tersinkron',last:remote.updated_at,error:''})}
    else{await saveCloudData(data);setSync({mode:'cloud',status:'Tersinkron',last:new Date().toISOString(),error:''})}
   }catch(e){setSync({mode:'cloud',status:'Offline',last:null,error:e.message||'Gagal terhubung'})}
   ready.current=true
  }
  start()
  const stop=subscribeCloudData((payload,updatedAt)=>{if(!alive)return;applyingRemote.current=true;setData(payload);saveData(payload);setSync({mode:'cloud',status:'Tersinkron',last:updatedAt,error:''})})
  return()=>{alive=false;stop();clearTimeout(saveTimer.current)}
 },[])
 useEffect(()=>{
  saveData(data);document.documentElement.style.setProperty('--primary',data.settings.accent||'#155e75')
  if(!cloudEnabled||!ready.current)return
  if(applyingRemote.current){applyingRemote.current=false;return}
  clearTimeout(saveTimer.current)
  setSync(s=>({...s,status:'Menyimpan...',error:''}))
  saveTimer.current=setTimeout(async()=>{try{const r=await saveCloudData(data);setSync({mode:'cloud',status:'Tersinkron',last:r?.updated_at||new Date().toISOString(),error:''})}catch(e){setSync(s=>({...s,status:'Offline',error:e.message||'Gagal menyimpan'}))}},600)
 },[data])
 const login=s=>{setSession(s);sessionStorage.setItem('ak5b_session',JSON.stringify(s));if(s.role==='parent')setPage('parents')}; const logout=()=>{setSession(null);sessionStorage.removeItem('ak5b_session')}
 if(!session)return <Login data={data} onLogin={login}/>
 if(session.role==='parent')return <div className="parent-only"><header><b>Portal Orang Tua — {data.settings.school}</b><span className={`sync-pill ${sync.status==='Offline'?'sync-error':''}`}>{sync.mode==='cloud'?'☁':'●'} {sync.status}</span><button onClick={logout}>Keluar</button></header><main><ParentPortal data={data} studentId={session.studentId}/></main><footer className="app-footer parent-footer">Dashboard didesain oleh <strong>FAHMI DJAWAS</strong>. © 2026 Semua hak dilindungi</footer></div>
 const pages={dashboard:<Dashboard data={data}/>,students:<Students data={data} setData={setData}/>,attendance:<Attendance data={data} setData={setData}/>,grades:<Grades data={data} setData={setData}/>,parents:<ParentPortal data={data}/>,settings:<Settings data={data} setData={setData} sync={sync}/>}
 return <Layout page={page} setPage={setPage} onLogout={logout} settings={data.settings} sync={sync}>{pages[page]}</Layout>
}
