import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { Client } from 'pg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const dbUrl = process.env.SUPABASE_DB_URL;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });
const db = new Client({ connectionString: dbUrl });
await db.connect();

const EMAIL = 'uji-ceo@koperumnas.local';
const PASSWORD = 'Uji-CEO-Password-2026!';

// 1. Cek user
let { rows } = await db.query('select id from auth.users where email = $1', [EMAIL]);
let userId;
if (rows.length === 0) {
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: EMAIL,
    password: PASSWORD,
    email_confirm: true,
  });
  if (error) {
    console.error('Gagal create user:', error);
    process.exit(1);
  }
  userId = data.user.id;
  console.log('User created:', userId);
} else {
  userId = rows[0].id;
  await supabaseAdmin.auth.admin.updateUserById(userId, { password: PASSWORD });
  console.log('User password updated:', userId);
}

// 2. Profile
await db.query(
  `insert into public.profile (id, nama, jabatan, divisi, harus_ganti_password, aktif)
   values ($1, 'AKUN UJI - CEO', 'CEO (uji)', 'Direksi', false, true)
   on conflict (id) do update set
     nama = 'AKUN UJI - CEO',
     jabatan = 'CEO (uji)',
     divisi = 'Direksi',
     harus_ganti_password = false,
     aktif = true`,
  [userId]
);

// 3. Roles
for (const role of ['ceo', 'karyawan']) {
  await db.query(
    `insert into public.role (user_id, role) values ($1, $2) on conflict do nothing`,
    [userId, role]
  );
}

// 4. Penugasan Absen Kantor Pusat
const kantorPusatId = 'c1216960-0eb7-48bc-bfae-a4413eb57fda';
await db.query(
  `insert into public.penugasan_absen (user_id, lokasi_absen_id)
   values ($1, $2)
   on conflict do nothing`,
  [userId, kantorPusatId]
);

console.log('Akun uji CEO siap:', EMAIL);
await db.end();
