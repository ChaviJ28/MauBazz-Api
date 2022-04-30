CREATE DATABASE maubazz;
use maubazz; 

CREATE TABLE shop(
    shop_id int NOT NULL AUTO_INCREMENT,
    brand_name VARCHAR(255),
    trade_name VARCHAR(255),
    logo_url VARCHAR(255),
    color VARCHAR(10), 
    banner_url JSON,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(shop_id)
);


CREATE TABLE product(
    product_id int NOT NULL AUTO_INCREMENT,
    title VARCHAR(255),
    descri VARCHAR(255),
    price DECIMAL(10, 2),
    on_discount BOOLEAN,
    discount DECIMAL(10, 2),
    color JSON, 
    size JSON,
    stock int,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(product_id)
);


CREATE TABLE product_shop(
    id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    shop_id int NOT NULL ,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);

CREATE TABLE product_image(
    id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    img_url MEDIUMTEXT,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(product_id)
);

CREATE TABLE category(
    cat_id int NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    PRIMARY KEY(cat_id),
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE shop_category(
    id int NOT NULL AUTO_INCREMENT,
    shop_id int,
    cat_id int,
    PRIMARY KEY(id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id),
    FOREIGN KEY (cat_id) REFERENCES category(cat_id)
);

CREATE TABLE product_category(
    id int NOT NULL AUTO_INCREMENT,
    product_id int,
    cat_id int,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (cat_id) REFERENCES category(cat_id)
);

CREATE TABLE user(
    usr_id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    pwd VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    contact JSON,
    gender VARCHAR(20),
    dob DATETIME,
    profile_url VARCHAR(255),
    card_details JSON,
    address JSON,
    PRIMARY KEY(usr_id),
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE shop_owner(
    id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    pwd VARCHAR(255),
    full_name VARCHAR(255),
    shop_id int,
    contact JSON,
    is_active BOOLEAN,
    subscription_type VARCHAR(255),
    login_count int DEFAULT 0,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (shop_id) REFERENCES shop(shop_id)
);
/*https://zinoui.com/blog/storing-passwords-securely

CREATE TABLE shop_invoices(
    id, shopid, month, sts, amt
)*/

CREATE TABLE user_admin(
    id int NOT NULL AUTO_INCREMENT,
    username VARCHAR(255),
    pwd VARCHAR(255),
    full_name VARCHAR(255),
    email VARCHAR(255),
    status BOOLEAN,
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
);

CREATE TABLE cart(
    id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    usr_id int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (usr_id) REFERENCES user(usr_id),
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE orders(
    order_id int NOT NULL AUTO_INCREMENT,
    usr_id int NOT NULL,
    price DECIMAL(10, 2),
    address JSON,
    payment_type JSON,
    paid_sts BOOLEAN,
    delivery_comment VARCHAR(255),
    delivery_sts VARCHAR(255),
    on_delivered JSON,
    PRIMARY KEY(order_id),
    FOREIGN KEY (usr_id) REFERENCES user(usr_id),
    created_on DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_on DATETIME DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE order_details(
    id int NOT NULL AUTO_INCREMENT,
    product_id int NOT NULL,
    order_id int NOT NULL,
    quantity int NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY (product_id) REFERENCES product(product_id),
    FOREIGN KEY (order_id) REFERENCES orders(order_id)
);


INSERT INTO user_admin(username, pwd, full_name, email, status) VALUES("admin", "$2b$08$qLiWOfBN6qpjF.ElfEToGOGM0Jpq.i.oB25mUHSaqG08nTjMIUefC", "Admin", "admin@maubazz.mu", true);


