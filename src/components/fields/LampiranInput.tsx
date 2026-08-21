import { useController, useFormContext } from 'react-hook-form';

interface LampiranItem {
  nama: string;
}

export function LampiranInput({ name, label = 'Lampirkan bukti' }: { name: string; label?: string }) {
  const { control } = useFormContext();
  const { field: rhf } = useController({ name, control, defaultValue: [] });
  const items: LampiranItem[] = rhf.value ?? [];

  function tambah(e: React.ChangeEvent<HTMLInputElement>) {
    const dipilih = Array.from(e.target.files ?? []).map((f) => ({ nama: f.name }));
    rhf.onChange([...items, ...dipilih]);
    e.target.value = '';
  }

  function hapus(i: number) {
    rhf.onChange(items.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-2">
      <label
        className="inline-flex w-fit cursor-pointer items-center border px-4"
        style={{ borderColor: 'var(--biru)', color: 'var(--biru)', minHeight: 44 }}
      >
        {label}
        <input
          type="file"
          accept="image/*,video/*"
          capture="environment"
          multiple
          hidden
          name={rhf.name}
          ref={rhf.ref}
          onChange={tambah}
          onBlur={rhf.onBlur}
        />
      </label>
      {items.length > 0 && (
        <ul className="flex flex-col gap-1">
          {items.map((it, i) => (
            <li key={`${it.nama}-${i}`} className="flex items-center justify-between gap-2 text-sm" style={{ minHeight: 44 }}>
              <span>{it.nama}</span>
              <button type="button" onClick={() => hapus(i)} style={{ color: 'var(--merah)' }}>
                Hapus
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
