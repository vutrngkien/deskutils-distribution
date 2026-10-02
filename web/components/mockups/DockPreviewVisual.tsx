const previews = [
  { bg: '#f6f7fb', a: '#dfe5f5', b: '#e9edf7' },
  { bg: '#eef0f4', a: '#c9d4f7', b: '#dde2ee' },
  { bg: '#fffbea', a: '#f6edc4', b: '#fbf4d8' },
];

/** Temporary visual: hovering a Dock icon to preview an app's windows (W2). */
export function DockPreviewVisual() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6">
      <div className="flex items-end gap-3">
        {previews.map((preview, index) => (
          <div
            key={index}
            className={`flex h-[96px] w-[110px] flex-col overflow-hidden rounded-[10px] ${
              index === 0 ? 'shadow-[0_0_0_3px_#4d8bff]' : 'shadow-[0_0_0_1px_rgba(10,20,60,0.12)]'
            }`}
            style={{ background: preview.bg }}
          >
            <span className="h-3 bg-white/60" />
            <div className="grid flex-1 gap-1.5 p-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <span className="rounded" style={{ background: preview.a }} />
              <span className="rounded" style={{ background: preview.b }} />
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-[0_10px_30px_-14px_rgba(10,30,110,0.4)]">
        {['#1478f5', '#f25c9b', '#ffc83d', '#2fb350'].map((color) => (
          <span key={color} className="h-8 w-8 rounded-[9px]" style={{ background: color }} />
        ))}
      </div>
    </div>
  );
}
