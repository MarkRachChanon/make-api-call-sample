const express = require('express');
const router = express.Router();
const controller = require('../controllers/member.controller');

router.get('/',
  // #swagger.tags = ['Members']
  // #swagger.description = 'ดึงสมาชิกทั้งหมด (สามารถใช้ search, email, phone เพื่อค้นหา)'
  controller.getMembers
);

router.get('/:id',
  // #swagger.tags = ['Members']
  // #swagger.description = 'ดึงสมาชิกตาม ID'
  controller.getMemberById
);

router.post('/',
  // #swagger.tags = ['Members']
  // #swagger.description = 'สร้างสมาชิกใหม่'
  controller.createMember
);

router.put('/:id',
  // #swagger.tags = ['Members']
  // #swagger.description = 'แก้ไขข้อมูลสมาชิก'
  controller.updateMember
);

router.delete('/:id',
  // #swagger.tags = ['Members']
  // #swagger.description = 'ลบสมาชิก'
  controller.deleteMember
);

module.exports = router;