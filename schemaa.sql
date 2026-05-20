CREATE table users(
    id varchar (50)PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    email VARCHAR(40) UNIQUE not NULL,
    password VARCHAR(60) not NULL
);