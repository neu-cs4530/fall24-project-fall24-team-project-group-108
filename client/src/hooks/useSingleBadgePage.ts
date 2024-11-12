import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Badge, Question } from '../types';
import { getQuestionByAnswerer, getQuestionsByFilter } from '../services/questionService';
import { fetchBadgesByUser, fetchEarnedUsers } from '../services/badgeService';

/**
 * Custom hook for managing the state and logic of a single badge page.
 *
 * @returns sentUser
 */
const useSingleBadgePage = () => {
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
        // eslint-disable-next-line no-console
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

  return {
    users,
    badgeName,
    paginatedRows,
    currentPage,
    rowsPerPage,
    handleAuthorClick,
    pageCount,
    handlePageChange,
  };
};

export default useSingleBadgePage;
