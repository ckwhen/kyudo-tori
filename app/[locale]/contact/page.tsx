'use client';

import { useState, SubmitEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useAppToast } from '@/shared/hooks';
import { type ActionResponse } from '@/shared/utils/types';
import { ERROR_CODES } from '@/shared/utils/error-handler';
import { NOTIFICATION_CODES } from '@/shared/utils/constants';

export default function ContactPage() {
  const tContact = useTranslations('contact');
  const { showError, showNotification } = useAppToast();
  const [ formData, setFormData ] = useState({ name: '', email: '', message: '' });
  const [ status, setStatus ] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const isFormSubmitting = status === 'submitting';

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = (await res.json()) as ActionResponse<{ id: string }>

      if (result.errorCode) {
        showError(result.errorCode);
      } else {
        showNotification(NOTIFICATION_CODES.CONTACT_SUCCESS);
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (_err) {
      showError(ERROR_CODES.CONTACT_FAILED);
    } finally {
      setStatus('idle');
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-bold text-moss opacity-90 mb-1.5">
          {tContact('label_name')}
        </label>
        <input
          type="text"
          required
          disabled={isFormSubmitting}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-canvas/50 border border-zinc-200 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-moss transition-colors disabled:opacity-50"
          placeholder={tContact('placeholder_name')}
        />
      </div>

      <div>
        <label className="block font-bold text-moss opacity-90 mb-1.5">
          {tContact('label_email')}
        </label>
        <input
          type="email"
          required
          disabled={isFormSubmitting}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full bg-canvas/50 border border-zinc-200 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-moss transition-colors disabled:opacity-50"
          placeholder={tContact('placeholder_email')}
        />
      </div>

      <div>
        <label className="block font-bold text-moss opacity-90 mb-1.5">
          {tContact('label_message')}
        </label>
        <textarea
          required
          rows={4}
          disabled={isFormSubmitting}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-canvas/50 border border-zinc-200 rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-moss transition-colors resize-none disabled:opacity-50"
          placeholder={tContact('placeholder_message')}
        />
      </div>

      <button
        type="submit"
        disabled={isFormSubmitting}
        className="w-full flex items-center justify-center gap-2 rounded-md bg-moss hover:bg-[#2e3d2d] disabled:bg-zinc-200 disabled:text-zinc-400 text-sm font-semibold text-canvas py-2.5 shadow-sm transition-all active:scale-[0.98]"
      >
        {isFormSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>{tContact('btn_submitting')}</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>{tContact('btn_submit')}</span>
          </>
        )}
      </button>
    </form>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-[85vh] px-4 py-12 text-ink text-sm">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-sm p-8 shadow-md">
        <div className="gap-3 mb-6">
          <h1 className="text-lg font-bold text-ink">
            {tContact('title')}
          </h1>
          <p className="text-zinc-500 mt-0.5">
            {tContact('subtitle')}
          </p>
        </div>
        {renderForm()}
      </div>
    </div>
  );
}
