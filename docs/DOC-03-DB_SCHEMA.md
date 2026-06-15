# DOC-03: Database Schema Specification
**Status:** Draft  
**Owner:** Backend Team  
**Last Updated:** 2026-06-15  
**Depends On:** DOC-02  
**Blocks:** DOC-04  

## 1. Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    users ||--o{ dealers : "1:1 or 1:0"
    users ||--o{ inquiries : makes
    users ||--o{ test_drive_bookings : books
    users ||--o{ wishlists : saves
    dealers ||--o{ cars : manages
    cars ||--o{ car_images : has
    cars ||--o{ inquiries : receives
    cars ||--o{ test_drive_bookings : scheduled_for
    cars ||--o{ wishlists : saved_in

    users {
        UUID id PK
        VARCHAR email UK
        VARCHAR full_name
        VARCHAR role
    }
    dealers {
        UUID id PK
        UUID user_id FK_UK
        VARCHAR business_name
    }
    cars {
        UUID id PK
        UUID dealer_id FK
        VARCHAR make
        VARCHAR model
    }
```

## 2. Table Definitions

### `users`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| email | VARCHAR(255) | UNIQUE, NOT NULL | |
| full_name | VARCHAR(255) | NOT NULL | |
| phone | VARCHAR(20) | | |
| role | VARCHAR(20) | NOT NULL | 'buyer' |
| cognito_id | VARCHAR(255) | UNIQUE | |
| is_active | BOOLEAN | | TRUE |
| created_at | TIMESTAMP | | NOW() |
| updated_at | TIMESTAMP | | NOW() |

### `dealers`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| user_id | UUID | UNIQUE, NOT NULL, FK(users.id) | |
| business_name | VARCHAR(255) | NOT NULL | |
| license_number| VARCHAR(100) | UNIQUE, NOT NULL | |
| description | TEXT | | |
| address | JSONB | | |
| working_hours | JSONB | | |
| is_approved | BOOLEAN | | FALSE |
| created_at | TIMESTAMP | | NOW() |

### `cars`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| dealer_id | UUID | NOT NULL, FK(dealers.id) | |
| title | VARCHAR(255) | NOT NULL | |
| make | VARCHAR(100) | NOT NULL | |
| model | VARCHAR(100) | NOT NULL | |
| variant | VARCHAR(100) | | |
| year | INTEGER | NOT NULL | |
| price | NUMERIC(12,2)| NOT NULL | |
| mileage | INTEGER | NOT NULL | |
| fuel_type | VARCHAR(50) | NOT NULL | |
| transmission | VARCHAR(50) | NOT NULL | |
| body_type | VARCHAR(50) | | |
| color | VARCHAR(50) | | |
| engine_cc | INTEGER | | |
| seats | INTEGER | | |
| description | TEXT | | |
| features | JSONB | | |
| status | VARCHAR(20) | | 'active' |
| is_featured | BOOLEAN | | FALSE |
| view_count | INTEGER | | 0 |
| created_at | TIMESTAMP | | NOW() |
| updated_at | TIMESTAMP | | NOW() |

### `car_images`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| car_id | UUID | NOT NULL, FK(cars.id) | |
| s3_key | VARCHAR(500) | NOT NULL | |
| url | VARCHAR(1000)| NOT NULL | |
| is_primary | BOOLEAN | | FALSE |
| sort_order | INTEGER | | 0 |
| created_at | TIMESTAMP | | NOW() |

### `inquiries`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| car_id | UUID | NOT NULL, FK(cars.id) | |
| user_id | UUID | FK(users.id) | |
| name | VARCHAR(255) | NOT NULL | |
| email | VARCHAR(255) | NOT NULL | |
| phone | VARCHAR(20) | | |
| message | TEXT | NOT NULL | |
| status | VARCHAR(20) | | 'pending' |
| created_at | TIMESTAMP | | NOW() |

### `test_drive_bookings`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| car_id | UUID | NOT NULL, FK(cars.id) | |
| user_id | UUID | NOT NULL, FK(users.id) | |
| booking_date | DATE | NOT NULL | |
| time_slot | VARCHAR(20) | NOT NULL | |
| status | VARCHAR(20) | | 'scheduled' |
| notes | TEXT | | |
| created_at | TIMESTAMP | | NOW() |

### `wishlists`
| Column | Type | Constraints | Default |
|---|---|---|---|
| id | UUID | PRIMARY KEY | gen_random_uuid() |
| user_id | UUID | NOT NULL, FK(users.id) | |
| car_id | UUID | NOT NULL, FK(cars.id) | |
| created_at | TIMESTAMP | | NOW() |

*Constraint: `UNIQUE(user_id, car_id)`*

## 3. Critical Indexes

- **Full-Text Search**: `cars` table will have a GIN index on `title`, `make`, and `model`.
  ```sql
  CREATE INDEX idx_cars_fulltext ON cars USING GIN (to_tsvector('english', title || ' ' || make || ' ' || model));
  ```
- **Foreign Keys**: Indexes on `dealer_id`, `car_id`, and `user_id` across relations.
- **Filters**: Indexes on `cars` for `status`, `price`, `year`, `fuel_type`, and `transmission`.
