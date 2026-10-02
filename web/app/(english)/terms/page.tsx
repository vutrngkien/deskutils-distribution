import { TermsPage } from '@/components/pages/TermsPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'terms');

export default function Page() {
  return <TermsPage />;
}
