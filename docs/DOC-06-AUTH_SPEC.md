# DOC-06: Authentication & Authorization Specification
**Status:** Draft  
**Owner:** Security/Backend Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-02, DOC-05  
**Blocks:** DOC-07, DOC-09  

## 1. Auth Architecture
The platform uses **Stateless JWTs** managed and verified by the FastAPI backend, with **AWS Cognito** serving as the Identity Provider (IdP) for User Pools and OAuth (Google).

## 2. JWT Flow (Login)
1. User provides email/password or authenticates via Google OAuth.
2. Frontend sends credentials/tokens to the `/v1/auth/login` endpoint (or Cognito returns token to frontend, which passes it to backend for registration/login).
3. Backend verifies credentials via Cognito.
4. Backend issues its own application-specific JWTs:
   - **Access Token**: Short-lived (15 minutes). Contains `user_id` and `role`.
   - **Refresh Token**: Long-lived (7 days). Stored in HTTP-only cookie or secure frontend storage, mapped to the user session.

## 3. Role-Based Access Control (RBAC)
There are 4 distinct roles encoded in the JWT `role` claim:
- **`unauthenticated`**: No token. Can access public inventory (`GET /v1/cars`) and submit inquiries (`POST /v1/inquiries`).
- **`buyer`**: Standard authenticated user. Can access their own profile (`GET /v1/users/me`) and manage their test drive bookings (`POST /v1/bookings`).
- **`dealer`**: Dealership account. Can manage car listings (`POST /v1/cars`), view inquiries for their cars (`GET /v1/inquiries`), and manage their dealership profile.
- **`admin`**: Superuser. Can access administrative endpoints (`GET /v1/admin/*`), manage users, and approve or reject dealer applications.

## 4. Auth Endpoint Security
- **Rate Limiting**: Strictly enforced on all `/v1/auth/*` routes (e.g., maximum 5 requests per minute per IP for login/register) to prevent brute force attacks.
- **Password Policies**: Enforced by Cognito (minimum 8 characters, requiring numbers, uppercase letters, and special characters).
- **Password Reset**: Flows utilize email OTPs processed securely via AWS Cognito.

## 5. Security Dependencies
- FastAPI dependency `Depends(get_current_user)` checks token validity.
- FastAPI dependency `Depends(RoleChecker(['dealer', 'admin']))` enforces strict RBAC based on the role payload found in the verified token.
