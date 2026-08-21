import { FormProvider, useFieldArray, useForm, useFormContext, type FieldValues } from 'react-hook-form';
import type { Field, FormSchema } from '../forms/types';

interface FormRendererProps {
  schema: FormSchema;
  nilaiAwal?: FieldValues;
  onSubmit: (data: FieldValues) => void;
}

function FieldTabel({ field, namaField }: { field: Field; namaField: string }) {
  const { control, register } = useFormContext();
  const kolom = field.kolom ?? [];
  const { fields, append, remove } = useFieldArray({ control, name: namaField });

  return (
    <div className="flex flex-col gap-2">
      {fields.map((baris, i) => (
        <div key={baris.id} className="flex flex-col gap-1 border p-2" style={{ borderColor: 'var(--garis)' }}>
          {kolom.map((k) => (
            <label key={k.key} className="flex flex-col text-sm">
              {k.label}
              <input
                className="border px-2 py-1"
                style={{ borderColor: 'var(--garis)' }}
                {...register(`${namaField}.${i}.${k.key}`)}
              />
            </label>
          ))}
          <button type="button" onClick={() => remove(i)} className="text-sm underline">
            Hapus baris
          </button>
        </div>
      ))}
      <button type="button" onClick={() => append({})} className="text-sm underline">
        Tambah baris
      </button>
    </div>
  );
}

export function FormRenderer({ schema, nilaiAwal, onSubmit }: FormRendererProps) {
  const methods = useForm({ defaultValues: nilaiAwal });
  const { register, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      {schema.blocks.map((block) => (
        <fieldset key={block.id} className="flex flex-col gap-3 border p-4" style={{ borderColor: 'var(--garis)' }}>
          <legend className="px-1 text-lg" style={{ fontFamily: 'var(--display)' }}>
            {block.judul}
          </legend>
          {block.catatan && <p className="text-sm" style={{ color: 'var(--biru-3)' }}>{block.catatan}</p>}
          {block.fields.map((field) => (
            <label key={field.key} className="flex flex-col gap-1">
              <span>
                {field.label}
                {field.wajib && <span style={{ color: 'var(--merah)' }}> *</span>}
              </span>

              {field.type === 'angka' && (
                <input
                  type="number"
                  inputMode="numeric"
                  min={field.min}
                  max={field.max}
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)', fontFamily: 'var(--mono)' }}
                  {...register(field.key, { valueAsNumber: true })}
                />
              )}

              {field.type === 'uang' && (
                <input
                  type="number"
                  inputMode="numeric"
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)', fontFamily: 'var(--mono)' }}
                  {...register(field.key, { valueAsNumber: true })}
                />
              )}

              {field.type === 'teks' && (
                <input
                  type="text"
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)' }}
                  {...register(field.key)}
                />
              )}

              {field.type === 'teks_panjang' && (
                <textarea
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)' }}
                  {...register(field.key)}
                />
              )}

              {field.type === 'pilih' && (
                <select
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)' }}
                  {...register(field.key)}
                >
                  <option value="">— pilih —</option>
                  {(field.pilihan ?? []).map((opsi) => (
                    <option key={opsi} value={opsi}>
                      {opsi}
                    </option>
                  ))}
                </select>
              )}

              {field.type === 'ya_tidak' && (
                <select
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)' }}
                  {...register(field.key)}
                >
                  <option value="">— pilih —</option>
                  <option value="ya">Ya</option>
                  <option value="tidak">Tidak</option>
                </select>
              )}

              {field.type === 'centang' && (
                <input type="checkbox" className="h-6 w-6 self-start" {...register(field.key)} />
              )}

              {field.type === 'status_warna' && (
                <select
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)' }}
                  {...register(field.key)}
                >
                  <option value="">— pilih —</option>
                  <option value="hijau">🟢 Aman</option>
                  <option value="kuning">🟡 Dikawal</option>
                  <option value="merah">🔴 Urgent</option>
                </select>
              )}

              {field.type === 'tabel' && <FieldTabel field={field} namaField={field.key} />}

              {field.type === 'lampiran' && (
                <input
                  type="file"
                  accept="image/*,video/*"
                  className="border px-2 py-1"
                  style={{ borderColor: 'var(--garis)' }}
                  {...register(field.key)}
                />
              )}

              {field.bantuan && (
                <span className="text-sm" style={{ color: 'var(--kosong)' }}>
                  {field.bantuan}
                </span>
              )}
            </label>
          ))}
        </fieldset>
      ))}
      <button
        type="submit"
        className="px-4 py-3"
        style={{ background: 'var(--biru)', color: 'var(--kertas-2)', minHeight: 44 }}
      >
        Kirim
      </button>
    </form>
    </FormProvider>
  );
}
