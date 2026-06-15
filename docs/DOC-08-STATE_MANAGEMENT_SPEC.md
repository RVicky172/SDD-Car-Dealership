# DOC-08: State Management Specification
**Status:** Draft  
**Owner:** Frontend Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-05  
**Blocks:** DOC-13  

## 1. Strategy
We split state into two distinct paradigms:
1. **Server State**: Managed by `@tanstack/react-query` (Caching, polling, background updates).
2. **Client State**: Managed by `zustand` (UI state, active filters, auth session).

## 2. React Query Key Factory
Located at `src/utils/queryKeys.ts`:
```typescript
export const queryKeys = {
  cars: {
    all: () => ['cars'],
    list: (filters: CarFilters) => ['cars', 'list', filters],
    detail: (id: string) => ['cars', 'detail', id],
    featured: () => ['cars', 'featured'],
  },
  inquiries: {
    all: () => ['inquiries'],
    list: () => ['inquiries', 'list'],
    detail: (id: string) => ['inquiries', 'detail', id],
  },
  bookings: {
    all: () => ['bookings'],
    list: () => ['bookings', 'list'],
    availability: (carId: string, date: string) => ['bookings', 'availability', carId, date],
  },
  users: {
    me: () => ['users', 'me'],
    wishlist: () => ['users', 'wishlist'],
  }
};
```

## 3. Zustand Stores

### `authStore` (`src/store/authStore.ts`)
```typescript
interface AuthState {
  user: User | null;
  role: Role | 'unauthenticated';
  accessToken: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}
```

### `filterStore` (`src/store/filterStore.ts`)
```typescript
interface FilterState {
  filters: CarFilters;
  setFilter: (key: keyof CarFilters, value: any) => void;
  clearFilters: () => void;
}
```

### `compareStore` (`src/store/compareStore.ts`)
```typescript
interface CompareState {
  selectedCarIds: string[]; // max 3
  addCar: (id: string) => void;
  removeCar: (id: string) => void;
  clear: () => void;
}
```
