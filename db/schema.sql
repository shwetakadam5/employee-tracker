DROP DATABASE IF EXISTS companies_db;
CREATE DATABASE companies_db;

\c companies_db;

-- Creating departments table

CREATE TABLE departments(
  id SERIAL PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

-- Creating roles table
CREATE TABLE roles(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department INTEGER NOT NULL,
    FOREIGN KEY (department) REFERENCES departments(id)
);

-- Creating employees table
CREATE TABLE employees(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);