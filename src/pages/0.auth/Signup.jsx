import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { signup } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const FIELD = 'w-full border border-ivory-700 bg-ivory-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-600 placeholder:text-espresso-200';

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    try {
      signup(form);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-6 py-24">
      <div className="mb-10 text-center">
        <h1 className="font-display text-3xl text-espresso-700">{t('auth.signupTitle')}</h1>
        <p className="mt-2 text-sm text-espresso-400">{t('auth.signupSub')}</p>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <input required placeholder="Full name" value={form.name} onChange={set('name')} className={FIELD} />
        <input required type="email" placeholder={t('auth.email')} value={form.email} onChange={set('email')} className={FIELD} />
        <input required type="password" placeholder={t('auth.password')} value={form.password} onChange={set('password')} className={FIELD} />
        <input required type="password" placeholder={t('auth.confirmPassword')} value={form.confirm} onChange={set('confirm')} className={FIELD} />
        {error && <p className="text-xs text-error">{error}</p>}
        <Button type="submit" variant="primary" size="lg" className="w-full">{t('auth.signup')}</Button>
      </form>

      <p className="mt-8 text-center text-sm text-espresso-400">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="text-gold-600 underline underline-offset-4 hover:text-gold-700">{t('auth.login')}</Link>
      </p>
    </div>
  );
}
