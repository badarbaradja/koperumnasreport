'use client';

import { useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

export function TeksPanjang({ field }: { field: Field }) {
  const { register } = useFormContext();
  return (
    <textarea
      rows={4}
      className="border px-2 py-2"
      style={{ borderColor: 'var(--garis)' }}
      {...register(field.key)}
    />
  );
}
