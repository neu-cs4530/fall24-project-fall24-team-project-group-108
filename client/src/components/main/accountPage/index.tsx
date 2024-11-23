import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Tab, Tabs } from '@mui/material';
import './index.css';
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
    handleChange,
    badgeList,
    navigate,
    setEditModalOpen,
    editModalOpen,
    renderProfilePicture,
    renderTabContent,
  } = useAccountPage();

  return (
    <div className='backgroundContainer'>
      <div className='leftBubble'>
        <div className='profileHeaderInfo'>
          {renderProfilePicture()}
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

      {editModalOpen && (
        <EditAccountModal
          onClose={() => setEditModalOpen(false)}
          userBadges={badgeList}
          user={sentUser as string}
          nav={navigate}
        />
      )}
    </div>
  );
};

export default AccountPage;
