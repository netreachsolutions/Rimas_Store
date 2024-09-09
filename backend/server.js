// server.js
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const customerRoutes = require("./routes/customerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageRoutes = require("./routes/imageRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const { errorHandler } = require("./utils/errorHandler");


const app = express();

// CORS setup
app.use(cors({
    origin: '*', // Allow requests from all origins for development; adjust for production
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.use(express.json());

// Route handlers
app.use("/api/users", customerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/image", imageRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
