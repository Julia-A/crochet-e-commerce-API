// The routes for the products
const {getProducts, getProductById, createProduct, updateProduct, deleteProduct} = require('../controllers/productController');
const express = require('express');
const router = express.Router();
// const Product = require('../models/Product');

const {protect} = require('../middlewares/authMiddleware');
const {admin} = require('../middlewares/adminMiddleware');




/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product listing and admin management
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 */

// Get all products route
router.get('/', getProducts);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product found
 *       404:
 *         description: Product not found
 */
// Get all products by ID route
router.get('/:id', getProductById);




// Admin Only Operations

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create new product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, image, description, price, countInStock]
 *             properties:
 *               name:
 *                 type: string
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               countInStock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 */
router.post('/', protect, admin, createProduct);


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *               description:
 *                 type: string
 *               countInStock:
 *                 type: number
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', protect, admin, updateProduct);


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', protect, admin, deleteProduct);



// Add a product
// router.post('/add', async (req, res) => {
//     try {
//         const product = new Product(req.body);
//         await product.save();
//         res.status(201).json({message: 'Product added', product});
//     } catch (err) {
//         res.status(400).json({message: `Error adding product: ${err.message}`})
//     }
// });




module.exports = router;