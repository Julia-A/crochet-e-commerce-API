// The logic route for product listing

const Product = require('../models/Product');



// Create a product (admin only)
exports.createProduct = async (req, res) => {
    const {name, image, description, price, countInStock} = req.body;

    try {
        const product = new Product({name, image, description, price, countInStock});

        await product.save();
        return res.status(201).json({message: 'Product created', product});
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// Update a product (admin only)
exports.updateProduct = async (req, res) => {
    const {name, image, description, price, countInStock} = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.name = name || product.name;
        product.image = image || product.image;
        product.description = description || product.description;
        product.price = price || product.price;
        product.countInStock = countInStock || product.countInStock;

        await product.save();
        return res.json({ message: 'Product updated', product });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// Delete a product (admin only)
exports.deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


// Get all products - Controller
exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({message:err.message});
    }
};



// Get a single product by ID - Controller
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(!product) {
            return res.status(404).json({message: 'Product not found'});
        }

        res.json(product);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};