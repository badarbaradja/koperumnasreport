-- ═══ §3.1 · Fungsi bantu ═══════════════════════════════════════════════

create or replace function public.has_role(r text)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.role where user_id = auth.uid() and role = r);
$$;

create or replace function public.can_see_report(f text, author uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select
       author = auth.uid()
    or public.has_role('ceo')
    or (public.has_role('pusat')             and f <> 'accounting')
    or (public.has_role('kontrol_marketing') and f =  'personal_marketing')
    or (public.has_role('accounting')        and f in ('accounting','manager_resto','ita'))
    or (public.has_role('manager_resto')     and f =  'personal_marketing');
$$;

-- Baris `pusat and f <> 'accounting'` adalah inti kerahasiaan yang diminta klien. Jangan diubah.

-- ═══ §3.2 · Policy report ═══════════════════════════════════════════════

alter table public.report enable row level security;

create policy report_select on public.report for select
  using (public.can_see_report(form_key, author_id));

create policy report_insert on public.report for insert
  with check (author_id = auth.uid());

create policy report_update on public.report for update
  using (author_id = auth.uid()
         and tanggal = (now() at time zone 'Asia/Jakarta')::date)
  with check (author_id = auth.uid());

-- CATATAN PENTING: policy `report_nudge` (untuk tombol "Tagih" milik Pusat) SENGAJA
-- TIDAK dipasang. `with check (true)` pada update akan membiarkan Pusat mengubah kolom
-- apa pun di baris report siapa pun -- RLS tidak bisa membatasi per-kolom. Sebagai gantinya
-- tombol Tagih wajib lewat RPC `tagih_laporan` di bawah ini. Jangan menambahkan policy
-- report_nudge kembali.

create or replace function public.tagih_laporan(assignment uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not (public.has_role('pusat') or public.has_role('ceo')) then
    raise exception 'Tidak berhak';
  end if;
  -- catat penagihan; implementasi menyusul di Task 18
end $$;

-- ═══ §3.3 · Policy tabel lain ═══════════════════════════════════════════

-- profile: semua yang login boleh melihat nama rekan (untuk daftar PIC)
alter table public.profile enable row level security;
create policy profile_select on public.profile for select using (auth.uid() is not null);
create policy profile_update on public.profile for update
  using (id = auth.uid() or public.has_role('ceo'));

-- role, lokasi, outlet, assignment, policy: baca untuk semua, tulis hanya CEO
alter table public.role       enable row level security;
alter table public.lokasi     enable row level security;
alter table public.outlet     enable row level security;
alter table public.assignment enable row level security;
alter table public.policy     enable row level security;

create policy role_select   on public.role       for select using (auth.uid() is not null);
create policy lokasi_select on public.lokasi     for select using (auth.uid() is not null);
create policy outlet_select on public.outlet     for select using (auth.uid() is not null);
create policy asg_select    on public.assignment for select using (auth.uid() is not null);
create policy policy_select on public.policy     for select using (auth.uid() is not null);

create policy role_admin   on public.role       for all using (public.has_role('ceo')) with check (public.has_role('ceo'));
create policy lokasi_admin on public.lokasi     for all using (public.has_role('ceo')) with check (public.has_role('ceo'));
create policy outlet_admin on public.outlet     for all using (public.has_role('ceo')) with check (public.has_role('ceo'));
create policy asg_admin    on public.assignment for all using (public.has_role('ceo')) with check (public.has_role('ceo'));
create policy policy_admin on public.policy     for all using (public.has_role('ceo')) with check (public.has_role('ceo'));

-- attachment: ikut visibilitas laporan induknya
alter table public.attachment enable row level security;
create policy att_select on public.attachment for select using (
  exists (select 1 from public.report r
          where r.id = report_id and public.can_see_report(r.form_key, r.author_id))
);
create policy att_insert on public.attachment for insert with check (
  exists (select 1 from public.report r where r.id = report_id and r.author_id = auth.uid())
);
create policy att_delete on public.attachment for delete using (
  exists (select 1 from public.report r where r.id = report_id and r.author_id = auth.uid())
);

-- pte_daily & closing: milik sendiri + pengawas marketing
alter table public.pte_daily enable row level security;
alter table public.closing   enable row level security;

create policy pte_select on public.pte_daily for select using (
  user_id = auth.uid() or public.has_role('ceo')
  or public.has_role('pusat') or public.has_role('kontrol_marketing')
  or public.has_role('manager_resto')
);
create policy pte_write on public.pte_daily for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy closing_select on public.closing for select using (
  user_id = auth.uid() or public.has_role('ceo')
  or public.has_role('pusat') or public.has_role('kontrol_marketing')
);
create policy closing_write on public.closing for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- decision: dilihat CEO & Pusat, dibuat pemilik laporan, diputuskan CEO saja
alter table public.decision enable row level security;
create policy dec_select on public.decision for select using (
  public.has_role('ceo') or public.has_role('pusat')
  or exists (select 1 from public.report r where r.id = report_id and r.author_id = auth.uid())
);
create policy dec_insert on public.decision for insert with check (
  exists (select 1 from public.report r where r.id = report_id and r.author_id = auth.uid())
);
create policy dec_decide on public.decision for update
  using (public.has_role('ceo')) with check (public.has_role('ceo'));

-- ═══ §3.4 · View (security_invoker) ═════════════════════════════════════
-- Belum ada view di titik ini (view dibuat di 0004_views.sql, Task 20).
-- WAJIB ditambahkan `alter view ... set (security_invoker = on)` untuk setiap view
-- begitu 0004_views.sql dibuat -- lihat CATATAN-TEKNIS §3.4. Jangan lupa.

-- ═══ §3.5 · Storage ══════════════════════════════════════════════════════

create policy bukti_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'bukti' and (storage.foldername(name))[1] in (
    select r.id::text from public.report r where r.author_id = auth.uid()
  ));

create policy bukti_read on storage.objects for select to authenticated
  using (bucket_id = 'bukti' and (storage.foldername(name))[1] in (
    select r.id::text from public.report r
    where public.can_see_report(r.form_key, r.author_id)
  ));
