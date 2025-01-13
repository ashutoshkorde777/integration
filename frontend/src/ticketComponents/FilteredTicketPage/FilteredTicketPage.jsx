import React, { useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import TicketTable from "../TicketTable/TicketTable";
import BackButton from "../Backbutton/Backbutton";
import UserContext from "../context/UserContext";
import axios from "axios";
import { TextField, MenuItem, Select, InputLabel, FormControl, Box, Button, Grid } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import * as XLSX from 'xlsx'; // Import the xlsx library



function FilteredTicketPage() {
  const location = useLocation();
  const type = location.state?.ticketsType || ''; // Only receive ticketsType from route location state

  const [tickets, setTickets] = useState([]); // Local state for all fetched tickets
  const [ticketsType, setTicketsType] = useState(type);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOption, setFilterOption] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const { user } = useContext(UserContext);
  const { currentRole } = useContext(UserContext);

  // Function to fetch tickets based on role and user info
  const fetchTickets = async () => {
    try {
      // let endpoint = "http://localhost:3000/tickets/tickets";
      // let params = {};

      // if (currentRole?.designation === "Executive") {
      //   params = { employee_id: user.id };
      // } else if (currentRole?.designation === "HOD") {
      //   params = { department: currentRole.department };
      // } else if (currentRole?.designation === "Admin") {
      //   // No additional params needed for admin
      // } else if (currentRole?.designation === "Assignee") {
      //   if (type === "Unassigned") {
      //     params = { department: currentRole.department };

      //   } else {
      //     params = { assignee: user.name };
      //   }

      // }


      // const response = await axios.get(endpoint, { params });
      // setTickets(response.data);


      let params = {};

      if (currentRole?.designation === "Executive") {
        params = { employee_id: user.id, ticketsType: ticketsType };
      } else if (currentRole?.designation === "HOD") {
        params = { department: currentRole.department, ticketsType: ticketsType };
      } else if (currentRole?.designation === "Admin") {
        params = { ticketsType: ticketsType }; // Add default for admin if required
      } else if (currentRole?.designation === "Assignee") {
        params = { assignee: user.name, assigneeDepartment: currentRole.department, ticketsType: ticketsType };
      }

      let endpoint = "http://localhost:3000/tickets/filteredTickets";

      // Debugging
      console.log("Sending request to:", endpoint);
      console.log("Query params:", params);

      try {
        const response = await axios.get(endpoint, { params: params });
        console.log("Response data:", response.data);
        setTickets(response.data);
      } catch (error) {
        console.error("Error in Axios call:");
        if (error.response) {
          console.error("Response error:", error.response.data);
        } else if (error.request) {
          console.error("Request error:", error.request);
        } else {
          console.error("General error:", error.message);
        }
      }



    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  };

  const handleSearchSubmit = () => {
    setSubmittedQuery(searchQuery); // Update submittedQuery on submit
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSubmittedQuery("");
    setFilterOption("");
  };


  // Function to handle ticket updates
  const handleTicketUpdate = (updatedTicket) => {
    // Filter out the ticket with the same id as updatedTicket
    const updatedTickets = tickets.filter(ticket => ticket.id !== updatedTicket.id);

    // Add the updated ticket to the filtered list and sort them
    const sortedTickets = [...updatedTickets, updatedTicket].sort((a, b) => {
      return new Date(b.ticket_created_at) - new Date(a.ticket_created_at);
    });

    // Update the tickets state
    setTickets(sortedTickets);
  };

  // Separate function to filter tickets based on dropdown selection
  const applyDropdownFilter = (ticketsList) => {
    let filteredList = [...ticketsList];

    if (filterOption) {
      switch (filterOption) {
        case 'Latest Status':
          filteredList = filteredList.sort((a, b) => {
            const statusOrder = {
              open: 1,
              reopened: 2,
              pending: 3,
              hold: 4,
              close: 5, // Closed tickets should be at the end
            };

            // If both tickets are closed
            if (a.status === 'close' && b.status === 'close') {
              return new Date(b.ticket_created_at) - new Date(a.ticket_created_at); // Sort by creation date if both are closed
            }
            // If one of the tickets is closed, it should be pushed to the end
            if (a.status === 'close') return 1; // `a` goes after `b`
            if (b.status === 'close') return -1; // `b` goes after `a`

            // Sort by status order if neither is closed
            if (statusOrder[a.status] !== statusOrder[b.status]) {
              return statusOrder[a.status] - statusOrder[b.status];
            } else {
              return new Date(b.ticket_created_at) - new Date(a.ticket_created_at); // Sort by creation date if status is same
            }
          });
          break;

        case 'Priority':
          const priorityOrder = { high: 1, mid: 2, low: 3 };
          filteredList.sort((a, b) => {
            const priorityA = priorityOrder[a.priority] || Infinity;
            const priorityB = priorityOrder[b.priority] || Infinity;

            // If both tickets are closed
            if (a.status === 'close' && b.status === 'close') {
              return new Date(b.ticket_created_at) - new Date(a.ticket_created_at); // Sort by creation date if both are closed
            }
            // If one of the tickets is closed, it should be pushed to the end
            if (a.status === 'close') return 1; // `a` goes after `b`
            if (b.status === 'close') return -1; // `b` goes after `a`

            // Sort by priority if neither is closed
            return priorityA - priorityB;
          });
          break;

        default:
          break;
      }
    }

    return filteredList;
  };



  // Separate function to filter tickets based on search input
  const applySearchFilter = (ticketsList) => {
    let filteredList = [...ticketsList];
    if (submittedQuery) {
      filteredList = filteredList.filter(ticket => {
        const isIdSearch = !isNaN(submittedQuery) && ticket.id.toString() === submittedQuery;
        return (
          isIdSearch ||
          ticket.title.toLowerCase().includes(submittedQuery.toLowerCase()) ||
          ticket.description.toLowerCase().includes(submittedQuery.toLowerCase())
        );
      });
    }
    return filteredList;
  };



  useEffect(() => {
    if (currentRole && user) {
      fetchTickets(); // Fetch tickets on component mount or role/user change
    }
  }, [currentRole, user]);

  useEffect(() => {
    // Log the tickets state whenever it changes for debugging
    // console.log("Tickets state updated:", tickets);

    // Filter tickets based on ticketsType first
    let ft = [...tickets];
    switch (ticketsType) {
      case 'Overdue':
        if (currentRole.designation === 'Assignee') {
          ft = tickets.filter(ticket => new Date(ticket.ticket_created_at) < new Date() && ticket.status !== 'close' && ticket.assignee === user.name);
        } else {
          ft = tickets.filter(ticket => new Date(ticket.ticket_created_at) < new Date() && ticket.status !== 'close');
        }
        break;
      case 'Due today':
        if (currentRole.designation === 'Assignee') {
          ft = tickets.filter(ticket => {
            const ticketDate = new Date(ticket.ticket_created_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return ticketDate.toDateString() === sevenDaysAgo.toDateString() && ticket.assignee === user.name;
          });
        } else {
          ft = tickets.filter(ticket => {
            const ticketDate = new Date(ticket.ticket_created_at);
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return ticketDate.toDateString() === sevenDaysAgo.toDateString();
          });
        }
        break;
      case 'Open':
        if (currentRole.designation === 'Assignee') {
          ft = tickets.filter(ticket => ticket.status === 'open' && ticket.assignee === user.name);
        } else {
          ft = tickets.filter(ticket => ticket.status === 'open');
        }
        break;
      case 'On hold':
        if (currentRole.designation === 'Assignee') {
          ft = tickets.filter(ticket => ticket.status === 'hold' && ticket.assignee === user.name);
        } else {
          ft = tickets.filter(ticket => ticket.status === 'hold');
        }
        break;
      case 'Unassigned':
        // Fetch all department tickets and filter out unassigned ones for Assignee role
        if (currentRole.designation === 'Assignee') {
          ft = tickets.filter(ticket => !ticket.assignee && ticket.department === currentRole.department);
        } else {
          ft = tickets.filter(ticket => !ticket.assignee);
        }
        break;
      case 'All tickets':
        if (currentRole.designation === 'Assignee') {
          ft = tickets.filter(ticket => ticket.assignee === user.name);
        } else {
          ft = tickets;
        }
        break;
      default:
        break;
    }

    // Apply the search and dropdown filters sequentially
    const searchFilteredTickets = applySearchFilter(ft);
    const finalFilteredTickets = applyDropdownFilter(searchFilteredTickets);

    // Update the state with the final filtered tickets
    setFilteredTickets(finalFilteredTickets);

  }, [tickets, ticketsType, currentRole, user, submittedQuery, filterOption]); // Adding tickets as a dependency here to trigger the update

  // Handle search bar input and update the state
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value); // Update the search query
  };

  // Handle filter dropdown selection and update the state
  const handleFilterChange = (e) => {
    setFilterOption(e.target.value); // Update the filter option
  };



  const exportToExcel = () => {
    // Define a dynamic sheet name based on the current filter and status
    let sheetName = 'Report';

    if (filterOption) {
      sheetName = `${filterOption} - Tickets`;
    }

    // Optionally, add status information to the sheet name if there's a status filter or ticket type
    if (ticketsType) {
      sheetName = `${sheetName} - ${ticketsType}`;
    }

    // Convert filtered tickets to Excel sheet format
    const ws = XLSX.utils.json_to_sheet(filteredTickets);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, sheetName); // Use the dynamic sheet name
    XLSX.writeFile(wb, `${sheetName}.xlsx`); // Save the file with the dynamic name
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', padding: '16px', flexDirection: 'row' }}>
        <BackButton />
      </div>

      {/* Search bar and Filter dropdown in the same row */}
      <Box display="flex" justifyContent="space-between" alignItems="center" margin={5} >
        <Grid container spacing={0} alignItems="center">
          {/* Search bar */}
          <Grid item>
            <TextField
              label="Search tickets"
              variant="outlined"
              value={searchQuery}
              onChange={handleSearchChange}
              size="small"
              style={{ width: 300 }}
            />
          </Grid>

          {/* Search button */}
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<SearchIcon />}
              style={{ marginLeft: 8, padding: '6px 16px' }}
              onClick={handleSearchSubmit} // Add this line
            >
              Search
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="outlined"
              color="secondary"
              size="medium"
              style={{ marginLeft: 8, padding: '6px 16px' }}
              onClick={handleClearFilters} // Add this line
            >
              Clear
            </Button>
          </Grid>

          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={exportToExcel}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 16px',
                marginLeft: 1,
                backgroundColor: '#0061a1',
                color: 'white',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#004c82',
                }
              }}
            >
              <span className="action-icon"> {/* Add your icon here */} </span>
              Download Report
            </Button>
          </Grid>


          {/* Spacer to push the dropdown to the right */}
          <Grid item xs />

          {/* Filter dropdown */}
          <Grid item>
            <FormControl variant="outlined" size="small" style={{ width: 180 }}>
              <InputLabel id="filter-label">Sort by</InputLabel>
              <Select
                labelId="filter-label"
                id="filter-select"
                value={filterOption}
                onChange={handleFilterChange}
                label="Sort by"
              >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="Latest Status">Latest Status</MenuItem>
                <MenuItem value="Priority">Priority</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <div className="new-container">
        {tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '16px' }}>No tickets found</div>
        ) : (
          <TicketTable tickets={filteredTickets} onTicketUpdate={handleTicketUpdate} />
        )}
      </div>
    </>
  );
}

export default FilteredTicketPage;
