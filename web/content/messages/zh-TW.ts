import { zhCN } from './zh-CN';
import type { Messages } from './en';

// Traditional Chinese copy is kept in its own catalog so it can be reviewed
// independently from Simplified Chinese as the product copy evolves.
export const zhTW = {
  ...zhCN,
  'nav.pricing': '價格',
  'nav.changelog': '更新日誌',
  'nav.privacy': '隱私',
  'nav.terms': '條款',
  'hero.description': '剪貼簿歷史、截圖、取色和更多工具，都在選單列裡。',
  'hero.downloadFree': '免費下載',
  'hero.captureOcr': '擷取與 OCR',
  'clipboard.title': '剪貼簿歷史',
  'clipboard.subtitle': '找回複製過的內容，在需要的地方貼上。',
  'clipboard.local': '剪貼簿內容始終留在你的 Mac 上。',
  'capture.title': '截圖與標註',
  'capture.badge': '截圖工具',
  'capture.area.title': '擷取區域',
  'capture.annotate.title': '快速標註',
  'capture.previous.title': '擷取上次區域',
  'capture.scrolling.title': '捲動擷取',
  'capture.subject.title': '擷取主體',
  'utilities.color.title': '取色器',
  'utilities.keyboard.title': '清潔鍵盤',
  'utilities.sleep.title': '防止睡眠',
  'pricing.free': '免費',
  'pricing.freeItems': '{count} 個剪貼簿項目',
  'pricing.proItems': '{count} 個剪貼簿項目',
  'pricing.screenshots': '截圖與標註',
  'pricing.scrolling': '捲動擷取',
  'install.label': '安裝指南',
  'privacy.label': '隱私權政策',
} satisfies Messages;
