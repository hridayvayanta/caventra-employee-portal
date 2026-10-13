import React, { useState } from 'react';
import { Eye, EyeOff, UserPlus, CheckCircle2, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Department } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface RegisterFormProps {
  onBackToLogin: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onBackToLogin }) => {
  const { register } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState<Department>('Coding');
  const [position, setPosition] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters in length.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify and re-enter.');
      return;
    }

    setIsSubmitting(true);
    const result = await register({
      fullName,
      email,
      password,
      department,
      position,
    });
    setIsSubmitting(false);

    if (result.success) {
      setIsSubmitted(true);
    } else {
      setErrorMessage(result.error || 'Failed to submit registration.');
    }
  };

  if (isSubmitted) {
    return (
      <div
        className="card"
        style={{
          maxWidth: 520,
          margin: '0 auto',
          textAlign: 'center',
          padding: '40px 32px',
          borderColor: 'var(--gold-border)',
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            borderRadius: '50%',
            background: 'var(--success-bg)',
            border: '1px solid var(--success-border)',
            color: 'var(--success)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
          }}
        >
          <CheckCircle2 size={32} />
        </div>

        <h2 style={{ fontSize: 24, marginBottom: 12, color: 'var(--tx-heading)' }}>
          Registration Submitted
        </h2>

        <div
          style={{
            background: 'rgba(201, 184, 160, 0.08)',
            border: '1px solid var(--gold-border)',
            borderRadius: 'var(--radius-sm)',
            padding: '16px 20px',
            marginBottom: 24,
            textAlign: 'left',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gold)', marginBottom: 6 }}>
            <ShieldAlert size={16} />
            <strong style={{ fontSize: 13 }}>Awaiting Super-Admin Authorization</strong>
          </div>
          <p style={{ fontSize: 13, color: 'var(--tx)', margin: 0, lineHeight: 1.5 }}>
            Thank you, <strong>{fullName}</strong>. Your registration for the <strong>{department}</strong> Department has been securely logged. To safeguard proprietary company data, your account is in a pending state until a Caventra Super-Admin reviews and activates your credentials.
          </p>
        </div>

        <p style={{ fontSize: 13, color: 'var(--tx-muted)', marginBottom: 28 }}>
          Once approved, you will be able to log in with <strong>{email}</strong>.
        </p>

        <button type="button" className="btn btn-solid" onClick={onBackToLogin}>
          <ArrowLeft size={16} />
          Return to Portal Login
        </button>
      </div>
    );
  }

  return (
    <div className="card" style={{ maxWidth: 540, margin: '0 auto', padding: '36px 32px' }}>
      <div style={{ marginBottom: 24 }}>
        <button
          type="button"
          onClick={onBackToLogin}
          className="btn btn-secondary btn-xs"
          style={{ marginBottom: 16 }}
        >
          <ArrowLeft size={13} />
          Back to Login
        </button>

        <h2 style={{ fontSize: 24, color: 'var(--tx-heading)', marginBottom: 6 }}>
          Employee Registration
        </h2>
        <p style={{ fontSize: 13.5, color: 'var(--tx-muted)' }}>
          Join the Caventra team. All registrations undergo Super-Admin verification before internal portal access is granted.
        </p>
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
            lineHeight: 1.4,
          }}
          role="alert"
        >
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="reg-name">
            Full Name *
          </label>
          <input
            id="reg-name"
            type="text"
            className="form-control"
            placeholder="e.g. Alex Rivera"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-email">
            Caventra Work Email *
          </label>
          <input
            id="reg-email"
            type="email"
            className="form-control"
            placeholder="name@caventra.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="form-group">
            <label className="form-label" htmlFor="reg-dept">
              Department *
            </label>
            <select
              id="reg-dept"
              className="form-control"
              value={department}
              onChange={(e) => setDepartment(e.target.value as Department)}
              required
            >
              <option value="Coding">Coding</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-pos">
              Job Title / Position
            </label>
            <input
              id="reg-pos"
              type="text"
              className="form-control"
              placeholder="e.g. Senior Frontend Eng"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="reg-pass">
            Create Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-pass"
              type={showPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Minimum 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              style={{ paddingRight: 42 }}
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

        <div className="form-group">
          <label className="form-label" htmlFor="reg-pass2">
            Confirm Password *
          </label>
          <div style={{ position: 'relative' }}>
            <input
              id="reg-pass2"
              type={showConfirmPassword ? 'text' : 'password'}
              className="form-control"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div style={{ marginTop: 24 }}>
          <button type="submit" className="btn btn-solid" style={{ width: '100%' }} disabled={isSubmitting}>
            <UserPlus size={16} />
            {isSubmitting ? 'Registering Account…' : 'Submit Registration for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
};
