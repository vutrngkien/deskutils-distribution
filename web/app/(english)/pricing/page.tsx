import { PricingPage } from '@/components/pages/PricingPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'pricing');

export default function Page() {
  return <PricingPage />;
}
