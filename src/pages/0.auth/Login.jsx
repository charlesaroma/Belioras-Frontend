import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { login } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const FIELD = 'w-full border border-ivory-700 bg-ivory-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-600 placeholder:text-espresso-200';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    try {
      const session = login(form);
      navigate(session.role === 'admin' ? '/dashboard' : '/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-24">
      <div className="mb-6 flex justify-center">
        <img src="/belioras-logo.png" alt="Belioras" className="h-20 w-auto" />
      </div>
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-espresso-700">{t('auth.loginTitle')}</h1>
        <p className="mt-2 text-sm text-espresso-400">{t('auth.loginSub')}</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <input required type="email" placeholder={t('auth.email')} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={FIELD} />
        <input required type="password" placeholder={t('auth.password')} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className={FIELD} />
        {error && <p className="text-xs text-error">{error}</p>}
        <label className="flex items-center gap-2 text-xs text-espresso-400">
          <input type="checkbox" defaultChecked className="accent-espresso-700" />
          {t('auth.rememberLogin')}
        </label>
        <Button type="submit" variant="primary" size="lg" className="w-full">{t('auth.login')}</Button>
      </form>

      <div className="mt-4 rounded border border-champagne-300 bg-champagne-50 px-4 py-3 text-[11px] leading-relaxed text-brown-700">
        Demo dashboard access — email <span className="font-mono">admin@beliora.com</span>, password <span className="font-mono">beliora2026</span>
      </div>

      <p className="mt-8 space-x-2 text-center text-sm text-espresso-400">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="text-gold-600 underline underline-offset-4 hover:text-gold-700">{t('auth.signup')}</Link>
        {' · '}
        <Link to="/forgot-password" className="text-espresso-400 underline underline-offset-4 hover:text-espresso-700">Forgot?</Link>
      </p>
    </div>
  );
}
