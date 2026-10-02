import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'display-dimming');

export default function Page() {
  return <UtilityPage id="display-dimming" />;
}
