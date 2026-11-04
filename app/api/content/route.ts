import { database, readContent, canEdit } from '../../store';
import { getChatGPTUser } from '../../chatgpt-auth';
import { contentSchema, initialContent } from '../../content';
export const dynamic='force-dynamic';
const json=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(){try{return json(await readContent());}catch{return json({error:'No pudimos cargar el contenido. Probá nuevamente.'},503);}}
export async function PUT(request:Request){
 if(!(await canEdit()))return json({error:'Tu cuenta no tiene permiso de edición.'},403);
 const origin=request.headers.get('origin');
 if(!origin || origin!==new URL(request.url).origin)return json({error:'Solicitud no permitida.'},403);
 if(Number(request.headers.get('content-length')||0)>200000)return json({error:'El contenido es demasiado grande.'},413);
 let body;try{const raw=await request.text();if(raw.length>200000)return json({error:'El contenido es demasiado grande.'},413);body=JSON.parse(raw);}catch{return json({error:'Formato de contenido inválido.'},400);}
 if(!body || typeof body!=='object' || Array.isArray(body))return json({error:'Formato de contenido inválido.'},400);
 const parsed=contentSchema.safeParse(body.content);
 if(!parsed.success || !Number.isInteger(body.version) || body.version<0)return json({error:'Revisá los campos: los enlaces deben empezar con https:// y el correo debe ser válido.'},400);
 try{
 const db=database(),user=(await getChatGPTUser())!,now=new Date().toISOString();
 await db.prepare('INSERT OR IGNORE INTO site_content (id, body, version, updated_at, updated_by) VALUES (?, ?, ?, ?, ?)').bind('main',JSON.stringify(initialContent),0,now,user.userId).run();
 const result=await db.prepare('UPDATE site_content SET body = ?, version = version + 1, updated_at = ?, updated_by = ? WHERE id = ? AND version = ?').bind(JSON.stringify(parsed.data),now,user.userId,'main',body.version).run();
 if(result.meta.changes!==1)return json({error:'Otra persona guardó cambios. Tu edición sigue abierta: copiá lo que quieras conservar y cargá la última versión antes de volver a guardar.'},409);
 return json({version:body.version+1,updatedAt:now});
 }catch{return json({error:'No pudimos guardar. Tus cambios siguen abiertos; intentá nuevamente.'},503);}
}
