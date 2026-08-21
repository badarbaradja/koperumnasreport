import { useAuth } from '../auth/AuthProvider';

export function Beranda() {
  const { profile, roles, signOut } = useAuth();

  return (
    <main className="flex min-h-svh flex-col gap-4 p-6">
      <h1 className="text-2xl" style={{ color: 'var(--biru)' }}>
        Pusat Kontrol Koperumnas Group
      </h1>
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
    </main>
  );
}
