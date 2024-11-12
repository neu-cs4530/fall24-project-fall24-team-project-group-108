import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchEarnedUsers } from '../../../services/badgeService';

const SingleBadgePage = () => {
  const { badgeName } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [users, setUsers] = useState<string[]>([]);
  const navigate = useNavigate();

  const pageCount = Math.ceil(users.length / rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const paginatedRows = users.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const fetchBadgeData = async () => {
      try {
        const res = await fetchEarnedUsers(badgeName as string);
        setUsers(res || []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBadgeData();
  }, [badgeName]);

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = (user: string) => {
    navigate(`/account/${user}`); // Assuming you have an ID for the author
  };

  return (
    <div className='single-badge-page'>
      <div className='page-title'>All Users Who Have Earned Badge: {badgeName}</div>
      <div className='users-table'>
        {users.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell className='header-style'>#</TableCell>
                  <TableCell className='header-style'>User</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((user, index) => (
                  <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <div
                        className='user'
                        onClick={e => {
                          e.stopPropagation(); // prevent triggering the parent div's click event
                          handleAuthorClick(user);
                        }}>
                        {user}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handlePageChange}
              color='primary'
              sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
            />
          </TableContainer>
        ) : (
          <p>Badge has not been earned by any user yet.</p>
        )}
      </div>
    </div>
  );
};

export default SingleBadgePage;
