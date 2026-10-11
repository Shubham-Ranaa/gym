import QRCode from 'qrcode';
import { settingsRepository } from '@/lib/repository';

export async function generateGymQRCode(): Promise<{
  dataUrl: string;
  svg: string;
  checkInUrl: string;
}> {
  const settings = await settingsRepository.find();
  const appUrl = settings?.appUrl || process.env.APP_URL;
  
  if (!appUrl) {
    throw new Error(
      'APP_URL is not configured. Set the APP_URL environment variable or configure the public application URL in gym settings.'
    );
  }
  
  const checkInUrl = `${appUrl.replace(/\/+$/, '')}/check-in`;
  
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