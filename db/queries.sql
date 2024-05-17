-- Query to fetch all the employees and its details
SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,e.manager_id,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
JOIN roles r ON e.role_id = r.id
JOIN departments d ON r.department = d.id
LEFT JOIN employees e2 ON e.manager_id = e2.id;

-- Query to fetch all the roles and its details
SELECT r.id, r.title, d.name AS department, r.salary FROM roles r
JOIN departments d ON r.department = d.id;

-- Query to fetch all the deparments and its details
SELECT * FROM departments d; 

-- Query to fetch all the roles to display in the inquirer prompt
SELECT r.id AS value, r.title AS name FROM roles r

-- Query to fetch all the employees to display in the inquirer prompt
SELECT e.id AS value, CONCAT(e.first_name,' ',e.last_name) AS name FROM employees e

-- Query to fetch all the departments to display in the inquirer prompt
SELECT d.id AS value, d.name FROM departments d

-- Query to fetch all the employees assigned to the manager
SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
                JOIN roles r ON e.role_id = r.id
                JOIN departments d ON r.department = d.id
                LEFT JOIN employees e2 ON e.manager_id = e2.id
                WHERE e.manager_id = $1

-- Query to fetch all the employees assigned to the department
SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
                JOIN roles r ON e.role_id = r.id
                JOIN departments d ON r.department = d.id
                LEFT JOIN employees e2 ON e.manager_id = e2.id
                WHERE d.id = $1

-- Query to total utilized budget of the department.
SELECT d.id, d.name AS Department, COUNT(e.id) AS Total_Num_Of_Employees, SUM(r.salary) AS Total_Utilized_Budget_OfDepartment FROM employees e
                JOIN roles r ON e.role_id = r.id
                RIGHT JOIN departments d ON r.department = d.id 
                WHERE d.id = $1
                GROUP BY d.id


-- Insert query for add employee
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)
                
-- Insert query for add department
INSERT INTO departments (name) VALUES ($1)
                
-- Insert query for add role
INSERT INTO roles (title, salary, department) VALUES ($1,$2,$3)

-- Update query for updating role of the employee
UPDATE employees SET role_id = $1 WHERE id = $2

-- Update query for updating rmanager of the employee
UPDATE employees SET manager_id = $1 WHERE id = $2

--Delete query for department
DELETE FROM departments d WHERE d.id =$1

--Delete query for role
DELETE FROM roles r WHERE r.id =$1

--Delete query for employee
DELETE FROM employees e WHERE e.id =$1