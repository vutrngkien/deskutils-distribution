import { PrivacyPage } from '@/components/pages/PrivacyPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'privacy');

export default function Page() {
  return <PrivacyPage />;
}
