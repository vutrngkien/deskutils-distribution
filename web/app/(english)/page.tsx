import { HomePage } from '@/components/pages/HomePage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'home');

export default function Page() {
  return <HomePage />;
}
