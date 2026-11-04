'use client';
import { defaultTypography, fontFamily, fontOptions, type FontId, type Typography } from './typography';

export default function TypographyEditor({value,onChange}:{value:Typography;onChange:(value:Typography)=>void}) {
  const groups: { key: keyof Typography; label: string; sample: string }[] = [
    { key: 'headings', label: 'Títulos y logo FIFA CON', sample: 'FIFA CON · Ideas en movimiento' },
    { key: 'body', label: 'Texto general', sample: 'De estudiantes para estudiantes. Física, ideas y nuevas preguntas.' },
    { key: 'labels', label: 'Horarios y etiquetas', sample: '09:30 / CONFERENCIA · DICIEMBRE 2026' },
  ];
  return <div className="typography-editor">
    <p className="field-hint">Elegí una fuente para cada grupo. La página muestra los cambios al instante; «Guardar cambios» los aplica para todos.</p>
    {groups.map(group => <div className="font-choice" key={group.key}>
      <label className="field"><span>{group.label}</span>
        <select value={value[group.key]} onChange={event => onChange({...value,[group.key]:event.target.value as FontId})}>
          {fontOptions.map(font => <option key={font.id} value={font.id}>{font.label}</option>)}
        </select>
      </label>
      <p className={`font-sample sample-${group.key}`} style={{fontFamily:fontFamily(value[group.key],group.key)}}>{group.sample}</p>
    </div>)}
    <div className="typography-preview" aria-label="Vista previa de la combinación tipográfica">
      <p style={{fontFamily:fontFamily(value.labels,'labels')}}>3RA EDICIÓN / DICIEMBRE 2026</p>
      <h3 style={{fontFamily:fontFamily(value.headings,'headings')}}>Las preguntas nos vuelven a encontrar.</h3>
      <p style={{fontFamily:fontFamily(value.body,'body')}}>Un encuentro para compartir física, intercambiar ideas y construir conocimiento en comunidad.</p>
    </div>
    <button className="add" type="button" onClick={()=>onChange({...defaultTypography})}>Restaurar las fuentes originales</button>
    <p className="field-hint font-availability">Las fuentes dependen del dispositivo. Palatino usa Palatino o Palatino Linotype si está instalada; si no, se muestra Book Antiqua o Georgia.</p>
  </div>;
}
