'use client';
import {useRef, useState, type KeyboardEvent} from 'react';
import type {Content} from './content';

const digits=(n:number)=>String(n).padStart(2,'0');
export default function ScopeSchedule({days,showTimes}:{days:Content['days'];showTimes:boolean}){
 const [day,setDay]=useState(0),[activity,setActivity]=useState(0);
 const options=useRef<(HTMLButtonElement|null)[]>([]);
 const dayIndex=Math.min(day,days.length-1),current=days[dayIndex];
 const sessions=current?.sessions||[],index=Math.min(activity,Math.max(0,sessions.length-1)),selected=sessions[index];
 function selectDay(next:number){setDay(next);setActivity(0)}
 function keyboard(e:KeyboardEvent<HTMLButtonElement>,i:number){let next=i;if(e.key==='ArrowDown')next=(i+1)%sessions.length;else if(e.key==='ArrowUp')next=(i-1+sessions.length)%sessions.length;else if(e.key==='Home')next=0;else if(e.key==='End')next=sessions.length-1;else return;e.preventDefault();setActivity(next);options.current[next]?.focus();}
 const phase=index*.55+dayIndex*.3;
 const traces=[0,1,2].map(channel=>Array.from({length:721},(_,x)=>{
  const pulse=Math.tanh(7*Math.sin(x*Math.PI*2/90+phase-channel*.42));
  const signal=channel===0&&x<300?0:31.25*pulse;
  const noise=1.1*Math.sin(x*1.7+channel)+.6*Math.sin(x*.59);
  return `${x?'L':'M'}${x},${(49+channel*73-signal+noise).toFixed(2)}`;
 }).join(' '));
 const overview=Array.from({length:361},(_,i)=>{const x=i*2;const burst=x>280&&x<440||x>620;return `${i?'L':'M'}${x},${(burst?20-10*Math.tanh(7*Math.sin(x*.22+phase)):30).toFixed(2)}`}).join(' ');
 return <div className="scope-instrument" role="region" aria-label="Cronograma interactivo del congreso">
  <div className="scope-case-label"><span><b>FIFA</b> / SCOPE 03</span><span>OSCILOSCOPIO DEL ENCUENTRO <i aria-hidden="true"/></span></div>
  <div className="scope-display">
   <div className="scope-status"><span className="scope-running">▶ RUN</span><span>M 40.0 ns <b>/</b> 2.50 GS/s</span><span className="scope-trigger">T ↗ Trig’d</span></div>
   <div className="scope-channels" role="group" aria-label="Elegir jornada">{days.map((d,i)=><button type="button" key={i} aria-pressed={i===dayIndex} onClick={()=>selectDay(i)}><span>J{digits(i+1)}</span>{d.label}</button>)}</div>
   <div className="scope-acquisition" aria-hidden="true">
    <div className="scope-plots">
     <div className="scope-overview"><span>M 200 ns</span><svg viewBox="0 0 720 46" preserveAspectRatio="none"><path className="scope-selection-window" d="M280 0H440V46H280Z"/><path className="scope-ch1 scope-signal" d={overview}/></svg></div>
     <div className="scope-graticule"><svg viewBox="0 0 720 250" preserveAspectRatio="none">
      <g className="scope-grid">{Array.from({length:11},(_,i)=><path key={`v${i}`} d={`M${i*72} 0V250`}/>)}{Array.from({length:9},(_,i)=><path key={`h${i}`} d={`M0 ${i*31.25}H720`}/>)}</g>
      <path className="scope-axis" d="M0 125H720 M360 0V250"/>
      <g className="scope-ticks">{Array.from({length:51},(_,i)=><path key={i} d={`M${i*14.4} 122V128`}/>)}{Array.from({length:41},(_,i)=><path key={i} d={`M357 ${i*6.25}H363`}/>)}</g>
      <path className="scope-cursor" d="M300 0V250"/>
      {traces.map((trace,i)=><path key={i} className={`scope-signal scope-ch${i+1}`} d={trace}/>)}
      <path className="scope-trigger-marker" d="M292 1H308L300 11Z"/>
     </svg><span className="scope-trigger-tag">T</span><span className="scope-zero scope-ch1">1▸</span><span className="scope-zero scope-ch2">2▸</span><span className="scope-zero scope-ch3">3▸</span><div key={`${dayIndex}-${index}`} className="scope-sweep"/></div>
     <div className="scope-scales"><span className="scope-ch1"><b>CH1</b> 2.50 V</span><span className="scope-ch2"><b>CH2</b> 2.50 V</span><span className="scope-ch3"><b>CH3</b> 2.50 V</span><span>40.0 ns/div</span></div>
    </div>
    <div className="scope-measures"><div className="scope-measure-cursors"><span>ΔV <b>350 mV</b></span><span>Δt <b>50.4 ns</b></span></div><div className="scope-ch1"><span>CH1 Freq</span><strong>19.95 MHz</strong><small>Vpp 4.98 V</small></div><div className="scope-ch2"><span>CH2 Freq</span><strong>19.99 MHz</strong><small>Vpp 5.02 V</small></div><div className="scope-ch3"><span>CH3 Freq</span><strong>19.93 MHz</strong><small>Vpp 4.96 V</small></div></div>
    <div className="scope-acquisition-foot"><span>T → 0.00000 s</span><span>CH1 ↗ 1.65 V</span><span>SIMULATION / SEÑALES ILUSTRATIVAS</span></div>
   </div>
   <div className="scope-content">
    <div className="scope-options"><p className="scope-small">SELECCIONÁ UNA ACTIVIDAD ↓</p><div className="scope-activity-list" role="group" aria-label="Actividades de la jornada">{sessions.map((s,i)=><button type="button" key={i} ref={node=>{options.current[i]=node}} aria-pressed={index===i} aria-controls="scope-detail" onKeyDown={e=>keyboard(e,i)} onClick={()=>setActivity(i)}><span className="scope-option-index">{digits(i+1)}</span><span>{s.title||'Actividad por anunciar'}{showTimes&&s.time&&<time>{s.time}</time>}</span><span aria-hidden="true">{index===i?'◂':'·'}</span></button>)}</div>{!sessions.length&&<p className="scope-empty">Sin actividades cargadas.</p>}</div>
    <div className="scope-detail" id="scope-detail" aria-live="polite" aria-atomic="true"><div className="scope-readout"><span>{selected?`ACTIVIDAD ${digits(index+1)}`:'EN ESPERA'}</span><span>{showTimes&&selected?.time?<time>{selected.time}</time>:'FIFA CON'}</span></div>{selected?<><p className="scope-kind">{selected.type||'Encuentro'}</p><h3>{selected.title||'Actividad por anunciar'}</h3><p className="scope-description">{selected.description||'Pronto compartiremos más información sobre esta actividad.'}</p></>:<><h3>Próxima señal.</h3><p className="scope-description">Las actividades de esta jornada se anunciarán próximamente.</p></>}</div>
   </div>
   <div className="scope-bottom"><span className="scope-small">{current?.label} <b>/</b> {sessions.length?`${digits(index+1)} DE ${digits(sessions.length)}`:'SIN ACTIVIDADES'}</span><div className="scope-pagination" role="group" aria-label="Recorrer actividades"><button type="button" disabled={!selected||index===0} onClick={()=>setActivity(index-1)}>← Anterior</button><button type="button" disabled={!selected||index===sessions.length-1} onClick={()=>setActivity(index+1)}>Siguiente →</button></div></div>
  </div>
  <div className="scope-case-foot" aria-hidden="true"><span>FÍSICA / COMUNIDAD / NUEVAS PREGUNTAS</span><span>DSO / 3 CHANNELS</span></div>
 </div>;
}
