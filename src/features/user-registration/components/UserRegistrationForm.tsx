import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useCheckUsernameMutation, useRegisterUserMutation } from '../api/userRegistrationApi';
import { userRegistrationSchema, type UserRegistrationValues, type UserRegistrationPayload } from '../types/userRegistrationSchemas';

export interface UserRegistrationFormProps {
  onSuccess?: (payload: UserRegistrationPayload) => void;
}

export const UserRegistrationForm: React.FC<UserRegistrationFormProps> = ({ onSuccess }) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<UserRegistrationValues>({
    mode: 'onBlur',
    resolver: zodResolver(userRegistrationSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      communicationPreference: 'email',
      householdSize: 2,
      securityAnswer: '',
      termsAccepted: false,
    },
  });

  const { mutateAsync: checkUsername, isPending: isCheckingUsername } = useCheckUsernameMutation();
  const { mutateAsync: registerUser, isPending: isRegistering } = useRegisterUserMutation();

  const handleUsernameBlur = useCallback(
    async (event: React.FocusEvent<HTMLInputElement>) => {
      const usernameValue = event.target.value.trim();
      if (!usernameValue) return;
      try {
        const { available } = await checkUsername(usernameValue);
        if (!available) {
          setError('username', { type: 'server', message: 'That username is already taken.' });
        } else {
          clearErrors('username');
        }
      } catch (_) {
        setError('username', { type: 'server', message: 'Unable to validate username right now.' });
      }
    },
    [checkUsername, setError, clearErrors],
  );

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const { confirmPassword, ...payload } = values;
    try {
      await registerUser(payload);
      onSuccess?.(payload);
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Something went wrong.');
    }
  });

  const disableSubmit = isSubmitting || isRegistering || isCheckingUsername;

  return (
    <form onSubmit={onSubmit} className="space-y-8 rounded-3xl border border-white/10 bg-background/80 p-6 shadow-[0_35px_100px_rgba(15,118,110,0.35)] backdrop-blur">
      <div>
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/70">User onboarding</p>
        <h2 className="font-display mt-2 text-3xl text-text-primary">Create your Nest identity</h2>
        <p className="font-sans mt-2 text-sm text-text-secondary">
          Uncontrolled inputs powered by React Hook Form keep mount time below 1.8s while still enforcing enterprise-grade validation.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="font-sans text-sm text-text-secondary">
          Username
          <input
            {...register('username')}
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="nest_partner"
            onBlur={handleUsernameBlur}
            aria-invalid={Boolean(errors.username)}
            aria-describedby={errors.username ? 'username-error' : undefined}
          />
          {errors.username ? (
            <span id="username-error" className="mt-1 block text-xs text-rose-300">
              {errors.username.message}
            </span>
          ) : (
            <span className="mt-1 block text-xs text-text-tertiary">3-24 lowercase characters, numbers, or underscores.</span>
          )}
        </label>
        <label className="font-sans text-sm text-text-secondary">
          Email
          <input
            {...register('email')}
            type="email"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="you@email.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email ? (
            <span id="email-error" className="mt-1 block text-xs text-rose-300">
              {errors.email.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="font-sans text-sm text-text-secondary">
          Password
          <input
            {...register('password')}
            type="password"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="••••••••••••"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : 'password-hint'}
          />
          {errors.password ? (
            <span id="password-error" className="mt-1 block text-xs text-rose-300">
              {errors.password.message}
            </span>
          ) : (
            <span id="password-hint" className="mt-1 block text-xs text-text-tertiary">
              12+ chars, uppercase, lowercase, number, and symbol for calm security.
            </span>
          )}
        </label>
        <label className="font-sans text-sm text-text-secondary">
          Confirm password
          <input
            {...register('confirmPassword')}
            type="password"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="Repeat password"
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? 'confirm-error' : undefined}
          />
          {errors.confirmPassword ? (
            <span id="confirm-error" className="mt-1 block text-xs text-rose-300">
              {errors.confirmPassword.message}
            </span>
          ) : null}
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="font-sans text-sm text-text-secondary">
          Communication preference
          <select
            {...register('communicationPreference')}
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
          >
            <option value="email">Email updates</option>
            <option value="sms">SMS alerts</option>
            <option value="none">No proactive outreach</option>
          </select>
        </label>
        <label className="font-sans text-sm text-text-secondary">
          Household size
          <input
            {...register('householdSize', { valueAsNumber: true })}
            type="number"
            min={1}
            max={12}
            inputMode="numeric"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            aria-invalid={Boolean(errors.householdSize)}
            aria-describedby={errors.householdSize ? 'household-error' : undefined}
          />
          {errors.householdSize ? (
            <span id="household-error" className="mt-1 block text-xs text-rose-300">
              {errors.householdSize.message}
            </span>
          ) : null}
        </label>
        <label className="font-sans text-sm text-text-secondary md:col-span-1">
          Security answer
          <input
            {...register('securityAnswer')}
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="Favorite shared ritual?"
            aria-invalid={Boolean(errors.securityAnswer)}
            aria-describedby={errors.securityAnswer ? 'security-error' : undefined}
          />
          {errors.securityAnswer ? (
            <span id="security-error" className="mt-1 block text-xs text-rose-300">
              {errors.securityAnswer.message}
            </span>
          ) : null}
        </label>
      </div>

      <label className="font-sans flex items-start gap-3 text-sm text-text-secondary">
        <input
          {...register('termsAccepted')}
          type="checkbox"
          className="mt-1 h-5 w-5 rounded border border-white/20 bg-white/5 text-emerald-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        />
        <span>
          I agree to share household finance insights with Nest.{' '}
          <span className="text-text-primary">We encrypt every field at rest and in transit.</span>
        </span>
      </label>
      {errors.termsAccepted ? (
        <p className="font-sans text-xs text-rose-300">{errors.termsAccepted.message}</p>
      ) : null}

      {serverError ? <p className="font-sans text-sm text-rose-300">{serverError}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs text-text-tertiary">
          Async username verification prevents duplicate households before you even hit submit.
        </p>
        <button
          type="submit"
          disabled={disableSubmit}
          className="font-sans rounded-2xl bg-emerald-400 px-6 py-3 text-base font-semibold text-emerald-950 transition-transform duration-200 hover:scale-[1.02] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-700/40 disabled:text-emerald-100/60"
        >
          {disableSubmit ? 'Processing...' : 'Create account'}
        </button>
      </div>
    </form>
  );
};
