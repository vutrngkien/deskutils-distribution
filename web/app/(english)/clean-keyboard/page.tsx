import { UtilityPage } from '@/components/features/utility/UtilityPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'clean-keyboard');

export default function Page() {
  return <UtilityPage id="clean-keyboard" />;
}
