import { useController, useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

const OPSI = [
  { value: 'hijau', label: '🟢 Aman', warna: 'var(--hijau)' },
  { value: 'kuning', label: '🟡 Dikawal', warna: 'var(--kuning)' },
  { value: 'merah', label: '🔴 Urgent', warna: 'var(--merah)' },
];

export function StatusWarna({ field }: { field: Field }) {
  const { control } = useFormContext();
  const { field: rhf } = useController({ name: field.key, control });

  return (
    <div className="flex gap-2">
      {OPSI.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => rhf.onChange(o.value)}
          className="flex-1 border px-3 py-3"
          style={{
            borderColor: o.warna,
            background: rhf.value === o.value ? o.warna : 'transparent',
            color: rhf.value === o.value ? 'var(--kertas-2)' : 'var(--tinta)',
            minHeight: 44,
          }}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
