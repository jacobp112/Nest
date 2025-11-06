import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { btn, card, input } from '../theme/styles';

// Backward-compatible AuthCard with optional control props and optional motion micro-interactions
const AuthCard = ({
  mode: controlledMode,
  setMode: setControlledMode,
  onLogin: onLoginProp,
  onRegister: onRegisterProp,
  loading: loadingProp,
  error: errorProp,
  lockMode = false,
  hideToggle = false,
  interactive = false,
} = {}) => {
  const [uncontrolledMode, setUncontrolledMode] = useState(controlledMode || 'login');
  const mode = controlledMode ?? uncontrolledMode;
  const setMode = useMemo(() => setControlledMode ?? setUncontrolledMode, [setControlledMode]);

  const { login: authLogin, register: authRegister, loading: authLoading, error: authError } = useAuth();
  const login = onLoginProp ?? authLogin;
  const register = onRegisterProp ?? authRegister;
  const loading = loadingProp ?? authLoading;
  const error = errorProp ?? authError;

  const [form, setForm] = useState({ email: '', password: '', displayName: '' });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'login') {
      login(form.email, form.password);
    } else {
      register(form.email, form.password, form.displayName);
    }
  };

  const cardClassName = card({ variant: 'elevated', padding: 'lg', className: 'w-full max-w-md' });
  const inputClassName = input({ size: 'lg' });
  const submitButtonClassName = btn({ block: true, disabled: loading, loading, className: 'glow-primary' });

  const InputComponent = interactive ? motion.input : 'input';
  const SubmitComponent = interactive ? motion.button : 'button';
  const focusMotionProps = interactive
    ? {
        whileFocus: { scale: 1.02 },
        transition: { type: 'spring', stiffness: 260, damping: 20, mass: 0.4 },
      }
    : {};
  const submitMotionProps = interactive
    ? {
        whileHover: { scale: 1.012 },
        whileTap: { scale: 0.985 },
        transition: { type: 'spring', stiffness: 230, damping: 22, mass: 0.6 },
      }
    : {};

  return (
    <div className={cardClassName}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-primary">Nest Finance</p>
          <h2 className="mt-2 text-2xl font-semibold text-text-primary">
            {mode === 'login' ? 'Welcome Back' : 'Create an account'}
          </h2>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 text-primary">
          <ShieldCheck className="h-6 w-6" />
        </div>
      </div>

      {!hideToggle && (
        <div className="mb-6 flex rounded-full bg-surface-muted p-1 text-sm font-semibold text-text-secondary">
          <button
            onClick={() => !lockMode && setMode('login')}
            className={`flex-1 rounded-full px-4 py-2 transition ${
              mode === 'login' ? 'bg-surface text-text-primary shadow-sm' : 'hover:text-text-primary'
            } ${lockMode ? 'cursor-default opacity-70' : ''}`}
            disabled={lockMode}
          >
            Login
          </button>
          <button
            onClick={() => !lockMode && setMode('register')}
            className={`flex-1 rounded-full px-4 py-2 transition ${
              mode === 'register' ? 'bg-surface text-text-primary shadow-sm' : 'hover:text-text-primary'
            } ${lockMode ? 'cursor-default opacity-70' : ''}`}
            disabled={lockMode}
          >
            Register
          </button>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">Full Name</label>
            <InputComponent
              type="text"
              required
              className={`${inputClassName} ${interactive ? 'will-change-transform' : ''}`}
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
              placeholder="Alex Johnson"
              {...focusMotionProps}
            />
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Email address</label>
          <InputComponent
            type="email"
            required
            className={`${inputClassName} ${interactive ? 'will-change-transform' : ''}`}
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@nestfinance.com"
            {...focusMotionProps}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-text-secondary">Password</label>
          <InputComponent
            type="password"
            required
            minLength={6}
            className={`${inputClassName} ${interactive ? 'will-change-transform' : ''}`}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="********"
            {...focusMotionProps}
          />
        </div>

        {error && <p className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

        <SubmitComponent type="submit" className={submitButtonClassName} disabled={loading} {...submitMotionProps}>
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Please wait...
            </span>
          ) : mode === 'login' ? (
            'Secure Login'
          ) : (
            'Create secure account'
          )}
        </SubmitComponent>
      </form>
    </div>
  );
};

export default AuthCard;

