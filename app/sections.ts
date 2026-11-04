export const sectionKinds = ['portada','datos','encuentro','programa','expositores','participar','informacion','custom'] as const;
export type SectionKind = typeof sectionKinds[number];
export type PageSection = {id:string;kind:SectionKind;visible:boolean;navLabel:string;title:string;body:string;linkUrl:string;linkLabel:string};
export const builtInSections: PageSection[] = [
  ['portada','Portada'],['datos','Datos del encuentro'],['encuentro','El encuentro'],['programa','Programa'],['expositores','Expositores'],['participar','Participar'],['informacion','Información y preguntas'],
].map(([kind,label])=>({id:kind,kind:kind as SectionKind,visible:true,navLabel:['encuentro','programa','expositores','participar'].includes(kind)?label:'',title:label,body:'',linkUrl:'',linkLabel:''}));
export function sectionAnchor(section:PageSection){return section.kind==='portada'?'inicio':section.id;}
export function visibleSections(sections:PageSection[]){return sections.filter(s=>s.visible);}
export function navigationSections(sections:PageSection[]){return visibleSections(sections).filter(s=>s.navLabel.trim());}
