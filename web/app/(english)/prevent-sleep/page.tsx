import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'prevent-sleep');

export default function Page() {
  return <UtilityPage id="prevent-sleep" />;
}
