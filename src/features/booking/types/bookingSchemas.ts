import { z } from 'zod';

export const bookingStatusSchema = z.enum(['pending', 'confirmed', 'canceled']);

export const bookingFormSchema = z.object({
  guestName: z.string().min(2, 'Name must include at least 2 characters'),
  guestEmail: z.string().email('Enter a valid email address'),
  arrivalDate: z.string().min(1, 'Arrival date is required'),
  nights: z.coerce.number().int().min(1, 'Stay must be at least one night').max(30, 'Stay cannot be longer than 30 nights'),
  rooms: z.coerce.number().int().min(1, 'At least one room is required').max(5, 'Maximum of 5 rooms per stay'),
  specialRequests: z
    .string()
    .max(400, 'Request is too long')
    .optional()
    .or(z.literal('')),
});

export const bookingSchema = bookingFormSchema.extend({
  id: z.string().min(1),
  status: bookingStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type BookingStatus = z.infer<typeof bookingStatusSchema>;
export type BookingFormValues = z.infer<typeof bookingFormSchema>;
export type Booking = z.infer<typeof bookingSchema>;
