'use client';

import { useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

export function Centang({ field }: { field: Field }) {
  const { register } = useFormContext();
  return (
    <input
      type="checkbox"
      className="h-11 w-11"
      style={{ accentColor: 'var(--biru)' }}
      {...register(field.key)}
    />
  );
}
