import { useState } from 'react';
import SectionCard from './SectionCard';
import AIButton from './AIButton';
import { useGenerateProfessionalSummaryMutation } from '@/features/ai/aiApi';

export default function SummarySection({ register, watch, setValue }) {
  const [generateSummary, { isLoading }] = useGenerateProfessionalSummaryMutation();
  const [role, setRole] = useState('');
  const summary = watch('professionalSummary');

  const handleGenerate = async () => {
    if (!role.trim()) return;
    const result = await generateSummary({
      role,
      experienceSummary: summary || 'Early career professional building their resume.',
    }).unwrap();
    setValue('professionalSummary', result.data.summary, { shouldDirty: true });
  };

  return (
    <SectionCard title="Professional Summary" subtitle="A short pitch at the top of your resume">
      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Target role, e.g. Frontend Developer"
          className="flex-1 px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
        />
        <AIButton onClick={handleGenerate} isLoading={isLoading} label="Generate" />
      </div>
      <textarea
        {...register('professionalSummary')}
        rows={4}
        placeholder="Write a short summary, or generate one with AI above."
        className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition resize-none"
      />
    </SectionCard>
  );
}
