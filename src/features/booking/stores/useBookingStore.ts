import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { BookingStatus } from '../types/bookingSchemas';

export type BookingDrawerView = 'form' | 'details';

export interface BookingStoreState {
  selectedBookingId: string | null;
  isDrawerOpen: boolean;
  drawerView: BookingDrawerView;
  filters: {
    status?: BookingStatus;
  };
  selectBooking: (bookingId: string | null, view?: BookingDrawerView) => void;
  openDrawer: (view?: BookingDrawerView) => void;
  closeDrawer: () => void;
  setStatusFilter: (status?: BookingStatus) => void;
}

export const useBookingStore = create<BookingStoreState>()(
  devtools(
    (set) => ({
      selectedBookingId: null,
      isDrawerOpen: false,
      drawerView: 'form',
      filters: {},
      selectBooking: (bookingId, view = 'details') =>
        set(() => ({
          selectedBookingId: bookingId,
          drawerView: view,
          isDrawerOpen: Boolean(bookingId),
        })),
      openDrawer: (view = 'form') =>
        set(() => ({
          isDrawerOpen: true,
          drawerView: view,
        })),
      closeDrawer: () =>
        set(() => ({
          isDrawerOpen: false,
          selectedBookingId: null,
        })),
      setStatusFilter: (status) =>
        set((state) => ({
          filters: { ...state.filters, status },
        })),
    }),
    { name: 'booking-store' },
  ),
);
