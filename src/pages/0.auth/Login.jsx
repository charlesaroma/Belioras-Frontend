import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '../../components/common/Button';
import AuthSplitShell from './AuthSplitShell';
import FloatingInput from './FloatingInput';
import { login } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const HERO_IMAGE = 'https://ik.imagekit.io/sbgenu6wj/Belioras/Home/model-belioras123.jpeg';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
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
    <AuthSplitShell
      heroImage={HERO_IMAGE}
      kicker="The Maison"
      title={<>Dressed in intention. <br /> Made to last.</>}
      blurb="Sign in to access your curated wardrobe, exclusive member events, and complimentary styling services."
    >
      <div className="mb-10 text-center lg:text-left">
        <h1 className="mb-3 font-display text-3xl text-espresso-700 lg:text-4xl">{t('auth.loginTitle')}</h1>
        <p className="text-sm text-espresso-400">{t('auth.loginSub')}</p>
      </div>

      <form onSubmit={submit} noValidate className="space-y-6">
        <FloatingInput
          id="email"
          label={t('auth.email')}
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(e) => { setForm({ ...form, email: e.target.value }); setError(''); }}
        />

        <FloatingInput
          id="password"
          label={t('auth.password')}
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => { setForm({ ...form, password: e.target.value }); setError(''); }}
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

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-espresso-400">
            <input type="checkbox" defaultChecked className="accent-espresso-700" />
            {t('auth.rememberLogin')}
          </label>
          <Link to="/forgot-password" className="text-xs text-espresso-400 transition-colors hover:text-gold-700">
            Forgot password?
          </Link>
        </div>

        {error && (
          <p className="rounded border border-error/30 bg-error/5 px-4 py-3 text-xs text-error" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full">
          {t('auth.login')}
        </Button>
      </form>

      <div className="mt-8 rounded border border-champagne-300 bg-champagne-50 px-4 py-3 text-[11px] leading-relaxed text-brown-700">
        Demo dashboard access — email <span className="font-mono">admin@beliora.com</span>, password{' '}
        <span className="font-mono">beliora2026</span>
      </div>

      <p className="mt-8 text-center text-sm text-espresso-400">
        {t('auth.noAccount')}{' '}
        <Link to="/signup" className="text-gold-600 underline underline-offset-4 hover:text-gold-700">
          {t('auth.signup')}
        </Link>
      </p>
    </AuthSplitShell>
  );
}
