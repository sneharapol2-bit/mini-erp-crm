# Placement Drive Assignment: Mini ERP + CRM Operations Portal

> **Full Stack Developer Case Study Solution**  
> A production-ready, executive-grade Operations Portal built for distribution/wholesale companies to manage Customers (CRM), Products & Inventory, Sales Delivery Challans, Stock Movement Logs, and PDF Invoice Generation.

---

## 🌟 Key Highlights & Feature Matrix

| Module | Features Implemented | Role Access |
| :--- | :--- | :--- |
| **Authentication & Roles** | Role-based permission engine (Admin, Sales, Warehouse, Accounts), live header Role Switcher tester, JWT token auth simulation. | All Roles |
| **Customer CRM** | Add/Edit Customer, search, filters by type (Retail, Wholesale, Distributor) & status (Lead, Active, Inactive), view customer details modal with complete **Follow-up Notes Timeline**. | Admin, Sales, Accounts |
| **Product & Inventory** | Add/Edit Product, SKU management, Unit price, Stock levels, Low stock alert thresholds, Warehouse rack locations, Stock IN / OUT manual adjustments with reason tracking. | Admin, Warehouse, Sales |
| **Sales Challan** | Customer selection, multi-product line items, auto-generated challan numbers (`CHN-2026-XXX`), Draft vs Confirmed saving, **Atomic Stock Reduction Logic**, negative stock prevention. | Admin, Sales, Accounts |
| **Stock Movement Log** | Audit trail recording all stock inward purchases and outward sales challans with quantity, reason, user, and timestamps. | Admin, Warehouse, Accounts |
| **PDF Invoice Export** | Instant official Sales Delivery Challan PDF export using `jsPDF` with custom styling and customer billing info. | All Roles |

---

## 🔑 Test Login Credentials Matrix

Use the header **ROLE TESTER** bar to switch instantly, or log in with the following demo credentials:

| Role | User Name | Email | Permissions & Privileges |
| :--- | :--- | :--- | :--- |
| **Admin** | Rajesh Kumar | `admin@company.com` | Full administrative control across all modules, stock adjustments, & challan confirmations. |
| **Sales** | Priya Sharma | `priya.sales@company.com` | Customer CRM management, post follow-up notes, create & confirm sales challans. |
| **Warehouse** | Vikram Singh | `vikram.wh@company.com` | Catalog management, stock IN / OUT adjustments, rack locations, and audit logs. |
| **Accounts** | Ananya Roy | `ananya.acc@company.com` | Customer billing accounts, GST details audit, challan revenue review, and PDF invoice downloads. |

---

## 🚀 Quick Start Guide (Local Development)

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 2. Frontend Web Application Setup
```bash
# Navigate to project directory
cd mini-erp-crm

# Install dependencies
npm install

# Launch Vite development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 3. Companion Express REST API Backend Setup
```bash
# Navigate to server directory
cd server

# Install server dependencies
npm install

# Start Express development server
npm run dev
```
Backend REST API will run on `http://localhost:5000/api`.

---

## 🐳 Docker Containerized Deployment

Deploy both frontend & backend with a single command:

```bash
# Build and run Docker containers
docker-compose up --build -d
```
Access the application at `http://localhost:3000`.

---

## 📬 Postman API Collection Testing

Import `postman_collection.json` into Postman to test REST endpoints:
- `POST /api/auth/login` (Generate JWT Token)
- `GET /api/customers?type=Wholesale` (Filter CRM Customers)
- `POST /api/customers` (Add new Customer)
- `GET /api/products` (List Catalog & Stock Levels)
- `POST /api/challans` (Create Confirmed Challan & Deduct Inventory)

---

## 🛡️ Important Business Logic Validation

1. **Stock Deduction Rule**: When a Sales Challan status transitions to **Confirmed**, the system automatically validates inventory for each line item. If requested quantity exceeds available stock, the operation fails with a clear error:
   `"Insufficient stock for product X. Available: 5, Requested: 15"`.
2. **Snapshot Preservation**: Confirmed challans store item price and title snapshots so subsequent catalog edits never alter historical sales records.
3. **Auditability**: Every stock change (manual adjustment or challan issue) automatically logs an entry in the **Stock Movement Logs**.

---

## 🏆 Bonus Points Implemented
- [x] Dockerfile & Docker Compose configuration
- [x] Export Sales Delivery Challan as PDF Invoice
- [x] Postman API Collection
- [x] Dark / Light theme toggle & responsive modern UI
- [x] Live Evaluator Role Switcher bar
