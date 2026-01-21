# เพิ่ม Resources และ Filter ใน Backend API

## 📋 ภาพรวม

เอกสารนี้สรุปการเพิ่ม 2 Resources ใหม่ (Products, Orders)

---

## Resources ทั้งหมดในระบบ

| # | Resource | คำอธิบาย | Endpoints |
|---|----------|----------|-----------|
| 1 | **Members** | ข้อมูลสมาชิก | 5 endpoints |
| 2 | **Products** | ข้อมูลสินค้า | 5 endpoints |
| 3 | **Orders** | คำสั่งซื้อ | 5 endpoints |

**รวม: 15 Endpoints**

---

## ขั้นตอนที่ 1: แก้ไข Prisma Schema

แก้ไขไฟล์ `prisma/schema.prisma` เพิ่ม 2 Models ใหม่:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

// Model เดิม
model Member {
  id        Int      @id @default(autoincrement())
  firstName String   @map("first_name")
  lastName  String   @map("last_name")
  email     String   @unique
  phone     String?
  address   String?  @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("members")
}

// Model ใหม่ที่ 1: Products
model Product {
  id          Int      @id @default(autoincrement())
  name        String
  description String?  @db.Text
  price       Float
  stock       Int      @default(0)
  category    String?
  imageUrl    String?  @map("image_url")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("products")
}

// Model ใหม่ที่ 2: Orders
model Order {
  id          Int      @id @default(autoincrement())
  orderNumber String   @unique @map("order_number")
  customerName String  @map("customer_name")
  email       String
  phone       String?
  totalAmount Float    @map("total_amount")
  status      String   @default("pending")
  orderDate   DateTime @default(now()) @map("order_date")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("orders")
}
```

---

## ขั้นตอนที่ 2: รัน Migration

```bash
npx prisma migrate dev --name add_products_orders
```

คำสั่งนี้จะ:
- สร้างตาราง `products` และ `orders` ในฐานข้อมูล
- Generate Prisma Client ใหม่

## ขั้นตอนที่ 3: แก้ไข src/index.js

เพิ่ม Routes ใหม่และ CORS:

ติดตั้ง CORS Package

```bash
npm install cors
```

เพิ่ม Routes

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger-output.json');
const memberRoutes = require('./routes/member.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (สำหรับ React Frontend)
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Routes
app.use('/members', memberRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Member Management API',
    version: '1.0.0',
    endpoints: {
      documentation: `http://localhost:${PORT}/api-docs`,
      members: `http://localhost:${PORT}/members`,
      products: `http://localhost:${PORT}/products`,
      orders: `http://localhost:${PORT}/orders`
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'ไม่พบเส้นทาง API ที่ร้องขอ'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/api-docs`);
  console.log(`👥 Members API: http://localhost:${PORT}/members`);
  console.log(`📦 Products API: http://localhost:${PORT}/products`);
  console.log(`🛒 Orders API: http://localhost:${PORT}/orders`);
  console.log('='.repeat(50));
});
```

---

## ขั้นตอนที่ 6: รันและทดสอบ

```bash
# Generate Swagger
npm run swagger

# Start Server
npm start
```