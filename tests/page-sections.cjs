const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const cache=new Map();
function load(filename){filename=path.resolve(filename);if(cache.has(filename))return cache.get(filename).exports;const m={exports:{}};cache.set(filename,m);const code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;const localRequire=name=>{if(name.startsWith('.')){const base=path.resolve(path.dirname(filename),name);return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx')}return require(name)};new Function('require','module','exports',code)(localRequire,m,m.exports);return m.exports;}
const {initialContent}=load('app/content.ts'),Conference=load('app/Conference.tsx').default;
const render=content=>renderToStaticMarkup(React.createElement(Conference,{initial:content,initialVersion:0,canEdit:false}));
let data=structuredClone(initialContent),html=render(data);
assert(!html.includes('<time>'));assert(!html.includes('Editar página'));assert(html.includes('Pausar partículas'));
data.showScheduleTimes=true;assert(render(data).includes('<time>'));
const empty=structuredClone(initialContent);empty.days=[{label:'Jornada vacía',sessions:[]}];
const emptyHtml=render(empty);assert(emptyHtml.includes('Próxima señal.'));assert(emptyHtml.includes('SIN ACTIVIDADES'));assert(!emptyHtml.includes('<time>'));
assert(html.includes('Cronograma interactivo del congreso'));assert(html.includes('Actividades de la jornada'));
data.pageSections.find(s=>s.kind==='programa').visible=false;data.pageSections=data.pageSections.filter(s=>s.kind!=='expositores');
data.pageSections.find(s=>s.kind==='datos').navLabel='Datos';
data.pageSections.unshift({id:'custom-test',kind:'custom',visible:true,navLabel:'Novedades',title:'<script>hello</script>',body:'Contenido nuevo',linkUrl:'https://example.com',linkLabel:'Más información'});
html=render(data);assert(!html.includes('id="programa"'));assert(!html.includes('href="#programa"'));assert(!html.includes('id="expositores"'));assert(!html.includes('href="#expositores"'));assert(html.includes('&lt;script&gt;hello&lt;/script&gt;'));assert(html.indexOf('id="custom-test"')<html.indexOf('id="inicio"'));
for(const match of html.matchAll(/href="#([^"]+)"/g))assert(html.includes(`id="${match[1]}"`),`Missing anchor ${match[1]}`);
data.pageSections=[];data.particlesEnabled=false;html=render(data);assert(!html.includes('Pausar partículas'));assert(!html.includes('id="inicio"'));
console.log('PASS: hidden schedule times, visitor permissions, section visibility/removal/order, escaped custom content, valid navigation, empty layout, particle setting.');
