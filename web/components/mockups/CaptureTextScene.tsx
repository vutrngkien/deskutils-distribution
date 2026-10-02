import { CheckCircle2 } from 'lucide-react';

function TextResult({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="home-ocr-result" data-testid="ocr-result">
      <span className="flex items-center gap-1.5 font-semibold text-[#1a7f37]">
        <CheckCircle2 size={18} strokeWidth={1.8} />
        Text copied
      </span>
      <span>
        Final copy review by Thursday
        <br />
        Press kit uploaded to shared drive
        {!mobile && (
          <>
            <br />
            Support macros updated
          </>
        )}
      </span>
    </div>
  );
}

export function CaptureTextScene() {
  return (
    <div aria-hidden="true" className="home-ocr-scene">
      <div className="home-ocr-slide">
        <span className="text-xs font-semibold tracking-[0.12em] text-[#9fb3e6]">
          TEAM SYNC · SLIDE 4
        </span>
        <span className="text-[26px] font-bold tracking-tight">Launch checklist</span>
        <span>• Final copy review by Thursday</span>
        <span>• Press kit uploaded to shared drive</span>
        <span>• Support macros updated</span>
        <div className="home-ocr-selection" />
      </div>
      <TextResult />
    </div>
  );
}

export function CaptureTextSceneMobile() {
  return (
    <div aria-hidden="true" className="home-ocr-mobile">
      <div className="home-ocr-slide">
        <span className="text-lg font-bold">Launch checklist</span>
        <span>• Final copy review by Thursday</span>
        <span>• Press kit uploaded to shared drive</span>
        <div className="home-ocr-selection" />
      </div>
      <TextResult mobile />
    </div>
  );
}
