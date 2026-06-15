# DOC-11: Network Specification
**Status:** Draft  
**Owner:** DevOps/Infra Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-10  
**Blocks:** DOC-13  

## 1. VPC Layout
**VPC CIDR:** 10.0.0.0/16

### Subnets
- **Public Subnets** (`10.0.1.0/24`, `10.0.2.0/24`): Holds the ALB and NAT Gateways.
- **Private App Subnets** (`10.0.3.0/24`, `10.0.4.0/24`): Holds ECS Fargate Tasks (FastAPI, Celery).
- **Private DB Subnets** (`10.0.5.0/24`, `10.0.6.0/24`): Holds RDS instances and ElastiCache.

## 2. Routing Rules
- Public Subnet traffic routes to the Internet Gateway.
- Private App Subnet traffic routes to NAT Gateways to access external APIs (e.g., SES, external dependencies) while remaining hidden from direct ingress.
- Private DB Subnets do not have outward internet access.

## 3. Security Groups
| SG Name | Inbound From | Port | Purpose |
|---|---|---|---|
| `sg-alb` | `0.0.0.0/0` | 443, 80 | Public ALB ingress |
| `sg-ecs` | `sg-alb` | 8000 | Application API |
| `sg-rds` | `sg-ecs` | 5432 | PostgreSQL access |
| `sg-redis` | `sg-ecs` | 6379 | Redis access |
