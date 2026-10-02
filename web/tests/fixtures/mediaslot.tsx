import React from 'react';
import { createRoot } from 'react-dom/client';
import { ProductVisual } from '../../components/media/ProductVisual';

const data = JSON.parse(document.querySelector('#slot-data')!.textContent ?? '{}') as {
  generated: boolean;
  crop?: boolean;
};
(globalThis as { __generatedMedia?: boolean }).__generatedMedia = data.generated;
createRoot(document.querySelector('#root')!).render(
  data.crop ? (
    // Mirrors the Screenshot hero: fixed-height frame + an offset crop
    // positioner shared by the mockup and the generated image. Inline styles
    // are used because the isolated fixture does not load the Tailwind CSS.
    <ProductVisual
      id="hero"
      locale="en"
      priority
      frameStyle={{ position: 'relative', height: 352, width: 350, overflow: 'hidden' }}
      cropClassName="deskutils-crop"
      cropStyle={{ position: 'absolute', left: -100, top: 0, width: 550, height: 352 }}
    >
      <div data-testid="fixture-mockup" style={{ width: 550, height: 352 }} />
    </ProductVisual>
  ) : (
    <ProductVisual id="hero" locale="en" priority>
      <div data-testid="fixture-mockup" />
    </ProductVisual>
  ),
);
