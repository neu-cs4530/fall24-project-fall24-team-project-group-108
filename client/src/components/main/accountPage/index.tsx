import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Tab, Tabs } from '@mui/material';
import './index.css';
import QuestionsTab from './questionsTab';
import AnswersTab from './answersTab';
import BadgesTab from './badgesTab';
import useAccountPage from '../../../hooks/useAccountPage';

/**
 * AccountPage component that displays the full content of a given user account with subtabs for
 * badges and question/answer activity.
 */
const AccountPage = () => {
  const {
    sentUser,
    value,
    userLoggedIn,
    alist,
    qlist,
    handleAuthorClick,
    handleChange,
    badgeList,
    navigate,
  } = useAccountPage();

  return (
    <div className='backgroundContainer'>
      <div className='leftBubble'>
        <div className='profileHeaderInfo'>
          <AccountCircleIcon sx={{ fontSize: 100 }} />
          <div className='profileHeaderUsername'>
            <div>{userLoggedIn ? 'Your Profile' : sentUser}</div>
          </div>
        </div>
      </div>
      <div className='rightBubble'>
        <div className='profileTabs'>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' centered>
              <Tab label='Badges' />
              <Tab label='Questions' />
              <Tab label='Answers' />
            </Tabs>
          </Box>
          <div>
            {value === 0 &&
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
            {value === 1 &&
              (userLoggedIn ? QuestionsTab('you', qlist) : QuestionsTab(sentUser as string, qlist))}
            {value === 2 &&
              (userLoggedIn ? AnswersTab('you', alist) : AnswersTab(sentUser as string, alist))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
