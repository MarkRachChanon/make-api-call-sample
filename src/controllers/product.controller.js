const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /products - พร้อม Filter
exports.getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, inStock } = req.query;
    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    if (category) {
      where.category = { contains: category };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }

    if (inStock === 'true') {
      where.stock = { gt: 0 };
    }

    where.isActive = true;

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({
      status: 'success',
      message: 'ดึงข้อมูลสินค้าสำเร็จ',
      total: products.length,
      filters: { search, category, minPrice, maxPrice, inStock },
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: { detail: 'ไม่สามารถดึงข้อมูลสินค้าได้' }
    });
  }
};

// GET, POST, PUT, DELETE (เหมือน member.controller.js)