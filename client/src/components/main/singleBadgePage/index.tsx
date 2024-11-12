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
import useSingleBadgePage from '../../../hooks/useSingleBadgePage';

const SingleBadgePage = () => {
  const {
    users,
    badgeName,
    paginatedRows,
    currentPage,
    rowsPerPage,
    handleAuthorClick,
    pageCount,
    handlePageChange,
  } = useSingleBadgePage();

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
