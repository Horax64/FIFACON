export const fontIds = ['original', 'palatino', 'georgia', 'arial', 'verdana', 'trebuchet', 'courier'] as const;
export type FontId = typeof fontIds[number];
export type Typography = { headings: FontId; body: FontId; labels: FontId };
export const defaultTypography: Typography = { headings: 'original', body: 'original', labels: 'original' };
export const fontOptions: { id: FontId; label: string; family: string }[] = [
  { id: 'original', label: 'Original del diseño', family: 'Arial, Helvetica, sans-serif' },
  { id: 'palatino', label: 'Palatino', family: 'Palatino, "Palatino Linotype", "Book Antiqua", Georgia, serif' },
  { id: 'georgia', label: 'Georgia', family: 'Georgia, "Times New Roman", serif' },
  { id: 'arial', label: 'Arial', family: 'Arial, Helvetica, sans-serif' },
  { id: 'verdana', label: 'Verdana', family: 'Verdana, Geneva, sans-serif' },
  { id: 'trebuchet', label: 'Trebuchet MS', family: '"Trebuchet MS", Arial, sans-serif' },
  { id: 'courier', label: 'Courier New', family: '"Courier New", Courier, monospace' },
];
export function fontFamily(id: FontId, group: keyof Typography | 'display'): string {
  if (id === 'original') {
    if (group === 'labels') return '"Courier New", monospace';
    if (group === 'display') return '"Arial Black", Arial, Helvetica, sans-serif';
    return 'Arial, Helvetica, sans-serif';
  }
  return fontOptions.find(font => font.id === id)!.family;
}
