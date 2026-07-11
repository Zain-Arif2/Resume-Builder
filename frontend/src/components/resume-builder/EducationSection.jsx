import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import SectionCard from './SectionCard';

export default function EducationSection({ control, register }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'education' });

  return (
    <SectionCard
      title="Education"
      subtitle="Degrees, diplomas, and certifications"
      action={
        <button
          type="button"
          onClick={() => append({ institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })}
          className="flex items-center gap-1.5 text-xs font-medium text-ink border border-slate/20 px-3 py-1.5 rounded-lg hover:border-slate/40 transition"
        >
          <Plus size={13} /> Add
        </button>
      }
    >
      {fields.length === 0 && <p className="text-slate text-sm">No education added yet.</p>}

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-slate/10 rounded-xl p-4 relative">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-slate hover:text-danger transition"
            >
              <Trash2 size={15} />
            </button>

            <div className="grid sm:grid-cols-2 gap-3 pr-8">
              <input
                {...register(`education.${index}.institution`)}
                placeholder="Institution"
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                {...register(`education.${index}.degree`)}
                placeholder="Degree"
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                {...register(`education.${index}.fieldOfStudy`)}
                placeholder="Field of study"
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                {...register(`education.${index}.grade`)}
                placeholder="Grade / GPA"
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                type="date"
                {...register(`education.${index}.startDate`)}
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                type="date"
                {...register(`education.${index}.endDate`)}
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
