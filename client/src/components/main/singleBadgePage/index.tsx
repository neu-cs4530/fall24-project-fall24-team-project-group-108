import { useParams } from 'react-router-dom';
import './index.css';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const DUMMY_ROWS = [
  { name: 'Lauren', date: new Date() },
  { name: 'Lauren', date: new Date() },
  { name: 'Lauren', date: new Date() },
  { name: 'Lauren', date: new Date() },
  { name: 'Lauren', date: new Date() },
];

const SingleBadgePage = () => {
  // have to query info for the given badgeName
  const { badgeName } = useParams();

  return (
    <div className='single-badge-page'>
      <div className='page-title'>All Users Who Have Earned Badge: {badgeName}</div>
      <div className='users-table'>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Date Earned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_ROWS.map(row => (
                <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.date.toString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default SingleBadgePage;
