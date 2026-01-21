const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// สร้างเลขที่คำสั่งซื้ออัตโนมัติ
function generateOrderNumber() {
  const timestamp = Date.now().toString();
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD${timestamp}${random}`;
}

// GET /orders - ดึงคำสั่งซื้อทั้งหมด (พร้อม Filter)
exports.getOrders = async (req, res) => {
  try {
    const { status, customerName, startDate, endDate, minAmount, maxAmount } = req.query;

    // สร้าง where condition
    const where = {};

    // Filter: สถานะคำสั่งซื้อ
    if (status) {
      where.status = status;
    }

    // Filter: ชื่อลูกค้า
    if (customerName) {
      where.customerName = { contains: customerName };
    }

    // Filter: ช่วงวันที่
    if (startDate || endDate) {
      where.orderDate = {};
      if (startDate) {
        where.orderDate.gte = new Date(startDate);
      }
      if (endDate) {
        // เพิ่ม 1 วันเพื่อให้ครอบคลุมทั้งวัน
        const end = new Date(endDate);
        end.setDate(end.getDate() + 1);
        where.orderDate.lt = end;
      }
    }

    // Filter: ช่วงยอดเงิน
    if (minAmount || maxAmount) {
      where.totalAmount = {};
      if (minAmount) {
        where.totalAmount.gte = parseFloat(minAmount);
      }
      if (maxAmount) {
        where.totalAmount.lte = parseFloat(maxAmount);
      }
    }

    const orders = await prisma.order.findMany({
      where,
      orderBy: { orderDate: 'desc' }
    });

    res.json({
      status: 'success',
      message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ',
      total: orders.length,
      filters: { status, customerName, startDate, endDate, minAmount, maxAmount },
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: { detail: 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้' }
    });
  }
};

// GET /orders/:id - ดึงคำสั่งซื้อตาม ID
exports.getOrderById = async (req, res) => {
  const orderId = parseInt(req.params.id, 10);

  if (isNaN(orderId)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID ไม่ถูกต้อง'
    });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบคำสั่งซื้อ'
      });
    }

    res.json({
      status: 'success',
      message: 'ดึงข้อมูลคำสั่งซื้อสำเร็จ',
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: { detail: 'ไม่สามารถดึงข้อมูลคำสั่งซื้อได้' }
    });
  }
};

// POST /orders - สร้างคำสั่งซื้อใหม่
exports.createOrder = async (req, res) => {
  const { customerName, email, phone, totalAmount } = req.body;

  if (!customerName || !email || totalAmount === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'ข้อมูลไม่ครบถ้วน',
      error: {
        detail: 'customerName, email และ totalAmount เป็นข้อมูลที่จำเป็น'
      }
    });
  }

  try {
    const orderNumber = generateOrderNumber();

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customerName,
        email,
        phone: phone || null,
        totalAmount: parseFloat(totalAmount),
        status: 'pending'
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'สร้างคำสั่งซื้อสำเร็จ',
      data: newOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: { detail: 'ไม่สามารถสร้างคำสั่งซื้อได้' }
    });
  }
};

// PUT /orders/:id - แก้ไขคำสั่งซื้อ
exports.updateOrder = async (req, res) => {
  const orderId = parseInt(req.params.id, 10);
  const { customerName, email, phone, totalAmount, status } = req.body;

  if (isNaN(orderId)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID ไม่ถูกต้อง'
    });
  }

  if (!customerName || !email || totalAmount === undefined) {
    return res.status(400).json({
      status: 'error',
      message: 'ข้อมูลไม่ครบถ้วน',
      error: {
        detail: 'customerName, email และ totalAmount เป็นข้อมูลที่จำเป็น'
      }
    });
  }

  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        customerName,
        email,
        phone: phone ?? null,
        totalAmount: parseFloat(totalAmount),
        status: status || undefined
      }
    });

    res.json({
      status: 'success',
      message: 'แก้ไขคำสั่งซื้อสำเร็จ',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบคำสั่งซื้อ'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: { detail: 'ไม่สามารถแก้ไขคำสั่งซื้อได้' }
    });
  }
};

// DELETE /orders/:id - ลบคำสั่งซื้อ
exports.deleteOrder = async (req, res) => {
  const orderId = parseInt(req.params.id, 10);

  if (isNaN(orderId)) {
    return res.status(400).json({
      status: 'error',
      message: 'ID ไม่ถูกต้อง'
    });
  }

  try {
    const deletedOrder = await prisma.order.delete({
      where: { id: orderId }
    });

    res.json({
      status: 'success',
      message: 'ลบคำสั่งซื้อสำเร็จ',
      data: deletedOrder
    });
  } catch (error) {
    console.error('Error deleting order:', error);

    if (error.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'ไม่พบคำสั่งซื้อ'
      });
    }

    res.status(500).json({
      status: 'error',
      message: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์',
      error: { detail: 'ไม่สามารถลบคำสั่งซื้อได้' }
    });
  }
};