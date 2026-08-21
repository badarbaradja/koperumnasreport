create extension if not exists "pgcrypto";

-- ─── ENUM ────────────────────────────────────────────────────────────
create type report_status  as enum ('draft','terkirim','terlambat');
create type warna          as enum ('hijau','kuning','merah');
create type decision_status as enum ('menunggu','disetujui','dicicil','ditunda','ditolak');

-- ─── ORANG ───────────────────────────────────────────────────────────
create table public.profile (
  id          uuid primary key references auth.users on delete cascade,
  nama        text not null,
  jabatan     text,
  divisi      text,
  aktif       boolean not null default true,
  created_at  timestamptz not null default now()
);

create table public.role (
  user_id uuid not null references public.profile(id) on delete cascade,
  role    text not null
          check (role in ('ceo','pusat','accounting','kontrol_marketing',
                          'kadiv','pic_lokasi','manager_resto','karyawan')),
  primary key (user_id, role)
);

-- ─── TEMPAT ──────────────────────────────────────────────────────────
create table public.lokasi (
  id    uuid primary key default gen_random_uuid(),
  nama  text not null unique,
  aktif boolean not null default true
);

create table public.outlet (
  id    uuid primary key default gen_random_uuid(),
  nama  text not null unique,
  aktif boolean not null default true
);

-- siapa bertanggung jawab mengisi form apa, untuk scope mana
create table public.assignment (
  id        uuid primary key default gen_random_uuid(),
  user_id   uuid not null references public.profile(id) on delete cascade,
  form_key  text not null,
  lokasi_id uuid references public.lokasi(id) on delete cascade,
  outlet_id uuid references public.outlet(id) on delete cascade,
  shift     text check (shift in ('pagi','siang','malam'))
);

create unique index assignment_uniq on public.assignment (
  user_id, form_key,
  coalesce(lokasi_id, outlet_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(shift, '-')
);

-- ─── LAPORAN ─────────────────────────────────────────────────────────
create table public.report (
  id           uuid primary key default gen_random_uuid(),
  form_key     text not null,
  form_version int  not null default 1,
  tanggal      date not null,
  author_id    uuid not null references public.profile(id),
  lokasi_id    uuid references public.lokasi(id),
  outlet_id    uuid references public.outlet(id),
  shift        text check (shift in ('pagi','siang','malam')),
  data         jsonb not null default '{}'::jsonb,
  status       report_status not null default 'draft',
  warna        warna,
  submitted_at timestamptz,
  nudged_at    timestamptz,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create unique index report_uniq on public.report (
  form_key, tanggal, author_id,
  coalesce(lokasi_id, outlet_id, '00000000-0000-0000-0000-000000000000'::uuid),
  coalesce(shift, '-')
);
create index report_tanggal_idx on public.report (tanggal desc);
create index report_form_idx    on public.report (form_key, tanggal desc);
create index report_data_gin    on public.report using gin (data);

create table public.attachment (
  id          uuid primary key default gen_random_uuid(),
  report_id   uuid not null references public.report(id) on delete cascade,
  field_key   text not null,
  path        text not null,
  mime        text,
  bytes       bigint,
  captured_at timestamptz,
  created_at  timestamptz not null default now()
);
create index attachment_report_idx on public.attachment (report_id, field_key);

-- ─── MARKETING ───────────────────────────────────────────────────────
create table public.pte_daily (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.profile(id) on delete cascade,
  tanggal          date not null,
  live             boolean not null default false,
  undang_jumlah    int not null default 0,
  kesaksian_jumlah int not null default 0,
  review_jumlah    int not null default 0,
  konten_jumlah    int not null default 0,
  mentahan_jumlah  int not null default 0,
  lengkap boolean generated always as (
    live
    and undang_jumlah    > 0
    and kesaksian_jumlah > 0
    and review_jumlah    > 0
    and konten_jumlah   >= 3
    and mentahan_jumlah  > 0
  ) stored,
  report_id  uuid references public.report(id) on delete set null,
  updated_at timestamptz not null default now(),
  unique (user_id, tanggal)
);

create table public.closing (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profile(id) on delete cascade,
  nama_konsumen text not null,
  lokasi_id     uuid references public.lokasi(id),
  tanggal       date not null,
  status        text not null default 'booking'
                check (status in ('booking','akad','batal')),
  report_id     uuid references public.report(id) on delete set null,
  created_at    timestamptz not null default now()
);
create index closing_user_idx on public.closing (user_id, tanggal desc);

-- ─── KEPUTUSAN CEO ───────────────────────────────────────────────────
create table public.decision (
  id                 uuid primary key default gen_random_uuid(),
  report_id          uuid references public.report(id) on delete cascade,
  judul              text not null,
  masalah            text,
  dampak             text,
  nominal            bigint not null default 0,
  pic_id             uuid references public.profile(id),
  deadline           date,
  urgensi            int not null default 2 check (urgensi between 1 and 3),
  status             decision_status not null default 'menunggu',
  keputusan_catatan  text,
  decided_by         uuid references public.profile(id),
  decided_at         timestamptz,
  created_at         timestamptz not null default now()
);
create index decision_antrean_idx
  on public.decision (status, urgensi, deadline nulls last);

-- ─── ATURAN BISNIS ───────────────────────────────────────────────────
create table public.policy (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ═══ TRIGGER updated_at ═══════════════════════════════════════════════

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger report_updated    before update on public.report
  for each row execute function public.set_updated_at();
create trigger pte_daily_updated before update on public.pte_daily
  for each row execute function public.set_updated_at();
