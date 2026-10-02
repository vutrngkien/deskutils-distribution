import { createRoot } from 'react-dom/client';
import { ScreenshotTabs, useScreenshotState } from '../../components/mockups/ScreenshotTabs';
function Fallback() {
  const state = useScreenshotState();
  return (
    <div
      data-testid="screenshot-fallback"
      data-state={state}
      style={{ width: 600, height: 384, background: '#eef' }}
    >
      Mockup
    </div>
  );
}
const config = JSON.parse(document.getElementById('tabs-data')!.textContent!);
createRoot(document.getElementById('root')!).render(
  <ScreenshotTabs
    labels={['Capture', 'Annotate', 'Copy & save']}
    descriptions={['Capture caption', 'Annotate caption', 'Save caption']}
    videos={config.videos}
  >
    <Fallback />
  </ScreenshotTabs>,
);
