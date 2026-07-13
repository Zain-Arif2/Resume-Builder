import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const PasswordInput = forwardRef(function PasswordInput({ className = '', ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        ref={ref}
        type={visible ? 'text' : 'password'}
        className={`w-full px-4 py-2.5 pr-11 bg-paper border border-slate/20 rounded-xl text-ink placeholder:text-slate/50 focus:ring-2 focus:ring-amber/40 focus:border-amber outline-none transition ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate/50 hover:text-ink transition"
      >
        {visible ? <EyeOff size={17} /> : <Eye size={17} />}
      </button>
    </div>
  );
});

export default PasswordInput;
