-- Create the database
CREATE DATABASE ecommerce_v2;

-- Use the database
USE ecommerce_v2;


CREATE TABLE customers (
	customer_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    phone_number VARCHAR(12)
);

CREATE TABLE addresses (
	address_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
	first_line VARCHAR(255) NOT NULL,
    second_line VARCHAR(255),
    postcode VARCHAR(20) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

CREATE TABLE default_addresses (
    default_address_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    address_id INT NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)

);

-- Create orders table
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
	delivery_amount DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create payments table
CREATE TABLE payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    processor_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'GBP',
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


-- Create deliveries table
CREATE TABLE deliveries (
	delivery_id INT AUTO_INCREMENT PRIMARY KEY,
	order_id INT NOT NULL,
    address_id INT NOT NULL,
	delivery_status ENUM('processing', 'dispatched', 'arrived') DEFAULT 'processing',
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

-- Create products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE product_image (
	product_image_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
	image_url VARCHAR(255),
    priority INT,
	FOREIGN KEY (product_id) REFERENCES products(product_id)
);

-- Create categories table
CREATE TABLE categories (
	category_id INT AUTO_INCREMENT PRIMARY KEY,
	category_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(255)
);

-- Create product_category table
CREATE TABLE product_category (
	product_category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NOT NULL,
    product_id INT NOT NULL,
	FOREIGN KEY (category_id) REFERENCES categories(category_id),
	FOREIGN KEY (product_id) REFERENCES products(product_id),
    UNIQUE (category_id, product_id)
);

-- Create order_items table
CREATE TABLE order_items (
	order_item_id INT AUTO_INCREMENT PRIMARY KEY,
	order_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);


-- Create carts table
CREATE TABLE carts (
	cart_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
	FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);

-- Create cart_items table
CREATE TABLE cart_items (
	cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
	cart_id INT NOT NULL,
	product_id INT NOT NULL,
	quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES carts(cart_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);
