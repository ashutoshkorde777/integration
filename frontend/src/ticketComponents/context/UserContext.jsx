import React, { createContext, useState, useEffect } from 'react';


const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentRole, setCurrentRole] = useState(null);

    


    const updateCurrentRole = async (role)=>{
        setCurrentRole(role);
    }
    

    const initializeUser = async (user,department,role) => {
        setUser(user);
        setIsAuthenticated(true);
        const permission = await (user.roles.filter(obj => obj.department === department && obj.designation === role))[0].permissions;
        setCurrentRole({department:department, designation:role, permissions:permission } || null);
        console.log(currentRole);
        console.log('Current Role:', { department: department, designation: role, permissions:permission });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        setCurrentRole(null);
    };

    // useEffect(() => {
    //     console.log('Token:', token);
    //     console.log('Decoded Token:', decodedToken);
    //     console.log('Is Expired:', isExpired);
    //     console.log('isAuthenticated:', isAuthenticated);



    //     if (token && !isExpired) {            
    //         setUser(decodedToken);
    //         setIsAuthenticated(true);
    //         if(decodedToken){
    //             setCurrentRole(decodedToken.roles[0]);
    //             console.log(user);
    //             console.log(currentRole);
    //         }
    //         else{
    //             setCurrentRole(null);
    //         }
            

    //     } else {
    //         logout();
    //     }
    // }, [token, decodedToken, isExpired]);

    return (
        <UserContext.Provider value={{ user, isAuthenticated, currentRole, logout, initializeUser, updateCurrentRole }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
