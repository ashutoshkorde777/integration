import asyncHandler from "../utils/asyncHandler.js";
import { connection } from "../db/index.js";
import { generateAccessToken } from "../utils/tokens.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

// Refresh token endpoint
export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json(new ApiError(400, 'Refresh token is required'));
    }

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        const employeeId = decoded.employeeId;
        const [employee] = await connection.promise().query('SELECT * FROM employee WHERE customEmployeeId = ?', [employeeId]);

        if (employee.length === 0 || employee[0].employeeRefreshToken !== refreshToken) {
            return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // Generate new accessToken
        const newAccessToken = generateAccessToken({ employeeId: employeeId, employeeEmail: employee[0].employeeEmail });

        res.json({ accessToken: newAccessToken });
    });
});


export const validate = asyncHandler(async (req, res) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

        // Debug the decoded token
        // console.log('Decoded Token:', decoded);

        const [result] = await connection.promise().query('SELECT employeeAccess FROM employee WHERE employeeId = ?', [decoded.employeeId]);

        if (result.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ accessString: result[0].accessString });
    } catch (err) {
        console.error('Token validation error:', err);
        res.status(403).json({ error: 'Invalid or expired token' });
    }

});

