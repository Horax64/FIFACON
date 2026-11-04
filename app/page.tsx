import Conference from './Conference';
import { readContent, canEdit } from './store';
export const dynamic = 'force-dynamic';
export default async function Page() {
 const [record, editor] = await Promise.all([readContent(), canEdit()]);
 return <Conference initial={record.content} initialVersion={record.version} canEdit={editor} />;
}
