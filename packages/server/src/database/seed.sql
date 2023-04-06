CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    PRIMARY KEY (id)
);

INSERT OR REPLACE INTO users VALUES
    (1, 'User 1', 'password1234'),
    (2, 'User 2', 'password1234'),
    (3, 'User 3', 'password1234')