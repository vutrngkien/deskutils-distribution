import { ClipboardManagerPage } from '@/components/pages/ClipboardManagerPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'clipboard-manager');

export default function Page() {
  return <ClipboardManagerPage />;
}
