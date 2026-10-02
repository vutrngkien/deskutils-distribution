import { InstallPage } from '@/components/pages/InstallPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'install');

export default function Page() {
  return <InstallPage />;
}
