# DOC-10: Infrastructure Specification
**Status:** Draft  
**Owner:** DevOps/Infra Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-02  
**Blocks:** DOC-13  

## 1. Core Services (AWS)
- **Compute**: ECS Fargate for container orchestration (FastAPI + Celery).
- **Database**: RDS PostgreSQL 15 (Multi-AZ for Production).
- **Cache**: ElastiCache Redis.
- **Frontend CDN**: CloudFront + S3 bucket for React build.
- **Image Storage**: S3 bucket for car images + CloudFront CDN.

## 2. Supporting Services
- **Auth**: AWS Cognito User Pool.
- **Load Balancing**: Application Load Balancer (ALB) acting as the entry point for API traffic.
- **DNS**: Route 53.
- **Secrets Management**: AWS Secrets Manager (DB credentials, JWT secrets).
- **Email**: AWS SES.
- **Logging/Monitoring**: CloudWatch Logs & Metrics.

## 3. Terraform Module Structure
Located in `infra/modules/`:
- `vpc`: Network foundation.
- `ecs`: Fargate clusters, task definitions, autoscaling.
- `rds`: PostgreSQL instances.
- `elasticache`: Redis clusters.
- `s3-cloudfront`: SPA hosting and image CDN.
- `cognito`: Auth setup.
- `alb`: Load balancer and listeners.
- `waf`: Web Application Firewall rules.
