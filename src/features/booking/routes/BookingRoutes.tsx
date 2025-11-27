import React from 'react';

import { BookingForm } from '../components/BookingForm';
import { useCreateBookingMutation, useBookingsQuery } from '../api/bookingApi';
import { useBookingStore } from '../stores/useBookingStore';
import type { BookingFormValues } from '../types/bookingSchemas';

export const BookingRoutes: React.FC = () => {
  const { data: bookings = [], isPending } = useBookingsQuery();
  const { mutateAsync, isPending: isCreating } = useCreateBookingMutation();
  const { selectBooking, selectedBookingId } = useBookingStore();

  const handleSubmit = async (values: BookingFormValues) => {
    await mutateAsync(values);
  };

  return (
    <section className="py-24">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-background/70 p-6 shadow-[0_35px_100px_rgba(15,118,110,0.35)] backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/70">Live bookings</p>
                <h2 className="font-display mt-2 text-3xl text-text-primary">Upcoming arrivals</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-1 font-sans text-xs text-text-secondary">
                {bookings.length} active
              </span>
            </div>
            <ul className="mt-6 space-y-3">
              {isPending ? (
                <li className="animate-pulse rounded-2xl border border-white/5 bg-white/5 p-4 text-text-secondary">Loading bookings…</li>
              ) : bookings.length ? (
                bookings.map((booking) => (
                  <li key={booking.id}>
                    <button
                      type="button"
                      onClick={() => selectBooking(booking.id)}
                      className={`w-full rounded-2xl border px-4 py-3 text-left transition ${selectedBookingId === booking.id ? 'border-emerald-300/70 bg-emerald-400/10 text-text-primary' : 'border-white/10 bg-white/5 text-text-secondary hover:border-white/20 hover:bg-white/10'}`}
                    >
                      <p className="font-display text-xl text-text-primary">{booking.guestName}</p>
                      <p className="font-sans text-sm text-text-secondary">
                        {booking.arrivalDate} · {booking.nights} nights · {booking.rooms} rooms
                      </p>
                      <p className="font-sans text-xs uppercase tracking-[0.3em] text-emerald-100/70">{booking.status}</p>
                    </button>
                  </li>
                ))
              ) : (
                <li className="rounded-2xl border border-white/5 bg-white/5 p-4 text-text-secondary">
                  No bookings yet. Create the first experience with the form.
                </li>
              )}
            </ul>
          </div>
          <div className="rounded-3xl border border-white/10 bg-background/80 p-6 shadow-[0_35px_100px_rgba(15,118,110,0.35)] backdrop-blur">
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.35em] text-emerald-200/70">Booking intake</p>
            <h2 className="font-display mt-2 text-3xl text-text-primary">Design a new stay</h2>
            <p className="font-sans mt-2 text-sm text-text-secondary">
              Capture high-intent guests with collaborative planning that mirrors household rituals.
            </p>
            <div className="mt-8">
              <BookingForm onSubmit={handleSubmit} ctaLabel={isCreating ? 'Saving...' : 'Reserve stay'} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
