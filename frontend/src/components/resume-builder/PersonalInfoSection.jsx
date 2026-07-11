import SectionCard from './SectionCard';

export default function PersonalInfoSection({ register }) {
  return (
    <SectionCard title="Personal Information" subtitle="How employers can reach you">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full Name" {...register('personalInfo.fullName')} />
        <Field label="Email" type="email" {...register('personalInfo.email')} />
        <Field label="Phone" {...register('personalInfo.phone')} />
        <Field label="City" {...register('personalInfo.city')} />
        <Field label="Country" {...register('personalInfo.country')} />
        <Field label="LinkedIn" {...register('personalInfo.linkedin')} />
        <Field label="GitHub" {...register('personalInfo.github')} />
        <Field label="Website" {...register('personalInfo.website')} />
      </div>
    </SectionCard>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate mb-1.5">{label}</label>
      <input
        {...props}
        className="w-full px-3.5 py-2.5 bg-paper-dim border border-slate/15 rounded-lg text-sm text-ink focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition"
      />
    </div>
  );
}
