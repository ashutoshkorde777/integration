import React, { createContext, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    // Get user and jobProfiles from Redux store
    const reduxUser = useSelector((state) => state.auth.user);
    const jobProfiles = useSelector((state) => state.auth.jobProfiles);

    // Initialize user with roles
    const initializeUser = async (user, department, role) => {
        setUser(user);
        setIsAuthenticated(true);
        const permission = await user.roles.find(obj => obj.department === department && obj.designation === role)?.permissions;
        setCurrentRole({ department, designation: role, permissions: permission } || null);
        console.log(currentRole);
        console.log('Current Role:', { department, designation: role, permissions: permission });
    };

    const updateCurrentRole = (role) => {
        setCurrentRole(role);
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        setCurrentRole(null);
    };

    // useEffect to initialize user when data from Redux changes or after the page reloads
    useEffect(() => {
        // Check if reduxUser and jobProfiles are not empty before initializing
        if (reduxUser && jobProfiles.length > 0) {
            console.log("Component mounted in userContext!");
            console.log("User:", reduxUser);
            console.log("Job Profiles:", jobProfiles);

            const roles = jobProfiles.map(profile => ({
                department: profile.departmentName,
                designation: profile.designationName
            }));

            const user2 = {    
                contact: reduxUser.employeePhone,
                email: reduxUser.employeeEmail,
                id: reduxUser.employeeId,
                name: reduxUser.employeeName,
                permissions: reduxUser.employeeAccess.split(',')[3],
                roles: roles
            };

            const tempRole = user2.roles.find((role) => role.designation === "Executive");
            initializeUser(user2, tempRole?.department, tempRole?.designation);
        }
        
        // Cleanup logic
        return () => {
            console.log("UserContext has been unmounted.");
        };
    }, [reduxUser, jobProfiles]);  // Runs when reduxUser or jobProfiles change

    return (
        <UserContext.Provider value={{ user, isAuthenticated, currentRole, logout, initializeUser, updateCurrentRole }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
