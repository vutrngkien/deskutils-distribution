import { ScreenshotPage } from '@/components/pages/ScreenshotPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'screenshot');

export default function Page() {
  return <ScreenshotPage />;
}
