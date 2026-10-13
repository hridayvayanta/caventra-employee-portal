import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck, KeyRound, HelpCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { RegisterForm } from './RegisterForm';

export const LoginPage: React.FC = () => {
  const { login, isDemoMode } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email || !password) {
      setErrorMessage('Please provide both your work email and password.');
      return;
    }

    setIsLoading(true);
    const result = await login(email, password);
    setIsLoading(false);

    if (!result.success) {
      setErrorMessage(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Caventra2026!');
    setErrorMessage('');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '36px 20px',
        position: 'relative',
      }}
    >
      {/* Background radial accent glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(700px, 90vw)',
          height: 380,
          background: 'radial-gradient(circle, rgba(201, 184, 160, 0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div style={{ width: '100%', maxWidth: 540, position: 'relative', zIndex: 1 }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-block', marginBottom: 16 }}>
            <img
              src="./assets/logo.png"
              alt="Caventra — Ideas to Impact"
              style={{
                width: 'min(280px, 70vw)',
                height: 'auto',
                margin: '0 auto',
                display: 'block',
                filter: 'drop-shadow(0 4px 20px rgba(201, 184, 160, 0.15))',
              }}
              onError={(e) => {
                // In case logo path needs relative fallback
                const target = e.target as HTMLImageElement;
                if (!target.src.includes('logo-nav.png')) {
                  target.src = './assets/logo-nav.png';
                }
              }}
            />
          </div>

          <h1
            style={{
              fontSize: 'clamp(22px, 3.5vw, 28px)',
              letterSpacing: '-0.02em',
              color: 'var(--tx-heading)',
              marginBottom: 6,
            }}
          >
            Employee Management Portal
          </h1>
          <p style={{ fontSize: 14, color: 'var(--tx-muted)', letterSpacing: '0.04em' }}>
            Ideas to Impact — Internal Operations &amp; Team Workspaces
          </p>
        </div>

        {isRegistering ? (
          <RegisterForm onBackToLogin={() => setIsRegistering(false)} />
        ) : (
          <div className="card" style={{ padding: '36px 32px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 24,
                paddingBottom: 16,
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div>
                <h2 style={{ fontSize: 20, color: 'var(--tx-heading)', marginBottom: 4 }}>
                  Authentication
                </h2>
                <span style={{ fontSize: 13, color: 'var(--tx-muted)' }}>
                  Sign in with your Caventra organizational email
                </span>
              </div>
              <ShieldCheck size={24} color="var(--gold)" />
            </div>

            {errorMessage && (
              <div
                style={{
                  background: 'var(--danger-bg)',
                  border: '1px solid var(--danger-border)',
                  color: 'var(--danger)',
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 13,
                  marginBottom: 20,
                  lineHeight: 1.45,
                }}
                role="alert"
              >
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">
                  Work Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-email"
                    type="email"
                    className="form-control"
                    placeholder="e.g. hriday@caventra.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    style={{ paddingLeft: 40 }}
                  />
                  <Mail
                    size={16}
                    color="var(--tx-muted)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label" htmlFor="login-pass">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--gold)',
                      fontSize: 12,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Forgot password?
                  </button>
                </div>
                <div style={{ position: 'relative' }}>
                  <input
                    id="login-pass"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter your account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ paddingLeft: 40, paddingRight: 40 }}
                  />
                  <Lock
                    size={16}
                    color="var(--tx-muted)"
                    style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: 12,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--tx-muted)',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ marginTop: 24 }}>
                <button type="submit" className="btn btn-solid" style={{ width: '100%' }} disabled={isLoading}>
                  {isLoading ? 'Authenticating…' : 'Sign In to Workspace'}
                  <ArrowRight size={16} />
                </button>
              </div>
            </form>

            {/* Registration Switcher */}
            <div
              style={{
                marginTop: 24,
                paddingTop: 18,
                borderTop: '1px solid var(--line)',
                textAlign: 'center',
                fontSize: 13,
                color: 'var(--tx-muted)',
              }}
            >
              Don't have an approved account?{' '}
              <button
                type="button"
                onClick={() => setIsRegistering(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--gold-light)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  textDecoration: 'underline',
                  textUnderlineOffset: 3,
                }}
              >
                Register for Employee Access
              </button>
            </div>

            {/* Demo Quick Logins Helper */}
            {isDemoMode && (
              <div
                style={{
                  marginTop: 24,
                  padding: '14px 16px',
                  background: 'rgba(201, 184, 160, 0.04)',
                  border: '1px dashed var(--gold-border)',
                  borderRadius: 'var(--radius-sm)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    color: 'var(--gold)',
                    fontSize: 12,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  <KeyRound size={13} />
                  <span>DEMO EVALUATION QUICK-FILL</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 6 }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleQuickFill('hriday@caventra.com')}
                  >
                    👑 Hriday (Founder)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleQuickFill('ved@caventra.com')}
                  >
                    👑 Ved (Founder)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleQuickFill('sauran@caventra.com')}
                  >
                    👑 Sauran (Founder)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleQuickFill('alex.rivera@caventra.com')}
                  >
                    💻 Coding (Alex R.)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleQuickFill('sarah.chen@caventra.com')}
                  >
                    📈 Sales (Sarah C.)
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-xs"
                    onClick={() => handleQuickFill('maya.lin@caventra.com')}
                  >
                    👥 HR (Maya L.)
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 12, color: 'var(--tx-muted)' }}>
          <span>© {new Date().getFullYear()} Caventra · Ideas to Impact. All rights reserved.</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="modal-overlay" onClick={() => setShowForgotModal(false)}>
          <div
            className="modal-dialog"
            style={{ maxWidth: 440 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-title"
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <HelpCircle size={18} color="var(--gold)" />
                <h3 id="forgot-title" style={{ fontSize: 16 }}>
                  Password Recovery
                </h3>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--tx-muted)',
                  cursor: 'pointer',
                  padding: 4,
                }}
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 13.5, color: 'var(--tx)', lineHeight: 1.6, marginBottom: 14 }}>
                For security compliance within the Caventra internal network, automated public password resets are managed through Caventra's central identity provider.
              </p>
              <div
                style={{
                  background: 'var(--bg-input)',
                  border: '1px solid var(--line)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 12,
                  fontSize: 12.5,
                  color: 'var(--tx-muted)',
                }}
              >
                Please contact your department director or email <strong>caventraofficial@gmail.com</strong> with your employee ID to request an identity verification token.
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setShowForgotModal(false)}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
