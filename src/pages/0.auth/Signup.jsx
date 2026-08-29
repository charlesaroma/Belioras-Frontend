import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '../../components/common/Button';
import AuthSplitShell from './AuthSplitShell';
import FloatingInput from './FloatingInput';
import { signup } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const HERO_IMAGE = 'https://ik.imagekit.io/sbgenu6wj/Belioras/Home/heroImageBelioras.png';

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
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
    <AuthSplitShell
      heroImage={HERO_IMAGE}
      kicker="Membership Benefits"
      title="Exclusively yours."
      blurb="Early access to new collections, complimentary personal styling, priority shipping & returns, and invitations to private events."
    >
      <div className="mb-10 text-center lg:text-left">
        <h1 className="mb-3 font-display text-3xl text-espresso-700 lg:text-4xl">{t('auth.signupTitle')}</h1>
        <p className="text-sm text-espresso-400">{t('auth.signupSub')}</p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-6">
        <FloatingInput
          id="name"
          label="Full name"
          required
          autoComplete="name"
          value={form.name}
          onChange={set('name')}
        />

        <FloatingInput
          id="email"
          label={t('auth.email')}
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => { set('email')(e); setError(''); }}
        />

        <FloatingInput
          id="password"
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => { set('password')(e); setError(''); }}
          rightSlot={
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-espresso-200 transition-colors hover:text-espresso-700"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
            </button>
          }
        />

        <FloatingInput
          id="confirm"
          label={t('auth.confirmPassword')}
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="new-password"
          value={form.confirm}
          onChange={(e) => { set('confirm')(e); setError(''); }}
        />

        {error && (
          <p className="rounded border border-error/30 bg-error/5 px-4 py-3 text-xs text-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {t('auth.signup')}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-espresso-400">
        {t('auth.hasAccount')}{' '}
        <Link to="/login" className="text-gold-600 underline underline-offset-4 hover:text-gold-700">
          {t('auth.login')}
        </Link>
      </p>
    </AuthSplitShell>
  );
}
