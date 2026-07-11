import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check } from 'lucide-react';

export default function ShareModal({ resume, onClose, onTogglePublic, isUpdating }) {
  const canvasRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const publicUrl = resume?.publicSlug ? `${window.location.origin}/r/${resume.publicSlug}` : null;

  useEffect(() => {
    if (publicUrl && canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, publicUrl, { width: 160, margin: 1, color: { dark: '#14171F', light: '#FFFFFF' } });
    }
  }, [publicUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-paper rounded-2xl p-6 max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate hover:text-ink transition">
          <X size={18} />
        </button>
        <h2 className="font-display text-lg font-semibold text-ink mb-1">Share this resume</h2>
        <p className="text-slate text-sm mb-5">Anyone with the link can view it, no login required.</p>
        <label className="flex items-center gap-3 mb-5 cursor-pointer">
          <input
            type="checkbox"
            checked={resume?.isPublic || false}
            onChange={(e) => onTogglePublic(e.target.checked)}
            disabled={isUpdating}
            className="w-4 h-4 accent-amber"
          />
          <span className="text-sm text-ink font-medium">Make this resume public</span>
        </label>
        {resume?.isPublic && publicUrl && (
          <div className="space-y-4">
            <div className="flex justify-center bg-paper-dim rounded-xl p-4">
              <canvas ref={canvasRef} />
            </div>
            <div className="flex items-center gap-2 bg-paper-dim border border-slate/15 rounded-lg px-3 py-2">
              <span className="text-xs text-slate truncate flex-1 font-mono">{publicUrl}</span>
              <button onClick={handleCopy} className="text-amber hover:text-amber/80 transition shrink-0">
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
