import { useMutation } from '@tanstack/react-query';

import type { UserRegistrationPayload } from '../types/userRegistrationSchemas';

const USER_API_BASE = '/api/users';

const parseJson = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error('Unable to process request');
  }
  return (await response.json()) as T;
};

export interface UsernameAvailabilityResponse {
  available: boolean;
}

export const checkUsernameAvailability = async (username: string): Promise<UsernameAvailabilityResponse> => {
  const response = await fetch(`${USER_API_BASE}/check-username?username=${encodeURIComponent(username)}`);
  return parseJson<UsernameAvailabilityResponse>(response);
};

export const registerUser = async (payload: UserRegistrationPayload): Promise<void> => {
  const response = await fetch(`${USER_API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  await parseJson(response);
};

export const useCheckUsernameMutation = () =>
  useMutation({
    mutationFn: checkUsernameAvailability,
  });

export const useRegisterUserMutation = () =>
  useMutation({
    mutationFn: registerUser,
  });
