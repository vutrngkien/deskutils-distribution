import React from 'react';
import { createRoot } from 'react-dom/client';
import { PricingPlans } from '../../components/pricing/PricingPlans';

// Bundled twice (launch offer on/off) so both pricing states are render-tested
// against the shared `content/product.ts` data without rebuilding the site.
createRoot(document.querySelector('#root')!).render(<PricingPlans locale="en" />);
