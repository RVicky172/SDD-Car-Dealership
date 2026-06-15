# DOC-12: Security Specification
**Status:** Draft  
**Owner:** Security Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-06, DOC-11  
**Blocks:** DOC-14  

## 1. API Security
- **JWT Lifespan**: Access tokens (15m), Refresh tokens (7d).
- **HTTPS**: Forced on ALB. HTTP to HTTPS redirects.
- **CORS**: Explicit allowed origins configured in FastAPI, no wildcard `*` allowed in production.
- **Rate Limiting**: Applied via `slowapi` on login and public routes.
- **Input Sanitization**: Automatically handled via Pydantic v2 schemas.
- **SQL Injection**: Prevented globally by using parameterized queries via SQLAlchemy ORM.

## 2. Infrastructure Security (AWS)
- **IAM Least Privilege**: ECS tasks run with explicit IAM Task Execution Roles limited to their required S3 buckets and SES policies.
- **Secrets**: No `.env` files in production. DB passwords and API keys loaded exclusively via AWS Secrets Manager.
- **WAF**: AWS Web Application Firewall attached to both ALB and CloudFront distributions to prevent generic layer 7 attacks.
- **Audit**: CloudTrail enabled for tracking infrastructure API calls.

## 3. Data Privacy
- **Tenancy Isolation**: RBAC ensures Dealers only have CRUD rights over listings matching their `dealer_id`.
- **Upload Validation**: S3 presigned URLs include hard limits on file types (images only) and size (<5MB).
