import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Save, Check } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import PersonalInfoSection from '@/components/resume-builder/PersonalInfoSection';
import SummarySection from '@/components/resume-builder/SummarySection';
import ExperienceSection from '@/components/resume-builder/ExperienceSection';
import EducationSection from '@/components/resume-builder/EducationSection';
import SkillsSection from '@/components/resume-builder/SkillsSection';
import { useGetResumeQuery, useUpdateResumeMutation } from '@/features/resume/resumeApi';

function useDebouncedCallback(callback, delay) {
  const [timer, setTimer] = useState(null);
  return useCallback(
    (...args) => {
      if (timer) clearTimeout(timer);
      const newTimer = setTimeout(() => callback(...args), delay);
      setTimer(newTimer);
    },
    [callback, delay, timer]
  );
}

export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useGetResumeQuery(id);
  const [updateResume, { isLoading: isSaving }] = useUpdateResumeMutation();
  const [lastSaved, setLastSaved] = useState(null);

  const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      title: 'Untitled Resume',
      personalInfo: {},
      professionalSummary: '',
      experience: [],
      education: [],
      skills: [],
    },
  });

  useEffect(() => {
    if (data?.data?.resume) {
      const resume = data.data.resume;
      reset({
        title: resume.title || 'Untitled Resume',
        personalInfo: resume.personalInfo || {},
        professionalSummary: resume.professionalSummary || '',
        experience: resume.experience || [],
        education: resume.education || [],
        skills: resume.skills || [],
      });
    }
  }, [data, reset]);

  const saveResume = async (values) => {
    await updateResume({ id, ...values }).unwrap();
    setLastSaved(new Date());
  };

  const debouncedSave = useDebouncedCallback((values) => saveResume(values), 1500);

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (!isLoading && data) {
      debouncedSave(getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues]);

  const onManualSave = handleSubmit(saveResume);

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-slate hover:text-ink transition"
          >
            <ArrowLeft size={20} />
          </button>
          <input
            {...register('title')}
            className="font-display text-xl font-semibold text-ink bg-transparent outline-none border-b border-transparent focus:border-amber transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate flex items-center gap-1.5">
            {isSaving ? (
              'Saving...'
            ) : lastSaved ? (
              <>
                <Check size={13} className="text-emerald" /> Saved
              </>
            ) : (
              'Auto-save on'
            )}
          </span>
          <button
            onClick={onManualSave}
            className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-xl text-sm font-medium hover:bg-ink-light transition"
          >
            <Save size={15} /> Save
          </button>
        </div>
      </div>

      <div className="max-w-3xl">
        <PersonalInfoSection register={register} />
        <SummarySection register={register} watch={watch} setValue={setValue} />
        <ExperienceSection control={control} register={register} watch={watch} setValue={setValue} />
        <EducationSection control={control} register={register} />
        <SkillsSection control={control} watch={watch} setValue={setValue} />
      </div>
    </DashboardLayout>
  );
}
