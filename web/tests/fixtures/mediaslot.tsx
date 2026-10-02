import React from 'react';
import { createRoot } from 'react-dom/client';
import { ProductVisual } from '../../components/media/ProductVisual';

const data = JSON.parse(document.querySelector('#slot-data')!.textContent ?? '{}') as {
  generated: boolean;
};
(globalThis as { __generatedMedia?: boolean }).__generatedMedia = data.generated;
createRoot(document.querySelector('#root')!).render(
  <ProductVisual id="hero" locale="en" priority>
    <div data-testid="fixture-mockup" />
  </ProductVisual>,
);
