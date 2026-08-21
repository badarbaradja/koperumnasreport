'use client';

import { useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

export function Teks({ field }: { field: Field }) {
  const { register } = useFormContext();
  return (
    <input
      type="text"
      className="border px-2 py-2"
      style={{ borderColor: 'var(--garis)', minHeight: 44 }}
      {...register(field.key)}
    />
  );
}
