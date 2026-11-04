import { env } from 'cloudflare:workers';
import { getChatGPTUser } from './chatgpt-auth';
import { initialContent, contentSchema, type Content } from './content';
export function database(){if(!env.DB)throw new Error('Base de datos no disponible');return env.DB;}
export async function canEdit(){const user=await getChatGPTUser();if(!user)return false;return (env.EDITOR_EMAILS||'').split(',').map(x=>x.trim().toLowerCase()).includes(user.email.toLowerCase());}
export async function readContent():Promise<{content:Content;version:number}>{
 const row=await database().prepare('SELECT body, version FROM site_content WHERE id = ?').bind('main').first<{body:string;version:number}>();
 return row?{content:contentSchema.parse(JSON.parse(row.body)),version:row.version}:{content:initialContent,version:0};
}
