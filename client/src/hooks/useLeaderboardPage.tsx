import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getLeaderboardUsers } from '../services/tagService';
import { TagCounts } from '../types';

/**
 * Custom hook for managing the leaderboard page's state, navigation, and real-time updates.
 *
 * @returns
 */
const useLeaderboardPage = () => {
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
        // eslint-disable-next-line no-console
        console.log(error); // Handle error
      }
    };

    fetchLeaderboardData();
  }, [tid]);

  return {
    countList,
    paginatedRows,
    tid,
    currentPage,
    rowsPerPage,
    handleAuthorClick,
    pageCount,
    handlePageChange,
  };
};

export default useLeaderboardPage;
