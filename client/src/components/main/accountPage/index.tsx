import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Tab, Tabs } from '@mui/material';
import './index.css';
import QuestionsTab from './questionsTab';
import AnswersTab from './answersTab';
import BadgesTab from './badgesTab';
import useAccountPage from '../../../hooks/useAccountPage';
import EditAccountModal from './editModal';

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
    setEditModalOpen,
    editModalOpen,
  } = useAccountPage();

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
          {userLoggedIn && (
            <Button variant='contained' onClick={() => setEditModalOpen(true)}>
              Set Picture
            </Button>
          )}
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
      {editModalOpen && (
        <EditAccountModal
          onClose={() => setEditModalOpen(false)}
          userBadges={badgeList}
          user={sentUser as string}
        />
      )}
    </div>
  );
};

export default AccountPage;
