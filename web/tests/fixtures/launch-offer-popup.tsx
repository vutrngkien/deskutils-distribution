import React, { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LaunchOfferPopup } from '../../components/pricing/LaunchOfferPopup';

function Harness() {
  const [mounted, setMounted] = useState(true);
  return (
    <>
      <button onClick={() => setMounted(!mounted)}>{mounted ? 'Unmount' : 'Remount'}</button>
      <div style={{ height: 1200 }} />
      <section id="quickring" style={{ height: 200 }}>
        Quick Ring
      </section>
      {mounted && <LaunchOfferPopup locale="en" />}
    </>
  );
}

createRoot(document.querySelector('#root')!).render(
  <StrictMode>
    <Harness />
  </StrictMode>,
);
