import { useFormContext } from 'react-hook-form';
import type { Field } from '../../forms/types';

export function Angka({ field }: { field: Field }) {
  const { register } = useFormContext();
  const min = field.min ?? 0;
  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      max={field.max}
      className="border px-2 py-2"
      style={{ borderColor: 'var(--garis)', fontFamily: 'var(--mono)', minHeight: 44 }}
      {...register(field.key, {
        valueAsNumber: true,
        min: { value: min, message: `${field.label} tidak boleh kurang dari ${min}` },
      })}
    />
  );
}
