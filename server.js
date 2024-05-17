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
            [ "list", "options", "What would you like to do?", "", "", [ "View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Update Employee Manager", "View Employees By Manager", "View Employees By Department", "View Total Utilized Budget Of A Department", "Delete Department", "Delete Role", "Delete Employee", "Quit" ] ],
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
            [ "list", "departmentToDelete", "Which department do you wish to delete?", "", ((answers) => answers.options === "Delete Department"), async () => await displayDepartments() ],
            [ "list", "roleToDelete", "Which role do you wish to delete?", "", ((answers) => answers.options === "Delete Role"), async () => await displayRoles() ],
            [ "list", "employeeToDelete", "Which employee do you wish to delete?", "", ((answers) => answers.options === "Delete Employee"), async () => await displayEmployees() ],
        ];
        //ANSCII value for the application welcome title : "Employee Manager".
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

                // The welcome text is reset to blank
                welcomeText = ``;

                //Configured the various actions for the list of options displayed for the user to choose.

                if (answer.options === "View All Employees") {

                    let employeeRecords = await getEmployees();
                    let employees = [];

                    // The values of the objects are retrieved to display it in a table format
                    for (let index = 0; index < employeeRecords.length; index++) {
                        const propertyValues = Object.values(employeeRecords[ index ]);
                        employees.push(propertyValues);
                    }
                    //This is to display the data retrieved from the database in a "table format"  on the console.
                    var table =
                        new AsciiTable3('View Employees')
                            .setHeading('ID', 'First Name', 'Last Name', 'Title', 'Department', 'Salary', 'Manager')
                            .setAlignCenter(3)
                            .addRowMatrix(employees);

                    // set compact style for the table
                    table.setStyle('compact');
                    employees.length ? console.log(table.toString()) : console.log("***********No Employee Records***********");

                } else if (answer.options === "View All Roles") {

                    let roleRecords = await getRoles();
                    let roles = [];

                    for (let index = 0; index < roleRecords.length; index++) {
                        const propertyValues = Object.values(roleRecords[ index ]);
                        roles.push(propertyValues);
                    }

                    //This is to display the data retrieved from the database in a "table format"  on the console.
                    var table =
                        new AsciiTable3('View Roles')
                            .setHeading('ID', 'Title', 'Department', 'Salary')
                            .setAlignCenter(3)
                            .addRowMatrix(roles);

                    // set compact style for the table
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
                    addedRows ? console.log(`***********Employee ${answer.employeeFirstName} added to the database***********`) : console.log("***********Employee could not be added to the database***********");

                } else if (answer.options === "Add Department") {

                    let addedRows = await addDepartment(answer);
                    addedRows ? console.log(`***********Department ${answer.departmentName} added to the database***********`) : console.log("***********Department could not be added to the database***********");

                } else if (answer.options === "Add Role") {

                    let addedRows = await addRole(answer);
                    addedRows ? console.log(`***********Role ${answer.roleName} added to the database***********`) : console.log("***********Role could not be added to the database***********");

                } else if (answer.options === "Update Employee Role") {

                    let updatedRows = await updateEmployeeRole(answer);
                    updatedRows ? console.log(`***********Role updated for Employee ${answer.employeeSelectedForUpdate} in the database***********`) : console.log("***********Employee Role could not be updated to the database***********");

                } else if (answer.options === "Update Employee Manager") {

                    let updatedRows = await updateEmployeeManager(answer);
                    updatedRows ? console.log(`***********Manager updated for Employee ${answer.employeeSelectedForMgrUpdate} in the database***********`) : console.log("***********Employee Manager could not be updated to the database***********");

                } else if (answer.options === "Delete Department") {

                    let deletedRows = await deleteDepartment(answer);
                    deletedRows ? console.log(`***********Department deleted from the database***********`) : console.log(`***********Department cannot be deleted.***********`);

                } else if (answer.options === "Delete Role") {

                    let deletedRows = await deleteRole(answer);
                    deletedRows ? console.log(`***********Role deleted from the database***********`) : console.log(`***********Role cannot be deleted.***********`);

                } else if (answer.options === "Delete Employee") {

                    let deletedRows = await deleteEmployee(answer);
                    deletedRows ? console.log(`***********Employee deleted from the database***********`) : console.log(`***********Employee cannot be deleted.***********`);

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
                    employees.length ? console.log(table.toString()) : console.log(`***********Manager has no employees assigned***********`);

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
                    employees.length ? console.log(table.toString()) : console.log(`***********Department has no employees assigned***********`);

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
                    deptBudgets.length ? console.log(table.toString()) : console.log(`***********Department has no budget assigned***********`);

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
            // User is displayed the options until the user chooses to quit.
            init();

        };


        // Function to get all the details of the employees from the database. 
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

        // Function to get all the roles from the database.
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

        // Function to get all the departments from the database.
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

        // Function to get all the roles to be displayed as options in the inquirer prompt for add/update/delete roles from the database.
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

        // Function to get all the employees to be displayed as options in the inquirer prompt for add/update/delete employees from the database.
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

        // Function to get all the managers to be displayed as options in the inquirer prompt for add/update/delete managers from the database with option to choose NONE .
        async function displayEmployeesForManager() {
            try {

                // Query database
                let employeesAsManagers = [];
                let result = await pool.query(`SELECT e.id AS value, CONCAT(e.first_name,' ',e.last_name) AS name FROM employees e`);

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

        // Function to get all the departments to be displayed as options in the inquirer prompt for add/update/delete actions from the database.
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

        // Function to create a new employee with the user provided details on the inquirer input. Invokes the INSERT query for the employees table
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

        // Function to create a new department with the user provided details on the inquirer input. Invokes the INSERT query for the departments table
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

        // Function to create a new role with the user provided details on the inquirer input. Invokes the INSERT query for the roles table
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

        // Function to update an employee's role with the user provided details on the inquirer input. Invokes the Update query for the employees table
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

        // Function to update an employee's manager with the user provided details on the inquirer input. Invokes the Update query for the employees table
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

        // Function to get all the employees assigned to a manager from the database.
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

        // Function to get all the employees assigned to a department from the database.
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

        // Function to get the total ultilized budget of a department from the database. It's the sum of salaries of all employees assigned to the department
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

        // Function to delete the department from the database. The function will display an error if there is a referencing table for the department to be deleted.
        async function deleteDepartment(deleteDetails) {
            try {

                // Query database
                const sql = `DELETE FROM departments d WHERE d.id =$1`;
                const params = [ deleteDetails.departmentToDelete ];
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

        // Function to delete the role from the database. The function will display an error if there is a referencing table for the role to be deleted.
        async function deleteRole(deleteDetails) {
            try {

                // Query database
                const sql = `DELETE FROM roles r WHERE r.id =$1`;
                const params = [ deleteDetails.roleToDelete ];
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

        // Function to delete the employee from the database. If the manager record is deleted then the manager_id is set to NULL on the referencing employee record.
        async function deleteEmployee(deleteDetails) {
            try {

                // Query database
                const sql = `DELETE FROM employees e WHERE e.id =$1`;
                const params = [ deleteDetails.employeeToDelete ];
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

        // Function call to initialize app
        init();
    }
}

// Constructor EmployeeManager is exported from the file.
module.exports = EmployeeManager;
