const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');
const { getMyOrders, updateOrderStatus } = require('../controllers/orderController');



/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order tracking and admin status control
 */

/**
 * @swagger
 * /api/orders/my-orders:
 *   get:
 *     summary: Get logged-in user's orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 */
// User route
router.get('/my-orders',protect, getMyOrders);



/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     summary: Admin update order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [processing, shipped, delivered]
 *     responses:
 *       200:
 *         description: Order status updated
 */

// Admin route
router.put('/:id/status', protect, admin, updateOrderStatus);









module.exports = router;