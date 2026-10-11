import QRCode from 'qrcode';
import { settingsRepository } from '@/lib/repository';

/**
 * Normalises a configured base URL into the fixed check-in destination.
 *
 * Handles trailing slashes, a base URL that already points at /check-in, and
 * accidental double slashes, so the QR code always resolves to exactly one
 * /check-in path.
 */
function buildCheckInUrl(rawUrl: string): string {
  let url = rawUrl.trim().replace(/\/+$/, '');
  
  // Already points at the check-in page - do not append it twice
  if (url.endsWith('/check-in')) return url;
  
  return `${url}/check-in`;
}

export async function generateGymQRCode(): Promise<{
  dataUrl: string;
  svg: string;
  checkInUrl: string;
}> {
  const settings = await settingsRepository.find();
  // The configured environment variable wins so a redeploy cannot leave a
  // stale domain baked into stored settings.
  const appUrl = process.env.APP_URL || settings?.appUrl;
  
  if (!appUrl) {
    throw new Error(
      'APP_URL is not configured. Set the APP_URL environment variable or configure the public application URL in gym settings.'
    );
  }
  
  const checkInUrl = buildCheckInUrl(appUrl);
  
  const options: QRCode.QRCodeToStringOptions = {
    type: 'svg',
    width: 512,
    margin: 2,
    color: {
      dark: '#0a0a0a',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'M',
  };
  
  const [dataUrl, svg] = await Promise.all([
    QRCode.toDataURL(checkInUrl, {
      width: 512,
      margin: 2,
      color: { dark: '#0a0a0a', light: '#ffffff' },
      errorCorrectionLevel: 'M',
    }),
    QRCode.toString(checkInUrl, options),
  ]);
  
  return { dataUrl, svg, checkInUrl };
}

export async function generateQRCodeDataUrl(
  text: string,
  options?: {
    width?: number;
    margin?: number;
    color?: { dark: string; light: string };
  }
): Promise<string> {
  return QRCode.toDataURL(text, {
    width: options?.width || 256,
    margin: options?.margin || 2,
    color: options?.color || { dark: '#0a0a0a', light: '#ffffff' },
    errorCorrectionLevel: 'M',
  });
}