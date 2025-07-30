const express = require('express');
const router = express.Router();
const {protect} = require('../middlewares/authMiddleware');
const {initializePayment, verifyPayment} = require('../controllers/paymentController');


/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Paystack integration
 */

/**
 * @swagger
 * /api/payment/initialize:
 *   post:
 *     summary: Initialize payment (creates order)
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, shippingAddress]
 *             properties:
 *               email:
 *                 type: string
 *               shippingAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment initialized
 */
// intialize payment route
router.post('/initialize', protect, initializePayment );


// Callback_url route
// router.get('/verify', (req, res) => {
//     res.send ('Payment verified and working');
// });


/**
 * @swagger
 * /api/payment/verify/{reference}:
 *   get:
 *     summary: Verify payment
 *     tags: [Payment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Payment verified and order updated
 */
// verify payment route
router.get('/verify/:reference', protect, verifyPayment);









module.exports = router;