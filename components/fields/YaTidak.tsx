'use client';

import { useController, useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

const OPSI = [
  { value: 'ya', label: 'Ya' },
  { value: 'tidak', label: 'Tidak' },
];

export function YaTidak({ field }: { field: Field }) {
  const { control } = useFormContext();
  const { field: rhf } = useController({ name: field.key, control });

  return (
    <div className="flex gap-2">
      {OPSI.map((o) => (
        <button
          type="button"
          key={o.value}
          onClick={() => rhf.onChange(o.value)}
          className="flex-1 border px-3 py-2"
          style={{
            borderColor: 'var(--garis)',
            background: rhf.value === o.value ? 'var(--biru)' : 'transparent',
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
