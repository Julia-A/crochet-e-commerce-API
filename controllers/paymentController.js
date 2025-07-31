const axios = require('axios');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');


// initialize a payment - Controller
const initializePayment = async (req, res) => {
    // get the user's information from the request
    const {shippingAddress} = req.body;
    const userId = req.user._id;
    const email = req.user.email;

    try {

        // Get the user's cart
        const cart = await Cart.findOne({user: userId}).populate('items.product');

        if(!cart || cart.items.length === 0) {
            return res.status(400).json({message: 'Cart is empty'});
        }

        // Prepare the order items and calculate the total price
        const orderItems = cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        }));
        const totalPrice = cart.items.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        // Initiating paystack
        // axios uses this syntax: axios.post(url, body, {headers: header information});
        // so the code below specifies these parameters first before calling on axios
        const headers = {Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json'};
        const body = {
            email,
            amount: Math.round(totalPrice * 100), // Paystack only accepts subunits of currency, in this case it's kobo 
            callback_url: 'https://crochet-e-commerce-api.onrender.com/api/payment/verify' // this is the route that paystack redirects to after the user payment
        };

        if (totalPrice <= 0) {
            return res.status(400).json({message: 'Invalid cart total'});
        }
        
        // Now we call on axios.post and assign the data sent to this constant/variable called response 
        const response = await axios.post('https://api.paystack.co/transaction/initialize', body, {headers});

        // Save order with pending (verified) payment
        const newOrder = new Order({
                user: req.user._id, // gotten from token
                orderItems,  // we get this from the frontend or store them temporarily
                totalPrice,
                paymentStatus: 'pending',
                paymentReference: response.data.data.reference,
                shippingAddress //get the address from frontend
            });

            await newOrder.save();
        
        // if successful, return with this json
        res.json({
            message:'payment initialized successfully',
            orderId: newOrder._id,
            data: response.data     // Contains authorization_url and reference
        });
    } catch (err) {
        res.status(500).json({message: err.response ? err.response.data.message : err.message});
    }
};



// verify a payment - Controller
const verifyPayment = async (req, res) => {
    // get the payment reference from the request parameter i.e...
    // paystack sends (embeds) the payment reference as a query/parameter. It attaches the reference as a parameter in the callback url by itself
    // paystack does this for you
    const reference = req.params.reference;

    try {
        // so now paystack needs you to send a get request to their api using the payment reference
        // this is still the syntax for get: axios.get(url, {headers});

        const headers = {Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`, 'Content-Type': 'application/json'};

        const response = await axios.get(`http://api.paystack.co/transaction/verify/${reference}`, {headers}); // you could also use {headers: headers} but that just looks weird, they both have the same name

        // check if the payment was successful
        const paystackData = response.data.data;
        if(paystackData.status === 'success') {
            // send the response as data
            const order = await Order.findOne({paymentReference: reference});

            if (!order) {
                return res.status(400).json({message: 'Order not found for this transaction'})
            }

            // Update paymentStatus in order and update product stock quantities
            order.paymentStatus = 'paid';
            order.status = 'processing';

            for(const item of order.orderItems) {
                const product = await Product.findById(item.product);

                if(product) {
                    product.countInStock -= item.quantity;
                    await product.save();
                }
            }
            await order.save();

            // empty user's cart
            await Cart.findOneAndDelete({user: req.user._id});


            return res.json({
                message: 'verification successful and order updated',
                order
            });
        } else {
            return res.status(400).json({message: 'Payment verification failed'})
        }

    } catch (err) {
        return res.status(500).json({message: err.response ? err.response.data.message : err.message});
    }
};


module.exports = {initializePayment, verifyPayment};