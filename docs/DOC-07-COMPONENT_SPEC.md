# DOC-07: Frontend Component Specification
**Status:** Draft  
**Owner:** Frontend Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-02  
**Blocks:** DOC-13  

## 1. Component Architecture
The React application (`frontend/src/components`) utilizes atomic-style design, heavily leveraging `shadcn/ui` for primitive, accessible components, overlaid with Tailwind CSS.

## 2. Directory Structure
- **`/common`**: Reusable primitives (`Button`, `Input`, `Modal`, `Pagination`, `Badge`, `Spinner`, `Toast`).
- **`/layout`**: Shell components (`Navbar`, `Footer`, `Sidebar`, `PageWrapper`).
- **`/cars`**: Domain-specific UI (`CarCard`, `CarGrid`, `CarFilter`, `CarImageGallery`, `CarSpecs`, `CarCompareDrawer`, `EMICalculator`).
- **`/inquiry`**: Forms and lists (`InquiryForm`, `InquiryCard`).
- **`/booking`**: Test drive widgets (`BookingCalendar`, `BookingConfirmation`).
- **`/dealer`**: Dashboard components (`DealerCard`, `DealerAnalytics`).

## 3. Prop Interfaces (Examples)
### CarCard
```typescript
interface CarCardProps {
  car: Car;
  viewMode: 'grid' | 'list';
  onWishlistToggle?: (carId: string) => void;
  showDealer?: boolean;
}
```

### CarFilter
```typescript
interface CarFilterProps {
  initialFilters: CarFilters;
  onFilterChange: (filters: CarFilters) => void;
  availableOptions: FilterOptions; // { makes: string[], years: number[], etc. }
}
```
