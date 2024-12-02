import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllEmployees } from '../../features/employeeSlice.js'; // Update import to match actual file location

const EmployeeList = () => {
    const dispatch = useDispatch();
    const { employees, loading, error } = useSelector((state) => state.employee);  // Correct state path

    useEffect(() => {
        dispatch(getAllEmployees());
    }, [dispatch]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h1>Employee List</h1>
            <ul>
                {employees.map((employee) => (
                    <li key={employee.id}>{employee.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default EmployeeList;
