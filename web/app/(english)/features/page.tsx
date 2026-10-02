import { FeaturesPage } from '@/components/pages/FeaturesPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'features');

export default function Page() {
  return <FeaturesPage />;
}
