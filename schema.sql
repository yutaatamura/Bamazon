DROP DATABASE IF EXISTS bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(30) NULL,
    department_name VARCHAR(30) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT default 0, 
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Roasted Ethiopian Organic Coffee Beans", "Food", "12.45", "34"), ("Echo Dot", "Tech", "39.99", "15"), ("Bluetooth Headphones", "Tech", "12.99", "7"), ("Vintage Suede Sneakers", "Clothing", "49.99", "7"), ("Travel-size Backpack", "Sports", "79.99", "9"), ("Bluetooth Speaker", "Tech", "24.99", "13"), ("HDTV 55-inch", "Tech", "1255.00", "4"), ("Polarized Sport Sunglasses", "Sport", "79.99", "11"), ("Wind Breaker", "Clothing", "19.99", "15"), ("DVD Bundle", "Entertainment", "15.99", "6");

