import asyncHandler from "../utils/asyncHandler.js";
import { connection } from "../db/index.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens.js";

export const addEmployee = asyncHandler(async (req, res) => {
    const employee = req.body;

    // Check if customEmployeeId is unique
    const checkForCustomIdQuery = `SELECT * FROM employee WHERE customEmployeeId = ?`;
    const [checkingCustomIdResult] = await connection.promise().query(checkForCustomIdQuery, [employee.employee.customEmployeeId]);

    if (checkingCustomIdResult.length > 0) {
        return res.status(400).json(new ApiError(400, 'CustomEmployeeID should be unique', ['CustomEmployeeID should be unique']));
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(employee.employee.employeePassword, 10);

    // Generate refresh token for the employee
    const employeeRefreshToken = generateRefreshToken({ employeeId: employee.employee.customEmployeeId });

    // Insert the employee into the employee table
    const insertEmployeeQuery = `
        INSERT INTO employee 
        (customEmployeeId, employeeName, companyName, employeeQualification, experienceInYears, 
         employeeDOB, employeeJoinDate, employeeGender, employeePhone, employeeEmail, 
         employeePassword, employeeAccess, employeeRefreshToken) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const employeeData = [
        employee.employee.customEmployeeId,
        employee.employee.employeeName,
        employee.employee.companyName,
        employee.employee.employeeQualification,
        employee.employee.experienceInYears,
        employee.employee.employeeDOB,
        employee.employee.employeeJoinDate,
        employee.employee.employeeGender,
        employee.employee.employeePhone,
        employee.employee.employeeEmail,
        hashedPassword, // Use hashed password here
        employee.employee.employeeAccess,
        employeeRefreshToken // Add the generated refresh token here
    ];

    const [result] = await connection.promise().query(insertEmployeeQuery, employeeData);
    const employeeId = result.insertId;

    // Insert job profiles into employeedesignation table
    for (const profile of employee.jobProfiles) {
        let { designationId, designationName, departmentId, managerId } = profile;

        if (!departmentId) {
            return res.status(400).json({ message: "Department ID is required." });
        }

        // Insert designation if designationId is 0
        if (designationId === 0) {
            const insertQuery = `INSERT INTO designation (designationName) VALUES (?);`;
            const [designationInsertResult] = await connection.promise().query(insertQuery, [designationName]);
            designationId = designationInsertResult.insertId;
        }

        // Insert job profile for the employee
        const insertJobProfileQuery = `
            INSERT INTO employeedesignation (employeeId, designationId, departmentId, managerId) 
            VALUES (?, ?, ?, ?)
        `;
        await connection.promise().query(insertJobProfileQuery, [employeeId, designationId, departmentId, managerId]);
    }

    res.status(201).json(new ApiResponse(201, result.insertId, "Employee and job profiles added successfully."));
});

export const loginEmployee = asyncHandler(async (req, res) => {
    const { employeeEmail, employeePassword } = req.body;

    connection.query('SELECT * FROM employee WHERE employeeEmail = ?', [employeeEmail], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const employee = results[0];

        // Check if the password matches
        const isPasswordValid = await bcrypt.compare(employeePassword, employee.employeePassword);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate tokens
        const user = { employeeId: employee.employeeId, employeeEmail };
        const accessToken = generateAccessToken(user);
        const refreshToken = employee.employeeRefreshToken; // Assuming refresh token is already stored in DB

        // Set accessToken as an HTTP-only cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Set secure to true in production
            maxAge: 30 * 60 * 1000, // 30 minutes
            path: '/'
        });

        const [employeeAccess] = await connection.promise().query(`SELECT employeeAccess FROM employee WHERE employeeId = ${employee.employeeId}`);
        const accessString = employeeAccess[0].employeeAccess;

        res.json({ refreshToken, accessToken, accessString });
    });
});

export const logoutEmployee = asyncHandler(async (req, res) => {
    res.clearCookie('accessToken', { path: '/', httpOnly: true, secure: true });
    res.status(200).json({ message: 'Logged out successfully' });
});

export const deleteEmployee = asyncHandler(async (req, res) => {
    const { employeeId } = req.body;

    if (!employeeId) {
        return res.status(400).json({ message: "Employee ID is required" });
    }

    // Check if the employee exists
    const checkEmployeeQuery = "SELECT * FROM employee WHERE employeeId = ?";
    const [employee] = await connection.promise().query(checkEmployeeQuery, [employeeId]);

    if (employee.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
    }

    // Update employeeEndDate to CURRENT_DATE
    const updateEmployeeQuery = "UPDATE employee SET employeeEndDate = CURRENT_DATE WHERE employeeId = ?";
    await connection.promise().query(updateEmployeeQuery, [employeeId]);

    res.status(200).json({ message: "Employee successfully deactivated" });
});

export const updateEmployee = asyncHandler(async (req, res) => {
    const { employeeId, updates, jobProfiles } = req.body;

    if (!employeeId || (!updates && !jobProfiles)) {
        return res.status(400).json({ message: "Employee ID, updates, or jobProfiles are required" });
    }

    // Check if the employee exists
    const checkEmployeeQuery = "SELECT * FROM employee WHERE employeeId = ?";
    const [employee] = await connection.promise().query(checkEmployeeQuery, [employeeId]);

    if (employee.length === 0) {
        return res.status(404).json({ message: "Employee not found" });
    }

    // 1. Update the employee table
    if (updates) {
        const fieldsToUpdate = [];
        const values = [];

        for (const key in updates) {
            if (updates.hasOwnProperty(key)) {
                fieldsToUpdate.push(`${key} = ?`);
                values.push(updates[key]);
            }
        }

        // Add the employeeId at the end for the WHERE clause
        values.push(employeeId);

        const updateQuery = `UPDATE employee SET ${fieldsToUpdate.join(", ")} WHERE employeeId = ?`;
        await connection.promise().query(updateQuery, values);
    }

    // 2. Update job profiles (employeedesignation table)
    if (jobProfiles && Array.isArray(jobProfiles)) {
        for (const profile of jobProfiles) {
            const { designationId, designationName, departmentId, managerId, operation } = profile;

            if (!departmentId) {
                return res.status(400).json({ message: "Department ID is required for job profile update." });
            }

            if (operation === "update") {
                // Update existing job profile
                const updateJobProfileQuery = `
                    UPDATE employeedesignation
                    SET designationId = ?, departmentId = ?, managerId = ?
                    WHERE employeeId = ? AND designationId = ?`;
                await connection.promise().query(updateJobProfileQuery, [designationId, departmentId, managerId, employeeId, designationId]);
            } else if (operation === "add") {
                // Add new job profile
                const insertJobProfileQuery = `
                    INSERT INTO employeedesignation (employeeId, designationId, departmentId, managerId)
                    VALUES (?, ?, ?, ?)`;
                await connection.promise().query(insertJobProfileQuery, [employeeId, designationId, departmentId, managerId]);
            } else if (operation === "delete") {
                // Delete job profile
                const deleteJobProfileQuery = `
                    DELETE FROM employeedesignation
                    WHERE employeeId = ? AND designationId = ?`;
                await connection.promise().query(deleteJobProfileQuery, [employeeId, designationId]);
            }
        }
    }

    res.status(200).json({ message: "Employee and job profiles updated successfully" });
});

export const getAllEmployees = asyncHandler(async (req, res) => {
    const query = `
        SELECT 
            e.employeeId,
            e.customEmployeeId, 
            e.employeeName, 
            e.companyName, 
            e.employeeQualification, 
            e.experienceInYears, 
            e.employeeDOB, 
            e.employeeJoinDate, 
            e.employeeGender, 
            e.employeePhone, 
            e.employeeEmail, 
            e.employeeAccess, 
            e.employeeEndDate, 
            d.departmentName, 
            ds.designationName, 
            m.employeeName AS managerName
        FROM 
            employee e
        LEFT JOIN 
            employeeDesignation ed ON e.employeeId = ed.employeeId
        LEFT JOIN 
            department d ON ed.departmentId = d.departmentId
        LEFT JOIN 
            designation ds ON ed.designationId = ds.designationId
        LEFT JOIN 
            employee m ON ed.managerId = m.employeeId;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            throw new Error("Error fetching employees: " + err.message);
        }

        // Group the results
        const employeesMap = {};

        results.forEach((row) => {
            const customEmployeeId = row.customEmployeeId;

            if (!employeesMap[customEmployeeId]) {
                // Initialize the employee object if not already present
                employeesMap[customEmployeeId] = {
                    employee: {
                        employeeId: row.employeeId,
                        customEmployeeId: row.customEmployeeId,
                        employeeName: row.employeeName,
                        companyName: row.companyName,
                        employeeQualification: row.employeeQualification,
                        experienceInYears: row.experienceInYears,
                        employeeDOB: row.employeeDOB,
                        employeeJoinDate: row.employeeJoinDate,
                        employeeGender: row.employeeGender,
                        employeePhone: row.employeePhone,
                        employeeEmail: row.employeeEmail,
                        employeeAccess: row.employeeAccess,
                        employeeEndDate: row.employeeEndDate,
                    },
                    jobProfiles: [],
                };
            }

            // Add the job profile to the employee's jobProfiles array
            if (row.designationName || row.departmentName || row.managerName) {
                employeesMap[customEmployeeId].jobProfiles.push({
                    designationName: row.designationName,
                    departmentName: row.departmentName,
                    managerName: row.managerName,
                });
            }
        });

        // Convert the map to an array of grouped objects
        const employees = Object.values(employeesMap);

        res.status(200).json(employees);
    });
});
