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