export interface TestCase {
  description: string;
  expected: string;
}

export interface Problem {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  level: 'Fundamentals' | 'Intermediate' | 'Advanced';
  concept: string;
  estimatedTime: string;
  description: string;
  hints: string[];
  initialCode: string;
  solution: string;
  testCases: TestCase[];
}

export const problemsData: Problem[] = [
  // ========== FUNDAMENTALS ==========
  
  // Data Retrieval Queries
  {
    id: 'fund-retrieval-1',
    title: 'Retrieve All Records from Employees Table',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Data Retrieval Queries',
    estimatedTime: '5 min',
    description: 'Write a query to retrieve all records from the employees table.',
    hints: ['Use SELECT * to select all columns', 'FROM specifies the table name'],
    initialCode: 'SELECT \n  \nFROM employees;',
    solution: 'SELECT * FROM employees;',
    testCases: [
      { description: 'Returns all employee records', expected: 'All rows from employees table' }
    ]
  },
  {
    id: 'fund-retrieval-2',
    title: 'Display Employee Name and Department ID',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Data Retrieval Queries',
    estimatedTime: '5 min',
    description: 'Display only employee_name and department_id columns from the employees table.',
    hints: ['List specific columns separated by commas'],
    initialCode: 'SELECT \n  \nFROM employees;',
    solution: 'SELECT employee_name, department_id FROM employees;',
    testCases: [
      { description: 'Returns only name and department ID', expected: 'employee_name, department_id columns' }
    ]
  },
  {
    id: 'fund-retrieval-3',
    title: 'Retrieve Employees with Job Title "Analyst"',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Data Retrieval Queries',
    estimatedTime: '8 min',
    description: 'Retrieve all employees whose job title is "Analyst".',
    hints: ['Use WHERE clause to filter rows', 'Use = operator for exact match'],
    initialCode: 'SELECT * \nFROM employees\nWHERE ;',
    solution: 'SELECT * FROM employees WHERE job_title = \'Analyst\';',
    testCases: [
      { description: 'Returns only Analysts', expected: 'Employees where job_title = "Analyst"' }
    ]
  },

  // Filtering and Sorting Data
  {
    id: 'fund-filter-1',
    title: 'Order Employees by Hire Date',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Filtering and Sorting Data',
    estimatedTime: '7 min',
    description: 'Display all employees ordered by their hire_date in ascending order.',
    hints: ['Use ORDER BY clause', 'ASC is the default sort order'],
    initialCode: 'SELECT * \nFROM employees\nORDER BY ;',
    solution: 'SELECT * FROM employees ORDER BY hire_date ASC;',
    testCases: [
      { description: 'Employees sorted by hire date', expected: 'Ordered by hire_date ascending' }
    ]
  },
  {
    id: 'fund-filter-2',
    title: 'Retrieve Unique Department Names',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Filtering and Sorting Data',
    estimatedTime: '5 min',
    description: 'Retrieve unique department names from the departments table.',
    hints: ['Use DISTINCT keyword to remove duplicates'],
    initialCode: 'SELECT \nFROM departments;',
    solution: 'SELECT DISTINCT department_name FROM departments;',
    testCases: [
      { description: 'Unique departments only', expected: 'Distinct department names' }
    ]
  },
  {
    id: 'fund-filter-3',
    title: 'Top Five Highest-Paid Employees',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Filtering and Sorting Data',
    estimatedTime: '10 min',
    description: 'List the top five employees with the highest salaries.',
    hints: ['Use ORDER BY with DESC', 'Use LIMIT to restrict results'],
    initialCode: 'SELECT * \nFROM employees\nORDER BY \nLIMIT ;',
    solution: 'SELECT * FROM employees ORDER BY salary DESC LIMIT 5;',
    testCases: [
      { description: 'Top 5 earners', expected: '5 employees with highest salaries' }
    ]
  },
  {
    id: 'fund-filter-4',
    title: 'Employees with Salary Between 60,000 and 90,000',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Filtering and Sorting Data',
    estimatedTime: '8 min',
    description: 'Retrieve employees whose salary is between 60,000 and 90,000.',
    hints: ['Use BETWEEN operator for range queries'],
    initialCode: 'SELECT * \nFROM employees\nWHERE salary ;',
    solution: 'SELECT * FROM employees WHERE salary BETWEEN 60000 AND 90000;',
    testCases: [
      { description: 'Salary in range', expected: 'Employees with salary 60k-90k' }
    ]
  },
  {
    id: 'fund-filter-5',
    title: 'Employees in Departments 10, 20, or 30',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Filtering and Sorting Data',
    estimatedTime: '7 min',
    description: 'List employees who belong to departments 10, 20, or 30.',
    hints: ['Use IN operator for multiple values'],
    initialCode: 'SELECT * \nFROM employees\nWHERE department_id ;',
    solution: 'SELECT * FROM employees WHERE department_id IN (10, 20, 30);',
    testCases: [
      { description: 'Specific departments', expected: 'Employees in dept 10, 20, or 30' }
    ]
  },

  // Aggregation and Summary Functions
  {
    id: 'fund-agg-1',
    title: 'Count Total Number of Employees',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Aggregation and Summary Functions',
    estimatedTime: '5 min',
    description: 'Calculate the total number of employees in the organization.',
    hints: ['Use COUNT(*) or COUNT(column_name)'],
    initialCode: 'SELECT \nFROM employees;',
    solution: 'SELECT COUNT(*) AS total_employees FROM employees;',
    testCases: [
      { description: 'Total employee count', expected: 'Single number representing total employees' }
    ]
  },
  {
    id: 'fund-agg-2',
    title: 'Compute Average Salary Per Department',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Aggregation and Summary Functions',
    estimatedTime: '12 min',
    description: 'Compute the average salary within each department.',
    hints: ['Use AVG() function', 'GROUP BY department_id'],
    initialCode: 'SELECT department_id, \nFROM employees\nGROUP BY ;',
    solution: 'SELECT department_id, AVG(salary) AS avg_salary FROM employees GROUP BY department_id;',
    testCases: [
      { description: 'Average salary by dept', expected: 'Dept ID with average salary' }
    ]
  },
  {
    id: 'fund-agg-3',
    title: 'Find Highest and Lowest Salary',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Aggregation and Summary Functions',
    estimatedTime: '7 min',
    description: 'Find the highest and lowest salary in the company.',
    hints: ['Use MAX() and MIN() functions'],
    initialCode: 'SELECT \nFROM employees;',
    solution: 'SELECT MAX(salary) AS max_salary, MIN(salary) AS min_salary FROM employees;',
    testCases: [
      { description: 'Min and max salaries', expected: 'Two values: highest and lowest salary' }
    ]
  },
  {
    id: 'fund-agg-4',
    title: 'Determine Total Payroll Expense',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Aggregation and Summary Functions',
    estimatedTime: '6 min',
    description: 'Determine the total payroll expense for all employees.',
    hints: ['Use SUM() function on salary column'],
    initialCode: 'SELECT \nFROM employees;',
    solution: 'SELECT SUM(salary) AS total_payroll FROM employees;',
    testCases: [
      { description: 'Total salary sum', expected: 'Single value with sum of all salaries' }
    ]
  },

  // Grouping and Conditional Aggregation
  {
    id: 'fund-group-1',
    title: 'Total Employees Per Department',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Grouping and Conditional Aggregation',
    estimatedTime: '10 min',
    description: 'Display the total number of employees in each department.',
    hints: ['Use COUNT() with GROUP BY'],
    initialCode: 'SELECT department_id, \nFROM employees\nGROUP BY ;',
    solution: 'SELECT department_id, COUNT(*) AS employee_count FROM employees GROUP BY department_id;',
    testCases: [
      { description: 'Count per department', expected: 'Department ID with employee count' }
    ]
  },
  {
    id: 'fund-group-2',
    title: 'Departments with Average Salary Above 75,000',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Grouping and Conditional Aggregation',
    estimatedTime: '15 min',
    description: 'Show departments where the average salary exceeds 75,000.',
    hints: ['Use HAVING clause to filter grouped results', 'HAVING comes after GROUP BY'],
    initialCode: 'SELECT department_id, AVG(salary) AS avg_sal\nFROM employees\nGROUP BY department_id\nHAVING ;',
    solution: 'SELECT department_id, AVG(salary) AS avg_sal FROM employees GROUP BY department_id HAVING AVG(salary) > 75000;',
    testCases: [
      { description: 'High-paying departments', expected: 'Departments with avg salary > 75k' }
    ]
  },
  {
    id: 'fund-group-3',
    title: 'Job Titles with More Than Five Employees',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Grouping and Conditional Aggregation',
    estimatedTime: '12 min',
    description: 'Find job titles that have more than five employees.',
    hints: ['GROUP BY job_title', 'Use HAVING COUNT(*) > 5'],
    initialCode: 'SELECT job_title, COUNT(*) AS count\nFROM employees\nGROUP BY \nHAVING ;',
    solution: 'SELECT job_title, COUNT(*) AS count FROM employees GROUP BY job_title HAVING COUNT(*) > 5;',
    testCases: [
      { description: 'Popular job titles', expected: 'Job titles with >5 employees' }
    ]
  },

  // Introductory Table Joins
  {
    id: 'fund-join-1',
    title: 'Employee Names with Department Names',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Introductory Table Joins',
    estimatedTime: '15 min',
    description: 'Display each employee\'s name along with their department name.',
    hints: ['Use INNER JOIN', 'Join on department_id'],
    initialCode: 'SELECT e.employee_name, d.department_name\nFROM employees e\nINNER JOIN departments d\nON ;',
    solution: 'SELECT e.employee_name, d.department_name FROM employees e INNER JOIN departments d ON e.department_id = d.department_id;',
    testCases: [
      { description: 'Employee with department', expected: 'Employee name and department name' }
    ]
  },
  {
    id: 'fund-join-2',
    title: 'All Departments with Their Employees',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Introductory Table Joins',
    estimatedTime: '18 min',
    description: 'List all departments and the employees assigned to them, including departments with no employees.',
    hints: ['Use LEFT JOIN to include all departments'],
    initialCode: 'SELECT d.department_name, e.employee_name\nFROM departments d\nLEFT JOIN employees e\nON ;',
    solution: 'SELECT d.department_name, e.employee_name FROM departments d LEFT JOIN employees e ON d.department_id = e.department_id;',
    testCases: [
      { description: 'All departments with employees', expected: 'All departments, even with NULL employees' }
    ]
  },
  {
    id: 'fund-join-3',
    title: 'Employees Without Department Assignment',
    difficulty: 'Medium',
    level: 'Fundamentals',
    concept: 'Introductory Table Joins',
    estimatedTime: '16 min',
    description: 'Identify employees who are not associated with any department.',
    hints: ['Use LEFT JOIN', 'Filter WHERE department_id IS NULL'],
    initialCode: 'SELECT e.employee_name\nFROM employees e\nLEFT JOIN departments d\nON e.department_id = d.department_id\nWHERE ;',
    solution: 'SELECT e.employee_name FROM employees e LEFT JOIN departments d ON e.department_id = d.department_id WHERE d.department_id IS NULL;',
    testCases: [
      { description: 'Unassigned employees', expected: 'Employees without department' }
    ]
  },

  // Column Aliasing and Core SQL Functions
  {
    id: 'fund-alias-1',
    title: 'Combine First and Last Names',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Column Aliasing and Core SQL Functions',
    estimatedTime: '8 min',
    description: 'Combine first and last names to create a full_name column.',
    hints: ['Use CONCAT() function', 'Use AS for aliasing'],
    initialCode: 'SELECT \nFROM employees;',
    solution: 'SELECT CONCAT(first_name, \' \', last_name) AS full_name FROM employees;',
    testCases: [
      { description: 'Full name column', expected: 'Single column with first + last name' }
    ]
  },
  {
    id: 'fund-alias-2',
    title: 'Display Names in Uppercase',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Column Aliasing and Core SQL Functions',
    estimatedTime: '6 min',
    description: 'Display employee names in uppercase format.',
    hints: ['Use UPPER() function'],
    initialCode: 'SELECT \nFROM employees;',
    solution: 'SELECT UPPER(employee_name) AS name_uppercase FROM employees;',
    testCases: [
      { description: 'Uppercase names', expected: 'All names in uppercase' }
    ]
  },
  {
    id: 'fund-alias-3',
    title: 'Calculate Name Length',
    difficulty: 'Easy',
    level: 'Fundamentals',
    concept: 'Column Aliasing and Core SQL Functions',
    estimatedTime: '7 min',
    description: 'Calculate the length of each employee\'s name.',
    hints: ['Use LENGTH() or LEN() function'],
    initialCode: 'SELECT employee_name, \nFROM employees;',
    solution: 'SELECT employee_name, LENGTH(employee_name) AS name_length FROM employees;',
    testCases: [
      { description: 'Name with length', expected: 'Employee name and character count' }
    ]
  },

  // ========== INTERMEDIATE ==========

  // Advanced Joins and Set Operations
  {
    id: 'int-join-1',
    title: 'Merge Regional Employee Data Using UNION',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Advanced Joins and Set Operations',
    estimatedTime: '20 min',
    description: 'Merge employee data from two regional tables (employees_east and employees_west) using UNION.',
    hints: ['UNION removes duplicates automatically', 'Both tables must have same structure'],
    initialCode: 'SELECT * FROM employees_east\nUNION\n',
    solution: 'SELECT * FROM employees_east UNION SELECT * FROM employees_west;',
    testCases: [
      { description: 'Combined employee list', expected: 'Unique employees from both regions' }
    ]
  },
  {
    id: 'int-join-2',
    title: 'Find Overlapping Employees Using INTERSECT',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Advanced Joins and Set Operations',
    estimatedTime: '18 min',
    description: 'Identify employees appearing in both current_employees and contractors tables.',
    hints: ['Use INTERSECT for common records'],
    initialCode: 'SELECT employee_id FROM current_employees\nINTERSECT\n',
    solution: 'SELECT employee_id FROM current_employees INTERSECT SELECT employee_id FROM contractors;',
    testCases: [
      { description: 'Common employees', expected: 'Employees in both tables' }
    ]
  },
  {
    id: 'int-join-3',
    title: 'Finance Employees Not in Sales',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Advanced Joins and Set Operations',
    estimatedTime: '17 min',
    description: 'Display employees in the "Finance" department who are not in "Sales."',
    hints: ['Use EXCEPT or NOT IN', 'Filter by department'],
    initialCode: 'SELECT employee_id FROM employees WHERE department = \'Finance\'\nEXCEPT\n',
    solution: 'SELECT employee_id FROM employees WHERE department = \'Finance\' EXCEPT SELECT employee_id FROM employees WHERE department = \'Sales\';',
    testCases: [
      { description: 'Finance only', expected: 'Finance employees excluding Sales' }
    ]
  },
  {
    id: 'int-join-4',
    title: 'Full Outer Join of Departments and Employees',
    difficulty: 'Hard',
    level: 'Intermediate',
    concept: 'Advanced Joins and Set Operations',
    estimatedTime: '22 min',
    description: 'Retrieve a comprehensive list of all departments and employees using a FULL OUTER JOIN.',
    hints: ['FULL OUTER JOIN shows all records from both tables', 'May have NULLs on either side'],
    initialCode: 'SELECT d.department_name, e.employee_name\nFROM departments d\nFULL OUTER JOIN employees e\nON ;',
    solution: 'SELECT d.department_name, e.employee_name FROM departments d FULL OUTER JOIN employees e ON d.department_id = e.department_id;',
    testCases: [
      { description: 'All departments and employees', expected: 'Complete list with possible NULLs' }
    ]
  },

  // Subqueries and Nested Logic
  {
    id: 'int-sub-1',
    title: 'Employees Earning Above Average',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Subqueries and Nested Logic',
    estimatedTime: '15 min',
    description: 'Retrieve employees whose salary is greater than the company average.',
    hints: ['Use subquery to calculate AVG(salary)', 'Use WHERE salary > (subquery)'],
    initialCode: 'SELECT * \nFROM employees\nWHERE salary > ();',
    solution: 'SELECT * FROM employees WHERE salary > (SELECT AVG(salary) FROM employees);',
    testCases: [
      { description: 'Above-average earners', expected: 'Employees with salary > average' }
    ]
  },
  {
    id: 'int-sub-2',
    title: 'Departments with More Than 15 Employees',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Subqueries and Nested Logic',
    estimatedTime: '20 min',
    description: 'Display departments with more than 15 employees.',
    hints: ['Use subquery with GROUP BY and HAVING', 'Or use IN with subquery'],
    initialCode: 'SELECT department_name\nFROM departments\nWHERE department_id IN ();',
    solution: 'SELECT department_name FROM departments WHERE department_id IN (SELECT department_id FROM employees GROUP BY department_id HAVING COUNT(*) > 15);',
    testCases: [
      { description: 'Large departments', expected: 'Departments with >15 employees' }
    ]
  },
  {
    id: 'int-sub-3',
    title: 'Employees with Manager Salary Match',
    difficulty: 'Hard',
    level: 'Intermediate',
    concept: 'Subqueries and Nested Logic',
    estimatedTime: '25 min',
    description: 'Find employees whose salary matches their department manager\'s salary.',
    hints: ['Use correlated subquery', 'Reference outer query in inner query'],
    initialCode: 'SELECT e.employee_name\nFROM employees e\nWHERE e.salary = (\n  SELECT \n);',
    solution: 'SELECT e.employee_name FROM employees e WHERE e.salary = (SELECT m.salary FROM employees m WHERE m.job_title = \'Manager\' AND m.department_id = e.department_id);',
    testCases: [
      { description: 'Salary match with manager', expected: 'Employees earning same as their manager' }
    ]
  },

  // Conditional Expressions
  {
    id: 'int-case-1',
    title: 'Classify Employees by Salary Range',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Conditional Expressions',
    estimatedTime: '18 min',
    description: 'Classify employees as "High", "Moderate", or "Low" earners based on salary range.',
    hints: ['Use CASE statement', 'Define salary ranges for each category'],
    initialCode: 'SELECT employee_name,\n  CASE\n    WHEN \n  END AS salary_category\nFROM employees;',
    solution: 'SELECT employee_name, CASE WHEN salary > 80000 THEN \'High\' WHEN salary BETWEEN 50000 AND 80000 THEN \'Moderate\' ELSE \'Low\' END AS salary_category FROM employees;',
    testCases: [
      { description: 'Salary classifications', expected: 'Employee with High/Moderate/Low category' }
    ]
  },
  {
    id: 'int-case-2',
    title: 'Replace Null Commission with N/A',
    difficulty: 'Easy',
    level: 'Intermediate',
    concept: 'Conditional Expressions',
    estimatedTime: '12 min',
    description: 'Replace null commission values with "N/A."',
    hints: ['Use COALESCE() or CASE', 'Check for NULL values'],
    initialCode: 'SELECT employee_name,\n  COALESCE() AS commission\nFROM employees;',
    solution: 'SELECT employee_name, COALESCE(commission, \'N/A\') AS commission FROM employees;',
    testCases: [
      { description: 'Null handling', expected: 'Commission shown as N/A when null' }
    ]
  },
  {
    id: 'int-case-3',
    title: 'Label Managers vs Staff',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Conditional Expressions',
    estimatedTime: '15 min',
    description: 'Assign a label "Manager" to employees whose job title includes \'Manager\'; otherwise, "Staff."',
    hints: ['Use CASE with LIKE operator', 'Pattern match for Manager'],
    initialCode: 'SELECT employee_name,\n  CASE\n    WHEN job_title LIKE \n  END AS role_type\nFROM employees;',
    solution: 'SELECT employee_name, CASE WHEN job_title LIKE \'%Manager%\' THEN \'Manager\' ELSE \'Staff\' END AS role_type FROM employees;',
    testCases: [
      { description: 'Role classification', expected: 'Employees labeled as Manager or Staff' }
    ]
  },

  // String and Date Manipulation
  {
    id: 'int-string-1',
    title: 'Extract First Three Letters of Department Name',
    difficulty: 'Easy',
    level: 'Intermediate',
    concept: 'String and Date Manipulation',
    estimatedTime: '10 min',
    description: 'Extract the first three letters of each department name.',
    hints: ['Use SUBSTRING() or LEFT() function'],
    initialCode: 'SELECT department_name, \nFROM departments;',
    solution: 'SELECT department_name, SUBSTRING(department_name, 1, 3) AS dept_code FROM departments;',
    testCases: [
      { description: 'Department codes', expected: 'First 3 characters of dept name' }
    ]
  },
  {
    id: 'int-string-2',
    title: 'Replace HR with Human Resources',
    difficulty: 'Easy',
    level: 'Intermediate',
    concept: 'String and Date Manipulation',
    estimatedTime: '11 min',
    description: 'Replace "HR" with "Human Resources" in department names.',
    hints: ['Use REPLACE() function'],
    initialCode: 'SELECT \nFROM departments;',
    solution: 'SELECT REPLACE(department_name, \'HR\', \'Human Resources\') AS full_dept_name FROM departments;',
    testCases: [
      { description: 'String replacement', expected: 'HR changed to Human Resources' }
    ]
  },
  {
    id: 'int-date-1',
    title: 'Display Year of Hire Date',
    difficulty: 'Easy',
    level: 'Intermediate',
    concept: 'String and Date Manipulation',
    estimatedTime: '10 min',
    description: 'Display the year portion of each employee\'s hire date.',
    hints: ['Use EXTRACT(YEAR FROM date) or YEAR() function'],
    initialCode: 'SELECT employee_name, \nFROM employees;',
    solution: 'SELECT employee_name, EXTRACT(YEAR FROM hire_date) AS hire_year FROM employees;',
    testCases: [
      { description: 'Hire year', expected: 'Employee with year portion of hire_date' }
    ]
  },
  {
    id: 'int-date-2',
    title: 'Format Hire Date as Month, Year',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'String and Date Manipulation',
    estimatedTime: '14 min',
    description: 'Format the hire date as "Month, Year."',
    hints: ['Use DATE_FORMAT() or TO_CHAR()', 'Format pattern varies by database'],
    initialCode: 'SELECT employee_name,\n  DATE_FORMAT(hire_date, ) AS formatted_date\nFROM employees;',
    solution: 'SELECT employee_name, DATE_FORMAT(hire_date, \'%M, %Y\') AS formatted_date FROM employees;',
    testCases: [
      { description: 'Date formatting', expected: 'Hire date in "Month, Year" format' }
    ]
  },

  // Data Manipulation Statements
  {
    id: 'int-dml-1',
    title: 'Insert a New Employee Record',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Data Manipulation Statements',
    estimatedTime: '12 min',
    description: 'Insert a new employee record into the employees table.',
    hints: ['Use INSERT INTO', 'Specify column names and values'],
    initialCode: 'INSERT INTO employees ()\nVALUES ();',
    solution: 'INSERT INTO employees (employee_id, employee_name, salary, department_id) VALUES (101, \'John Doe\', 65000, 10);',
    testCases: [
      { description: 'New employee added', expected: 'One row inserted' }
    ]
  },
  {
    id: 'int-dml-2',
    title: 'Increase All Salaries by 8%',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Data Manipulation Statements',
    estimatedTime: '10 min',
    description: 'Increase the salary of all employees by 8%.',
    hints: ['Use UPDATE statement', 'SET salary = salary * 1.08'],
    initialCode: 'UPDATE employees\nSET ;',
    solution: 'UPDATE employees SET salary = salary * 1.08;',
    testCases: [
      { description: 'All salaries increased', expected: 'All rows updated with 8% raise' }
    ]
  },
  {
    id: 'int-dml-3',
    title: 'Delete Unassigned Employees',
    difficulty: 'Medium',
    level: 'Intermediate',
    concept: 'Data Manipulation Statements',
    estimatedTime: '13 min',
    description: 'Remove employees who have not been assigned to any department.',
    hints: ['Use DELETE statement', 'WHERE department_id IS NULL'],
    initialCode: 'DELETE FROM employees\nWHERE ;',
    solution: 'DELETE FROM employees WHERE department_id IS NULL;',
    testCases: [
      { description: 'Unassigned deleted', expected: 'Employees without department removed' }
    ]
  },

  // ========== ADVANCED ==========

  // Analytical and Window Functions
  {
    id: 'adv-window-1',
    title: 'Assign Sequential Numbers to Employees',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Analytical and Window Functions',
    estimatedTime: '22 min',
    description: 'Assign a sequential number to employees ordered by salary.',
    hints: ['Use ROW_NUMBER() OVER (ORDER BY ...)', 'No PARTITION needed for overall ranking'],
    initialCode: 'SELECT employee_name, salary,\n  \nFROM employees;',
    solution: 'SELECT employee_name, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS row_num FROM employees;',
    testCases: [
      { description: 'Sequential numbering', expected: 'Each employee with unique row number' }
    ]
  },
  {
    id: 'adv-window-2',
    title: 'Rank Employees by Salary Within Department',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Analytical and Window Functions',
    estimatedTime: '25 min',
    description: 'Rank employees by salary within each department.',
    hints: ['Use RANK() OVER (PARTITION BY ... ORDER BY ...)', 'PARTITION BY department_id'],
    initialCode: 'SELECT employee_name, salary, department_id,\n  \nFROM employees;',
    solution: 'SELECT employee_name, salary, department_id, RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS salary_rank FROM employees;',
    testCases: [
      { description: 'Ranked employees', expected: 'Employees with rank per department' }
    ]
  },
  {
    id: 'adv-window-3',
    title: 'Top 3 Earners Per Department',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Analytical and Window Functions',
    estimatedTime: '30 min',
    description: 'Identify the top three highest-paid employees in each department.',
    hints: ['Use ROW_NUMBER() or DENSE_RANK()', 'Filter with WHERE rank <= 3 in outer query'],
    initialCode: 'SELECT * FROM (\n  SELECT employee_name, salary, department_id,\n    \n  FROM employees\n) ranked\nWHERE ;',
    solution: 'SELECT * FROM (SELECT employee_name, salary, department_id, DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) AS rnk FROM employees) ranked WHERE rnk <= 3;',
    testCases: [
      { description: 'Top 3 per dept', expected: 'Top 3 earners in each department' }
    ]
  },

  // Common Table Expressions (CTEs)
  {
    id: 'adv-cte-1',
    title: 'CTE for Departments with High Average Salary',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Common Table Expressions (CTEs)',
    estimatedTime: '22 min',
    description: 'Use a CTE to find departments with average salaries above 80,000.',
    hints: ['Use WITH clause', 'Define CTE with dept average, then filter'],
    initialCode: 'WITH dept_avg AS (\n  \n)\nSELECT * FROM dept_avg\nWHERE ;',
    solution: 'WITH dept_avg AS (SELECT department_id, AVG(salary) AS avg_sal FROM employees GROUP BY department_id) SELECT * FROM dept_avg WHERE avg_sal > 80000;',
    testCases: [
      { description: 'High-paying depts', expected: 'Departments with avg salary > 80k' }
    ]
  },
  {
    id: 'adv-cte-2',
    title: 'Recursive CTE for Employee Hierarchy',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Common Table Expressions (CTEs)',
    estimatedTime: '35 min',
    description: 'Build a recursive CTE to display the reporting hierarchy of employees.',
    hints: ['Use WITH RECURSIVE', 'Base case: top-level employees', 'Recursive case: join on manager_id'],
    initialCode: 'WITH RECURSIVE emp_hierarchy AS (\n  SELECT \n  UNION ALL\n  SELECT \n)\nSELECT * FROM emp_hierarchy;',
    solution: 'WITH RECURSIVE emp_hierarchy AS (SELECT employee_id, employee_name, manager_id, 1 AS level FROM employees WHERE manager_id IS NULL UNION ALL SELECT e.employee_id, e.employee_name, e.manager_id, eh.level + 1 FROM employees e INNER JOIN emp_hierarchy eh ON e.manager_id = eh.employee_id) SELECT * FROM emp_hierarchy;',
    testCases: [
      { description: 'Employee hierarchy', expected: 'Org chart with levels' }
    ]
  },

  // Query Optimization and Indexing
  {
    id: 'adv-opt-1',
    title: 'Create Index on Last Name',
    difficulty: 'Medium',
    level: 'Advanced',
    concept: 'Query Optimization and Indexing',
    estimatedTime: '15 min',
    description: 'Create an index on the last_name column to improve query performance.',
    hints: ['Use CREATE INDEX', 'Syntax: CREATE INDEX idx_name ON table(column)'],
    initialCode: 'CREATE INDEX \nON employees();',
    solution: 'CREATE INDEX idx_last_name ON employees(last_name);',
    testCases: [
      { description: 'Index created', expected: 'Index on last_name column' }
    ]
  },
  {
    id: 'adv-opt-2',
    title: 'Rewrite Subquery as Join',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Query Optimization and Indexing',
    estimatedTime: '28 min',
    description: 'Rewrite a subquery as a join to improve efficiency.',
    hints: ['Convert WHERE IN subquery to INNER JOIN', 'Joins often perform better'],
    initialCode: '-- Original: SELECT * FROM employees WHERE dept_id IN (SELECT id FROM high_paid_depts)\n-- Rewrite as JOIN:\nSELECT \nFROM employees e\nINNER JOIN \nON ;',
    solution: 'SELECT e.* FROM employees e INNER JOIN (SELECT id FROM departments WHERE avg_salary > 80000) d ON e.dept_id = d.id;',
    testCases: [
      { description: 'Optimized query', expected: 'Same results with better performance' }
    ]
  },

  // Database Normalization and Schema Design
  {
    id: 'adv-norm-1',
    title: 'Normalize Denormalized Employee Table',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Database Normalization and Schema Design',
    estimatedTime: '35 min',
    description: 'Normalize a table containing redundant department data to third normal form (3NF).',
    hints: ['Separate department info into departments table', 'Use foreign keys'],
    initialCode: '-- Split into employees and departments tables\nCREATE TABLE departments (\n  \n);\n\nCREATE TABLE employees (\n  \n);',
    solution: 'CREATE TABLE departments (department_id INT PRIMARY KEY, department_name VARCHAR(100)); CREATE TABLE employees (employee_id INT PRIMARY KEY, employee_name VARCHAR(100), department_id INT, FOREIGN KEY (department_id) REFERENCES departments(department_id));',
    testCases: [
      { description: 'Normalized schema', expected: 'Two tables with proper relationships' }
    ]
  },
  {
    id: 'adv-norm-2',
    title: 'Identify Anomalies in Denormalized Data',
    difficulty: 'Medium',
    level: 'Advanced',
    concept: 'Database Normalization and Schema Design',
    estimatedTime: '25 min',
    description: 'Identify and correct anomalies in a denormalized dataset.',
    hints: ['Look for update, insert, and delete anomalies', 'Separate repeating groups'],
    initialCode: '-- Describe the anomalies found and propose solution\n',
    solution: '-- Anomalies: 1) Update anomaly: changing dept name requires multiple updates 2) Insert anomaly: cannot add dept without employee 3) Delete anomaly: deleting last employee loses dept info. Solution: Create separate departments table.',
    testCases: [
      { description: 'Anomalies identified', expected: 'Description of normalization issues' }
    ]
  },

  // Transactions and Concurrency Control
  {
    id: 'adv-trans-1',
    title: 'Transfer Budget Between Departments',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Transactions and Concurrency Control',
    estimatedTime: '28 min',
    description: 'Execute a transaction that transfers budget from one department to another.',
    hints: ['Use BEGIN TRANSACTION', 'UPDATE both departments', 'Use COMMIT'],
    initialCode: 'BEGIN TRANSACTION;\n\nUPDATE departments SET budget = \nWHERE department_id = ;\n\nUPDATE departments SET budget = \nWHERE department_id = ;\n\nCOMMIT;',
    solution: 'BEGIN TRANSACTION; UPDATE departments SET budget = budget - 10000 WHERE department_id = 10; UPDATE departments SET budget = budget + 10000 WHERE department_id = 20; COMMIT;',
    testCases: [
      { description: 'Budget transferred', expected: 'Both departments updated atomically' }
    ]
  },
  {
    id: 'adv-trans-2',
    title: 'Use SAVEPOINT for Partial Rollback',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Transactions and Concurrency Control',
    estimatedTime: '30 min',
    description: 'Use a SAVEPOINT to partially roll back a transaction.',
    hints: ['SAVEPOINT creates a marker', 'ROLLBACK TO SAVEPOINT reverts to that point', 'Rest of transaction can continue'],
    initialCode: 'BEGIN TRANSACTION;\nUPDATE employees SET salary = salary * 1.1;\nSAVEPOINT ;\n-- Make error-prone change\nROLLBACK TO ;\nCOMMIT;',
    solution: 'BEGIN TRANSACTION; UPDATE employees SET salary = salary * 1.1; SAVEPOINT before_bonus; UPDATE employees SET bonus = 5000 WHERE invalid_condition; ROLLBACK TO before_bonus; COMMIT;',
    testCases: [
      { description: 'Partial rollback', expected: 'First update kept, second update reverted' }
    ]
  },

  // Stored Procedures and Triggers
  {
    id: 'adv-proc-1',
    title: 'Create Stored Procedure for Salary Update',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Stored Procedures and Triggers',
    estimatedTime: '30 min',
    description: 'Develop a stored procedure to update employee salaries by department.',
    hints: ['Use CREATE PROCEDURE', 'Accept department_id and percentage as parameters'],
    initialCode: 'CREATE PROCEDURE update_dept_salaries(\n  \n)\nBEGIN\n  \nEND;',
    solution: 'CREATE PROCEDURE update_dept_salaries(IN dept_id INT, IN pct DECIMAL) BEGIN UPDATE employees SET salary = salary * (1 + pct/100) WHERE department_id = dept_id; END;',
    testCases: [
      { description: 'Procedure created', expected: 'Stored procedure for salary updates' }
    ]
  },
  {
    id: 'adv-proc-2',
    title: 'Create Trigger to Log Deletions',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'Stored Procedures and Triggers',
    estimatedTime: '32 min',
    description: 'Create a trigger that logs every deleted record in a history table.',
    hints: ['Use CREATE TRIGGER', 'AFTER DELETE event', 'INSERT into audit/history table'],
    initialCode: 'CREATE TRIGGER log_employee_delete\nAFTER DELETE ON employees\nFOR EACH ROW\nBEGIN\n  \nEND;',
    solution: 'CREATE TRIGGER log_employee_delete AFTER DELETE ON employees FOR EACH ROW BEGIN INSERT INTO employee_history (employee_id, employee_name, deleted_at) VALUES (OLD.employee_id, OLD.employee_name, NOW()); END;',
    testCases: [
      { description: 'Trigger created', expected: 'Deletions logged to history table' }
    ]
  },

  // JSON and Advanced Data Types
  {
    id: 'adv-json-1',
    title: 'Extract Skills from JSON Column',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'JSON and Advanced Data Types',
    estimatedTime: '25 min',
    description: 'Extract specific key-value pairs from a JSON column.',
    hints: ['Use JSON_EXTRACT() or -> operator', 'Syntax varies by database (MySQL, PostgreSQL)'],
    initialCode: 'SELECT employee_name,\n  \nFROM employees;',
    solution: 'SELECT employee_name, JSON_EXTRACT(skills, \'$.programming\') AS programming_skills FROM employees;',
    testCases: [
      { description: 'JSON data extracted', expected: 'Specific JSON field values' }
    ]
  },
  {
    id: 'adv-json-2',
    title: 'Convert Relational Data to JSON',
    difficulty: 'Hard',
    level: 'Advanced',
    concept: 'JSON and Advanced Data Types',
    estimatedTime: '28 min',
    description: 'Convert relational data into a JSON structure.',
    hints: ['Use JSON_OBJECT() or JSON_AGG()', 'Build JSON from column values'],
    initialCode: 'SELECT \nFROM employees;',
    solution: 'SELECT JSON_OBJECT(\'id\', employee_id, \'name\', employee_name, \'salary\', salary) AS employee_json FROM employees;',
    testCases: [
      { description: 'JSON output', expected: 'Employee data as JSON objects' }
    ]
  }
];

export const levelOrder = ['Fundamentals', 'Intermediate', 'Advanced'];

export const conceptsByLevel: Record<string, string[]> = {
  'Fundamentals': [
    'Data Retrieval Queries',
    'Filtering and Sorting Data',
    'Aggregation and Summary Functions',
    'Grouping and Conditional Aggregation',
    'Introductory Table Joins',
    'Column Aliasing and Core SQL Functions'
  ],
  'Intermediate': [
    'Advanced Joins and Set Operations',
    'Subqueries and Nested Logic',
    'Conditional Expressions',
    'String and Date Manipulation',
    'Data Manipulation Statements'
  ],
  'Advanced': [
    'Analytical and Window Functions',
    'Common Table Expressions (CTEs)',
    'Query Optimization and Indexing',
    'Database Normalization and Schema Design',
    'Transactions and Concurrency Control',
    'Stored Procedures and Triggers',
    'JSON and Advanced Data Types'
  ]
};
