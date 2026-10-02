import { Copy, Pipette } from 'lucide-react';

const swatches = ['#faf9f5', '#1d1d1f', '#ff8a5b', '#f25c9b', '#1450f5', '#6d5df5'];
const values = [
  { k: 'HEX', v: '#6D5DF5' },
  { k: 'RGB', v: 'rgb(109, 93, 245)' },
  { k: 'HSL', v: 'hsl(246, 88%, 66%)' },
];

/** Temporary visual: Color Picker panel (ported from DUColorPicker). */
export function ColorPickerPanel({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`flex w-[340px] flex-col gap-3.5 rounded-[20px] bg-[#fafafc]/95 p-4 text-[#1d1d1f] shadow-[0_0_0_0.5px_rgba(0,0,0,0.14),0_24px_50px_-14px_rgba(40,20,120,0.45)] ${className}`}
    >
      <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-full bg-[#1478f5] px-3.5 py-2 text-[14px] font-semibold text-white">
          <Pipette className="h-[17px] w-[17px]" strokeWidth={1.7} />
          Pick Color
        </span>
        <div className="flex gap-1.5">
          {swatches.map((swatch) => (
            <span
              key={swatch}
              className="h-5 w-5 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]"
              style={{ background: swatch }}
            />
          ))}
        </div>
      </div>
      <div className="flex items-center gap-3.5 rounded-[14px] bg-white p-3 shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)]">
        <span className="h-[52px] w-[52px] rounded-[10px] bg-[#6d5df5] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.08)]" />
        <div className="flex flex-1 flex-col gap-0.5">
          <span className="font-mono text-[19px] font-semibold">#6D5DF5</span>
          <span className="text-[12.5px] text-[#86868b]">Current color</span>
        </div>
        <Copy className="h-5 w-5 text-[#8e8e93]" strokeWidth={1.7} />
      </div>
      <div className="rounded-[14px] bg-white px-3 shadow-[0_0_0_0.5px_rgba(0,0,0,0.1)]">
        {values.map((value, index) => (
          <div
            key={value.k}
            className={`flex h-[42px] items-center gap-3.5 ${
              index < values.length - 1 ? 'border-b border-[#eeeef0]' : ''
            }`}
          >
            <span className="w-[34px] text-[11px] font-semibold text-[#86868b]">{value.k}</span>
            <span className="flex-1 whitespace-nowrap font-mono text-[13.5px]">{value.v}</span>
            <Copy className="h-[18px] w-[18px] text-[#aeaeb2]" strokeWidth={1.7} />
          </div>
        ))}
      </div>
    </div>
  );
}
