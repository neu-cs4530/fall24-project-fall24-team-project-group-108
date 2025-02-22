import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useUserContext from './useUserContext';
import { Answer, Badge, Question, User } from '../types';
import {
  getQuestionByAnswerer,
  getQuestionByCommenter,
  getQuestionsByFilter,
} from '../services/questionService';
import { fetchBadgesByUser, getBadgeDetailsByUsername } from '../services/badgeService';
import useBadgePage, { BadgeCategory, BadgeTier } from './useBadgePage';
import QuestionsTab from '../components/main/accountPage/questionsTab';
import AnswersTab from '../components/main/accountPage/answersTab';
import BadgesTab from '../components/main/accountPage/badgesTab';
import CommentsTab from '../components/main/accountPage/commentsTab';
import { getUsers, updateUserIsBanned } from '../services/userService';

export interface ProfileIconDetails {
  category: BadgeCategory | null;
  tier: BadgeTier | null;
}

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
 * @returns setEditModalOpen - setter to adjust modal display.
 * @returns editModalOpen - state to track if the modal is displayed.
 * @returns user - the user logged in.
 * @returns profileIconDetails - details of the user's profile icon.
 * @returns renderProfilePicture - function to render the profile icon.
 * @returns renderTabContent - function to display profile tabs.
 */
const useAccountPage = () => {
  const { getBadgeIcon } = useBadgePage();
  const { sentUser } = useParams();
  const { user, socket } = useUserContext();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [qlist, setQlist] = useState<Question[]>([]);
  const [alist, setAlist] = useState<Question[]>([]);
  const [clist, setClist] = useState<Question[]>([]);
  const [badgeList, setBadgeList] = useState<Badge[]>([]);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [currentDetails, setCurrentDetails] = useState<ProfileIconDetails | null>(null);
  const [currentUserIsModerator, setCurrentUserIsModerator] = useState<boolean>(false);
  const [sentUserIsBanned, setSentUserIsBanned] = useState<boolean>(false);
  const sentUserRef = useRef(sentUser);

  useEffect(() => {
    sentUserRef.current = sentUser;
  }, [sentUser]);

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

  useEffect(() => {
    const initUserAttributes = async () => {
      const dbUsers = await getUsers();

      const currentUserObject = dbUsers.filter(
        dbUser => dbUser.username === user.username,
      )[0] as User;
      setCurrentUserIsModerator(currentUserObject.isModerator);

      const sentUserObject = dbUsers.filter(
        dbUser => dbUser.username === sentUserRef.current,
      )[0] as User;
      setSentUserIsBanned(sentUserObject.isBanned ? sentUserObject.isBanned : false);
    };
    initUserAttributes();
  }, [user.username]);

  /**
   * Function to navigate to the badge page.
   */
  const handleAuthorClick = () => {
    navigate(`/badges`);
  };

  const banUser = async () => {
    if (sentUser) {
      await updateUserIsBanned(sentUser);
      setSentUserIsBanned(true);
    }
  };

  useEffect(() => {
    /**
     * Function to fetch questions based on the filter and update the question list.
     */
    const fetchQuestionData = async () => {
      try {
        const res = await getQuestionsByFilter('newest', '', sentUser);
        setQlist(res || []);
      } catch (e) {
        throw new Error('Error fetching data');
      }
    };

    /**
     * Function to fetch answers based on the filter and update the answer list.
     */
    const fetchAnswerData = async () => {
      try {
        const res = await getQuestionByAnswerer(sentUser);
        setAlist(res || []);
      } catch (e) {
        throw new Error('Error fetching data');
      }
    };

    /**
     * Function to fetch comments based on the filter and update the comment list.
     */
    const fetchCommentData = async () => {
      try {
        const res = await getQuestionByCommenter(sentUser);
        setClist(res || []);
      } catch (e) {
        throw new Error('Error fetching data');
      }
    };

    /**
     * Function to fetch all badges obtained by the user.
     */
    const fetchUserBadges = async () => {
      try {
        const res = await fetchBadgesByUser(sentUser as string);
        setBadgeList(res || []);
      } catch (e) {
        throw new Error('Error fetching data');
      }
    };

    /**
     * Function to fetch details about the user's profile icon.
     */
    const fetchProfileIconDetails = async () => {
      try {
        const details = await getBadgeDetailsByUsername(sentUser as string);
        setCurrentDetails({
          category: (details.category as BadgeCategory) || 'Unknown Category',
          tier: (details.tier as BadgeTier) || 'Unknown Tier',
        });
      } catch (error) {
        setCurrentDetails(null);
      }
    };

    fetchQuestionData();
    fetchAnswerData();
    fetchCommentData();
    fetchUserBadges();
    fetchProfileIconDetails();

    /**
     * Function to handle removing a post.
     *
     * @param qid - The unique id of the question.
     * @param updatedPost - The updated post.
     */
    const handleRemovePostUpdate = ({
      qid: id,
      updatedPost,
    }: {
      qid: string;
      updatedPost: Question | Answer;
    }) => {
      setQlist(prevQuestions => prevQuestions.filter(q => q.isRemoved === true));
      setAlist(prevQuestions => prevQuestions.filter(q => q.isRemoved === true));
    };

    socket.on('removePostUpdate', handleRemovePostUpdate);

    return () => {
      socket.off('removePostUpdate', handleRemovePostUpdate);
    };
  }, [user, sentUser, socket]);

  /**
   * Renders the profile picture of a user.
   * @returns Their profile icon or the default icon.
   */
  const renderProfilePicture = (details: ProfileIconDetails) => {
    if (details?.category && details?.tier) {
      return getBadgeIcon(details.category as BadgeCategory, details.tier as BadgeTier);
    }

    return <AccountCircleIcon sx={{ fontSize: 100 }} />;
  };

  /**
   * Renders content for tabs in user account.
   */
  const renderTabContent = () => {
    const userDisplay = userLoggedIn ? 'you' : (sentUser as string);

    switch (value) {
      case 0:
        return QuestionsTab(userDisplay, qlist);
      case 1:
        return AnswersTab(userDisplay, alist);
      case 2:
        return (
          <BadgesTab
            user={userDisplay}
            handleClick={handleAuthorClick}
            userBadges={badgeList}
            navigate={navigate}
          />
        );
      case 3:
        return CommentsTab(userDisplay, clist);
      default:
        return null;
    }
  };

  return {
    sentUser,
    value,
    userLoggedIn,
    alist,
    qlist,
    clist,
    handleAuthorClick,
    handleChange,
    badgeList,
    navigate,
    setEditModalOpen,
    editModalOpen,
    user,
    currentDetails,
    renderProfilePicture,
    renderTabContent,
    setCurrentDetails,
    currentUserIsModerator,
    banUser,
    sentUserIsBanned,
  };
};

export default useAccountPage;
