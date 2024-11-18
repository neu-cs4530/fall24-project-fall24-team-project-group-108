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
import useLeaderboardPage from '../../../hooks/useLeaderboardPage';

const LeaderboardPage = () => {
  const {
    countList,
    paginatedRows,
    tid,
    currentPage,
    rowsPerPage,
    handleAuthorClick,
    pageCount,
    handlePageChange,
  } = useLeaderboardPage();

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
                  <TableCell className='header-style'>Questions Answered</TableCell>{' '}
                  {/* Added Count column */}
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
