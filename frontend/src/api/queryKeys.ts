export const queryKeys = {
  cars: {
    all: ['cars'] as const,
    detail: (id: string) => ['cars', id] as const,
  },
  dealers: {
    all: ['dealers'] as const,
    detail: (id: string) => ['dealers', id] as const,
  },
  bookings: {
    all: ['bookings'] as const,
    mine: ['bookings', 'mine'] as const,
  },
  inquiries: {
    all: ['inquiries'] as const,
  },
  user: {
    me: ['user', 'me'] as const,
  },
};
