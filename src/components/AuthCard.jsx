import React, { useState } from 'react';
import { Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const inputStyles =
  'w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary placeholder:text-text-muted shadow-sm transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20';
const buttonStyles =
  'inline-flex items-center justify-center rounded-box bg-primary px-4 py-2 text-sm font-semibold text-primary-content shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-surface hover:bg-primary/90';
const cardStyles =
  'rounded-3xl bg-surface-elevated/95 p-6 shadow-xl ring-1 ring-border/60 backdrop-blur';

const AuthCard = () => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', displayName: '' });
  const { login, register, loading, error } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (mode === 'login') {
      login(form.email, form.password);
    } else {
      register(form.email, form.password, form.displayName);
    }
  };

  return (
    <div className={`${cardStyles} w-full max-w-md`}>
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

      <div className="mb-6 flex rounded-full bg-surface-muted p-1 text-sm font-semibold text-text-secondary">
        <button
          onClick={() => setMode('login')}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === 'login' ? 'bg-surface text-text-primary shadow-sm' : 'hover:text-text-primary'
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setMode('register')}
          className={`flex-1 rounded-full px-4 py-2 transition ${
            mode === 'register' ? 'bg-surface text-text-primary shadow-sm' : 'hover:text-text-primary'
          }`}
        >
          Register
        </button>
      </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div>
              <label className="mb-2 block text-sm font-medium text-text-secondary">Full Name</label>
              <input
                type="text"
                required
              className={inputStyles}
              value={form.displayName}
              onChange={(event) => setForm((prev) => ({ ...prev, displayName: event.target.value }))}
              placeholder="Alex Johnson"
            />
          </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">Email address</label>
            <input
              type="email"
              required
            className={inputStyles}
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            placeholder="you@nestfinance.com"
          />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-text-secondary">Password</label>
            <input
              type="password"
              required
            minLength={6}
            className={inputStyles}
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="••••••••"
            />
          </div>
          {error && <p className="rounded-lg bg-danger/10 p-3 text-sm text-danger">{error}</p>}
          <button type="submit" className={`${buttonStyles} w-full`} disabled={loading}>
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
        </button>
      </form>
    </div>
  );
};

export default AuthCard;
