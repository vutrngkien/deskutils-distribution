import { FeedbackPage } from '@/components/pages/FeedbackPage';
import { routeMetadata } from '@/content/metadata';

export const metadata = {
  ...routeMetadata('en', 'feedback'),
  robots: { index: false, follow: false },
};

export default function Page() {
  return <FeedbackPage />;
}
