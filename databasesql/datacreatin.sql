create database netflix ;


-- create actors table --
CREATE TABLE actors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20),
    created_at DATETIME,
    updated_at DATETIME,
    is_active TINYINT(1)
);
-- create casts table --
CREATE TABLE casts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_at DATETIME,
    updated_at DATETIME,
    actor_id INT,
    FOREIGN KEY (actor_id) REFERENCES actors(id)
);
-- create profiles  table --
CREATE TABLE profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    limits INT,
    type ENUM('KID','ADULT'),
    created_at DATETIME,
    updated_at DATETIME,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- create status table ---
CREATE TABLE status (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('COMPLETED','IN PROGRESS'),
    user_id INT,
    created_at DATETIME,
    updated_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- create users table --

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    names VARCHAR(50),
    created_at DATETIME,
    updated_at DATETIME,
    is_active TINYINT(1),
    email VARCHAR(50),
    password VARCHAR(25)
);

-- create videos table --

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100),
    description VARCHAR(100),
    created_at DATETIME,
    updated_at DATETIME,
    cast_id INT FOREIGN KEY (cast_id) REFERENCES casts(id),
    user_id INT FOREIGN KEY (user_id) REFERENCES users(id),
    is_active TINYINT(1)
);
-- create wishlists table --

CREATE TABLE watchlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    last_watch TIME,
    video_id INT FOREIGN KEY (video_id) REFERENCES videos(id),
    status_id INT FOREIGN KEY (status_id) REFERENCES status(id),
    created_at DATETIME,
    updated_at DATETIME
);
