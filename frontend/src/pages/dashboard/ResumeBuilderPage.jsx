import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { PDFDownloadLink } from '@react-pdf/renderer';
import {
  ArrowLeft,
  Save,
  Check,
  Download,
  Share2,
  Target,
  Mail,
  History,
  Briefcase,
} from 'lucide-react';
import DashboardLayout from '@/layouts/DashboardLayout';
import PageLoader from '@/components/common/PageLoader';
import PersonalInfoSection from '@/components/resume-builder/PersonalInfoSection';
import SummarySection from '@/components/resume-builder/SummarySection';
import ExperienceSection from '@/components/resume-builder/ExperienceSection';
import EducationSection from '@/components/resume-builder/EducationSection';
import SkillsSection from '@/components/resume-builder/SkillsSection';
import ResumePreview from '@/components/resume-builder/ResumePreview';
import ResumePDFDocument from '@/components/resume-builder/ResumePDFDocument';
import ShareModal from '@/components/resume-builder/ShareModal';
import ATSModal from '@/components/resume-builder/ATSModal';
import CoverLetterModal from '@/components/resume-builder/CoverLetterModal';
import VersionHistoryModal from '@/components/resume-builder/VersionHistoryModal';
import { useGetResumeQuery, useUpdateResumeMutation } from '@/features/resume/resumeApi';
import CareerToolsModal from '@/components/resume-builder/CareerToolsModal';


export default function ResumeBuilderPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetResumeQuery(id);
  const [careerToolsOpen, setCareerToolsOpen] = useState(false);
  const [updateResume, { isLoading: isSaving }] = useUpdateResumeMutation();
  const [lastSaved, setLastSaved] = useState(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [atsOpen, setAtsOpen] = useState(false);
  const [coverLetterOpen, setCoverLetterOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const saveTimer = useRef(null);
  const isSavingRef = useRef(false);
  const pendingSave = useRef(false);
  const lastSavedData = useRef('');
  const initialized = useRef(false);

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
    if (!data?.data?.resume) return;

    const resume = data.data.resume;

    const formData = {
      title: resume.title || 'Untitled Resume',
      personalInfo: resume.personalInfo || {},
      professionalSummary: resume.professionalSummary || '',
      experience: resume.experience || [],
      education: resume.education || [],
      skills: resume.skills || [],
    };

    reset(formData);

    lastSavedData.current = JSON.stringify(formData);
    initialized.current = true;
  }, [data, reset]);

  const saveResume = async (values, saveVersion = false) => {
    if (isSavingRef.current) {
      pendingSave.current = true;
      return;
    }

    try {
      isSavingRef.current = true;

      await updateResume({
        id,
        saveVersion,
        ...values,
      }).unwrap();

      lastSavedData.current = JSON.stringify(values);
      setLastSaved(new Date());
    } finally {
      isSavingRef.current = false;

      if (pendingSave.current) {
        pendingSave.current = false;
        saveResume(getValues(), false);
      }
    }
  };

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (!initialized.current) return;

    const values = getValues();
    const current = JSON.stringify(values);

    if (current === lastSavedData.current) return;

    clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      saveResume(values, false);
    }, 2000);

    return () => clearTimeout(saveTimer.current);
  }, [watchedValues]);
  const onManualSave = handleSubmit(async (values) => {
    await saveResume(values, true);
    lastSavedData.current = JSON.stringify(values);
  });

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageLoader />
      </DashboardLayout>
    );
  }

  const previewData = watchedValues;
  const currentResume = data?.data?.resume;

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
            {isSaving ? 'Saving...' : lastSaved ? (<><Check size={13} className="text-emerald" /> Saved</>) : 'Auto-save on'}
          </span>
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
          <PDFDownloadLink document={<ResumePDFDocument data={previewData} />} fileName={`${getValues('title') || 'resume'}.pdf`}>
            {({ loading }) => (
              <span className="flex items-center gap-1.5 border border-slate/20 text-ink px-4 py-2 rounded-xl text-sm font-medium hover:border-slate/40 transition cursor-pointer">
                <Download size={15} /> {loading ? 'Preparing...' : 'Export PDF'}
              </span>
            )}
          </PDFDownloadLink>
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
          <p className="text-xs font-mono text-slate mb-2 uppercase tracking-wide">Live Preview</p>
<ResumePreview
    data={previewData}
/>        </div>
      </div>

      {shareOpen && (
        <ShareModal resume={currentResume} onClose={() => setShareOpen(false)} onTogglePublic={handleTogglePublic} isUpdating={isSaving} />
      )}
      {atsOpen && <ATSModal resumeData={previewData} onClose={() => setAtsOpen(false)} />}
      {coverLetterOpen && (
        <CoverLetterModal resumeSummary={previewData.professionalSummary} onClose={() => setCoverLetterOpen(false)} />
      )}

      {careerToolsOpen && (
        <CareerToolsModal
          resumeSummary={previewData.professionalSummary}
          skills={previewData.skills}
          onClose={() => setCareerToolsOpen(false)}
        />
      )}
      {historyOpen && (
        <VersionHistoryModal resumeId={id} onClose={() => setHistoryOpen(false)} onRestored={() => refetch()} />

      )}
    </DashboardLayout>
  );
}
