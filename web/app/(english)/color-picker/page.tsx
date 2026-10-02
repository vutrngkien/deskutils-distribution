import { ColorPickerPage } from '@/components/pages/ColorPickerPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = routeMetadata('en', 'color-picker');

export default function Page() {
  return <ColorPickerPage />;
}
