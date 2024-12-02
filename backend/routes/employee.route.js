import express from "express";
import {
    addEmployee,
    deleteEmployee, getAllEmployees,
    loginEmployee,
    logoutEmployee,
    updateEmployee
} from "../controllers/employee.controller.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/addEmployee',authMiddleware, addEmployee);
router.post('/loginEmployee', loginEmployee);
router.post('/logoutEmployee', logoutEmployee);
router.post('/deleteEmployee',authMiddleware, deleteEmployee);
router.post('/updateEmployee',authMiddleware, updateEmployee);
router.get('/getAllEmployees', getAllEmployees);

export default router