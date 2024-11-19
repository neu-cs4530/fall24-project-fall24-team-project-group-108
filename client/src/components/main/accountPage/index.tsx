import { useEffect, useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Box, Button, Tab, Tabs } from '@mui/material';
import './index.css';
import QuestionsTab from './questionsTab';
import AnswersTab from './answersTab';
import BadgesTab from './badgesTab';
import useAccountPage from '../../../hooks/useAccountPage';
import EditAccountModal from './editModal';
import useBadgePage, { BadgeCategory, BadgeTier } from '../../../hooks/useBadgePage';

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
    profileIconDetails,
  } = useAccountPage();
  const { getBadgeIcon } = useBadgePage();

  // State for profile picture details
  const [profileDetails, setProfileDetails] = useState<{
    category: BadgeCategory | null;
    tier: BadgeTier | null;
  } | null>(profileIconDetails as { category: BadgeCategory | null; tier: BadgeTier | null });

  const renderProfilePicture = () => {
    if (profileIconDetails?.category && profileIconDetails?.tier) {
      return getBadgeIcon(
        profileIconDetails.category as BadgeCategory,
        profileIconDetails.tier as BadgeTier,
      );
    }

    return <AccountCircleIcon sx={{ fontSize: 100 }} />;
  };

  const renderTabContent = () => {
    const user = userLoggedIn ? 'you' : (sentUser as string);

    switch (value) {
      case 0:
        return QuestionsTab(user, qlist);
      case 1:
        return AnswersTab(user, alist);
      case 2:
        return (
          <BadgesTab
            user={user}
            handleClick={handleAuthorClick}
            userBadges={badgeList}
            navigate={navigate}
          />
        );
      default:
        return null;
    }
  };

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
