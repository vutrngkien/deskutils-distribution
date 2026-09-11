import Script from 'next/script';
import { SectionTracker } from './SectionTracker';

const websiteId = '18c36bcd-0a9d-40a9-afb2-e95d9ca972af';

export function UmamiAnalytics() {
  return (
    <>
      <Script
        id="umami-analytics"
        src="https://cloud.umami.is/script.js"
        data-website-id={websiteId}
        data-domains="deskutils.app"
        strategy="afterInteractive"
      />
      <SectionTracker />
    </>
  );
}
