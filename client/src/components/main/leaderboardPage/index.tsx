import { useNavigate, useParams } from 'react-router-dom';
import './index.css';
import {
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { TagCounts } from '../../../types'; // Adjust imports if needed
import { getLeaderboardUsers } from '../../../services/tagService';

const LeaderboardPage = () => {
  const { tid } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();
  const [countList, setCountList] = useState<TagCounts[]>([]);

  const pageCount = Math.ceil(countList.length / rowsPerPage);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const paginatedRows = countList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = (user: string) => {
    navigate(`/account/${user}`);
  };

  useEffect(() => {
    /**
     * Function to grab all leaderboard users.
     */
    const fetchLeaderboardData = async () => {
      try {
        const res = await getLeaderboardUsers(tid as string); // Fetch data from API
        setCountList(res); // Set response data to state
      } catch (error) {
        console.log(error); // Handle error
      }
    };

    fetchLeaderboardData();
  }, [tid]);

  return (
    <div className='leaderboard-page'>
      <div className='page-title'>Leaderboard for tag: {tid}</div>
      <div className='users-table'>
        {countList.length > 0 ? (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead>
                <TableRow>
                  <TableCell className='header-style'>#</TableCell>
                  <TableCell className='header-style'>User</TableCell>
                  <TableCell className='header-style'>Count</TableCell> {/* Added Count column */}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedRows.map((user, index) => (
                  <TableRow
                    key={user.user}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell>{(currentPage - 1) * rowsPerPage + index + 1}</TableCell>
                    <TableCell>
                      <div
                        className='user'
                        onClick={e => {
                          e.stopPropagation(); // Prevent triggering the parent div's click event
                          handleAuthorClick(user.user);
                        }}>
                        {user.user}
                      </div>
                    </TableCell>
                    <TableCell>{user.count}</TableCell> {/* Display the count */}
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
          <p>No users have answered questions of type {tid}.</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
