# DOC-01: Product Requirements Document (PRD)
**Status:** Draft  
**Owner:** Product Team  
**Last Updated:** 2026-06-15  
**Depends On:** None  
**Blocks:** DOC-02  

## 1. Project Overview
A full-stack car dealership platform allowing buyers to search, view, and inquire about cars, and allowing dealers to manage their listings.

## 2. Target Roles
1. **Unauthenticated User**: Can browse the public inventory and submit inquiries.
2. **Authenticated Buyer**: Can save cars to a wishlist, manage inquiries, and book test drives.
3. **Dealer**: Can manage car listings, handle inquiries, and track analytics.
4. **Admin**: Can manage users, approve dealers, and moderate content.

## 3. Feature Specification (Product Scope)

### Public-Facing (Unauthenticated)
- **Car Inventory Listing**: Grid/list view with search, filter (make, model, year, price, fuel type, color, mileage, transmission).
- **Car Detail Page**: Full specs, image gallery, features, similar cars.
- **Advanced Search**: Full-text search with ElasticSearch-style queries.
- **Dealer Info Page**: About the dealership, location map, working hours.
- **Inquiry / Contact Form**: Send inquiry about a specific car to dealer.
- **Test Drive Booking**: Select car + pick a date/time slot.
- **Compare Cars**: Side-by-side spec comparison (up to 3 cars).
- **EMI Calculator**: Frontend-only loan calculator widget.

### Authenticated (Buyer Role)
- **User Registration / Login**: Email+password or Google OAuth via Cognito.
- **Saved/Wishlist Cars**: Bookmark cars, get notified if price drops.
- **Inquiry History**: View all past inquiries and their status.
- **Test Drive Bookings**: View/cancel upcoming test drive bookings.
- **Notification Center**: In-app + email notifications.

### Dealer Dashboard (Dealer Role)
- **Car CRUD**: Add, edit, delete car listings with bulk image upload.
- **Inquiry Management**: View, respond to, and close buyer inquiries.
- **Test Drive Management**: View scheduled test drives, mark complete.
- **Analytics Dashboard**: Views per car, inquiries, most-viewed, conversion rate.
- **Pricing Tools**: Mark featured/promoted listings.

### Admin Panel (Admin Role)
- **User Management**: View, suspend, promote users.
- **Dealer Approval**: Approve/reject dealer applications.
- **Content Moderation**: Review flagged listings.
- **System Health**: View system metrics, error rates.

## 4. Non-Functional Requirements
- **Performance**: High performance frontend delivery through CloudFront.
- **Scalability**: Ability to scale backend services automatically using ECS Fargate.
- **Security**: Data isolation per dealer, role-based access control, AWS Cognito for Identity.
