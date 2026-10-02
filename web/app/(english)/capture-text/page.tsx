import { CaptureTextPage } from '@/components/pages/CaptureTextPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'capture-text');

export default function Page() {
  return <CaptureTextPage />;
}
