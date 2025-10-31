import { ResponseInfo } from '@/types';

export function generateCSV(infos: ResponseInfo[]): string {
  const headers = [
    'Step',
    'URL',
    'Status',
    'Status Text',
    'Duration',
    'Redirect Type',
    'Location',
    'Host',
    'Server',
    'SSL Valid',
    'SSL Protocol',
    'Security Score',
    'SEO Score',
    'Content Type',
    'Content Length'
  ];

  const rows = infos.map((info, index) => [
    (index + 1).toString(),
    info.url,
    info.status.toString(),
    info.statusText,
    info.duration,
    info.redirectType || 'none',
    info.location || '',
    info.host,
    info.server?.name || '',
    info.ssl?.valid?.toString() || '',
    info.ssl?.protocol || '',
    info.security?.score?.toString() || '',
    info.seo?.impactScore?.toString() || '',
    info.headers?.['content-type'] || '',
    info.bodySize?.toString() || ''
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
  ].join('\n');

  return csvContent;
}

export function generateJSON(infos: ResponseInfo[]): string {
  return JSON.stringify(infos, null, 2);
}

export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function getFilenameFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.replace(/^www\./, '');
    const timestamp = new Date().toISOString().split('T')[0];
    return `redirect-analysis-${domain}-${timestamp}`;
  } catch {
    const timestamp = new Date().toISOString().split('T')[0];
    return `redirect-analysis-${timestamp}`;
  }
}
