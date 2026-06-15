# DOC-09: Routes Specification
**Status:** Draft  
**Owner:** Frontend Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-06  
**Blocks:** DOC-13  

## 1. Public Routes (No Auth Required)
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Landing page, hero search, featured cars |
| `/cars` | `CarListing` | Car search and filter interface |
| `/cars/:id` | `CarDetail` | Single car view, images, specs |
| `/cars/compare` | `Compare` | Side-by-side specs view |
| `/login` | `Auth/Login` | Authentication |
| `/register` | `Auth/Register` | Account creation |

## 2. Authenticated Routes (Role: Buyer, Dealer, Admin)
Requires `<ProtectedRoute>` wrapping.
| Path | Component | Description |
|---|---|---|
| `/profile` | `Profile` | Dashboard for standard users |
| `/profile/wishlist` | `Profile/Wishlist` | Saved cars |
| `/profile/inquiries` | `Profile/Inquiries` | Past messages |
| `/profile/bookings` | `Profile/Bookings` | Test drive schedules |

## 3. Dealer Routes (Role: Dealer)
Requires `<ProtectedRoute allowedRoles={['dealer']}>`.
| Path | Component | Description |
|---|---|---|
| `/dealer/dashboard` | `DealerDashboard` | Overview metrics |
| `/dealer/dashboard/cars` | `ManageCars` | CRUD interface for listings |
| `/dealer/dashboard/cars/new` | `ManageCars/New` | Add car form |
| `/dealer/dashboard/cars/:id/edit` | `ManageCars/Edit` | Edit car form |
| `/dealer/dashboard/inquiries` | `ManageInquiries` | Respond to buyers |
| `/dealer/dashboard/bookings` | `ManageBookings` | View scheduled drives |

## 4. Admin Routes (Role: Admin)
Requires `<ProtectedRoute allowedRoles={['admin']}>`.
| Path | Component | Description |
|---|---|---|
| `/admin/users` | `Admin/Users` | User moderation |
| `/admin/dealers` | `Admin/Dealers` | Dealer approval queue |
