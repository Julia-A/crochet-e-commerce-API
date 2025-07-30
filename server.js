const express = require('express');
const connectDB = require('./config/db');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const swaggerSpec = require('./swagger');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoutes = require('./routes/paymentRoute');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');


const dotenv = require('dotenv');


dotenv.config();
connectDB();

const app = express();


// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());

// tell the express app to use the routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);


// Connect to the database

// Basic route for testing
app.get('/', (req, res) => {
  console.log('working');
  res.send('Working');
});



// Server listening
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});