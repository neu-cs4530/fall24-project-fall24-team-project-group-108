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
    <div className='profilePageContainer'>
      <div className='profileHeader'>
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

      <div className='profileTabs'>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} centered>
            <Tab label='Questions' />
            <Tab label='Answers' />
            <Tab label='Badges' />
          </Tabs>
        </Box>
        <div>{renderTabContent()}</div>
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
