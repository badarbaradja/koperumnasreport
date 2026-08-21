const PETA_PESAN: Record<string, string> = {
  'Invalid login credentials': 'Email atau kata sandi salah.',
  'Email not confirmed': 'Email belum dikonfirmasi. Hubungi admin.',
  'User not found': 'Akun tidak ditemukan.',
  'Too many requests': 'Terlalu banyak percobaan. Coba lagi beberapa saat lagi.',
};

export function pesanErrorMasuk(pesanAsli: string | undefined): string {
  if (!pesanAsli) return 'Gagal masuk. Coba lagi.';
  return PETA_PESAN[pesanAsli] ?? 'Gagal masuk. Periksa email dan kata sandi.';
}
