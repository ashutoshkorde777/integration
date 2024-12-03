import './DepartmentDashboard.css';
import Infocard from '../../components/Infocard/Infocard.jsx';
import Searchbar from './Searchbox/Searchbar.jsx';
import TableComponent from '../../components/Table/TableComponent.jsx';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllWorkingDepartments } from "../../features/departmentSlice.js";
import { FiPlusCircle, FiBriefcase } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DepartmentDashboard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Fetch working departments on component mount
    useEffect(() => {
        dispatch(fetchAllWorkingDepartments());
    }, [dispatch]);

    // Access working departments from Redux state
    const { workingDepartments } = useSelector(state => state.department);
    console.log(workingDepartments);

    // Populate rows from working departments
    const rows = workingDepartments.map((department) => ({
        id: department.departmentId,
        deptName: department.departmentName, // Adjust keys based on your API response
    }));

    const columns = [
        { id: 'deptName', label: 'Department Name', align: 'left' },
    ];

    return (
        <div className='dashboard'>
            <div className='infocard-container-parent'>
                <div className='infocard-container'>
                    <Infocard
                        icon={`<FiBriefcase />`}
                        number={rows.length}
                        text={'All Departments'}
                        className={'selected'}
                        width={225}
                    />
                </div>
                <button
                    className="add-btn"
                    onClick={() => navigate('/department/addDepartment')}>
                    <FiPlusCircle style={{ marginRight: "10px", width: "25px", height: "25px" }} />
                    Add department
                </button>
            </div>
            {/* Searchbar Component */}
            {/* <Searchbar lst={rows} /> */}

            {/* Table Component */}
            <TableComponent rows={rows} columns={columns} linkBasePath={`/department`} />
        </div>
    );
};

export default DepartmentDashboard;
