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
	delivery_status ENUM('processing', 'dispatched') DEFAULT 'processing',
    FOREIGN KEY (order_id) REFERENCES orders(order_id),
    FOREIGN KEY (address_id) REFERENCES addresses(address_id)
);

-- Create product_types table
CREATE TABLE product_types (
    product_type_id INT AUTO_INCREMENT PRIMARY KEY,
    product_type_name VARCHAR(255) NOT NULL,
    description TEXT
);

-- Create products table
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_type_id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    product_weight INT DEFAULT 0 NOT NULL;
    stock INT NOT NULL,
    is_active BOOLEAN  DEFAULT TRUE NOT NULL;
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id)
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
    category_group_id INT NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    image_url VARCHAR(255),
    FOREIGN KEY (category_group_id) REFERENCES category_groups(category_group_id)
);

CREATE TABLE product_type_categories (
    product_type_category_id INT AUTO_INCREMENT PRIMARY KEY,
    product_type_id INT NOT NULL,
    category_group_id INT NOT NULL,
    FOREIGN KEY (product_type_id) REFERENCES product_types(product_type_id),
    FOREIGN KEY (category_group_id) REFERENCES category_groups(category_group_id)
);

CREATE VIEW customer_products AS
SELECT 
    p.product_id, 
    p.name, 
    p.description, 
    p.price, 
    p.stock, 
    p.created_at,
    p.is_active,
    pi.image_url
FROM 
    products p
LEFT JOIN 
    product_image pi ON p.product_id = pi.product_id AND pi.priority = 1
WHERE 
    p.is_active = TRUE;

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

-- Create otp table
CREATE TABLE otp (
	otp_id INT AUTO_INCREMENT PRIMARY KEY,
	customer_id INT NOT NULL,
    code_hash VARCHAR(255),
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
)
