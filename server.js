require("dotenv").config();

// Included packages needed for this application
const inquirer = require("inquirer");
// Import and require Pool 
const { Pool } = require('pg');


class EmployeeManager {

    constructor() {


    }


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
            [ "list", "options", "What would you like to do?", "", "", [ "View All Employees", "Add Employee", "Update Employee Role", "View All Roles", "Add Role", "View All Departments", "Add Department", "Quit" ] ],
            [ "input", "employeeFirstName", "What is the employee's first name?", "", ((answers) => answers.options === "Add Employee"), [] ],
            [ "input", "employeeLastName", "What is the employee's last name?", "", ((answers) => answers.options === "Add Employee"), [] ],
            [ "list", "roleSelectedForEmployee", "What is the employee's role?", "", ((answers) => answers.options === "Add Employee"), [ "Role1" ] ],
            [ "list", "managerSelectedForEmployee", "Who is the employee's manager?", "", ((answers) => answers.options === "Add Employee"), [ "employee1" ] ],
            [ "list", "employeeSelectedForUpdate", "Which employee's role do you want to update?", "", ((answers) => answers.options === "Update Employee Role"), [ "Employee1" ] ],
            [ "list", "roleToBeAssignedForEmpUpdate", "Which role do you want to assign the selected employee?", "", ((answers) => answers.options === "Update Employee Role"), [ "Role1" ] ],
            [ "input", "roleName", "What is the name of the role?", "", ((answers) => answers.options === "Add Role"), [] ],
            [ "input", "roleSalary", "What is the salary of the role?", "", ((answers) => answers.options === "Add Role"), [] ],
            [ "list", "departmentSelectedForRole", "Which department does the role belong to?", "", ((answers) => answers.options === "Add Role"), [ "Department1" ] ],
            [ "input", "departmentName", "What is the name of the department?", "", ((answers) => answers.options === "Add Department"), [] ],
        ];

        let welcomeText = ` _                                                          \r\n|_ ._ _  ._  |  _      _   _     |\\\/|  _. ._   _.  _   _  ._\r\n|_ | | | |_) | (_) \\\/ (\/_ (\/_    |  | (_| | | (_| (_| (\/_ | \r\n         |         \/                               _|       `;
        // Created a function to initialize app
        async function init() {

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

            if (answer.options === "View All Employees") {
                let employeeRecords = await getEmployees();
                console.table(employeeRecords);
                welcomeText = ``;

            } else if (answer.options === "Quit") {
                return;
            }

            init();

        }

        async function getEmployees() {

            // Query database
            let result = await pool.query(`SELECT e.id, e.first_name, e.last_name, r.title,d.name AS department, r.salary,e.manager_id,CONCAT( e2.first_name,' ', e2.last_name) AS manager FROM employees e
            JOIN roles r ON e.role_id = r.id
            JOIN departments d ON r.department = d.id
            LEFT JOIN employees e2 ON e.manager_id = e2.id`);

            return result.rows;

        }

        // Function call to initialize app
        init();
    }
}

// Constructor Logoinquirer is exported from the file.
module.exports = EmployeeManager;
