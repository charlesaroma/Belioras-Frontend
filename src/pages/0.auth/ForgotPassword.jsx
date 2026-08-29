import { useState } from 'react';
import { Link } from 'react-router-dom';
import ArrowBack from '@mui/icons-material/ArrowBack';
import MarkEmailReadOutlined from '@mui/icons-material/MarkEmailReadOutlined';
import VpnKeyOutlined from '@mui/icons-material/VpnKeyOutlined';
import Button from '../../components/common/Button';
import AuthSplitShell from './AuthSplitShell';
import FloatingInput from './FloatingInput';
import { requestPasswordReset } from '../../services/authService';
import { useLanguage } from '../../context/LanguageContext';

const HERO_IMAGE = 'https://ik.imagekit.io/sbgenu6wj/Belioras/Home/model-belioras123.jpeg';

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
    <AuthSplitShell
      heroImage={HERO_IMAGE}
      kicker="Secure Access"
      title={<>Reset your password <br /> securely.</>}
      blurb="We'll send a secure link to your email so you can create a new password and regain access to your account."
    >
      <div className="mb-10 text-center lg:text-left">
        <h1 className="mb-3 font-display text-3xl text-espresso-700 lg:text-4xl">
          {sent ? 'Check your inbox' : t('auth.forgotTitle')}
        </h1>
        <p className="text-sm text-espresso-400">
          <Link to="/login" className="inline-flex items-center gap-1 font-medium text-gold-700 underline underline-offset-4 hover:text-espresso-700">
            <ArrowBack sx={{ fontSize: 14 }} />
            {t('auth.backToLogin')}
          </Link>
        </p>
      </div>

      {sent ? (
        <div className="rounded-2xl border border-gold-500/30 bg-champagne-50 p-6 text-center">
          <span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-gold-500 text-ivory-50">
            <MarkEmailReadOutlined aria-hidden="true" />
          </span>
          <h2 className="mb-2 font-display text-lg text-espresso-700">Email sent</h2>
          <p className="text-sm leading-relaxed text-espresso-400">
            {t('auth.resetSent')}
          </p>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-6">
          <FloatingInput
            id="email"
            label={t('auth.email')}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button type="submit" variant="primary" size="lg" className="w-full gap-2">
            <VpnKeyOutlined fontSize="small" />
            {t('auth.sendLink')}
          </Button>
        </form>
      )}
    </AuthSplitShell>
  );
}
