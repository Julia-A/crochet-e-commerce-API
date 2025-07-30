const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {  // Stores what user made the order
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderItems: [
            {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalPrice: {
        type: String,
        required: true
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ['pending', 'paid'],
        default: 'pending', 
    },
    paymentReference: {
        type: String,
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['processing', 'shipped', 'delivered'],
        default: 'processing'
    }
}, {timestamps: true});


module.exports = mongoose.model('Order', orderSchema);