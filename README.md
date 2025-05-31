# Rimas Store – E‑commerce Platform

> **Tech stack:** Node.js · Express · MySQL · React 18 · AWS (EC2 + S3 + CloudFront) · Stripe · PayPal · Twilio / SendGrid · Tailwind CSS

A full‑stack monorepo that powers Rimas Store – a fashion e‑commerce site with UK‑first logistics, OTP‑based sign‑in, multi‑provider payments and a headless REST API.

---

## 📁 Repo Layout

```
.
├── backend/            # Express API & business logic
│   ├── controllers/
│   ├── models/         # MySQL queries (no ORM)
│   ├── services/       # payment, auth, cart, notification …
│   └── app.js          # Express bootstrap
├── frontend/           # React + Vite SPA
│   ├── src/components/
│   ├── src/pages/
│   └── src/main.jsx
├── scripts/            # DB migration & seed, stress tests (k6)
└── README.md           # you are here
```

---

## ✨  Key Features

| Domain            | Highlights                                                                      |
| ----------------- | ------------------------------------------------------------------------------- |
| **Catalogue**     | Dynamic categories, brand filters, best‑seller carousel, admin sorting UI       |
| **Cart**          | Works for guests *and* logged‑in users; merges automatically after login        |
| **Auth**          | Password + optional OTP login via SMS / email                                   |
| **Checkout**      | Stripe Payment Element (Card / Apple & Google Pay) **or** native PayPal buttons |
| **Notifications** | SendGrid e‑mails, Twilio SMS / WhatsApp to customer & merchant                  |
| **Ops**           | Docker‑ready, CI example, k6 stress‑test script, horizontal MySQL scaling notes |

---

# Database Tables Overview

![alt text](https://github.com/netreachsolutions/Rimas_Store/blob/main/Ecommerce_UML.jpeg?raw=true)


Below is a concise description of each table (and one view) in the Rimas Store schema. For each, you’ll find:

- **Purpose:** High-level role in the application.
- **Columns (Key):** Primary/foreign keys and essential fields.
- **Relationships:** How it connects to other tables.

---

## `customers`
- **Purpose:** Stores registered user accounts.
- **Key Columns:**
  - `customer_id` (PK)
  - `email` (unique, not null)
  - `first_name`, `last_name` (not null)
  - `password_hash`
  - `phone_number`
- **Relationships:**
  - 1 – ∞ with `addresses`
  - 1 – ∞ with `orders`
  - 1 – 1 (application-enforced) with `carts`
  - 1 – ∞ with `otp`

---

## `addresses`
- **Purpose:** Stores all customer postal addresses.
- **Key Columns:**
  - `address_id` (PK)
  - `customer_id` (FK → `customers.customer_id`, not null)
  - `first_line` (not null), `second_line`
  - `postcode` (not null), `city` (not null), `country` (not null)
  - `is_default` (boolean, default FALSE)
- **Relationships:**
  - ∞ – 1 → `customers`
  - 1 – ∞ with `deliveries`
  - Linked via `default_addresses` (see below)

---

## `default_addresses`
- **Purpose:** Enforces one “default” address per customer.
- **Key Columns:**
  - `default_address_id` (PK)
  - `customer_id` (FK → `customers.customer_id`)
  - `address_id` (FK → `addresses.address_id`)
- **Relationships:**
  - 1 – 1 (app logic) → `customers`
  - 1 – 1 → `addresses`

---

## `orders`
- **Purpose:** Records each placement of an order.
- **Key Columns:**
  - `order_id` (PK)
  - `customer_id` (FK → `customers.customer_id`, not null)
  - `delivery_amount` (decimal, default 0.00)
  - `total_weight` (int, default 0)
  - `created_at` (timestamp)
- **Relationships:**
  - ∞ – 1 → `customers`
  - 1 – 1 with `payments`
  - 1 – 1 with `deliveries`
  - 1 – ∞ with `order_items`

---

## `payments`
- **Purpose:** Stores payment details per order.
- **Key Columns:**
  - `payment_id` (PK)
  - `order_id` (FK → `orders.order_id`, not null)
  - `processor_id` (not null)
  - `amount` (decimal, not null)
  - `currency` (default 'GBP')
- **Relationships:**
  - 1 – 1 → `orders`

---

## `deliveries`
- **Purpose:** Tracks shipping info and status for each order.
- **Key Columns:**
  - `delivery_id` (PK)
  - `order_id` (FK → `orders.order_id`, not null)
  - `address_id` (FK → `addresses.address_id`, not null)
  - `delivery_status` (ENUM: 'processing', 'dispatched', default 'processing')
- **Relationships:**
  - 1 – 1 → `orders`
  - 1 – 1 → `addresses`

---

## `product_types`
- **Purpose:** High-level grouping of products (e.g., “T-Shirts”).
- **Key Columns:**
  - `product_type_id` (PK)
  - `product_type_name` (not null)
  - `description`
- **Relationships:**
  - 1 – ∞ with `products`
  - ∞ – ∞ via `product_type_categories` with `category_groups`

---

## `products`
- **Purpose:** Core catalog entries (e.g., “Black Cotton T-Shirt”).
- **Key Columns:**
  - `product_id` (PK)
  - `product_type_id` (FK → `product_types.product_type_id`, not null)
  - `name` (not null), `description`
  - `price` (decimal, not null)
  - `product_weight` (int, default 0)
  - `stock` (int, not null)
  - `is_active` (boolean, default TRUE)
  - `created_at` (timestamp)
- **Relationships:**
  - ∞ – 1 → `product_types`
  - 1 – ∞ with `product_image`
  - ∞ – ∞ via `product_category` with `categories`
  - ∞ – ∞ via `order_items` with `orders`
  - 1 – ∞ with `cart_items`

---

## `product_image`
- **Purpose:** Holds S3/CDN URLs for product photos.
- **Key Columns:**
  - `product_image_id` (PK)
  - `product_id` (FK → `products.product_id`, not null)
  - `image_url`
  - `priority` (int; 1 = primary thumbnail)
- **Relationships:**
  - ∞ – 1 → `products`

---

## `categories`
> _Note: `category_groups` schema not shown here._

- **Purpose:** Defines categories (e.g., “T-Shirts,” “Jackets”).
- **Key Columns:**
  - `category_id` (PK)
  - `category_group_id` (FK → `category_groups.category_group_id`, not null)
  - `category_name` (not null)
  - `description`
  - `image_url`
- **Relationships:**
  - ∞ – ∞ via `product_type_categories` with `product_types`
  - ∞ – ∞ via `product_category` with `products`

---

## `product_type_categories`
- **Purpose:** Junction table linking `product_types` to `category_groups`.
- **Key Columns:**
  - `product_type_category_id` (PK)
  - `product_type_id` (FK → `product_types.product_type_id`, not null)
  - `category_group_id` (FK → `category_groups.category_group_id`, not null)
- **Relationships:**
  - ∞ – 1 → `product_types`
  - ∞ – 1 → `category_groups`

---

## `customer_products` (VIEW)
- **Purpose:** Flattens `products` + primary `product_image` (priority = 1) for front-end queries.
- **Columns (derived):**
  - `product_id`, `name`, `description`, `price`, `stock`, `created_at`, `is_active` (from `products`)
  - `image_url` (from `product_image`)
- **Logic:**  
  - Only includes `is_active = TRUE`.  
  - Joins to `product_image` on `product_id` and `priority = 1`.

---

## `product_category`
- **Purpose:** Junction table mapping products to categories.
- **Key Columns:**
  - `product_category_id` (PK)
  - `category_id` (FK → `categories.category_id`, not null)
  - `product_id` (FK → `products.product_id`, not null)
- **Constraints:**  
  - `UNIQUE(category_id, product_id)`
- **Relationships:**
  - ∞ – 1 → `categories`
  - ∞ – 1 → `products`

---

## `order_items`
- **Purpose:** Line‐item detail for each product in an order.
- **Key Columns:**
  - `order_item_id` (PK)
  - `order_id` (FK → `orders.order_id`, not null)
  - `product_id` (FK → `products.product_id`, not null)
  - `quantity` (int, not null)
  - `price` (decimal, not null; snapshot at purchase)
- **Relationships:**
  - ∞ – 1 → `orders`
  - ∞ – 1 → `products`

---

## `carts`
- **Purpose:** Stores one active cart per customer.
- **Key Columns:**
  - `cart_id` (PK)
  - `customer_id` (FK → `customers.customer_id`, not null)
- **Relationships:**
  - 1 – ∞ with `cart_items`
  - 1 – 1 (app logic) with `customers`

---

## `cart_items`
- **Purpose:** Line items within a customer’s cart.
- **Key Columns:**
  - `cart_item_id` (PK)
  - `cart_id` (FK → `carts.cart_id`, not null, ON DELETE CASCADE)
  - `product_id` (FK → `products.product_id`, not null, ON DELETE CASCADE)
  - `quantity` (int, not null)
  - `price` (decimal, not null; snapshot when added)
- **Relationships:**
  - ∞ – 1 → `carts`
  - ∞ – 1 → `products`

---

## `otp`
- **Purpose:** Temporary storage of hashed OTP codes for login.
- **Key Columns:**
  - `otp_id` (PK)
  - `customer_id` (FK → `customers.customer_id`, not null)
  - `code_hash` (VARCHAR)
- **Relationships:**
  - ∞ – 1 → `customers`

---

### End-to-End Flow (Summary)

1. **Signup / OTP Login**  
   - Insert into `customers`.  
   - If using OTP: create `otp` row.

2. **Address Management**  
   - Add rows in `addresses`.  
   - Set `is_default = TRUE` and/or insert into `default_addresses`.

3. **Browsing & Cart**  
   - Front-end queries `customer_products` (view) to list products + main image.  
   - “Add to Cart” → create/update `carts` & `cart_items`.

4. **Checkout → Order Creation**  
   - Choose address (from `addresses`/`default_addresses`).  
   - Insert `orders` (+ `order_items` for each product).  
   - Process payment → insert `payments`.  
   - Insert `deliveries` (initial status = ‘processing’).  
   - Decrement `products.stock`.

5. **Fulfilment**  
   - Update `deliveries.delivery_status` → ‘dispatched’.  
   - Send notifications via SendGrid/Twilio.

---

> **Note on `category_groups`:**  
> Although not defined here, `category_groups` holds higher-level group names (e.g., “Men,” “Women,” “Kids”). Both `categories` and `product_type_categories` reference it.

This concise overview highlights each table’s role, key fields, and how they relate. By keeping data normalized and linking everything via foreign keys, the schema supports flexible catalog querying, robust order tracking, multi-provider payments, and UK-first logistics.


## 🖥️  Local Setup

### 1. Clone & Install

```bash
git clone https://github.com/your‑org/rimas‑store.git
cd rimas‑store
npm run install:all   # bootsraps root, backend and frontend
```

### 2. Environment Vars

Copy the samples and fill in real secrets:

```bash
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
```

| Variable                                                  | Purpose          |
| --------------------------------------------------------- | ---------------- |
| `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`                | MySQL connection |
| `JWT_SECRET`                                              | auth tokens      |
| `STRIPE_SECRET_KEY`, `PAYPAL_CLIENT_ID`                   | payments         |
| `SENDGRID_API_KEY`, `TWILIO_AUTH_TOKEN`                   | notifications    |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `S3_BUCKET` | asset storage    |

### 3. MySQL

```bash
docker compose up db   # or use local MySQL 8
npm run db:migrate     # runs scripts/mysql/schema.sql
npm run db:seed
```

### 4. Start Dev Servers

```bash
npm run dev   # concurrently: backend on :4242, frontend on :3000
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 🏗️  Business Logic Overview

### Authentication

* Registers via phone number (Unique-Identifier) and OTP verification
* JWT issued (`role = customer`), stored in `localStorage`.
* JWT token contains role type (e.g. admin) which allows for role based access to certain endpoints.

### Catalogue & Cart

* Products → `products` table; images in S3.
* `GET /api/products?filters…` supports brand/price/weight filters.
* Cart stored in DB (`cart` & `cart_items`).

### Checkout

1. **Address** chosen / created.
2. **Payment method**

   * **Stripe** → `orders/create-intent` → confirm on client → `orders/confirm`.
   * **PayPal** → `orders/create-paypal-order` → capture → `orders/confirm-paypal` (no redirect).
3. On success `orders` + `payments` rows created; stock decremented; notifications sent.

### Notifications

* `NotificationService` emits e‑mails (SendGrid) and SMS/WhatsApp (Twilio) upon each major phase of the order and delivery process.
* Merchant also receives custom‑order requests containing cart snapshot + customer message.

---

## 🚀  Deployment (AWS EC2)

```bash
ssh ubuntu@your‑ec2
```

1. `docker compose up -d` – builds backend + nginx reverse proxy.
2. Front‑end artefacts uploaded to S3 + CloudFront for CDN delivery.
3. Use PM2 if you prefer bare‑metal Node instead of Docker.
4. MySQL scaling options:

   * Amazon RDS / Aurora for automated fail‑over.
   * Read replicas + ProxySQL for heavy read traffic.

---


## 🛠️  Admin Portal

* `/admin` route guarded by role `admin`.
* Allows merchant to create new products and upload photos
* Allows merchant to view site orders and update delivery status.
* Product CRUD + post‑creation **drag‑and‑drop sorting** (stores order index).
* Order fulfilment toggles send dispatch notifications.

---

## 📜  License

MIT © Rimas Store Ltd.
