import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'system-monitoring');

export default function Page() {
  return <UtilityPage id="system-monitoring" />;
}
