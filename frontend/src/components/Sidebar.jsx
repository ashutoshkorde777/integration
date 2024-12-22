import './Sidebar.css';
import { FiMenu, FiClipboard, FiBriefcase, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from "./LogoutButton.jsx";
import { BsTicket } from "react-icons/bs";
import { PiOfficeChair } from "react-icons/pi";
import { MdOutlineModelTraining } from "react-icons/md";


// Utility to map icon strings to actual icon components
const iconMap = {
    FiClipboard: <FiClipboard size={22} color="white" />,
    FiBriefcase: <FiBriefcase size={22} color="white" />,
    FiUser: <FiUser size={22} color="white" />,
    BsTicket: <BsTicket size={22} color="white" />,
    PiOfficeChair: <PiOfficeChair size={22} color="white" />,
    MdOutlineModelTraining: <MdOutlineModelTraining size={22} color="white" />,
};

const Sidebar = () => {
    const navigate = useNavigate();

    const navItems = [
        {
            name: 'Projects',
            slug: "/projects",
            active: true,
            icon: 'FiClipboard'
        },
        {
            name: "Employees",
            slug: "/employees",
            active: true,
            icon: 'FiUser'
        },
        {
            name: "Departments",
            slug: "/departments",
            active: true,
            icon: 'FiBriefcase'
        },
        {
            name: "Designations",
            slug: "/designations",
            active: true,
            icon: 'PiOfficeChair'
        },
        {
            name: "Training",
            slug: "/training",
            active: true,
            icon: 'MdOutlineModelTraining'
        },
        {
            name: "Ticket Tracking",
            slug: "/tickettracking",
            active: true,
            icon: 'BsTicket'
        },
    ];

    return (
        <div className="sidebar">
            <div>
                <FiMenu className="menu-icon" size={22} color="white" />
                <div className="menu">
                    {navItems.map(item =>
                        item.active ? (
                            <Link
                                key={item.name}
                                to={item.slug}
                                className="icon-container"
                            >
                                {iconMap[item.icon]}
                                <span className="menu-text">{item.name}</span>
                            </Link>
                        ) : null
                    )}
                </div>
            </div>
            <div>

                <LogoutButton/>
            </div>
        </div>
    );
}

export default Sidebar;
