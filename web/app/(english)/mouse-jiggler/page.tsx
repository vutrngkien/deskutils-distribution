import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'mouse-jiggler');

export default function Page() {
  return <UtilityPage id="mouse-jiggler" />;
}
