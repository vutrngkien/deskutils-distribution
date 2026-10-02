import { ChangelogPage } from '@/components/pages/ChangelogPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'changelog');

export default function Page() {
  return <ChangelogPage />;
}
