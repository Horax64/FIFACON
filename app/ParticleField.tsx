'use client';
import { useEffect, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

export default function ParticleField({enabled}:{enabled:boolean}){
  const [mounted,setMounted]=useState(false),[paused,setPaused]=useState(false),[away,setAway]=useState(false);
  useEffect(()=>{setMounted(true);try{setPaused(localStorage.getItem('fifa-con-particles')==='paused')}catch{}const visibility=()=>setAway(document.hidden);visibility();document.addEventListener('visibilitychange',visibility);return()=>document.removeEventListener('visibilitychange',visibility)},[]);
  function toggle(){const next=!paused;setPaused(next);try{localStorage.setItem('fifa-con-particles',next?'paused':'active')}catch{}}
  if(!enabled)return null;
  return <><button type="button" className="particles-toggle" onClick={toggle} aria-pressed={paused}>{paused?'Reanudar partículas':'Pausar partículas'}</button>{mounted&&createPortal(<div className={`ambient-particles ${paused||away?'particles-paused':''}`} aria-hidden="true">{Array.from({length:18},(_,i)=><span key={i} style={{left:`${(i*37+7)%100}%`,top:0,'--drift-x':`${(i%2?1:-1)*(12+i%4*6)}vw`,'--particle-size':`${2+i%3}px`,animationDuration:`${32+i%7*3}s`,animationDelay:`${-(32+i%7*3)*((i*7+3)%18)/18}s`} as CSSProperties}/>)}</div>,document.body)}</>;
}
