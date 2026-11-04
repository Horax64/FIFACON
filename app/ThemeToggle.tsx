'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';

const preferenceKey = 'fifa-con-theme';
type Flight = { x: number; y: number; dx: number; dy: number; angle: number; absorbing: boolean };

export default function ThemeToggle() {
  const [light, setLight] = useState(false);
  const [busy, setBusy] = useState(false);
  const [flight, setFlight] = useState<Flight | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const locked = useRef(false);

  useEffect(() => {
    setLight(document.documentElement.dataset.theme === 'light');
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, []);

  async function toggle() {
    if (locked.current) return;
    locked.current = true;
    setBusy(true);
    const nextLight = !light;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rect = button.current!.getBoundingClientRect();
    const x = rect.left + 18, y = rect.top + rect.height / 2;
    const endX = Math.min(window.innerWidth * .48, x + 230);
    const endY = Math.min(window.innerHeight * .42, y + 235);
    const dx = endX - x, dy = endY - y;
    const apply = () => {
      document.documentElement.dataset.theme = nextLight ? 'light' : 'dark';
      setLight(nextLight);
      try { localStorage.setItem(preferenceKey, nextLight ? 'light' : 'dark'); } catch { /* Storage may be unavailable. */ }
    };
    const finish = () => { locked.current = false; setBusy(false); };
    const reveal = async () => {
      setFlight(null);
      if (!reduced && document.startViewTransition) {
        try {
          const transition = document.startViewTransition(apply);
          await transition.ready;
          const radius = Math.hypot(Math.max(endX, innerWidth - endX), Math.max(endY, innerHeight - endY));
          await document.documentElement.animate(
            { clipPath: [`circle(0px at ${endX}px ${endY}px)`, `circle(${radius}px at ${endX}px ${endY}px)`] },
            { duration: 700, easing: 'cubic-bezier(.2,.65,.2,1)', pseudoElement: '::view-transition-new(root)' },
          ).finished;
          await transition.finished;
        } catch { apply(); }
      } else apply();
      finish();
    };
    if (reduced) { apply(); finish(); return; }
    setFlight({ x, y, dx, dy, angle: Math.atan2(dy, dx) * 180 / Math.PI, absorbing: !nextLight });
    timer.current = setTimeout(() => { void reveal(); }, 480);
  }

  return <>
    <button className="photon-toggle" ref={button} onClick={toggle} aria-disabled={busy}
      aria-label={light ? 'Absorber un fotón: activar modo oscuro' : 'Crear un fotón: activar modo claro'}
      title={light ? 'Volver al modo oscuro' : 'Iluminar la página'}>
      <svg width="23" height="18" viewBox="0 0 30 20" fill="none" aria-hidden="true"><path d="M1 10C4 0 7 0 10 10S16 20 19 10S25 0 28 10" stroke="currentColor" strokeWidth="1.5"/><circle cx="27" cy="10" r="2.5" fill="currentColor"/></svg>
      {light ? 'Absorber un fotón' : 'Crear un fotón'}
    </button>
    <span className="sr-only" role="status">{light ? 'Modo claro activado' : 'Modo oscuro activado'}</span>
    {flight && createPortal(<div className={`photon-flight ${flight.absorbing ? 'absorbing' : ''}`} aria-hidden="true"
      style={{ '--photon-x': `${flight.x}px`, '--photon-y': `${flight.y}px`, '--photon-dx': `${flight.dx}px`, '--photon-dy': `${flight.dy}px`, '--photon-angle': `${flight.angle}deg` } as CSSProperties}>
      <div className="emission-ring"/>
      <div className="photon-packet"><div className="photon-orientation"><svg viewBox="0 0 120 40"><path d="M0 20 Q8 20 15 14 T30 20 T45 6 T60 20 T75 9 T90 20 T105 18 T118 20" fill="none" stroke="currentColor" strokeWidth="2"/></svg><span className="photon-core"/></div></div>
    </div>, document.body)}
  </>;
}
