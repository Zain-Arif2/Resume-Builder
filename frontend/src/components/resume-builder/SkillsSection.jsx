import { useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { X } from 'lucide-react';
import SectionCard from './SectionCard';
import AIButton from './AIButton';
import { useImproveSkillsMutation } from '@/features/ai/aiApi';

export default function SkillsSection({ control, watch, setValue }) {
  const { fields, append, remove, replace } = useFieldArray({ control, name: 'skills' });
  const [input, setInput] = useState('');
  const [role, setRole] = useState('');
  const [improveSkills, { isLoading }] = useImproveSkillsMutation();

  const addSkill = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    append({ name: input.trim(), level: 'intermediate' });
    setInput('');
  };

  const handleAISuggest = async () => {
    if (!role.trim()) return;
    const currentSkills = watch('skills')?.map((s) => s.name) || [];
    const result = await improveSkills({ role, currentSkills }).unwrap();
    replace(result.data.skills.map((name) => ({ name, level: 'intermediate' })));
  };

  return (
    <SectionCard title="Skills" subtitle="Technical and soft skills relevant to your target role">
      <div className="flex gap-2 mb-4">
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Target role for AI suggestions"
          className="flex-1 px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
        />
        <AIButton onClick={handleAISuggest} isLoading={isLoading} label="Suggest skills" />
      </div>

      <form onSubmit={addSkill} className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a skill and press Enter"
          className="flex-1 px-3.5 py-2 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-ink text-paper text-sm font-medium rounded-lg hover:bg-ink-light transition"
        >
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        {fields.map((field, index) => (
          <span
            key={field.id}
            className="inline-flex items-center gap-1.5 bg-amber-dim text-ink text-sm px-3 py-1.5 rounded-full"
          >
            {field.name}
            <button type="button" onClick={() => remove(index)} className="hover:text-danger transition">
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
