export type FieldType =
  | 'angka' | 'uang' | 'teks' | 'teks_panjang' | 'pilih'
  | 'ya_tidak' | 'centang' | 'status_warna' | 'tabel' | 'lampiran';

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  wajib?: boolean;
  buktiWajib?: boolean;          // centang tanpa lampiran → ditolak
  pilihan?: string[];            // untuk 'pilih'
  kolom?: { key: string; label: string; type: FieldType }[]; // untuk 'tabel'
  bantuan?: string;
  min?: number; max?: number;
}

export interface Block { id: string; judul: string; catatan?: string; fields: Field[]; }

export interface FormSchema {
  key: string;
  nama: string;
  scope: 'global' | 'lokasi' | 'outlet' | 'user';
  rahasia?: boolean;             // true hanya untuk 'accounting'
  blocks: Block[];
}
