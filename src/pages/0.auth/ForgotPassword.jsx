import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { requestPasswordReset } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const FIELD = 'w-full border border-ivory-700 bg-ivory-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-600 placeholder:text-espresso-200';

export default function ForgotPassword() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    requestPasswordReset(email);
    setSent(true);
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-24">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-espresso-700">{t('auth.forgotTitle')}</h1>
        <p className="mt-2 text-sm text-espresso-400">{t('auth.forgotSub')}</p>
      </div>

      {sent ? (
        <div className="border border-champagne-300 bg-champagne-50 px-5 py-4 text-center text-sm text-brown-700">
          {t('auth.resetSent')}
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-5">
          <input required type="email" placeholder={t('auth.email')} value={email} onChange={(e) => setEmail(e.target.value)} className={FIELD} />
          <Button type="submit" variant="primary" size="lg" className="w-full">{t('auth.sendLink')}</Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm">
        <Link to="/login" className="text-gold-600 underline underline-offset-4 hover:text-gold-700">{t('auth.backToLogin')}</Link>
      </p>
    </div>
  );
}
