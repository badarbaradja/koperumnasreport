'use client';

import { useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

export function Pilih({ field }: { field: Field }) {
  const { register } = useFormContext();
  return (
    <select
      className="border px-2 py-2"
      style={{ borderColor: 'var(--garis)', minHeight: 44 }}
      {...register(field.key)}
    >
      <option value="">— pilih —</option>
      {(field.pilihan ?? []).map((opsi) => (
        <option key={opsi} value={opsi}>
          {opsi}
        </option>
      ))}
    </select>
  );
}
