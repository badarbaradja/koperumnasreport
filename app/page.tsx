'use client';

import { useAuth } from '../lib/auth/AuthProvider';

export default function Home() {
  const { profile, roles, loading, signOut } = useAuth();

  return (
    <main className="flex min-h-svh flex-col gap-4 p-6">
      <h1 className="text-2xl" style={{ color: 'var(--biru)' }}>
        Pusat Kontrol Koperumnas Group
      </h1>
      {loading ? (
        <p>Memuat…</p>
      ) : (
        <>
          <p>Masuk sebagai: {profile?.nama ?? '(profil belum termuat)'}</p>
          <p>Peran: {roles.length > 0 ? roles.join(', ') : '(belum ada peran)'}</p>
          <button
            type="button"
            onClick={() => void signOut()}
            className="w-fit border px-4 py-2"
            style={{ borderColor: 'var(--merah)', color: 'var(--merah)', minHeight: 44 }}
          >
            Keluar
          </button>
        </>
      )}
    </main>
  );
}
