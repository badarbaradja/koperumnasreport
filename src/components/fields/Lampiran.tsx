import type { Field } from '../../forms/types';
import { LampiranInput } from './LampiranInput';

export function Lampiran({ field }: { field: Field }) {
  return <LampiranInput name={field.key} />;
}
