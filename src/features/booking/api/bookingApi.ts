import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { Booking, BookingFormValues } from '../types/bookingSchemas';

const BOOKING_API_BASE = '/api/booking';

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`Booking API error: ${response.status}`);
  }
  return (await response.json()) as T;
};

export const bookingQueryKeys = {
  all: ['booking'] as const,
  list: () => ['booking', 'list'] as const,
  detail: (bookingId: string) => ['booking', 'detail', bookingId] as const,
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const response = await fetch(BOOKING_API_BASE, { method: 'GET' });
  return parseResponse<Booking[]>(response);
};

export const createBooking = async (payload: BookingFormValues): Promise<Booking> => {
  const response = await fetch(BOOKING_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return parseResponse<Booking>(response);
};

export const useBookingsQuery = () =>
  useQuery({
    queryKey: bookingQueryKeys.list(),
    queryFn: fetchBookings,
  });

export const useCreateBookingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingQueryKeys.list() });
    },
  });
};
