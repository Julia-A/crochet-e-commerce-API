const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');


// Add item to cart
exports.addToCart = async (req, res) => {
    const userId = req.user._id;
    const {product, quantity} = req.body;

    try {
        // Validate that the quantity is at least 1
        if(!quantity || quantity < 1) {
            return res.status(400).json({message: 'Quantity must be at least 1'});
        }

        // Validate the product ID format
        if(!mongoose.Types.ObjectId.isValid(product)) {
            return res.status(400).json({message: 'Invalid product ID format for mongoose'})
        }

        // Check if the product being added exists
        const existingProduct = await Product.findById(product);
        if(!existingProduct) {
            return res.status(404).json({message: 'Product not found'});
        }

        // check if the quantity added exceeds the stock
        if(quantity > existingProduct.countInStock) {
            return res.status(400).json({
                message: `Only ${existingProduct.countInStock} item(s) left in stock`
            });
        }

        // Find or create the user's cart
        let cart = await Cart.findOne({user: userId});

        if(!cart) {
            // create new cart if there is no existing cart
            cart = new Cart({
                user: userId,
                items: [{product, quantity}]
            });
        } else {
            // check if the productId is already in the cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

            if(itemIndex > -1) {
                // update the quantity if the itemIndex is 0 and above
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new productIds instead
                cart.items.push({product, quantity});
            }
        }

        await cart.save();
         
        return res.json(cart);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};



// Get user cart
exports.getCart = async(req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.json({ items: [], totalPrice: 0 });
        }

        const totalPrice = cart.items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        res.json({
            items: cart.items,
            totalPrice
        });
    } catch (err) {
        return res.status(500).json({message: err.message});
    }
};


// Remove item from cart
exports.removeFromCart = async(req, res) => {
    const productId = req.params.productId;

    try {
        const cart = await Cart.findOne({user: req.user._id});

        if(!cart) return res.status(404).json({message: 'Cart not found'});

        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        return res.json(cart);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}