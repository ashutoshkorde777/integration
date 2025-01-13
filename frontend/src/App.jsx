import React from 'react';
import { useSelector } from 'react-redux';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Home from './pages/Home';
import Layout from './Layout.jsx';
import EmployeeDashboard from "./pages/employee/EmployeeDashboard.jsx";
import EmployeeProfile from "./pages/employee/EmployeeProfile.jsx";
import AddEmployee from "./pages/employee/AddEmployee.jsx";
import EditEmployeePage from "./pages/employee/EditEmployee.jsx";
import DepartmentDashboard from "./pages/department/DepartmentDashboard.jsx";
import {Bounce, ToastContainer} from "react-toastify";
import AddDepartment from "./pages/department/AddDepartment.jsx";
import DepartmentProfile from "./pages/department/DepartmentProfile.jsx";
import Profile from "./pages/Profile.jsx";
import Modal from "react-modal";
import Dashboard from "./ticketComponents/Dashboard/Dashboard.jsx";
import TicketForm from "./ticketComponents/CreateTicket/CreateTicket.jsx";  
import TicketPage from "./ticketComponents/TicketPage/TicketPage.jsx";
import FilteredTicketPage from "./ticketComponents/FilteredTicketPage/FilteredTicketPage.jsx";
import AdminFunctionalities from "./ticketComponents/AdminFunctionalities/AdminFunctionalities.jsx";
import ManageIssueTypes from "./ticketComponents/ManageIssueTypes/ManageIssueTypes.jsx";
import ManageBasicSolutions from "./ticketComponents/ManageBasicSolutions/ManageBasicSolutions.jsx";
import ManageTicketTitles from "./ticketComponents/ManageTicketTitles/ManageTicketTitles.jsx";
import ManageSendMailTo from "./ticketComponents/ManageSendMailTo/ManageSendMailTo.jsx";


Modal.setAppElement('#root');


const App = () => {
    const {isAuthenticated} = useSelector((state) => state.auth);

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />
            <Router>
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/"/> : <Login/>}/>

                    <Route element={<Layout/>}>
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <Home/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employees"
                            element={
                                <PrivateRoute>
                                    <EmployeeDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/departments"
                            element={
                                <PrivateRoute>
                                    <DepartmentDashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/addDepartment"
                            element={
                                <PrivateRoute>
                                    <AddDepartment/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/department/:id"
                            element={
                                <PrivateRoute>
                                    <DepartmentProfile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/:id"
                            element={
                                <PrivateRoute>
                                    <EmployeeProfile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/addEmployee"
                            element={
                                <PrivateRoute>
                                    <AddEmployee/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/employee/edit/:id"
                            element={
                                <PrivateRoute>
                                    <EditEmployeePage/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/designations"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/training"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/tickettracking"
                            element={
                                <PrivateRoute>
                                    <Dashboard/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/createTicket"
                            element={
                                <PrivateRoute>
                                    <TicketForm />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ticketPage/:id"
                            element={
                                <PrivateRoute>
                                   <TicketPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/FilteredTicketPage"
                            element={
                                <PrivateRoute>
                                   <FilteredTicketPage />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/adminFunctionalities"
                            element={
                                <PrivateRoute>
                                   <AdminFunctionalities />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/issue-types"
                            element={
                                <PrivateRoute>
                                   <ManageIssueTypes />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/basic-solutions"
                            element={
                                <PrivateRoute>
                                   <ManageBasicSolutions />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/ticket-titles"
                            element={
                                <PrivateRoute>
                                   <ManageTicketTitles />
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/send-mail-to"
                            element={
                                <PrivateRoute>
                                   < ManageSendMailTo/>
                                </PrivateRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <PrivateRoute>
                                    <Profile/>
                                </PrivateRoute>
                            }
                        />
                    </Route>
                    <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"}/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
