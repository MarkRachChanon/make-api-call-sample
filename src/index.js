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

// CORS configuration
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

// Root endpoint (Optoinal)
app.get('/', (req, res) => {
  res.json({
    message: 'Member Management API',
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