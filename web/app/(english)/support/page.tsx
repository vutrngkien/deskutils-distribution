import { SupportPage } from '@/components/pages/SupportPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'support');

export default function Page() {
  return <SupportPage />;
}
