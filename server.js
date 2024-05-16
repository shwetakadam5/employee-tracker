require("dotenv").config();

// Included packages needed for this application
const inquirer = require("inquirer");
const { Pool } = require('pg');
const { AsciiTable3 } = require('ascii-table3');

class EmployeeManager {

    constructor() { };

    run() {
        // Connect to database
        const pool = new Pool(
            {
                // Enter PostgreSQL username
                user: process.env.DB_USER,
                // Enter PostgreSQL password
                password: process.env.DB_PASSWORD,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME
            },
            console.log(`Connected to the ${process.env.DB_NAME}database!`)
        )
        // Created an array of questions for user input
        const questions = [
            [ "list", "options", "What would you like to do?", "", "", [ "View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Update Employee Manager", "View Employees By Manager", "View Employees By Department", "View Total Utilized Budget Of A Department", "Quit" ] ],
            [ "input", "employeeFirstName", "What is the employee's first name?", "", ((answers) => answers.options === "Add Employee"), [] ],
            [ "input", "employeeLastName", "What is the employee's last name?", "", ((answers) => answers.options === "Add Employee"), [] ],
            [ "list", "roleSelectedForEmployee", "What is the employee's role?", "", ((answers) => answers.options === "Add Employee"), async () => await displayRoles() ],
            [ "list", "managerSelectedForEmployee", "Who is the employee's manager?", "", ((answers) => answers.options === "Add Employee"), async () => await displayEmployeesForManager() ],
            [ "list", "employeeSelectedForUpdate", "Which employee's role do you want to update?", "", ((answers) => answers.options === "Update Employee Role"), async () => await displayEmployees() ],
            [ "list", "roleToBeAssignedForEmpUpdate", "Which role do you want to assign the selected employee?", "", ((answers) => answers.options === "Update Employee Role"), async () => await displayRoles() ],
            [ "input", "roleName", "What is the name of the role?", "", ((answers) => answers.options === "Add Role"), [] ],
            [ "input", "roleSalary", "What is the salary of the role?", "", ((answers) => answers.options === "Add Role"), [] ],
            [ "list", "departmentSelectedForRole", "Which department does the role belong to?", "", ((answers) => answers.options === "Add Role"), async () => await displayDepartments() ],
            [ "input", "departmentName", "What is the name of the department?", "", ((answers) => answers.options === "Add Department"), [] ],
            [ "list", "employeeSelectedForMgrUpdate", "Which employee's manager do you want to update?", "", ((answers) => answers.options === "Update Employee Manager"), async () => await displayEmployees() ],
            [ "list", "mgrToBeAssignedForEmpUpdate", "Which manager do you want to assign the selected employee?", "", ((answers) => answers.options === "Update Employee Manager"), async () => await displayEmployeesForManager() ],
            [ "list", "viewEmployeesOfMgr", "Which manager's employees do you wish to view?", "", ((answers) => answers.options === "View Employees By Manager"), async () => await displayEmployees() ],
            [ "list", "viewEmployeesOfDept", "Which department employees do you wish to view?", "", ((answers) => answers.options === "View Employees By Department"), async () => await displayDepartments() ],
            [ "list", "viewBudgetOfDept", "Which department's total utilized budget do you wish to view?", "", ((answers) => answers.options === "View Total Utilized Budget Of A Department"), async () => await displayDepartments() ],
        ];

        let welcomeText = ` _                                                          \r\n|_ ._ _  ._  |  _      _   _     |\\\/|  _. ._   _.  _   _  ._\r\n|_ | | | |_) | (_) \\\/ (\/_ (\/_    |  | (_| | | (_| (_| (\/_ | \r\n         |         \/                               _|       `;
        // Created a function to initialize app
        async function init() {
            try {
                console.log(welcomeText);

                const answer = await inquirer
                    .prompt(
                        questions.map((question) => {
                            return {
                                type: question[ 0 ],
                                name: question[ 1 ],
                                message: question[ 2 ],
                                default: question[ 3 ],
                                when: question[ 4 ],
                                choices: question[ 5 ],
                                validate: question[ 6 ],
                            }
                        }));

                console.log(answer);
                welcomeText = ``;

                if (answer.options === "View All Employees") {

                    let employeeRecords = await getEmployees();
                    let employees = [];

                    for (let index = 0; index < employeeRecords.length; index++) {
                        const propertyValues = Object.values(employeeRecords[ index ]);
                        employees.push(propertyValues);
                    }
                    var table =
                        new AsciiTable3('View Employees')
                            .setHeading('ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager')
                            .setAlignCenter(3)
                            .addRowMatrix(employees);

                    // set compact style
                    table.setStyle('compact');
                    employees.length ? console.log(table.toString()) : console.log("***********No Employee Records***********");



                } else if (answer.options === "View All Roles") {

                    let roleRecords = await getRoles();
                    let roles = [];

                    for (let index = 0; index < roleRecords.length; index++) {
                        const propertyValues = Object.values(roleRecords[ index ]);
                        roles.push(propertyValues);
                    }
                    var table =
                        new AsciiTable3('View Roles')
                            .setHeading('ID', 'Title', 'Department', 'Salary')
                            .setAlignCenter(3)
                            .addRowMatrix(roles);

                    // set compact style
                    table.setStyle('compact');
                    roles.length ? console.log(table.toString()) : console.log("***********No Role Records***********");


                } else if (answer.options === "View All Departments") {

                    let departmentRecords = await getDepartments();
                    let departments = [];

                    for (let index = 0; index < departmentRecords.length; index++) {
                        const propertyValues = Object.values(departmentRecords[ index ]);
                        departments.push(propertyValues);
                    }
                    var table =
                        new AsciiTable3('View Departments')
                            .setHeading('ID', 'Name')
                            .setAlignCenter(3)
                            .addRowMatrix(departments);

                    // set compact style
                    table.setStyle('compact');
                    departments.length ? console.log(table.toString()) : console.log("***********No Department Records***********");


                } else if (answer.options === "Add Employee") {

                    let addedRows = await addEmployee(answer);
                    addedRows ? console.log(`Employee ${answer.employeeFirstName} added to the database`) : console.log("***********Employee could not be added to the database***********");

                } else if (answer.options === "Add Department") {

                    let addedRows = await addDepartment(answer);
                    addedRows ? console.log(`Department ${answer.departmentName} added to the database`) : console.log("***********Department could not be added to the database***********");

                } else if (answer.options === "Add Role") {

                    let addedRows = await addRole(answer);
                    addedRows ? console.log(`Role ${answer.roleName} added to the database`) : console.log("***********Role could not be added to the database***********");

                } else if (answer.options === "Update Employee Role") {

                    let updatedRows = await updateEmployeeRole(answer);
                    updatedRows ? console.log(`Employee Role updated in the database`) : console.log("***********Employee Role could not be updated to the database***********");

                } else if (answer.options === "Update Employee Manager") {

                    let updatedRows = await updateEmployeeManager(answer);
                    updatedRows ? console.log(`Employee Manager updated in the database`) : console.log("***********Employee Manager could not be updated to the database***********");

                } else if (answer.options === "View Employees By Manager") {

                    let employeeRecords = await getEmployeesByManager(answer);
                    let employees = [];

                    for (let index = 0; index < employeeRecords.length; index++) {
                        const propertyValues = Object.values(employeeRecords[ index ]);
                        employees.push(propertyValues);
                    }
                    var table =
                        new AsciiTable3('View Employees By Manager')
                            .setHeading('ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager')
                            .setAlignCenter(3)
                            .addRowMatrix(employees);

                    // set compact style
                    table.setStyle('compact');
                    employees.length ? console.log(table.toString()) : console.log("***********Manager has no employees assigned***********");

                } else if (answer.options === "View Employees By Department") {

                    let employeeRecords = await getEmployeesByDepartment(answer);
                    let employees = [];

                    for (let index = 0; index < employeeRecords.length; index++) {
                        const propertyValues = Object.values(employeeRecords[ index ]);
                        employees.push(propertyValues);
                    }
                    var table =
                        new AsciiTable3('View Employees By Department')
                            .setHeading('ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager')
                            .setAlignCenter(3)
                            .addRowMatrix(employees);

                    // set compact style
                    table.setStyle('compact');
                    employees.length ? console.log(table.toString()) : console.log("***********Department has no employees assigned***********");

                } else if (answer.options === "View Total Utilized Budget Of A Department") {

                    let deptBudgetRecords = await getBudgetByDepartment(answer);
                    let deptBudgets = [];

                    for (let index = 0; index < deptBudgetRecords.length; index++) {
                        const propertyValues = Object.values(deptBudgetRecords[ index ]);
                        deptBudgets.push(propertyValues);
                    }
                    var table =
                        new AsciiTable3('View Total Utilizied Budget Of Department')
                            .setHeading('Department ID', 'Department Name', 'Number of Employees', 'Total Utilized Budget')
                            .setAlignCenter(3)
                            .addRowMatrix(deptBudgets);

                    // set compact style
                    table.setStyle('compact');
                    deptBudgets.length ? console.log(table.toString()) : console.log("***********Department has no budget assigned***********");

                } else if (answer.options === "Quit") {

                    return;

                }

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
            init();

        };

        async function getEmployees() {

            try {
                // Query database
                let result = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
            JOIN roles r ON e.role_id = r.id
            JOIN departments d ON r.department = d.id
            LEFT JOIN employees e2 ON e.manager_id = e2.id`);

                return result.rows;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };


        async function getRoles() {
            try {
                // Query database
                let result = await pool.query(`SELECT r.id, r.title, d.name AS department, r.salary FROM roles r
            JOIN departments d ON r.department = d.id;`);
                return result.rows;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }

        };


        async function getDepartments() {
            try {
                // Query database
                let result = await pool.query(`SELECT * FROM departments d`);
                return result.rows;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }

        };

        async function displayRoles() {
            try {
                // Query database
                let result = await pool.query(`SELECT r.id AS value, r.title AS name FROM roles r`);
                return result.rows;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }

        };

        async function displayEmployees() {
            try {
                // Query database
                let result = await pool.query(`SELECT e.id AS value, CONCAT(e.first_name,' ',e.last_name) AS name FROM employees e`);
                return result.rows;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }

        };

        async function displayEmployeesForManager() {
            try {
                // Query database
                let employeesAsManagers = [];
                let result = await pool.query(`SELECT e.id AS value, CONCAT(e.first_name,' ',e.last_name) AS name FROM employees e`);
                console.log(result.rows);
                employeesAsManagers = result.rows;
                employeesAsManagers.unshift({ value: null, name: "None" });
                return employeesAsManagers;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }

        };

        async function displayDepartments() {
            try {
                // Query database
                let result = await pool.query(`SELECT d.id AS value, d.name FROM departments d`);
                return result.rows;
            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }

        };

        async function addEmployee(empDetails) {
            try {
                // Query database
                const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
                const params = [ empDetails.employeeFirstName, empDetails.employeeLastName, empDetails.roleSelectedForEmployee, empDetails.managerSelectedForEmployee ];
                let result = await pool.query(sql, params);
                return result.rowCount;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };


        async function addDepartment(deptDetails) {
            try {
                // Query database
                const sql = `INSERT INTO departments (name) VALUES ($1)`;
                const params = [ deptDetails.departmentName ];
                let result = await pool.query(sql, params);
                return result.rowCount;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };


        async function addRole(roleDetails) {
            try {
                // Query database
                const sql = `INSERT INTO roles (title, salary, department) VALUES ($1,$2,$3)`;
                const params = [ roleDetails.roleName, roleDetails.roleSalary, roleDetails.departmentSelectedForRole ];
                let result = await pool.query(sql, params);
                return result.rowCount;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };

        async function updateEmployeeRole(updateDetails) {
            try {
                // Query database
                const sql = `UPDATE employees SET role_id = $1 WHERE id = $2`;
                const params = [ updateDetails.roleToBeAssignedForEmpUpdate, updateDetails.employeeSelectedForUpdate ];
                let result = await pool.query(sql, params);
                return result.rowCount;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };

        async function updateEmployeeManager(updateDetails) {
            try {
                // Query database
                const sql = `UPDATE employees SET manager_id = $1 WHERE id = $2`;
                const params = [ updateDetails.mgrToBeAssignedForEmpUpdate, updateDetails.employeeSelectedForMgrUpdate ];
                let result = await pool.query(sql, params);
                return result.rowCount;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };

        async function getEmployeesByManager(managerDetails) {

            try {
                // Query database
                const sql = `SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
                JOIN roles r ON e.role_id = r.id
                JOIN departments d ON r.department = d.id
                LEFT JOIN employees e2 ON e.manager_id = e2.id
                WHERE e.manager_id = $1`;
                const params = [ managerDetails.viewEmployeesOfMgr ];
                let result = await pool.query(sql, params);
                return result.rows;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };

        async function getEmployeesByDepartment(departmentDetails) {

            try {
                // Query database
                const sql = `SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
                JOIN roles r ON e.role_id = r.id
                JOIN departments d ON r.department = d.id
                LEFT JOIN employees e2 ON e.manager_id = e2.id
                WHERE d.id = $1`;
                const params = [ departmentDetails.viewEmployeesOfDept ];
                let result = await pool.query(sql, params);
                return result.rows;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };

        async function getBudgetByDepartment(departmentDetails) {

            try {
                // Query database
                const sql = `SELECT d.id, d.name AS Department, COUNT(e.id) AS Total_Num_Of_Employees, SUM(r.salary) AS Total_Utilized_Budget_OfDepartment FROM employees e
                JOIN roles r ON e.role_id = r.id
                RIGHT JOIN departments d ON r.department = d.id 
                WHERE d.id = $1
                GROUP BY d.id `;
                const params = [ departmentDetails.viewBudgetOfDept ];
                let result = await pool.query(sql, params);
                return result.rows;

            } catch (err) {

                console.error(
                    {
                        Error: `${err.message}`,
                        Hint: `${err.hint}`
                    }
                );
            }
        };

        // Function call to initialize app
        init();
    }
}

// Constructor EmployeeManager is exported from the file.
module.exports = EmployeeManager;
