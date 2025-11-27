import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { bookingFormSchema, type BookingFormValues } from '../types/bookingSchemas';

export interface BookingFormProps {
  defaultValues?: Partial<BookingFormValues>;
  onSubmit?: (values: BookingFormValues) => Promise<void> | void;
  ctaLabel?: string;
}

const defaultFormValues: BookingFormValues = {
  guestName: '',
  guestEmail: '',
  arrivalDate: '',
  nights: 1,
  rooms: 1,
  specialRequests: '',
};

export const BookingForm: React.FC<BookingFormProps> = ({ defaultValues, onSubmit, ctaLabel = 'Reserve stay' }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: { ...defaultFormValues, ...defaultValues },
  });

  const submitHandler = handleSubmit(async (values) => {
    if (onSubmit) {
      await onSubmit(values);
    }
  });

  return (
    <form onSubmit={submitHandler} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="font-sans text-sm text-text-secondary">
          Guest name
          <input
            {...register('guestName')}
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="Jordan Smith"
            aria-invalid={Boolean(errors.guestName)}
            aria-describedby="booking-guest-name-error"
          />
          {errors.guestName ? (
            <span id="booking-guest-name-error" className="mt-1 block text-xs text-rose-300">
              {errors.guestName.message}
            </span>
          ) : null}
        </label>
        <label className="font-sans text-sm text-text-secondary">
          Guest email
          <input
            {...register('guestEmail')}
            type="email"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            placeholder="jordan@email.com"
            aria-invalid={Boolean(errors.guestEmail)}
            aria-describedby="booking-guest-email-error"
          />
          {errors.guestEmail ? (
            <span id="booking-guest-email-error" className="mt-1 block text-xs text-rose-300">
              {errors.guestEmail.message}
            </span>
          ) : null}
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className="font-sans text-sm text-text-secondary">
          Arrival date
          <input
            {...register('arrivalDate')}
            type="date"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            aria-invalid={Boolean(errors.arrivalDate)}
            aria-describedby="booking-arrival-date-error"
          />
          {errors.arrivalDate ? (
            <span id="booking-arrival-date-error" className="mt-1 block text-xs text-rose-300">
              {errors.arrivalDate.message}
            </span>
          ) : null}
        </label>
        <label className="font-sans text-sm text-text-secondary">
          Nights
          <input
            {...register('nights')}
            type="number"
            min={1}
            max={30}
            inputMode="numeric"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            aria-invalid={Boolean(errors.nights)}
            aria-describedby="booking-nights-error"
          />
          {errors.nights ? (
            <span id="booking-nights-error" className="mt-1 block text-xs text-rose-300">
              {errors.nights.message}
            </span>
          ) : null}
        </label>
        <label className="font-sans text-sm text-text-secondary">
          Rooms
          <input
            {...register('rooms')}
            type="number"
            min={1}
            max={5}
            inputMode="numeric"
            className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
            aria-invalid={Boolean(errors.rooms)}
            aria-describedby="booking-rooms-error"
          />
          {errors.rooms ? (
            <span id="booking-rooms-error" className="mt-1 block text-xs text-rose-300">
              {errors.rooms.message}
            </span>
          ) : null}
        </label>
      </div>
      <label className="font-sans text-sm text-text-secondary">
        Special requests
        <textarea
          {...register('specialRequests')}
          rows={4}
          className="font-sans mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-text-primary focus:border-emerald-300/60 focus:outline-none"
          placeholder="Let us know how to tailor your stay."
          aria-invalid={Boolean(errors.specialRequests)}
          aria-describedby="booking-requests-error"
        />
        {errors.specialRequests ? (
          <span id="booking-requests-error" className="mt-1 block text-xs text-rose-300">
            {errors.specialRequests.message}
          </span>
        ) : null}
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-xs text-text-secondary">
          Secure checkout and bank-grade encryption protect your booking data.
        </p>
        <button
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="font-sans rounded-2xl bg-emerald-400 px-6 py-3 text-base font-semibold text-emerald-950 transition-transform duration-200 hover:scale-[1.02] hover:bg-emerald-300 disabled:cursor-not-allowed disabled:bg-emerald-700/40 disabled:text-emerald-100/60"
        >
          {isSubmitting ? 'Submitting...' : ctaLabel}
        </button>
      </div>
    </form>
  );
};
