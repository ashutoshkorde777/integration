import React, { useState, useEffect, useContext } from 'react';
import {
  Typography, Card, Accordion, AccordionSummary, AccordionDetails, Table, TableHead, TableRow, TableBody, TableCell
} from '@mui/material';
import { styled } from '@mui/system';
import { CiCirclePlus } from 'react-icons/ci';
import PropTypes from 'prop-types';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TicketMessage from '../TicketMessage/TicketMessage.jsx';
import MessageCard from '../MessageCard/MessageCard.jsx';
import UserContext from '../../context/UserContext.jsx';

// Styled components
const AccordionContainer = styled(Accordion)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  border: 'none',
  marginTop: '8px',
  marginLeft: '0px',
}));

const AccordionSummaryContainer = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: 'transparent',
  borderBottom: `1px solid ${theme.palette.divider}`,
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  paddingRight: '8px',
  paddingLeft: '0px',
  '& .MuiAccordionSummary-expandIcon': {
    marginRight: '0px',
  }
}));

const AccordionDetailsContainer = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: 'white',
  width: '1000px',
  height: '218px',
  top: '11px',
  left: '100px',
  borderRadius: '8px',
  border: '1px solid transparent',
  opacity: '1',
  position: 'relative',
  padding: '4px',
  maxHeight: '150px', // Set a maximum height
  overflowY: 'auto', // Enable vertical scrolling
}));

const HistoryTableCell = styled(TableCell)(({ theme }) => ({
  padding: '4px',
  fontSize: '0.875rem',
  borderRight: '2px solid rgba(224, 224, 224, 1)', 
  borderBottom: '2px solid rgba(224, 224, 224, 1)',
  borderTop: '2px solid rgba(224, 224, 224, 1)',
  borderLeft: '2px solid rgba(224, 224, 224, 1)'
}));

const NewMessageCard = styled(Card)(({ theme }) => ({
  width: '200px',
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px 8px',
  border: '2px solid #0061A1',
  backgroundColor: 'transparent',
  color: '#0061A1',
  cursor: 'pointer',
  marginLeft: '8px',
}));

const TicketDetails = ({ ticket = {} }) => {
  const [showTicketMessage, setShowTicketMessage] = useState(false);
  const [messages, setMessages] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [statusHistoryData, setStatusHistoryData] = useState([]);
  const { user } = useContext(UserContext); // Get user from context

  useEffect(() => {
    if (ticket && ticket.id) { // Ensure ticket and ticket.id exist
      const fetchDetails = async () => {
        try {
          // Fetch messages
          const messagesResponse = await fetch(`http://localhost:3000/logs/logs/ticket/${ticket.id}`);
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);

          // Fetch assignee history
          const historyResponse = await fetch(`http://localhost:3000/ticketAssigneeHistory/assignee-history/${ticket.id}`);
          const historyData = await historyResponse.json();
          setHistoryData(historyData);

          // Fetch status history
          const statusHistoryResponse = await fetch(`http://localhost:3000/ticketStatusHistory/status-history/${ticket.id}`);
          const statusHistoryData = await statusHistoryResponse.json();
          setStatusHistoryData(statusHistoryData);
          console.log(statusHistoryData);
        } catch (error) {
          console.error('Error fetching details:', error);
        }
      };
  
      fetchDetails();
    }
  }, [ticket]); // Depend on 'ticket' object

  const handleMessages = (message = {}) =>{
    setMessages([...messages, message]);
  };

  const handleNewMessageClick = () => {
    setShowTicketMessage(!showTicketMessage);
  };

  const renderHistoryAccordion = (history) => (
    <AccordionContainer>
      <AccordionSummaryContainer expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
        <Typography variant="h6">Assignee History</Typography>
      </AccordionSummaryContainer>
      <AccordionDetailsContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <HistoryTableCell>Changed By</HistoryTableCell>
              <HistoryTableCell>Old Assignee Name</HistoryTableCell>
              <HistoryTableCell>New Assignee Name</HistoryTableCell>
              <HistoryTableCell>Change Reason</HistoryTableCell>
              <HistoryTableCell>Assigned Date</HistoryTableCell>
              <HistoryTableCell>Email Sent to Owner</HistoryTableCell>
              <HistoryTableCell>Email Sent to Manager</HistoryTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history && history.length > 0 ? (
              history.map((entry, index) => {
                const assignedDate = new Date(entry.assigned_at).toLocaleDateString();

                return (
                  <TableRow key={index}>
                    <HistoryTableCell>{entry.changed_by_name}</HistoryTableCell>
                    <HistoryTableCell>{entry.old_assignee_name || 'N/A'}</HistoryTableCell>
                    <HistoryTableCell>{entry.new_assignee_name || 'N/A'}</HistoryTableCell>
                    <HistoryTableCell>{entry.change_reason || 'N/A'}</HistoryTableCell>
                    <HistoryTableCell>{assignedDate}</HistoryTableCell>
                    <HistoryTableCell>{entry.email_sent_to_owner ? 'Yes' : 'No'}</HistoryTableCell>
                    <HistoryTableCell>{entry.email_sent_to_manager ? 'Yes' : 'No'}</HistoryTableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <HistoryTableCell colSpan={7}>
                  <Typography variant="body2" align="center">No history available.</Typography>
                </HistoryTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </AccordionDetailsContainer>
    </AccordionContainer>
  );

  const renderStatusHistoryAccordion = (statusHistory) => (
    <AccordionContainer>
      <AccordionSummaryContainer expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
        <Typography variant="h6">Ticket Status History</Typography>
      </AccordionSummaryContainer>
      <AccordionDetailsContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <HistoryTableCell>Old Status</HistoryTableCell>
              <HistoryTableCell>New Status</HistoryTableCell>
              <HistoryTableCell>Changed By</HistoryTableCell>
              <HistoryTableCell>Change Date</HistoryTableCell>
              <HistoryTableCell>Change Time</HistoryTableCell>
              <HistoryTableCell>Change Reason</HistoryTableCell>
              <HistoryTableCell>Email Sent to Owner</HistoryTableCell>
              <HistoryTableCell>Email Sent to Manager</HistoryTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {statusHistory && statusHistory.length > 0 ? (
              statusHistory.map((entry, index) => {
                const changeDate = new Date(entry.changed_at).toLocaleDateString();
                const changeTime = new Date(entry.changed_at).toLocaleTimeString();

                return (
                  <TableRow key={index}>
                    <HistoryTableCell>{entry.old_status}</HistoryTableCell>
                    <HistoryTableCell>{entry.new_status}</HistoryTableCell>
                    <HistoryTableCell>{entry.changed_by}</HistoryTableCell>
                    <HistoryTableCell>{changeDate}</HistoryTableCell>
                    <HistoryTableCell>{changeTime}</HistoryTableCell>
                    <HistoryTableCell>{entry.status_change_reason || 'N/A'}</HistoryTableCell>
                    <HistoryTableCell>{entry.email_sent_to_owner ? 'Yes' : 'No'}</HistoryTableCell>
                    <HistoryTableCell>{entry.email_sent_to_manager ? 'Yes' : 'No'}</HistoryTableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <HistoryTableCell colSpan={8}>
                  <Typography variant="body2" align="center">No status history available.</Typography>
                </HistoryTableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </AccordionDetailsContainer>
    </AccordionContainer>
  );

  const renderMessages = () => (
    <div style={{ marginTop: '16px' }}>
      {messages.length > 0 ? (
        messages.map((message, index) => (
          <MessageCard key={index} message={message} />
        ))
      ) : ( 
        <Typography variant="body2" align="center">No messages available.</Typography>
      )}
    </div>
  );

  return (
    <div style={{ padding: '16px', position: 'relative' }}>
      {renderHistoryAccordion(historyData)}
      {renderStatusHistoryAccordion(statusHistoryData)}

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
        <Typography variant="h6" style={{ marginRight: '8px' }}>
          Message Details
        </Typography>
        <NewMessageCard onClick={handleNewMessageClick}>
          <CiCirclePlus size={20} style={{ marginRight: '4px', fontWeight: 'bold' }} />
          <Typography variant="body1" style={{ fontWeight: 'bold' }}>New Message</Typography>
        </NewMessageCard>
      </div>

      {showTicketMessage && (
        <TicketMessage ticketId={ticket.id} employeeId={user.id} handleMessages={handleMessages} />
      )}

      {renderMessages()}
    </div>
  );
};

TicketDetails.propTypes = {
  ticket: PropTypes.object.isRequired,
};

export default TicketDetails;