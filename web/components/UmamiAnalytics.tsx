import Script from 'next/script';
import { SectionTracker } from './SectionTracker';
import { InteractionTracker } from './InteractionTracker';

const websiteId = '18c36bcd-0a9d-40a9-afb2-e95d9ca972af';

export function UmamiAnalytics() {
  return (
    <>
      <Script
        id="umami-analytics"
        src="https://cloud.umami.is/script.js"
        data-website-id={websiteId}
        data-domains="deskutils.app"
        data-exclude-search="true"
        data-exclude-hash="true"
        strategy="afterInteractive"
      />
      <SectionTracker />
      <InteractionTracker />
    </>
  );
}
