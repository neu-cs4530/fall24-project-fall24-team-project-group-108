import { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Tab, Tabs } from '@mui/material';
import './index.css';
import { useNavigate, useParams } from 'react-router-dom';
import QuestionsTab from './questionsTab';
import AnswersTab from './answersTab';
import BadgesTab from './badgesTab';
import { Question } from '../../../types';
import { getQuestionByAnswerer, getQuestionsByFilter } from '../../../services/questionService';

/**
 * AccountPage component that displays the full content of a given user account with subtabs for
 * badges and question/answer activity.
 */
const AccountPage = () => {
  const { user } = useParams();
  const [value, setValue] = useState(0);
  const navigate = useNavigate();
  const [qlist, setQlist] = useState<Question[]>([]);
  const [alist, setAlist] = useState<Question[]>([]);

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
        const res = await getQuestionsByFilter('newest', '', user);
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
        const res = await getQuestionByAnswerer(user);
        setAlist(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchQuestionData();
    fetchAnswerData();
  }, [user]);

  return (
    <div className='profilePageContainer'>
      <div className='profileHeader'>
        <div className='profileHeaderInfo'>
          <AccountCircleIcon sx={{ fontSize: 100 }} />
          <div className='profileHeaderUsername'>
            <div>{user}</div>
            <div>profile metadata? joined x date</div>
          </div>
        </div>
        <div className='profileHeaderButtons'>
          <Button variant='outlined'>Edit</Button>
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
        <div style={{ padding: '20px' }}>
          {value === 0 && QuestionsTab(user as string, qlist)}
          {value === 1 && AnswersTab(user as string, alist)}
          {value === 2 && user && (
            <BadgesTab user={user} handleClick={handleAuthorClick} /> // Pass both user and handleClick
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
