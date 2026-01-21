const express = require('express');
const router = express.Router();
const controller = require('../controllers/order.controller');

router.get('/',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'ดึงคำสั่งซื้อทั้งหมด (สามารถใช้ status, customerName, startDate, endDate, minAmount, maxAmount เพื่อค้นหา)'
  controller.getOrders
);

router.get('/:id',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'ดึงคำสั่งซื้อตาม ID'
  controller.getOrderById
);

router.post('/',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'สร้างคำสั่งซื้อใหม่'
  controller.createOrder
);

router.put('/:id',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'แก้ไขคำสั่งซื้อ'
  controller.updateOrder
);

router.delete('/:id',
  // #swagger.tags = ['Orders']
  // #swagger.description = 'ลบคำสั่งซื้อ'
  controller.deleteOrder
);

module.exports = router;