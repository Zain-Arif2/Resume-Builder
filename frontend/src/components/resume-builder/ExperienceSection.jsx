import { useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import SectionCard from './SectionCard';
import AIButton from './AIButton';
import { useImproveExperienceMutation } from '@/features/ai/aiApi';

export default function ExperienceSection({ control, register, setValue, watch }) {
  const { fields, append, remove } = useFieldArray({ control, name: 'experience' });
  const [improveExperience, { isLoading }] = useImproveExperienceMutation();

  const handleImprove = async (index) => {
    const item = watch(`experience.${index}`);
    if (!item?.position || !item?.company) return;

    const bullets = (item.description || '').split('\n').filter(Boolean);
    if (bullets.length === 0) return;

    const result = await improveExperience({
      position: item.position,
      company: item.company,
      bullets,
    }).unwrap();

    setValue(`experience.${index}.description`, result.data.bullets.join('\n'), { shouldDirty: true });
  };

  return (
    <SectionCard
      title="Experience"
      subtitle="Your work history, most recent first"
      action={
        <button
          type="button"
          onClick={() => append({ company: '', position: '', startDate: '', endDate: '', description: '' })}
          className="flex items-center gap-1.5 text-xs font-medium text-ink border border-slate/20 px-3 py-1.5 rounded-lg hover:border-slate/40 transition"
        >
          <Plus size={13} /> Add
        </button>
      }
    >
      {fields.length === 0 && <p className="text-slate text-sm">No experience added yet.</p>}

      <div className="space-y-5">
        {fields.map((field, index) => (
          <div key={field.id} className="border border-slate/10 rounded-xl p-4 relative">
            <button
              type="button"
              onClick={() => remove(index)}
              className="absolute top-3 right-3 text-slate hover:text-danger transition"
            >
              <Trash2 size={15} />
            </button>

            <div className="grid sm:grid-cols-2 gap-3 mb-3 pr-8">
              <input
                {...register(`experience.${index}.position`)}
                placeholder="Position"
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                {...register(`experience.${index}.company`)}
                placeholder="Company"
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                type="date"
                {...register(`experience.${index}.startDate`)}
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
              <input
                type="date"
                {...register(`experience.${index}.endDate`)}
                className="px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
              />
            </div>

            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-slate">Bullet points (one per line)</label>
              <AIButton onClick={() => handleImprove(index)} isLoading={isLoading} label="Improve" />
            </div>
            <textarea
              {...register(`experience.${index}.description`)}
              rows={4}
              placeholder={'Led development of...\nImproved performance by...'}
              className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition resize-none"
            />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
