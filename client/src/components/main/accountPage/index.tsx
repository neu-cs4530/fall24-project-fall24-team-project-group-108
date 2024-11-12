import { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Tab, Tabs } from '@mui/material';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionsTab from './questionsTab';
import AnswersTab from './answersTab';
import BadgesTab from './badgesTab';
import { Badge, Question } from '../../../types';
import { getQuestionByAnswerer, getQuestionsByFilter } from '../../../services/questionService';
import { fetchBadgesByUser } from '../../../services/badgeService';
import useUserContext from '../../../hooks/useUserContext';

/**
 * AccountPage component that displays the full content of a given user account with subtabs for
 * badges and question/answer activity.
 */
const AccountPage = () => {
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

  return (
    <div className='profilePageContainer'>
      <div className='profileHeader'>
        <div className='profileHeaderInfo'>
          <AccountCircleIcon sx={{ fontSize: 100 }} />
          <div className='profileHeaderUsername'>
            <div>{userLoggedIn ? 'Your Profile' : sentUser}</div>
          </div>
        </div>
        <div className='profileHeaderButtons'>
          <Button variant='contained'>Message</Button>
        </div>
      </div>
      <div className='profileTabs'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' centered>
            <Tab label='Questions' />
            <Tab label='Answers' />
            <Tab label='Badges' />
          </Tabs>
        </Box>
        <div>
          {value === 0 &&
            (userLoggedIn ? QuestionsTab('you', qlist) : QuestionsTab(sentUser as string, qlist))}
          {value === 1 &&
            (userLoggedIn ? AnswersTab('you', alist) : AnswersTab(sentUser as string, alist))}
          {value === 2 &&
            (userLoggedIn ? (
              <BadgesTab
                user={'you'}
                handleClick={handleAuthorClick}
                userBadges={badgeList}
                navigate={navigate}
              />
            ) : (
              <BadgesTab
                user={sentUser}
                handleClick={handleAuthorClick}
                userBadges={badgeList}
                navigate={navigate}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
