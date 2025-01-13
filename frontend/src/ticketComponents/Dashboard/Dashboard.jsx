import React, { useMemo, useState, useContext, useEffect } from 'react';
import { Box, Typography, Paper, Grid, LinearProgress } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DonutChart from '../DonutChart/DonutChart';
import './Dashboard.css';
import BackButton from '../Backbutton/Backbutton';
import UserContext from '../context/UserContext';
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { CiCirclePlus } from "react-icons/ci";

const NavigationHeader = ({ title, subtitle, user, selectedRole }) => (
  <Box display="flex" alignItems="center" padding={{ xs: '8px', sm: '16px' }} flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
    {/* <NavLink to="/mainPage" style={{ textDecoration: 'none', color: '#1A73E8', fontWeight: 'bold', fontSize: '18px', padding: '8px 16px', border: '1px solid #1A73E8', borderRadius: '4px' }}>
      Main Page
    </NavLink> */}
    {selectedRole.designation==="Admin" && <NavLink to="/adminFunctionalities" style={{ textDecoration: 'none', color: '#1A73E8', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="create-ticket-card">
        <div className="create-ticket-body">Admin Functionalities</div>
      </div>
    </NavLink>}

    <NavLink to="/createTicket" style={{ textDecoration: 'none', color: '#1A73E8', display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div className="create-ticket-card">
        <CiCirclePlus className="create-ticket-icon" />
        <div className="create-ticket-body">Create Ticket</div>
      </div>
    </NavLink>


  </Box>
);

const SummaryBoxes = ({ summaryData, onCardClick }) => (
  <Grid container spacing={2} justifyContent="center" padding={{ xs: '8px', sm: '16px' }}>
    {summaryData.map((item, index) => (
      <Grid item key={index} xs={12} sm={6} md={4} lg={2}>
        <Paper
          elevation={3}
          style={{ padding: '16px', textAlign: 'center', cursor: 'pointer' }}
          onClick={() => onCardClick(item.label)}
        >
          <Typography variant="h5" style={{ color: '#1A73E8', fontWeight: 'bold' }}>
            {item.value}
          </Typography>
          <Typography variant="body2" style={{ color: '#757575' }}>
            {item.label}
          </Typography>
        </Paper>
      </Grid>
    ))}
  </Grid>
);

const TicketStatus = ({ statusData }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="body1" gutterBottom style={{ color: '#757575', fontWeight: 'bold' }}>
        Unresolved tickets by status
      </Typography>
      <AccessTimeIcon style={{ color: '#757575' }} />
    </Box>
    {statusData.map((status, index) => (
      <Box key={index} display="flex" flexDirection="column" mb={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="body2" style={{ flexGrow: 1 }}>
            {status.label}
          </Typography>
          <Typography variant="body2">{status.percentage}%</Typography>
          <Typography variant="body2" style={{ marginLeft: 8 }}>
            {status.count}
          </Typography>
        </Box>
        <LinearProgress variant="determinate" value={status.percentage} />
      </Box>
    ))}
  </Box>
);

const CategoryWiseTickets = ({ categories }) => (
  <Box>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Typography variant="body1" gutterBottom style={{ color: '#757575', fontWeight: 'bold' }}>
        New and open tickets category-wise
      </Typography>
      <AccessTimeIcon style={{ color: '#757575' }} />
    </Box>
    {categories.map((category, index) => (
      <Box key={index} mb={2}>
        <Box display="flex" alignItems="center" mb={1}>
          <Typography variant="body2" style={{ flexGrow: 1 }}>
            {category.label}
          </Typography>
          <Typography variant="body2">{category.percentage}%</Typography>
          <Typography variant="body2" style={{ marginLeft: 8 }}>
            {category.count}
          </Typography>
        </Box>
        <LinearProgress
          variant="determinate"
          value={category.percentage}
          style={{
            backgroundColor: index % 2 === 0 ? '#e0f7fa' : '#e3f2fd',
            color: '#0288d1',
          }}
        />
      </Box>
    ))}
  </Box>
);


// Updated fetchTickets function to pass the correct user info and params based on currentRole
const fetchTickets = async (role, user, setTickets, setDepartmentTickets, setTicketSummary) => {
  try {
    // let endpoint = "http://localhost:3000/tickets/tickets";
    let params = {};

    if (role?.designation === "Executive") {
      params = { employee_id: user.id };
    } else if (role?.designation === "HOD") {
      params = { department: role.department };
    } else if (role?.designation === "Admin") {
      // No additional params needed for admin
    } else if (role?.designation === "Assignee") {
      params = { assignee: user.name, assigneeDepartment: role.department };
    }

    // const response = await axios.get(endpoint, { params });
    // setTickets(response.data);
    // const response2 = await axios.get(`http://localhost:3000/tickets/tickets/department/${role.department}`);
    // setDepartmentTickets(response2.data);

    let endpoint = "http://localhost:3000/tickets/tickets/summary";
    // let params2 = {};

    // if (role?.designation === "Executive") {
    //   params2 = { employee_id: user.id };
    // } else if (role?.designation === "HOD") {
    //   params2 = { department: role.department };
    // } else if (role?.designation === "Assignee") {
      
    //   params2 = { assignee: user.name, assigneeDepartment:role.department};
    // }

    const response = await axios.get(endpoint, { params });
    setTicketSummary(response.data);
    
  } catch (error) {
    console.error("Error fetching tickets:", error);
  }
};

function App() {
  const { currentRole, user, updateCurrentRole } = useContext(UserContext); // Make sure to use user from context
  const [tickets, setTickets] = useState([]);
  const [departmentTickets, setDepartmentTickets] = useState([]);
  const [ticketSummary, setTicketSummary] = useState({});
  const [selectedRole, setSelectedRole] = useState(() => {
    // Default to "Executive" role if it exists in the user's roles
    return currentRole || null;
  });

  const navigate = useNavigate(); // Initialize useNavigate


  const handleRoleSelection = (role,updateCurrentRole) => {
    updateCurrentRole(role);
    setSelectedRole(role); // Set selected role
    
    
  };

  useEffect(() => {
    if (selectedRole && user) {
      fetchTickets(selectedRole, user, setTickets, setDepartmentTickets, setTicketSummary); // Fetch tickets based on current role and user
    }

    const interval = setInterval(() => {
      if (selectedRole && user) {
        fetchTickets(selectedRole, user, setTickets, setDepartmentTickets, setTicketSummary); // Poll every 2 seconds
      }
    }, 10000);

    return () => clearInterval(interval); // Clean up on component unmount
  }, [selectedRole, user]);

  // Function to handle card clicks and navigate with filtered tickets
  const handleCardClick = (label) => {
    let filteredTickets = [];
    let type = '';

    switch (label) {
      case 'Overdue':
        // filteredTickets = tickets.filter(ticket => new Date(ticket.ticket_created_at) < new Date() && ticket.status !== 'close');
        type = 'Overdue';
        break;
      case 'Due today':
        // filteredTickets = tickets.filter(ticket => new Date(ticket.ticket_created_at).toDateString() === new Date().toDateString());
        type = 'Due today';
        break;
      case 'Open':
        // filteredTickets = tickets.filter(ticket => ticket.status === 'open');
        type = 'Open';
        break;
      case 'On hold':
        // filteredTickets = tickets.filter(ticket => ticket.status === 'hold');
        type = 'On hold';
        break;
      case 'Unassigned':
        if (selectedRole?.designation === "Assignee") {
          // filteredTickets = departmentTickets.filter(ticket => !ticket.assignee);
          type = 'Unassigned';
        } else {
          // filteredTickets = tickets.filter(ticket => !ticket.assignee);
          type = 'Unassigned';
        }

        break;
      case 'All tickets':
        // filteredTickets = tickets;
        type = 'All tickets';
        break;
      default:
        break;
    }

    navigate('/FilteredTicketPage', { state: { ticketsType: type } });
  };

  // Calculate summary data
  const summaryData = useMemo(() => {
    // const overdue = tickets.filter(ticket => new Date(ticket.ticket_created_at) < new Date() && ticket.status !== 'close').length;
    // const dueToday = tickets.filter(ticket => new Date(ticket.ticket_created_at).toDateString() === new Date().toDateString()).length;
    // const open = tickets.filter(ticket => ticket.status === 'open').length;
    // const onHold = tickets.filter(ticket => ticket.status === 'hold').length;
    // const unassigned = (selectedRole?.designation === "Assignee") ? departmentTickets.filter(ticket => !ticket.assignee).length : tickets.filter(ticket => !ticket.assignee).length;
    // const allTickets = tickets.length;

    return [
      { label: 'Overdue', value: ticketSummary?.summary?.overdue ?? 0 },
      { label: 'Due today', value: ticketSummary?.summary?.dueToday ?? 0 },
      { label: 'Open', value: ticketSummary?.summary?.open ?? 0 },
      { label: 'On hold', value: ticketSummary?.summary?.onHold ?? 0 },
      { label: 'Unassigned', value: ticketSummary?.summary?.unassigned ?? 0 },
      { label: 'All tickets', value: ticketSummary?.summary?.allTickets ?? 0 }
    ];
  }, [tickets, ticketSummary]);

  // Calculate status data
  const statusData = useMemo(() => {
    // const statusCounts = tickets.reduce((acc, ticket) => {
    //   acc[ticket.status] = (acc[ticket.status] || 0) + 1;
    //   return acc;
    // }, {});

    const total = ticketSummary?.summary?.allTickets ?? 0;

    // Provide a fallback to an empty array if `statusData` is undefined or null
    return Object.keys(ticketSummary?.statusData ?? {}).map(status => ({
      label: ticketSummary.statusData[status]?.label || 'Unknown', // Default label
      count: ticketSummary.statusData[status]?.count || 0, // Default count
      percentage: total > 0 ? ((ticketSummary.statusData[status]?.count / total) * 100).toFixed(2) : '0.00',
    }));

  }, [tickets, ticketSummary]);

  // Calculate category-wise data
  const categories = useMemo(() => {
    // const categoryCounts = tickets.reduce((acc, ticket) => {
    //   acc[ticket.issue_type] = (acc[ticket.issue_type] || 0) + 1;
    //   return acc;
    // }, {});

    const total = ticketSummary?.summary?.allTickets ?? 0;

    // Provide a fallback to an empty object if `categories` is undefined or null
    return Object.keys(ticketSummary?.categories ?? {}).map(categoryKey => {
      const category = ticketSummary.categories[categoryKey] || {}; // Fallback to an empty object if the category is undefined

      return {
        label: category?.label || 'Unknown', // Default label
        count: category?.count || 0, // Default count
        percentage: total > 0 ? ((category?.count / total) * 100).toFixed(2) : '0.00',
      };
    });

  }, [tickets,ticketSummary]);

  return (
    <Box p={{ xs: '8px', sm: '16px' }}>
      <div className="topline">
        <NavigationHeader title={'back'} subtitle={'back'} user={user} selectedRole={selectedRole} />
        <div className="dropdown">
          <button
            className="dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            {selectedRole.designation + " " + selectedRole.department}
          </button>
          <ul className="dropdown-menu">
            {user?.roles?.map((role, index) => (
              <li key={index}>
                <button
                  className="dropdown-item"
                  onClick={() => handleRoleSelection(role,updateCurrentRole)}
                >
                  {role.designation + "-" + role.department}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>

      <SummaryBoxes summaryData={summaryData} onCardClick={handleCardClick} />

      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
        <DonutChart  priorityCount={ticketSummary.priority} />
          {/* <Paper elevation={3} style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
           
          </Paper> */}
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <TicketStatus statusData={statusData} />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} style={{ padding: '16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <CategoryWiseTickets categories={categories} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;

{/* <SummaryBoxes summaryData={summaryData} onCardClick={handleCardClick} />  */ }
