import { z } from 'zod';

export const passwordSchema = z
  .string()
  .min(12, 'Password must include at least 12 characters')
  .regex(/[A-Z]/, 'Password needs one uppercase letter')
  .regex(/[a-z]/, 'Password needs one lowercase letter')
  .regex(/[0-9]/, 'Password needs one number')
  .regex(/[^A-Za-z0-9]/, 'Password needs one special character');

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(24, 'Username cannot exceed 24 characters')
  .regex(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores are allowed');

export const userRegistrationSchema = z
  .object({
    username: usernameSchema,
    email: z.string().email('Enter a valid email address'),
    password: passwordSchema,
    confirmPassword: z.string(),
    communicationPreference: z.enum(['email', 'sms', 'none']),
    householdSize: z.coerce.number().int().min(1).max(12),
    securityAnswer: z.string().min(4, 'Security answer must be at least four characters'),
    termsAccepted: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms to continue' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  });

export type UserRegistrationValues = z.infer<typeof userRegistrationSchema>;
export type UserRegistrationPayload = Omit<UserRegistrationValues, 'confirmPassword'>;
