import express from "express";
import {
    addEmployee,
    deleteEmployee,
    loginEmployee,
    logoutEmployee,
    updateEmployee
} from "../controllers/employee.controller.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = express.Router()

router.post('/addEmployee',authMiddleware, addEmployee);
router.post('/loginEmployee', loginEmployee);
router.get('/logoutEmployee', logoutEmployee);
router.post('/deleteEmployee',authMiddleware, deleteEmployee);
router.post('/updateEmployee',authMiddleware, updateEmployee);

export default router