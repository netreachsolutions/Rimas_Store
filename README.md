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

* Registers via phone + password (min 6 chars).
* Optional OTP flow (`/api/users/otp`) – hashed in DB, expires after 2 min.
* JWT issued (`role = customer`), stored in `localStorage`.

### Catalogue & Cart

* Products → `products` table; images in S3.
* `GET /api/products?filters…` supports brand/price/weight filters.
* Cart stored in DB (`cart` & `cart_items`).
* Guest carts kept in `localStorage`; merged on login.

### Checkout

1. **Address** chosen / created.
2. **Payment method**

   * **Stripe** → `orders/create-intent` → confirm on client → `orders/confirm`.
   * **PayPal** → `orders/create-paypal-order` → capture → `orders/confirm-paypal` (no redirect).
3. On success `orders` + `payments` rows created; stock decremented; notifications sent.

### Notifications

* `NotificationService` emits e‑mails (SendGrid) and SMS/WhatsApp (Twilio).
* Merchant also receives custom‑order requests containing cart snapshot + customer message.

---

## 🚀  Deployment (AWS EC2)

```bash
ssh ubuntu@your‑ec2
sudo apt update && sudo apt install docker docker‑compose nginx -y
```

1. `docker compose up -d` – builds backend + nginx reverse proxy.
2. Front‑end artefacts uploaded to S3 + CloudFront for CDN delivery.
3. Use PM2 if you prefer bare‑metal Node instead of Docker.
4. MySQL scaling options:

   * Amazon RDS / Aurora for automated fail‑over.
   * Read replicas + ProxySQL for heavy read traffic.

---

## 🧪  Stress Testing

```bash
k6 run scripts/stress/cartCheckout.k6.js
```

Generates virtual users that browse catalogue, add to cart and checkout to validate 95th percentile < 300 ms.

---

## 🛠️  Admin Portal

* `/admin` route guarded by role `admin`.
* Product CRUD + post‑creation **drag‑and‑drop sorting** (stores order index).
* Order fulfilment toggles send dispatch notifications.

---

## 🤝  Contributing

1. Fork ☝️ ➜ feature branch ➜ PR.
2. Run `npm test` and `npm run lint` before committing.
3. Describe the business context in the PR template.

---

## 📜  License

MIT © Rimas Store Ltd.
