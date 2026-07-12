
import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { renderToString } from 'react-dom/server';
import { ArrowLeft, Save, Check, Download, Share2, Target, Mail, History, Briefcase, LayoutTemplate } from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import PersonalInfoSection from '@/components/resume-builder/PersonalInfoSection';
import SummarySection from '@/components/resume-builder/SummarySection';
import ExperienceSection from '@/components/resume-builder/ExperienceSection';
import EducationSection from '@/components/resume-builder/EducationSection';
import SkillsSection from '@/components/resume-builder/SkillsSection';
import ShareModal from '@/components/resume-builder/ShareModal';
import ATSModal from '@/components/resume-builder/ATSModal';
import CoverLetterModal from '@/components/resume-builder/CoverLetterModal';
import VersionHistoryModal from '@/components/resume-builder/VersionHistoryModal';
import CareerToolsModal from '@/components/resume-builder/CareerToolsModal';
import TemplatePickerModal from '@/components/resume-builder/TemplatePickerModal';
import { getTemplateById } from '@/components/resume-builder/templates';
import { useGetResumeQuery, useUpdateResumeMutation, useGeneratePDFMutation } from '@/features/resume/resumeApi';

const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const PREVIEW_WIDTH = 420;
const PREVIEW_SCALE = PREVIEW_WIDTH / A4_WIDTH;
const PREVIEW_HEIGHT = A4_HEIGHT * PREVIEW_SCALE;

export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetResumeQuery(id);
  const [updateResume, { isLoading: isSaving }] = useUpdateResumeMutation();
  const [generatePDF, { isLoading: isGeneratingPDF }] = useGeneratePDFMutation();
  const [lastSaved, setLastSaved] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [careerToolsOpen, setCareerToolsOpen] = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  const initializedRef = useRef(false);

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

  const watchedValues = useWatch({ control });

  // Reset the form ONLY the first time data loads for this resume id
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
    async (values, saveVersion = true) => { // Always saveVersion for manual save
      await updateResume({ id, saveVersion, ...values }).unwrap();
      setLastSaved(new Date());
    },
    [id, updateResume]
  );

  const handleDownloadPDF = useCallback(async () => {
    try {
      const activeTemplate = getTemplateById(watchedValues.template || 'classic');
      const TemplateComponent = activeTemplate.component;
      // Render template to HTML string
      const resumeHTML = renderToString(
        <div style={{ width: '210mm', minHeight: '297mm', backgroundColor: 'white' }}>
          <TemplateComponent data={watchedValues} />
        </div>
      );
      
      const blob = await generatePDF({ html: resumeHTML, css: '' }).unwrap();
      // Download the PDF
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${watchedValues.title || 'Resume'}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    }
  }, [watchedValues, generatePDF]);

  const onManualSave = handleSubmit((values) => saveResume(values, true));

  const handleTogglePublic = async (isPublic) => {
    await updateResume({ id, isPublic }).unwrap();
  };

  const handleSelectTemplate = (templateId) => {
    setValue('template', templateId, { shouldDirty: true });
    setTemplatePickerOpen(false);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  const previewData = watchedValues;
  const currentResume = data?.data?.resume;
  const activeTemplate = getTemplateById(previewData.template || 'classic');
  const TemplateComponent = activeTemplate.component;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-slate hover:text-ink transition">
            <ArrowLeft size={20} />
          </button>
          <input
            {...register('title')}
            className="font-display text-xl font-semibold text-ink bg-transparent outline-none border-b border-transparent focus:border-amber transition"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-slate flex items-center gap-1.5">
            {isSaving ? 'Saving...' : lastSaved ? (<><Check size={13} className="text-emerald" /> Last Saved</>) : 'Not Saved Yet'}
          </span>
          <button
            onClick={() => setTemplatePickerOpen(true)}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-3 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition"
          >
            <LayoutTemplate size={15} /> {activeTemplate.name}
          </button>
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-3 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition"
          >
            <History size={15} /> History
          </button>
          <button
            onClick={() => setAtsOpen(true)}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-3 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition"
          >
            <Target size={15} /> ATS Match
          </button>
          <button
            onClick={() => setCoverLetterOpen(true)}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-3 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition"
          >
            <Mail size={15} /> Cover Letter
          </button>
          <button
            onClick={() => setCareerToolsOpen(true)}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-3 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition"
          >
            <Briefcase size={15} /> Career Tools
          </button>
          <button
            onClick={() => setShareOpen(true)}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-3 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition"
          >
            <Share2 size={15} /> Share
          </button>
          <button
            onClick={onManualSave}
            className="flex items-center gap-1.5 bg-ink text-paper px-4 py-2 rounded-xl text-sm font-medium hover:bg-ink-light transition"
          >
            <Save size={15} /> Save
          </button>
          <button
            onClick={handleDownloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-1.5 border border-slate/20 text-ink px-4 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition disabled:opacity-50"
          >
            <Download size={15} />
            {isGeneratingPDF ? 'Generating...' : 'Export PDF'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <PersonalInfoSection register={register} />
          <SummarySection register={register} watch={watch} setValue={setValue} />
          <ExperienceSection control={control} register={register} watch={watch} setValue={setValue} />
          <EducationSection control={control} register={register} />
          <SkillsSection control={control} watch={watch} setValue={setValue} />
        </div>

        <div className="hidden lg:block sticky top-24 self-start">
          <p className="text-xs font-mono text-slate mb-2 uppercase tracking-wide">Live Preview — {activeTemplate.name}</p>
          <div
            className="rounded-xl shadow-lg border border-slate/10 overflow-hidden bg-white mx-auto"
            style={{ width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT }}
          >
            <div style={{ width: A4_WIDTH, height: A4_HEIGHT, transform: `scale(${PREVIEW_SCALE})`, transformOrigin: 'top left' }}>
              <TemplateComponent data={previewData} />
            </div>
          </div>
        </div>
      </div>

      {shareOpen && (
        <ShareModal resume={currentResume} onClose={() => setShareOpen(false)} onTogglePublic={handleTogglePublic} isUpdating={isSaving} />
      )}
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
    </DashboardLayout>
  );
}
