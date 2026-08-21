import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';
import { formatRupiah, parseRupiah } from '../../lib/rupiah';

export function Uang({ field }: { field: Field }) {
  const { control } = useFormContext();
  const { field: rhf } = useController({ name: field.key, control, defaultValue: 0 });
  const [fokus, setFokus] = useState(false);

  const nilai: number = rhf.value ?? 0;
  const tampilan = fokus ? (nilai ? String(nilai) : '') : nilai ? formatRupiah(nilai) : '';

  return (
    <input
      type="text"
      inputMode="numeric"
      className="border px-2 py-2"
      style={{ borderColor: 'var(--garis)', fontFamily: 'var(--mono)', minHeight: 44 }}
      value={tampilan}
      name={rhf.name}
      ref={rhf.ref}
      onFocus={() => setFokus(true)}
      onChange={(e) => rhf.onChange(parseRupiah(e.target.value))}
      onBlur={() => {
        setFokus(false);
        rhf.onBlur();
      }}
    />
  );
}
