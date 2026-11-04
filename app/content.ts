import { z } from 'zod';
import { fontIds, defaultTypography } from './typography';
import { sectionKinds, builtInSections } from './sections';
const text = z.string().max(5000);
const short = z.string().max(250);
const link = z.string().max(2000).refine(v=>{if(!v)return true;try{return new URL(v).protocol==='https:'}catch{return false}}, 'Usá una dirección que empiece con https://');
const pageSectionSchema=z.object({id:z.string().max(60).regex(/^(portada|datos|encuentro|programa|expositores|participar|informacion|custom-[a-z0-9-]+)$/),kind:z.enum(sectionKinds),visible:z.boolean(),navLabel:z.string().max(40),title:short,body:text,linkUrl:link,linkLabel:short});
export const contentSchema = z.object({
  showScheduleTimes:z.boolean().default(false),
  particlesEnabled:z.boolean().default(true),
  pageSections:z.array(pageSectionSchema).max(25).superRefine((sections,ctx)=>{const ids=new Set<string>();for(const section of sections){if(ids.has(section.id)||(section.kind==='custom'?!section.id.startsWith('custom-'):section.id!==section.kind)){ctx.addIssue({code:z.ZodIssueCode.custom,message:'Secciones duplicadas o inválidas'});}ids.add(section.id);}}).default(builtInSections),
  typography: z.object({headings:z.enum(fontIds).default('original'),body:z.enum(fontIds).default('original'),labels:z.enum(fontIds).default('original')}).default(defaultTypography),
  name:short.min(1), edition:short, tagline:short, headline:text, date:short, venue:short, address:short, modality:short,
  aboutTitle:short, about:text, activities:short, registrationTitle:short, registrationText:text, registrationLabel:short,
  registrationUrl:link, email:z.union([z.literal(''),z.string().email().max(250)]), mapUrl:link,
  agendaTitle:short.default('Ideas en movimiento.'), agendaNote:short, speakersNote:short,
  days:z.array(z.object({label:short.min(1),sessions:z.array(z.object({time:short,title:short,description:text,type:short})).max(40)})).min(1).max(10),
  speakers:z.array(z.object({name:short,affiliation:short,talk:text})).max(30),
  faqs:z.array(z.object({question:short,answer:text})).max(20),
});
export type Content = z.infer<typeof contentSchema>;
export const initialContent:Content={
 showScheduleTimes:false,particlesEnabled:true,pageSections:structuredClone(builtInSections),
 typography:{...defaultTypography},
 name:'FIFA CON',edition:'3RA EDICIÓN',tagline:'De estudiantes para estudiantes',headline:'Vuelve el congreso de estudiantes de Física después de 7 años.',date:'Diciembre de 2026',venue:'Sede por confirmar',address:'Facultad, edificio y dirección a confirmar',modality:'Modalidad por confirmar',
 aboutTitle:'Las preguntas nos vuelven a encontrar.',about:'Vuelve FIFA CON: un encuentro de estudiantes para estudiantes, para compartir física, intercambiar ideas y darle lugar a nuevas preguntas.\n\nEn esta tercera edición nos encontramos alrededor de charlas estelares e investigaciones independientes. Pronto vamos a compartir el programa y todos los detalles para participar.',activities:'Charlas estelares · Investigaciones independientes',
 registrationTitle:'Tu próxima pregunta empieza acá.',registrationText:'Próximamente vamos a anunciar cómo participar, las fechas de inscripción y la convocatoria de trabajos.',registrationLabel:'Inscribirme',registrationUrl:'',email:'',mapUrl:'',agendaTitle:'Ideas en movimiento.',agendaNote:'Programa ilustrativo · actividades y horarios por confirmar',speakersNote:'Expositores por anunciar',
 days:[{label:'Jornada 01',sessions:[{time:'09:00',title:'Acreditación y bienvenida',description:'Recepción de participantes.',type:'Apertura'},{time:'10:00',title:'Charla estelar',description:'Tema y expositor/a por confirmar.',type:'Conferencia'},{time:'11:30',title:'Preguntas en común',description:'Un espacio de intercambio entre estudiantes.',type:'Conversación'},{time:'14:00',title:'Investigaciones independientes',description:'Presentaciones de trabajos de estudiantes.',type:'Presentaciones'}]},{label:'Jornada 02',sessions:[{time:'09:30',title:'Ideas en construcción',description:'Tema y coordinación por confirmar.',type:'Taller'},{time:'11:00',title:'Cruces entre disciplinas',description:'Invitados/as por confirmar.',type:'Conversación'},{time:'14:00',title:'Nuevas preguntas',description:'Presentación y discusión de trabajos.',type:'Presentaciones'},{time:'16:00',title:'Lo que nos llevamos',description:'Puesta en común y cierre del encuentro.',type:'Cierre'}]}],
 speakers:[{name:'Próximamente',affiliation:'Expositor/a por confirmar',talk:'Charla estelar'},{name:'Próximamente',affiliation:'Expositor/a por confirmar',talk:'Investigaciones independientes'},{name:'Próximamente',affiliation:'Expositor/a por confirmar',talk:'Nuevas perspectivas'}],
 faqs:[{question:'¿Quiénes pueden participar?',answer:'El encuentro está pensado de estudiantes para estudiantes. Pronto compartiremos los requisitos de participación.'},{question:'¿La inscripción tiene costo?',answer:'Las condiciones de inscripción se anunciarán próximamente.'},{question:'¿Puedo presentar mi investigación?',answer:'Próximamente publicaremos la convocatoria, los formatos y las fechas para presentar trabajos.'},{question:'¿Se entregan certificados?',answer:'Las condiciones de asistencia y certificación están por confirmar.'}],
};
