import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'FIFA CON · Congreso de estudiantes de Física',description:'Tercera edición. Diciembre de 2026. De estudiantes para estudiantes.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="es" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:"try{document.documentElement.dataset.theme=localStorage.getItem('fifa-con-theme')==='light'?'light':'dark'}catch(e){}"}}/></head><body>{children}</body></html>}
