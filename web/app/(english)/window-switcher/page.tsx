import { WindowSwitcherPage } from '@/components/pages/WindowSwitcherPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'window-switcher');

export default function Page() {
  return <WindowSwitcherPage />;
}
