import { Wifi } from 'lucide-react';
import { DeskUtilsMenu } from './DeskUtilsMenu';
import { QuickRing } from './QuickRing';
import { MockupCanvas } from './MockupCanvas';

function MenuBar({ mobile = false }: { mobile?: boolean }) {
  return (
    <div className="home-mock-menu-bar">
      <span>
        <img
          src="/assets/images/deskutils-icon.webp"
          alt=""
          width={mobile ? 14 : 16}
          height={mobile ? 14 : 16}
        />
      </span>
      {!mobile && <Wifi size={17} strokeWidth={1.8} />}
      <span>{mobile ? '9:41' : 'Thu Oct 1  9:41'}</span>
    </div>
  );
}

export function HeroMockup() {
  return (
    <div aria-hidden="true" className="home-hero-stage">
      <MenuBar />
      <div className="home-hero-window">
        <div className="flex gap-1.5 p-3">
          {[0, 1, 2].map((i) => (
            <span key={i} className="h-[9px] w-[9px] rounded-full bg-white/60" />
          ))}
        </div>
        <div className="mx-4 mt-1 h-4 w-[46%] rounded bg-white/40" />
        <div className="home-hero-selection" />
      </div>
      <MockupCanvas width={320} height={440} className="home-hero-menu">
        <DeskUtilsMenu />
      </MockupCanvas>
      <MockupCanvas width={300} height={300} className="home-hero-ring">
        <QuickRing />
      </MockupCanvas>
    </div>
  );
}

export function HeroMockupMobile() {
  return (
    <div aria-hidden="true" className="home-hero-stage home-hero-stage-mobile">
      <MenuBar mobile />
      <MockupCanvas width={320} height={440} className="home-hero-menu-mobile">
        <DeskUtilsMenu />
      </MockupCanvas>
    </div>
  );
}
