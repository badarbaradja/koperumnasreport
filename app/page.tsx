'use client';

import Link from 'next/link';
import { useAuth } from '../lib/auth/AuthProvider';
import { usePolicy } from '../lib/api/policy';
import { useDaftarLokasi } from '../lib/api/lokasi';
import { useDaftarOutlet } from '../lib/api/outlet';
import { useDaftarShift } from '../lib/api/shift';
import { useLaporanHariIniSaya } from '../lib/api/beranda';
import { useProgresBulananSaya } from '../lib/api/marketing';
import { useTitikAbsenSaya, useAbsenHariIni } from '../lib/api/absensi';
import { hitungTugasHariIni, sapaanWaktu } from '../lib/tugasHariIni';
import { hariISOWIB, jamWIB, tanggalIndonesiaWIB, tanggalIndonesiaDariYmd } from '../lib/tanggal';
import { KeadaanGagal } from '../components/KeadaanGagal';
import { KerangkaBeranda, KerangkaDaftarKartu } from '../components/Kerangka';
import { usePembangunanUntukTanggal } from '../lib/api/pembangunan';
import { useKeuanganRekapUntukTanggal, useSelisihRestoUntukTanggal, useTanggalLaporanRestoTerakhir } from '../lib/api/dashboard';
import { useLaporanAccountingHariIni, hitungRingkasanKeuanganCeo, useTanggalLaporanAccountingTerakhir } from '../lib/api/accounting';
import { formatRupiah } from '../lib/rupiah';

/* =========================================================================
   Executive Section: Keuangan Hari Ini (CEO)
   ========================================================================= */
function KeuanganExecutiveSection() {
  const { data: keuangan } = useKeuanganRekapUntukTanggal();
  const { data: laporanAccounting } = useLaporanAccountingHariIni();
  const { data: tanggalAccountingTerakhir } = useTanggalLaporanAccountingTerakhir();
  const ringkasanKeuangan = laporanAccounting ? hitungRingkasanKeuanganCeo(laporanAccounting) : null;

  return (
    <section className="flex flex-col gap-3.5 sm:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--garis)] pb-2.5 sm:pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 sm:h-6 items-center rounded-full bg-[var(--biru-lembut)] px-2.5 text-[10px] sm:text-[11px] font-semibold text-[var(--biru)] border border-[var(--biru-garis)]">
              Eksekutif
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
              Keuangan Hari Ini
            </h2>
          </div>
          <p className="text-[11px] sm:text-xs text-[var(--label)] mt-0.5">
            Rekapitulasi arus kas harian dan posisi likuiditas eksekutif
          </p>
        </div>
      </div>

      {!keuangan ? (
        /* Intentional Empty State with Real Operational Context */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--garis-tegas)] bg-[var(--permukaan)] p-5 sm:p-7 text-center shadow-xs">
          <div className="flex size-11 sm:size-12 items-center justify-center rounded-full bg-[var(--biru-lembut)] text-[var(--biru)] mb-2.5 sm:mb-3">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-[var(--tinta)] mb-1" style={{ fontFamily: 'var(--display)' }}>
            Laporan Keuangan Hari Ini Belum Tersedia
          </h3>
          <p className="max-w-md text-xs text-[var(--label)] leading-relaxed mb-3 sm:mb-4">
            Data bersumber dari Form F17 (Accounting Harian). Setelah laporan dikirimkan oleh tim Accounting, ringkasan Net Cashflow, total penerimaan, dan posisi likuiditas akan otomatis terkonsolidasi di sini.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--halaman)] px-3 py-1 text-xs font-medium text-[var(--label)] border border-[var(--garis)]">
              <span className="size-2 rounded-full bg-amber-400 animate-pulse" />
              Menunggu Laporan Accounting Hari Ini
            </span>
            {tanggalAccountingTerakhir && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--halaman)] px-3 py-1 text-xs font-medium text-[var(--label)] border border-[var(--garis)]">
                Laporan terakhir: <strong className="font-semibold text-[var(--tinta)]">{tanggalIndonesiaDariYmd(tanggalAccountingTerakhir)}</strong>
              </span>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 sm:gap-4">
          {/* Row 1: Primary Cashflow KPIs */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Hero Card: Net Cashflow */}
            <div
              className={`flex flex-col justify-between rounded-2xl p-5 shadow-xs border transition-all ${
                keuangan.net >= 0
                  ? 'bg-emerald-50/40 border-emerald-200/80 text-emerald-950'
                  : 'bg-rose-50/40 border-rose-200/80 text-rose-950'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[var(--label)] uppercase tracking-wider">
                  Net Cashflow
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                    keuangan.net >= 0
                      ? 'bg-emerald-100/70 text-emerald-800 border-emerald-200'
                      : 'bg-rose-100/70 text-rose-800 border-rose-200'
                  }`}
                >
                  {keuangan.net >= 0 ? 'Surplus Harian' : 'Defisit Harian'}
                </span>
              </div>
              <div>
                <div
                  className="text-2xl sm:text-3xl font-bold tracking-tight tabular-nums"
                  style={{ fontFamily: 'var(--mono)', color: keuangan.net < 0 ? 'var(--merah)' : 'var(--hijau)' }}
                >
                  {formatRupiah(keuangan.net)}
                </div>
                <p className="text-xs text-[var(--label)] mt-1">
                  Arus kas bersih hari ini (Masuk - Keluar)
                </p>
              </div>
            </div>

            {/* Total Uang Masuk */}
            <div className="flex flex-col justify-between rounded-2xl bg-[var(--permukaan)] p-5 shadow-xs border border-[var(--garis)]">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[var(--label)] uppercase tracking-wider">
                  Uang Masuk
                </span>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 19V5" />
                    <path d="m5 12 7-7 7 7" />
                  </svg>
                </span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[var(--tinta)] tracking-tight tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {formatRupiah(keuangan.totalMasuk)}
                </div>
                <p className="text-xs text-[var(--label)] mt-1">
                  Total penerimaan konsumen & unit usaha
                </p>
              </div>
            </div>

            {/* Total Uang Keluar */}
            <div className="flex flex-col justify-between rounded-2xl bg-[var(--permukaan)] p-5 shadow-xs border border-[var(--garis)] sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-semibold text-[var(--label)] uppercase tracking-wider">
                  Uang Keluar
                </span>
                <span className="inline-flex size-7 items-center justify-center rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14" />
                    <path d="m19 12-7 7-7-7" />
                  </svg>
                </span>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[var(--tinta)] tracking-tight tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {formatRupiah(keuangan.totalKeluar)}
                </div>
                <p className="text-xs text-[var(--label)] mt-1">
                  Total pengeluaran operasional & proyek
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Balance & Obligations (from Accounting report if present) */}
          {ringkasanKeuangan && (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 shadow-xs">
                <p className="text-xs font-medium text-[var(--label)] mb-1">Dana Tersedia (Kas & Bank)</p>
                <p className="text-base sm:text-lg font-bold text-[var(--tinta)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {formatRupiah(ringkasanKeuangan.danaTersedia)}
                </p>
                <p className="text-[11px] text-[var(--label)] mt-1">Total saldo bank & kas fisik</p>
              </div>

              <div className="rounded-xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 shadow-xs">
                <p className="text-xs font-medium text-[var(--label)] mb-1">Total Piutang</p>
                <p className="text-base sm:text-lg font-bold text-[var(--tinta)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {formatRupiah(ringkasanKeuangan.piutangTotal)}
                </p>
                <p className="text-[11px] text-[var(--label)] mt-1">Piutang konsumen & operasional</p>
              </div>

              <div className="rounded-xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 shadow-xs">
                <p className="text-xs font-medium text-[var(--label)] mb-1">Kewajiban 7 Hari</p>
                <p className="text-base sm:text-lg font-bold text-[var(--tinta)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {formatRupiah(ringkasanKeuangan.kewajiban7Hari)}
                </p>
                <p className="text-[11px] text-[var(--label)] mt-1 truncate" title={`30 hari: ${formatRupiah(ringkasanKeuangan.kewajiban30Hari)}`}>
                  Jatuh tempo 30 hari: {formatRupiah(ringkasanKeuangan.kewajiban30Hari)}
                </p>
              </div>

              <div className="rounded-xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 shadow-xs">
                <p className="text-xs font-medium text-[var(--label)] mb-1 truncate">Cadangan vs Kewajiban 30 Hari</p>
                <p
                  className="text-base sm:text-lg font-bold tabular-nums"
                  style={{
                    fontFamily: 'var(--mono)',
                    color: ringkasanKeuangan.surplusKekurangan < 0 ? 'var(--merah)' : 'var(--hijau)',
                  }}
                >
                  {formatRupiah(ringkasanKeuangan.surplusKekurangan)}
                </p>
                <p className="text-[11px] text-[var(--label)] mt-1">Dana tersedia dikurangi kewajiban 30 hari</p>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/* =========================================================================
   Executive Section: Pembangunan & Silang-Cek Omzet Resto (CEO)
   ========================================================================= */
function OperationalOverviewSection() {
  const { data: pembangunan } = usePembangunanUntukTanggal();
  const { data: selisihResto } = useSelisihRestoUntukTanggal();
  const { data: tanggalRestoTerakhir } = useTanggalLaporanRestoTerakhir();

  const sedang = pembangunan?.sedangDibangun ?? 0;
  const finishing = pembangunan?.finishing ?? 0;
  const selesai = pembangunan?.selesaiHariIni ?? 0;
  const belum = pembangunan?.belumMulai ?? 0;
  const totalUnit = sedang + finishing + selesai + belum;

  return (
    <section className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2 items-stretch">
      {/* Column 1: Rekap Unit Pembangunan */}
      <div className="flex flex-col justify-between rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 sm:p-5 lg:p-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-[var(--garis)] pb-3 mb-3.5 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
                Rekap Unit Pembangunan Hari Ini
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--label)] mt-0.5">
                Monitoring progres fisik perumahan dari PIC Lokasi
              </p>
            </div>
            <span className="rounded-full bg-[var(--halaman)] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-[var(--biru)] border border-[var(--garis)] shrink-0">
              {totalUnit} Unit Terdata
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Sedang Dibangun */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 sm:p-3.5">
              <span className="text-[11px] sm:text-xs font-medium text-blue-800">Sedang Dibangun</span>
              <div className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-blue-950 tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                {sedang}
              </div>
              <span className="text-[10px] sm:text-[11px] text-blue-700/80">Struktur utama</span>
            </div>

            {/* Finishing */}
            <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-3 sm:p-3.5">
              <span className="text-[11px] sm:text-xs font-medium text-amber-800">Tahap Finishing</span>
              <div className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-amber-950 tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                {finishing}
              </div>
              <span className="text-[10px] sm:text-[11px] text-amber-700/80">Finishing interior/cat</span>
            </div>

            {/* Selesai Hari Ini */}
            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 sm:p-3.5">
              <span className="text-[11px] sm:text-xs font-medium text-emerald-800">Selesai Hari Ini</span>
              <div className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-emerald-950 tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                {selesai}
              </div>
              <span className="text-[10px] sm:text-[11px] text-emerald-700/80">Serah terima progres</span>
            </div>

            {/* Belum Mulai */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 sm:p-3.5">
              <span className="text-[11px] sm:text-xs font-medium text-slate-700">Belum Mulai</span>
              <div className="mt-0.5 sm:mt-1 text-xl sm:text-2xl font-bold text-slate-900 tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                {belum}
              </div>
              <span className="text-[10px] sm:text-[11px] text-slate-500">Antrean konstruksi</span>
            </div>
          </div>
        </div>

        {/* Segmented Distribution Bar */}
        {totalUnit > 0 && (
          <div className="mt-4 sm:mt-5 border-t border-[var(--garis)] pt-3">
            <div className="flex items-center justify-between text-xs text-[var(--label)] mb-1.5 font-medium">
              <span>Distribusi Tahapan Unit</span>
              <span>{Math.round(((selesai + finishing) / totalUnit) * 100)}% matang</span>
            </div>
            <div className="flex h-2 sm:h-2.5 w-full overflow-hidden rounded-full bg-[var(--garis)] gap-0.5">
              <div style={{ width: `${(sedang / totalUnit) * 100}%` }} className="bg-blue-600 transition-all" title={`Sedang Dibangun: ${sedang}`} />
              <div style={{ width: `${(finishing / totalUnit) * 100}%` }} className="bg-amber-500 transition-all" title={`Finishing: ${finishing}`} />
              <div style={{ width: `${(selesai / totalUnit) * 100}%` }} className="bg-emerald-600 transition-all" title={`Selesai: ${selesai}`} />
              <div style={{ width: `${(belum / totalUnit) * 100}%` }} className="bg-slate-400 transition-all" title={`Belum Mulai: ${belum}`} />
            </div>
          </div>
        )}
      </div>

      {/* Column 2: Silang-Cek Omzet Resto */}
      <div className="flex flex-col justify-between rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 sm:p-5 lg:p-6 shadow-xs">
        <div>
          <div className="flex items-center justify-between gap-2 border-b border-[var(--garis)] pb-3 mb-3.5 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
                Silang-Cek Omzet Resto Hari Ini
              </h3>
              <p className="text-[11px] sm:text-xs text-[var(--label)] mt-0.5">
                Rekonsiliasi omzet Manager Resto vs Kontrol F&amp;B
              </p>
            </div>
            <span className="rounded-full bg-[var(--biru-lembut)] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-[var(--biru)] border border-[var(--biru-garis)] shrink-0">
              Audit Silang
            </span>
          </div>

          {!selisihResto || selisihResto.length === 0 ? (
            /* Intentional Empty State */
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--garis)] bg-[var(--halaman)] p-5 sm:p-6 text-center">
              <div className="flex size-10 items-center justify-center rounded-full bg-white text-[var(--label)] shadow-2xs mb-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                  <path d="M9 14h6" />
                  <path d="M9 18h6" />
                  <path d="M9 10h6" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-[var(--tinta)] mb-1">
                Belum Ada Pasangan Laporan Masuk
              </p>
              <p className="text-[11px] text-[var(--label)] max-w-xs leading-relaxed">
                Menunggu kedua laporan (Form Manager Resto dan Form Kontrol F&amp;B) untuk diverifikasi otomatis oleh sistem.
              </p>
              {tanggalRestoTerakhir && (
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs text-[var(--label)] border border-[var(--garis)]">
                  <span>Laporan resto terakhir:</span>
                  <strong className="font-semibold text-[var(--tinta)]">{tanggalIndonesiaDariYmd(tanggalRestoTerakhir)}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {selisihResto.map((r) => {
                const adaSelisih = Boolean(r.selisih && r.selisih !== 0);
                return (
                  <div
                    key={r.outlet}
                    className={`rounded-xl border p-4 shadow-xs transition-all ${
                      adaSelisih
                        ? 'border-rose-200 bg-rose-50/40 text-rose-950'
                        : 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-semibold text-sm text-[var(--tinta)]" style={{ fontFamily: 'var(--display)' }}>
                        {r.outlet}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold border ${
                          adaSelisih
                            ? 'border-rose-200 bg-rose-100 text-rose-800'
                            : 'border-emerald-200 bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {adaSelisih ? `Selisih ${formatRupiah(r.selisih ?? 0)}` : 'Omzet Cocok'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-black/5 text-xs">
                      <div className="rounded-lg bg-white/80 p-2 border border-black/5">
                        <span className="text-[11px] text-[var(--label)] block">Versi Manager:</span>
                        <span className="font-semibold text-[var(--tinta)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                          {formatRupiah(r.versiManager ?? 0)}
                        </span>
                      </div>
                      <div className="rounded-lg bg-white/80 p-2 border border-black/5">
                        <span className="text-[11px] text-[var(--label)] block">Versi Kontrol F&amp;B:</span>
                        <span className="font-semibold text-[var(--tinta)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                          {formatRupiah(r.versiKontrolFnb ?? 0)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DashboardCeo() {
  // 03-CALC-SPEC.md §4.3 -- v_keuangan_rekap (4 angka agregat) sengaja
  // dibaca ceo, pusat, DAN accounting; OperationalOverviewSection
  // (pembangunan + selisih resto) TETAP ceo-only, spec tidak menyebutkan
  // peran lain untuk bagian itu. Dua gerbang terpisah, bukan satu gerbang
  // untuk seluruh DashboardCeo (gerbang tunggal 'ceo' sebelumnya membuat
  // pusat/accounting tidak pernah melihat 4 angka yang backend-nya sendiri
  // sudah mengizinkan -- bug, ditemukan audit Phase 2A 19 September 2026).
  const { roles } = useAuth();
  const bolehKeuangan = roles.includes('ceo') || roles.includes('pusat') || roles.includes('accounting');
  const bolehOperasional = roles.includes('ceo');
  return (
    <div className="flex flex-col gap-8 border-t border-[var(--garis)] pt-6 mt-2">
      {bolehKeuangan && <KeuanganExecutiveSection />}
      {bolehOperasional && <OperationalOverviewSection />}
    </div>
  );
}

/* =========================================================================
   Operations Section: Laporan Hari Ini (DaftarTugas)
   ========================================================================= */
function DaftarTugas() {
  const { assignments, roles } = useAuth();
  const { data: policy, isError: policyGagal, refetch: refetchPolicy } = usePolicy();
  const { data: lokasi } = useDaftarLokasi();
  const { data: outlet } = useDaftarOutlet();
  const { data: shift } = useDaftarShift();
  const { data: laporanHariIni, isLoading, isError: laporanGagal, refetch: refetchLaporan } = useLaporanHariIniSaya();
  const { data: progres } = useProgresBulananSaya();

  if (policyGagal || laporanGagal) {
    return (
      <KeadaanGagal
        pesan="Gagal memuat tugas hari ini."
        onCoba={() => {
          void refetchPolicy();
          void refetchLaporan();
        }}
      />
    );
  }

  if (!policy || isLoading) {
    return <KerangkaDaftarKartu />;
  }

  const namaLokasi = (id: string) => lokasi?.find((l) => l.id === id)?.nama ?? id;
  const namaOutlet = (id: string) => outlet?.find((o) => o.id === id)?.nama ?? id;
  const namaShift = (id: string) => shift?.find((s) => s.id === id)?.nama ?? id;
  const batasLaporShift = (id: string) => shift?.find((s) => s.id === id)?.batasLapor ?? null;
  const workdays = (policy.workdays as number[] | undefined) ?? [1, 2, 3, 4, 5, 6];
  const hariLibur = !workdays.includes(hariISOWIB());

  if (hariLibur) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-5 sm:p-6 shadow-xs">
        <div className="flex items-center gap-2">
          <span className="inline-flex size-7 items-center justify-center rounded-full bg-amber-50 text-amber-700 border border-amber-100">
            ☕
          </span>
          <h3 className="text-base font-bold text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
            Hari Ini Hari Libur
          </h3>
        </div>
        <p className="text-xs text-[var(--label)] leading-relaxed">
          Tidak ada kewajiban pengiriman laporan terjadwal untuk hari ini. Anda tetap dapat meninjau laporan yang telah dikirimkan sebelumnya.
        </p>
        <Link href="/riwayat" className="tombol-sekunder self-start text-xs">
          Lihat Laporan Yang Sudah Dikirim
        </Link>
      </div>
    );
  }

  const tugas = hitungTugasHariIni(assignments, roles, laporanHariIni ?? [], policy, jamWIB(), namaLokasi, namaOutlet, namaShift, batasLaporShift);
  const tugasBelum = tugas.filter((t) => t.status !== 'selesai');
  const tugasSelesai = tugas.length - tugasBelum.length;
  const invitTarget = Number(policy.invite_target);
  const closingTarget = Number(policy.closing_target);
  const persen = tugas.length > 0 ? Math.round((tugasSelesai / tugas.length) * 100) : 0;

  if (tugasBelum.length === 0) {
    return (
      <div className="flex flex-col gap-3 rounded-xl sm:rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-4 sm:p-5 lg:p-6 shadow-xs text-emerald-950">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
            <h3 className="text-sm sm:text-base font-bold text-emerald-950" style={{ fontFamily: 'var(--display)' }}>
              Semua Laporan Hari Ini Selesai
            </h3>
          </div>
          <span className="rounded-full bg-emerald-100 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-bold text-emerald-800 border border-emerald-200">
            100% Lengkap
          </span>
        </div>
        <p className="text-xs text-emerald-900/80 leading-relaxed">
          Seluruh penugasan laporan harian Anda untuk hari ini telah berhasil dikirimkan ke sistem.
        </p>
        <Link href="/riwayat" className="tombol-sekunder self-start text-xs">
          Buka Riwayat Laporan Saya
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Daily Briefing Progress Card */}
      <div className="rounded-xl sm:rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 sm:p-5 lg:p-6 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h3 className="text-sm sm:text-base font-bold text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
            Laporan Yang Perlu Dikerjakan
          </h3>
          <span className="rounded-full bg-[var(--biru-lembut)] px-2.5 py-0.5 text-xs font-bold text-[var(--biru)] border border-[var(--biru-garis)]">
            {persen}% Selesai
          </span>
        </div>

        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--biru)] tabular-nums" style={{ fontFamily: 'var(--display)' }}>
            {tugasSelesai}
          </span>
          <span className="text-xs text-[var(--label)]">
            dari {tugas.length} laporan sudah dikirim ({tugasBelum.length} masih ditunggu)
          </span>
        </div>

        {/* Modern Progress Bar */}
        <div className="mt-2.5 sm:mt-3 h-2 w-full overflow-hidden rounded-full bg-[var(--garis)]">
          <div
            className="h-full rounded-full bg-[var(--biru)] transition-all duration-500"
            style={{ width: `${persen}%` }}
          />
        </div>
      </div>

      {/* Task Cards List */}
      <div className="flex flex-col gap-2.5 sm:gap-3">
        {tugasBelum.map((t) => {
          return (
            <div
              key={`${t.formKey}-${t.scopeLabel ?? ''}`}
              className="flex flex-col justify-between gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-3.5 sm:p-4 lg:p-5 shadow-xs transition-all hover:border-[var(--biru-garis)] hover:shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <p className="font-semibold text-sm sm:text-base text-[var(--tinta)]" style={{ fontFamily: 'var(--display)' }}>
                      {t.namaForm}
                    </p>
                    {t.scopeLabel && (
                      <span className="inline-flex rounded-full bg-[var(--halaman)] px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-[var(--label)] border border-[var(--garis)]">
                        {t.scopeLabel}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] sm:text-[11px] font-bold border ${
                        t.lewatDeadline
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : t.status === 'draft'
                            ? 'border-amber-200 bg-amber-50 text-amber-800'
                            : 'border-slate-200 bg-slate-50 text-slate-700'
                      }`}
                    >
                      {t.lewatDeadline ? '⚠️' : '⏳'} {t.label}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/lapor/${t.formKey}`}
                  className="tombol-utama text-xs shrink-0 self-center sm:self-start"
                  style={{ minHeight: 36, padding: '6px 14px' }}
                >
                  {t.tombol}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Target Bulanan (PTE Marketing) */}
      {progres?.pte_berlaku && (
        <div className="rounded-xl sm:rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-3.5 sm:p-4 lg:p-5 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-3">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--label)]">
              Target Bulan Ini (PTE)
            </span>
            <span className="text-[11px] sm:text-xs font-medium text-[var(--label)]">Periode Berjalan</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className="rounded-xl bg-[var(--halaman)] p-2.5 sm:p-3 border border-[var(--garis)]">
              <span className="text-[11px] sm:text-xs text-[var(--label)] block">Undangan</span>
              <div className="flex items-baseline gap-1 mt-0.5 sm:mt-1">
                <span className="text-lg sm:text-xl font-bold text-[var(--biru)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {progres.undangan}
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--label)]">/ {invitTarget}</span>
              </div>
            </div>
            <div className="rounded-xl bg-[var(--halaman)] p-2.5 sm:p-3 border border-[var(--garis)]">
              <span className="text-[11px] sm:text-xs text-[var(--label)] block">Closing</span>
              <div className="flex items-baseline gap-1 mt-0.5 sm:mt-1">
                <span className="text-lg sm:text-xl font-bold text-[var(--biru)] tabular-nums" style={{ fontFamily: 'var(--mono)' }}>
                  {progres.closing}
                </span>
                <span className="text-[11px] sm:text-xs text-[var(--label)]">/ {closingTarget}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Operations Section: Status Absen Hari Ini
   ========================================================================= */
function StatusAbsenHariIni() {
  const { session } = useAuth();
  const { data: titikSaya } = useTitikAbsenSaya(session?.user.id);
  const { data: absenHariIni, isError, refetch } = useAbsenHariIni(session?.user.id);

  if (!titikSaya || titikSaya.length === 0) return null;

  if (isError) {
    return <KeadaanGagal pesan="Gagal memuat status absen." onCoba={() => void refetch()} />;
  }

  const masuk = absenHariIni?.find((a) => a.tipe === 'masuk');
  const pulang = absenHariIni?.find((a) => a.tipe === 'pulang');
  const semuaSudah = Boolean(masuk) && Boolean(pulang);

  function renderBarisAbsen(label: string, data: typeof masuk) {
    if (!data) {
      return (
        <div className="flex items-center justify-between rounded-xl bg-[var(--halaman)] p-2.5 sm:p-3 border border-[var(--garis)]">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-slate-300" />
            <span className="text-xs font-semibold text-[var(--tinta)]">{label}</span>
          </div>
          <span className="text-[11px] sm:text-xs text-[var(--label)]">Belum dilakukan</span>
        </div>
      );
    }

    const jam = new Date(data.waktu).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    });
    const luarRadius = data.status === 'di_luar_radius';

    return (
      <div className="flex flex-col gap-1 rounded-xl bg-[var(--halaman)] p-2.5 sm:p-3 border border-[var(--garis)] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${luarRadius ? 'bg-amber-400' : 'bg-emerald-500'}`} />
          <span className="text-xs font-semibold text-[var(--tinta)]">{label}</span>
          <span className="text-xs font-mono font-bold text-[var(--biru)]" style={{ fontFamily: 'var(--mono)' }}>
            {jam}
          </span>
        </div>
        <span
          className={`inline-flex items-center self-start sm:self-auto rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
            luarRadius
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {luarRadius ? `Di luar radius ${data.lokasiNama ?? ''}` : `Dalam radius ${data.lokasiNama ?? ''}`}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-xl sm:rounded-2xl border border-[var(--garis)] bg-[var(--permukaan)] p-4 sm:p-5 lg:p-6 shadow-xs">
      <div>
        <div className="flex items-center justify-between gap-2 border-b border-[var(--garis)] pb-3 mb-3.5 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="flex size-6 sm:size-7 items-center justify-center rounded-full bg-[var(--biru-lembut)] text-[var(--biru)] border border-[var(--biru-garis)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </span>
            <h3 className="text-sm sm:text-base font-bold text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
              Presensi Hari Ini
            </h3>
          </div>
          <span
            className={`rounded-full px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-bold border ${
              semuaSudah
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : masuk
                  ? 'bg-amber-50 text-amber-800 border-amber-200'
                  : 'bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            {semuaSudah ? 'Lengkap' : masuk ? 'Sudah Masuk' : 'Belum Absen'}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:gap-2.5">
          {renderBarisAbsen('Absen Masuk', masuk)}
          {renderBarisAbsen('Absen Pulang', pulang)}
        </div>
      </div>

      <div className="mt-4 sm:mt-5 border-t border-[var(--garis)] pt-3 flex items-center justify-between">
        <span className="text-[11px] sm:text-xs text-[var(--label)]">Sistem Presensi GPS</span>
        <Link href="/absen" className="text-xs font-semibold text-[var(--biru)] hover:underline">
          Buka Kamera Presensi &rarr;
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   Main Dashboard View (Home)
   ========================================================================= */
export default function Home() {
  const { profile, roles, session, loading } = useAuth();
  const { data: titikSaya } = useTitikAbsenSaya(session?.user.id);
  const punyaTitikAbsen = (titikSaya?.length ?? 0) > 0;

  return (
    <main className="mx-auto w-full max-w-7xl px-3.5 py-4 sm:px-6 sm:py-6 lg:px-8 flex flex-col gap-4 sm:gap-6 lg:gap-7 pb-24 sm:pb-8">
      {loading ? (
        <KerangkaBeranda />
      ) : (
        <>
          {/* Section 1: Executive Greeting & Context Bar */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--garis)] pb-3.5 sm:pb-4">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[var(--biru)]" style={{ fontFamily: 'var(--display)' }}>
                {sapaanWaktu(jamWIB())}, {profile?.nama ?? 'Karyawan'}.
              </h1>
              <p className="text-[11px] sm:text-xs text-[var(--label)] mt-0.5">
                Pusat kontrol dan laporan harian terpadu Koperumnas Group
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-1 sm:mt-0">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--garis)] bg-[var(--permukaan)] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-medium text-[var(--label)] shadow-2xs">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span suppressHydrationWarning>{tanggalIndonesiaWIB()}</span>
              </span>
              {profile?.divisi && (
                <span className="inline-flex rounded-full border border-[var(--biru-garis)] bg-[var(--biru-lembut)] px-2.5 sm:px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-semibold text-[var(--biru)]">
                  {profile.divisi}
                </span>
              )}
            </div>
          </div>

          {/* Section 2: Operations Grid (Laporan Hari Ini & Presensi) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
            <div className={punyaTitikAbsen ? 'lg:col-span-7 xl:col-span-8 flex flex-col gap-3 sm:gap-4' : 'lg:col-span-12 flex flex-col gap-3 sm:gap-4'}>
              <DaftarTugas />
            </div>

            {punyaTitikAbsen && (
              <div className="lg:col-span-5 xl:col-span-4">
                <StatusAbsenHariIni />
              </div>
            )}
          </div>

          {/* Section 3 & 4: Executive CEO Dashboard -- gerbang lebar di sini
              (ceo || pusat || accounting), gerbang PER-BAGIAN yang sesungguhnya
              ada di dalam DashboardCeo itu sendiri. */}
          {(roles.includes('ceo') || roles.includes('pusat') || roles.includes('accounting')) && <DashboardCeo />}
        </>
      )}
    </main>
  );
}
