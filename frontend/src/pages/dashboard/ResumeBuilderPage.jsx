import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { ArrowLeft, Save, Check, Download, Target, Mail, History, Briefcase, LayoutTemplate } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import PersonalInfoSection from '@/components/resume-builder/PersonalInfoSection';
import SummarySection from '@/components/resume-builder/SummarySection';
import ExperienceSection from '@/components/resume-builder/ExperienceSection';
import EducationSection from '@/components/resume-builder/EducationSection';
import SkillsSection from '@/components/resume-builder/SkillsSection';
import ATSModal from '@/components/resume-builder/ATSModal';
import ATSScoreWidget from '@/components/resume-builder/ATSScoreWidget';
import ATSScoreDetailModal from '@/components/resume-builder/ATSScoreDetailModal';
import CoverLetterModal from '@/components/resume-builder/CoverLetterModal';
import VersionHistoryModal from '@/components/resume-builder/VersionHistoryModal';
import CareerToolsModal from '@/components/resume-builder/CareerToolsModal';
import TemplatePickerModal from '@/components/resume-builder/TemplatePickerModal';
import ExportButton from '@/components/resume-builder/ExportButton';
import { getTemplateById } from '@/components/resume-builder/templates';
import { useGetResumeQuery, useUpdateResumeMutation } from '@/features/resume/resumeApi';
import { useAnalyzeGeneralATSMutation } from '@/features/ai/aiApi';

function useDebouncedCallback(callback, delay) {
  const timerRef = useRef(null);
  return useCallback(
    (...args) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

function ToolbarButton({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 text-slate hover:text-ink hover:bg-paper-dim px-2.5 py-2 rounded-lg text-xs font-medium transition whitespace-nowrap"
    >
      <Icon size={15} />
      {label}
    </button>
  );
}

export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetResumeQuery(id);
  const [updateResume, { isLoading: isSaving }] = useUpdateResumeMutation();
  const [lastSaved, setLastSaved] = useState(null);

  const [atsOpen, setAtsOpen] = useState(false);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [careerToolsOpen, setCareerToolsOpen] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const [atsScoreResult, setAtsScoreResult] = useState(null);
  const [atsScoreDetailOpen, setAtsScoreDetailOpen] = useState(false);
  const [analyzeGeneralATS, { isLoading: isRechecking }] = useAnalyzeGeneralATSMutation();

  const initializedRef = useRef(false);
  const exportRef = useRef(null);

  const { register, control, handleSubmit, reset, watch, setValue, getValues } = useForm({
    defaultValues: {
      title: 'Untitled Resume',
      template: 'classic',
      personalInfo: {},
      professionalSummary: '',
      experience: [],
      education: [],
      skills: [],
    },
  });

  useEffect(() => {
    initializedRef.current = false;
  }, [id]);

  useEffect(() => {
    if (data?.data?.resume && !initializedRef.current) {
      const resume = data.data.resume;
      reset({
        title: resume.title || 'Untitled Resume',
        template: resume.template || 'classic',
        personalInfo: resume.personalInfo || {},
        professionalSummary: resume.professionalSummary || '',
        experience: resume.experience || [],
        education: resume.education || [],
        skills: resume.skills || [],
      });
      initializedRef.current = true;
    }
  }, [data, reset]);

  const saveResume = useCallback(
    async (values, saveVersion = false) => {
      await updateResume({ id, saveVersion, ...values }).unwrap();
      setLastSaved(new Date());
    },
    [id, updateResume]
  );

  const debouncedSave = useDebouncedCallback((values) => saveResume(values, false), 1500);
  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (initializedRef.current) {
      debouncedSave(getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValues]);

  const onManualSave = handleSubmit((values) => saveResume(values, true));

  const handleSelectTemplate = (templateId) => {
    setValue('template', templateId, { shouldDirty: true });
    setTemplatePickerOpen(false);
  };

  const getExportHtml = () => {
    if (!exportRef.current) return '';
    return exportRef.current.outerHTML;
  };

  const handleRecheckScore = async () => {
    const resumeText = [
      previewDataRef.current.professionalSummary,
      ...(previewDataRef.current.experience || []).map((e) => `${e.position} at ${e.company}. ${e.description || ''}`),
      ...(previewDataRef.current.education || []).map((e) => `${e.degree} at ${e.institution}`),
      previewDataRef.current.skills?.length ? 'Skills: ' + previewDataRef.current.skills.map((s) => s.name).join(', ') : '',
    ].join('\n');
    const res = await analyzeGeneralATS({ resumeText, resumeId: id }).unwrap();
    setAtsScoreResult(res.data.analysis);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  const previewData = watchedValues;
  const previewDataRef = { current: previewData };
  const activeTemplate = getTemplateById(previewData.template || 'classic');
  const TemplateComponent = activeTemplate.component;

  return (
    <DashboardLayout>
      {/* Header: back + title */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <button onClick={() => navigate('/dashboard')} className="text-slate hover:text-ink transition shrink-0">
          <ArrowLeft size={20} />
        </button>
        <input
          {...register('title')}
          className="font-display text-xl font-semibold text-ink bg-transparent outline-none border-b border-transparent focus:border-amber transition min-w-0 flex-1"
        />
        <span className="text-xs font-mono text-slate flex items-center gap-1.5 shrink-0">
          {isSaving ? 'Saving...' : lastSaved ? (<><Check size={13} className="text-emerald" /> Saved</>) : 'Auto-save on'}
        </span>
      </div>

      {/* Toolbar: tools left, primary actions right */}
      <div className="flex items-center justify-between gap-3 mb-6 pb-3 border-b border-slate/10 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <ToolbarButton icon={LayoutTemplate} label={activeTemplate.name} onClick={() => setTemplatePickerOpen(true)} />
          <ToolbarButton icon={History} label="History" onClick={() => setHistoryOpen(true)} />
          <ToolbarButton icon={Target} label="ATS Match" onClick={() => setAtsOpen(true)} />
          <ToolbarButton icon={Mail} label="Cover Letter" onClick={() => setCoverLetterOpen(true)} />
          <ToolbarButton icon={Briefcase} label="Career Tools" onClick={() => setCareerToolsOpen(true)} />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onManualSave}
            className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-xl text-sm font-medium hover:bg-ink-light transition"
          >
            <Save size={15} /> Save
          </button>
<ExportButton getHtml={getExportHtml} baseFileName={getValues('title') || 'resume'} />        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <PersonalInfoSection register={register} />
          <SummarySection register={register} watch={watch} setValue={setValue} />
          <ExperienceSection control={control} register={register} watch={watch} setValue={setValue} />
          <EducationSection control={control} register={register} />
          <SkillsSection control={control} watch={watch} setValue={setValue} />
        </div>

        <div className="hidden lg:block sticky top-8 self-start space-y-4">
          <ATSScoreWidget
            resumeData={previewData}
            resumeId={id}
            result={atsScoreResult}
            onResult={setAtsScoreResult}
            onOpenDetails={() => setAtsScoreDetailOpen(true)}
          />

          <div>
            <p className="text-xs font-mono text-slate mb-2 uppercase tracking-wide">Live Preview — {activeTemplate.name}</p>
            <div className="rounded-xl shadow-lg border border-slate/10 overflow-hidden bg-white mx-auto" style={{ width: 420, height: 594 }}>
              <div style={{ width: 794, height: 1123, transform: 'scale(0.529)', transformOrigin: 'top left' }}>
                <TemplateComponent data={previewData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden, unscaled copy used only to capture clean HTML for PDF export */}
<div
  style={{
    position: "absolute",
    left: "-99999px",
    top: 0,
    width: "794px",
    visibility: "hidden",
    pointerEvents: "none",
  }}
>        <div ref={exportRef}>
          <TemplateComponent data={previewData} />
        </div>
      </div>

      {atsOpen && <ATSModal resumeData={previewData} onClose={() => setAtsOpen(false)} />}
      {coverLetterOpen && (
        <CoverLetterModal resumeSummary={previewData.professionalSummary} onClose={() => setCoverLetterOpen(false)} />
      )}
      {historyOpen && (
        <VersionHistoryModal resumeId={id} onClose={() => setHistoryOpen(false)} onRestored={() => refetch()} />
      )}
      {careerToolsOpen && (
        <CareerToolsModal
          resumeSummary={previewData.professionalSummary}
          skills={previewData.skills}
          onClose={() => setCareerToolsOpen(false)}
        />
      )}
      {templatePickerOpen && (
        <TemplatePickerModal
          selectedTemplateId={previewData.template || 'classic'}
          onSelect={handleSelectTemplate}
          onClose={() => setTemplatePickerOpen(false)}
          previewData={previewData}
        />
      )}
      {atsScoreDetailOpen && (
        <ATSScoreDetailModal
          result={atsScoreResult}
          onClose={() => setAtsScoreDetailOpen(false)}
          onRecheck={handleRecheckScore}
          isLoading={isRechecking}
        />
      )}
    </DashboardLayout>
  );
}
