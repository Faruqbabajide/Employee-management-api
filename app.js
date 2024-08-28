const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(express.json());

// In-memory storage for employees
let employees = [];

// Helper function to find employee by ID
const findEmployeeById = (id) => employees.find(emp => emp.id === id);

// Helper function to validate employee data
const validateEmployeeData = (data) => {
    const { name, position, department, contact } = data;
    if (!name || typeof name !== 'string') return false;
    if (!position || typeof position !== 'string') return false;
    if (!department || typeof department !== 'string') return false;
    if (!contact || typeof contact !== 'string') return false;
    return true;
};

// Create a new employee
app.post('/api/v1/employees', (req, res) => {
    const { name, position, department, contact } = req.body;

    if (!validateEmployeeData(req.body)) {
        return res.status(400).json({ error: 'Invalid employee data.' });
    }

    const newEmployee = {
        id: uuidv4(),
        name,
        position,
        department,
        contact,
        isActive: true,
        performanceReviews: []
    };

    employees.push(newEmployee);
    res.status(201).json(newEmployee);
});

// Retrieve a list of all employees
app.get('/api/v1/employees', (req, res) => {
    res.status(200).json(employees);
});

// Retrieve details of a specific employee by ID
app.get('/api/v1/employees/:id', (req, res) => {
    const employee = findEmployeeById(req.params.id);

    if (!employee) {
        return res.status(404).json({ error: 'Employee not found.' });
    }

    res.status(200).json(employee);
});

// Update employee details by ID
app.put('/api/v1/employees/:id', (req, res) => {
    const employee = findEmployeeById(req.params.id);
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found.' });
    }

    const { name, position, department, contact } = req.body;

    if (name) employee.name = name;
    if (position) employee.position = position;
    if (department) employee.department = department;
    if (contact) employee.contact = contact;

    res.status(200).json(employee);
});

// Record performance reviews for an employee
app.post('/api/v1/employees/:id/reviews', (req, res) => {
    const employee = findEmployeeById(req.params.id);
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found.' });
    }

    const { review } = req.body;

    if (!review || typeof review !== 'string') {
        return res.status(400).json({ error: 'Invalid review data.' });
    }

    employee.performanceReviews.push(review);
    res.status(201).json(employee);
});

// Deactivate an employee's profile by ID
app.patch('/api/v1/employees/:id/deactivate', (req, res) => {
    const employee = findEmployeeById(req.params.id);
    if (!employee) {
        return res.status(404).json({ error: 'Employee not found.' });
    }

    employee.isActive = false;
    res.status(200).json(employee);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
