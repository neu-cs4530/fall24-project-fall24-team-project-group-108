import './index.css';
import {
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useEffect, useMemo, useState } from 'react';
import useLeaderboardPage from '../../../hooks/useLeaderboardPage';
import { getBadgeDetailsByUsername } from '../../../services/badgeService';
import useBadgePage, { BadgeCategory, BadgeTier } from '../../../hooks/useBadgePage';
import { ProfileIconDetails } from '../../../hooks/useAccountPage';

const LeaderboardPage = () => {
  const {
    countList,
    tid,
    currentPage,
    rowsPerPage,
    handleAuthorClick,
    pageCount,
    handlePageChange,
  } = useLeaderboardPage();
  const { getBadgeIcon } = useBadgePage();

  // Add state for storing profile icons
  const [topUserIcons, setTopUserIcons] = useState<{ [key: string]: React.ReactNode }>({});

  // Split paginatedRows into first three and the rest
  const firstThreeRows = useMemo(() => countList.slice(0, 3), [countList]);
  const remainingRows = useMemo(() => countList.slice(3), [countList]);

  // Fetch profile icons for top users
  useEffect(() => {
    const renderProfilePicture = (details: ProfileIconDetails) => {
      if (details?.category && details?.tier) {
        return getBadgeIcon(details.category as BadgeCategory, details.tier as BadgeTier);
      }
      return <AccountCircleIcon sx={{ fontSize: 120, margin: 0 }} />;
    };

    const fetchTopUserIcons = async () => {
      const iconPromises = firstThreeRows.map(async row => {
        try {
          const details = await getBadgeDetailsByUsername(row.user);
          if (details) {
            const profileDetails = {
              category: (details.category as BadgeCategory) || 'Unknown Category',
              tier: (details.tier as BadgeTier) || 'Unknown Tier',
            };
            return { user: row.user, icon: renderProfilePicture(profileDetails) };
          }
          return { user: row.user, icon: <AccountCircleIcon sx={{ fontSize: 120, margin: 0 }} /> };
        } catch (error) {
          return { user: row.user, icon: <AccountCircleIcon sx={{ fontSize: 120, margin: 0 }} /> };
        }
      });

      const icons = await Promise.all(iconPromises);
      const iconMap = icons.reduce(
        (acc, { user, icon }) => ({
          ...acc,
          [user]: icon,
        }),
        {},
      );

      setTopUserIcons(iconMap);
    };

    if (firstThreeRows.length > 0) {
      fetchTopUserIcons();
    }
  }, [firstThreeRows, getBadgeIcon]);

  // Calculate paginated rows based on current page
  const paginatedRemainingRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return remainingRows.slice(startIndex, startIndex + rowsPerPage);
  }, [remainingRows, currentPage, rowsPerPage]);

  return (
    <div className='page_background'>
      <div className='leaderboard_page'>
        <h1 className='page_title'>Leaderboard for tag: {tid}</h1>
        {countList.length > 0 ? (
          <div>
            <div className='top_3'>
              {firstThreeRows[1] && (
                <div className='second'>
                  <div className='second-everything-else'>
                    {topUserIcons[firstThreeRows[1].user]}
                    <div className='position'>2nd</div>
                    <div className='username'>{firstThreeRows[1].user}</div>
                    <div className='questions'>{firstThreeRows[1].count} Questions</div>
                  </div>
                  <div className='second-rectangle'></div>
                </div>
              )}

              {firstThreeRows[0] && (
                <div className='first'>
                  <div className='first-everything-else'>
                    {topUserIcons[firstThreeRows[0].user]}
                    <div className='position'>1st</div>
                    <div className='username'>{firstThreeRows[0].user}</div>
                    <div className='questions'>{firstThreeRows[0].count} Questions</div>
                  </div>
                  <div className='first-rectangle'></div>
                </div>
              )}

              {firstThreeRows[2] && (
                <div className='second'>
                  <div className='second-everything-else'>
                    {topUserIcons[firstThreeRows[2].user]}
                    <div className='position'>3rd</div>
                    <div className='username'>{firstThreeRows[2].user}</div>
                    <div className='questions'>{firstThreeRows[2].count} Questions</div>
                  </div>
                  <div className='second-rectangle'></div>
                </div>
              )}
            </div>

            <div className='users_table'>
              <TableContainer component={Paper} sx={{ padding: 0, margin: 0 }}>
                <Table sx={{ minWidth: 650, padding: 0 }} aria-label='simple table'>
                  <TableBody>
                    {paginatedRemainingRows.map((user, index) => (
                      <TableRow
                        key={user.user}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                          'backgroundColor': '#d0ecfc',
                          'height': '20px',
                          'borderBottom': '1px solid black',
                        }}>
                        <TableCell
                          className='position-column'
                          sx={{
                            height: '20px',
                          }}>
                          {(() => {
                            const ind = (currentPage - 1) * rowsPerPage + index + 4;
                            const lastDigit = ind % 10;
                            const lastTwoDigits = ind % 100;

                            let suffix = 'th';

                            if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
                              suffix = 'th';
                            } else if (lastDigit === 1) {
                              suffix = 'st';
                            } else if (lastDigit === 2) {
                              suffix = 'nd';
                            } else if (lastDigit === 3) {
                              suffix = 'rd';
                            }

                            return `${ind}${suffix}`;
                          })()}
                        </TableCell>
                        <TableCell
                          sx={{
                            height: '20px',
                          }}>
                          <Stack
                            direction='column'
                            spacing={0} // Remove spacing between items
                            sx={{
                              '& div': {
                                // Make the text smaller
                                fontSize: '0.875rem',
                                lineHeight: '1',
                              },
                            }}>
                            <div
                              className='user'
                              onClick={e => {
                                e.stopPropagation();
                                handleAuthorClick(user.user);
                              }}>
                              {user.user}
                            </div>
                            <div>{user.count} Question(s)</div>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {paginatedRemainingRows.length > 0 && (
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    color='primary'
                    sx={{
                      mt: 0, // Remove margin-top
                      display: 'flex',
                      justifyContent: 'center',
                      backgroundColor: '#bde7ff', // Adjust if necessary
                    }}
                  />
                )}
              </TableContainer>
            </div>
          </div>
        ) : (
          <p>No users have answered questions of type {tid}.</p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
