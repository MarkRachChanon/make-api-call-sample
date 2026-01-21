const express = require('express');
const router = express.Router();
const controller = require('../controllers/product.controller');

router.get('/',
  // #swagger.tags = ['Products']
  // #swagger.description = 'ดึงสินค้าทั้งหมด (สามารถใช้ search, category, minPrice, maxPrice, inStock เพื่อค้นหา)'
  controller.getProducts
);

router.get('/:id',
  // #swagger.tags = ['Products']
  // #swagger.description = 'ดึงสินค้าตาม ID'
  controller.getProductById
);

router.post('/',
  // #swagger.tags = ['Products']
  // #swagger.description = 'สร้างสินค้าใหม่'
  controller.createProduct
);

router.put('/:id',
  // #swagger.tags = ['Products']
  // #swagger.description = 'แก้ไขข้อมูลสินค้า'
  controller.updateProduct
);

router.delete('/:id',
  // #swagger.tags = ['Products']
  // #swagger.description = 'ลบสินค้า'
  controller.deleteProduct
);

module.exports = router;