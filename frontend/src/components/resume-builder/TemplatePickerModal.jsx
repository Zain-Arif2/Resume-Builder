import { X, Check } from 'lucide-react';
import { RESUME_TEMPLATES } from './templates';

export default function TemplatePickerModal({ selectedTemplateId, onSelect, onClose, previewData }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-3xl w-full relative max-h-[85vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>

        <h2 className="font-display text-lg font-semibold text-ink mb-1">Choose a template</h2>
        <p className="text-slate text-sm mb-6">Your content stays the same, only the layout changes.</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {RESUME_TEMPLATES.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            const TemplateComponent = template.component;

            return (
              <button
                key={template.id}
                onClick={() => onSelect(template.id)}
                className={`text-left border rounded-xl overflow-hidden transition ${
                  isSelected ? 'border-amber ring-2 ring-amber/30' : 'border-slate/15 hover:border-slate/30'
                }`}
              >
                <div className="relative bg-paper-dim aspect-[3/4] overflow-hidden">
                  <div className="absolute inset-0 origin-top-left scale-[0.27] w-[370%] h-[370%] pointer-events-none">
                    <TemplateComponent data={previewData} />
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-amber text-ink rounded-full p-1">
                      <Check size={12} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-ink flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: template.accentColor }} />
                    {template.name}
                  </p>
                  <p className="text-xs text-slate mt-0.5">{template.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
