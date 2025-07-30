const Cart = require('../models/Cart');


// Add item to cart
exports.addToCart = async (req, res) => {
    const userId = req.user._id;
    const {product, quantity} = req.body;

    try {
        let cart = await Cart.findOne({user: userId});

        if(!cart) {
            // create new cart if there is no existing cart
            cart = new Cart({
                user: userId,
                items: [{product, quantity}]
            });
        } else {
            // check if the product is already in the cart
            const itemIndex = cart.items.findIndex(item => item.product.toString() === product);

            if(itemIndex > -1) {
                // update the quantity if the itemIndex is 0 and above
                cart.items[itemIndex].quantity += quantity;
            } else {
                // Add new products instead
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
        const cart = await Cart.findOne({user: req.user._id}).populate('items.product');
        if(!cart) return res.json({items: []});
        res.json(cart);
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