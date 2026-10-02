import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'external-display-only');

export default function Page() {
  return <UtilityPage id="external-display-only" />;
}
