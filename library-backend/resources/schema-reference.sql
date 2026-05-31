-- Optional reference schema (Hibernate ddl-auto=update creates tables automatically).

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(64) NOT NULL UNIQUE,
    email VARCHAR(120) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at DATETIME(6) NOT NULL
);

CREATE TABLE IF NOT EXISTS books (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    isbn VARCHAR(32) NOT NULL UNIQUE,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    published_year INT NULL,
    description VARCHAR(4000) NULL,
    cover_image_url VARCHAR(1024) NULL
);

CREATE TABLE IF NOT EXISTS borrow_records (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    book_id BIGINT NOT NULL,
    borrowed_at DATETIME(6) NOT NULL,
    due_date DATETIME(6) NOT NULL,
    returned_at DATETIME(6) NULL,
    fine_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT fk_borrow_user FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT fk_borrow_book FOREIGN KEY (book_id) REFERENCES books (id)
);

CREATE INDEX idx_borrow_user ON borrow_records (user_id);
CREATE INDEX idx_borrow_book ON borrow_records (book_id);
CREATE INDEX idx_borrow_active ON borrow_records (returned_at);
