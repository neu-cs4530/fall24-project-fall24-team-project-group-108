import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useUserContext from './useUserContext';
import { Badge, Question } from '../types';
import { getQuestionByAnswerer, getQuestionsByFilter } from '../services/questionService';
import { fetchBadgesByUser } from '../services/badgeService';

/**
 * Custom hook for managing the state and logic of an account page.
 *
 * @returns sentUser - the current user profile being viewed.
 * @returns value - the value of the current tab being viewed.
 * @returns userLoggedIn - the user logged in.
 * @returns alist - a list of questions answered by the user.
 * @returns qlist - a list of questions asked by the user.
 * @returns handeAuthorClick - a function to navigate to a user profile.
 * @returns handleChange - a function to handle tab switching.
 * @returns badgeList - the list of badges acquired by the user.
 * @returns navigate - a useNavigate to switch routes.
 */
const useAccountPage = () => {
  const { sentUser } = useParams();
  const { user } = useUserContext();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [qlist, setQlist] = useState<Question[]>([]);
  const [alist, setAlist] = useState<Question[]>([]);
  const [badgeList, setBadgeList] = useState<Badge[]>([]);

  // determine if the profile being viewed is for the currently logged in user
  let userLoggedIn: boolean;
  if (user.username === sentUser) {
    userLoggedIn = true;
  } else {
    userLoggedIn = false;
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  /**
   * Function to navigate to the badge page.
   */
  const handleAuthorClick = () => {
    navigate(`/badges`);
  };

  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const fetchQuestionData = async () => {
      try {
        const res = await getQuestionsByFilter('newest', '', sentUser);
        setQlist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to fetch answers based on the filter and update the answer list.
     */
    const fetchAnswerData = async () => {
      try {
        const res = await getQuestionByAnswerer(sentUser);
        setAlist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to fetch all badges obtained by the user.
     */
    const fetchUserBadges = async () => {
      try {
        const res = await fetchBadgesByUser(sentUser as string);
        setBadgeList(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchQuestionData();
    fetchAnswerData();
    fetchUserBadges();
  }, [user]);

  return {
    sentUser,
    value,
    userLoggedIn,
    alist,
    qlist,
    handleAuthorClick,
    handleChange,
    badgeList,
    navigate,
  };
};

export default useAccountPage;
