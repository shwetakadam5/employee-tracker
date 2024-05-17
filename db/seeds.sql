-- Inserting data into departments table
INSERT INTO departments (name) VALUES
('Admin'),
('Finance'),
('Human Resources'),
('Resource Management'),
('Marketing'),
('Research and Developement'),
('Production'),
('Sales'),
('IT');

-- Inserting data into the roles table
INSERT INTO roles (title, salary, department) VALUES
('Sales Lead', 100000, 8),
('Salesperson', 80000, 8),
('Technical Lead', 800000, 9),
('Software Engineer', 150000, 9),
('Accountant', 7000, 2),
('Scientist', 900000, 6),
('Senior Marketing Manager', 100000, 5),
('Marketing Trainee', 1000, 5),
('Marketing Manager', 50000, 5),
('Business Analyst', 990000, 9);

-- Inserting data into employees table
INSERT INTO employees (first_name, last_name, role_id) VALUES
('John', 'Doe', 1),
('Mike', 'Chan', 2), 
('Ashley', 'Rodriguez', 3), 
('Kevin', 'Tupik', 4), 
('Shiv', 'Zutshi', 7),  
('Kunal', 'Kadam', 8),
('Moriah', 'Cottonora', 9),
('Kate', 'Baxter', 10);


-- Updating the manager_id in the employees table
UPDATE employees
SET manager_id = 1
WHERE id = 2;

	
UPDATE employees
SET manager_id = 3
WHERE id = 4;
	

UPDATE employees
SET manager_id = 5
WHERE id = 6;

UPDATE employees
SET manager_id = 6
WHERE id = 7;
