/** Deterministic 11×11 QR-style grid (decorative; not a real code). */
function isFinder(row: number, col: number) {
  const inBox = (r0: number, c0: number) => row >= r0 && row < r0 + 3 && col >= c0 && col < c0 + 3;
  return inBox(0, 0) || inBox(0, 8) || inBox(8, 0);
}

function fill(row: number, col: number) {
  if (isFinder(row, col)) {
    const r = row % 8 === 0 ? row % 3 : row;
    const c = col % 8 === 0 ? col % 3 : col;
    const edge = r === 0 || r === 2 || c === 0 || c === 2;
    const center = r === 1 && c === 1;
    return edge || center;
  }
  return (row * 7 + col * 5 + row * col) % 3 === 0;
}

const cells = Array.from({ length: 11 }, (_, row) =>
  Array.from({ length: 11 }, (_, col) => ({ row, col, on: fill(row, col) })),
).flat();

/** Temporary visual: reading a QR code from the screen (design placeholder). */
export function QrCodeVisual() {
  return (
    <div className="flex items-center justify-center gap-6">
      <div className="grid grid-cols-11 gap-[2px] rounded-[12px] bg-white p-3 shadow-[0_16px_40px_-20px_rgba(10,30,110,0.4)]">
        {cells.map(({ row, col, on }) => (
          <span
            key={`${row}-${col}`}
            className="h-3 w-3 rounded-[1px]"
            style={{ background: on ? '#0a1530' : '#ffffff' }}
          />
        ))}
      </div>
      <span className="text-[24px] text-primary" aria-hidden="true">
        →
      </span>
      <div className="flex w-[190px] flex-col gap-2 rounded-[14px] bg-white p-4 shadow-[0_16px_40px_-20px_rgba(10,30,110,0.4)]">
        <span className="text-[12px] font-semibold text-[#1a7f37]">QR code read</span>
        <span className="rounded-[8px] bg-[#f3f6ff] p-2 font-mono text-[12px] text-[#2b3550]">
          deskutils.app
        </span>
        <span className="text-[11px] text-muted">Copied as text, not opened</span>
      </div>
    </div>
  );
}
