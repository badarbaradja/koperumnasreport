export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(n);
}

export function parseRupiah(s: string): number {
  const digits = s.replace(/[^0-9-]/g, '');
  return digits ? parseInt(digits, 10) : 0;
}
