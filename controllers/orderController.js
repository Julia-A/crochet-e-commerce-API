const Order = require('../models/Order');

// Get orders for logged-in user
exports.getMyOrders = async(req, res) => {
    try {
        const orders = await Order.find({user: req.user._id}).sort({createdAt: -1});
        res.json(orders);
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};


// update order status (for admins alone)
exports.updateOrderStatus = async (req, res) => {
    const {status} = req.body;

    try {
        const order = await Order.findById(req.params.id);

        if(!order) {
            return res.status(404).json({message: 'Order not found'});
        }

        order.status = status;
        await order.save();
        

        res.json({message: 'Order status updated', order});
    } catch (err) {
        res.status(500).json({message: err.message});
    }
};