import { Button, Tab, Tabs } from '@mui/material';
import './index.css';
import useAccountPage, { ProfileIconDetails } from '../../../hooks/useAccountPage';
import EditAccountModal from './editModal';
import BadgesTab from './badgesTab';
import QuestionsTab from './questionsTab';
import AnswersTab from './answersTab';
import CommentsTab from './commentsTab';

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
    clist,
    handleAuthorClick,
    handleChange,
    badgeList,
    navigate,
    setEditModalOpen,
    editModalOpen,
    currentDetails,
    renderProfilePicture,
    setCurrentDetails,
    currentUserIsModerator,
    banUser,
    sentUserIsBanned,
  } = useAccountPage();

  return (
    <div className='backgroundContainer'>
      <div className='leftBubble'>
        <div className='profilePicture'>
          {renderProfilePicture(currentDetails as ProfileIconDetails)}
        </div>

        <div className='profileHeaderUsername'>
          <div>{userLoggedIn ? 'Your Profile' : sentUser}</div>
        </div>
        <div className='profileHeaderButtons'>
          {userLoggedIn && (
            <Button variant='contained' onClick={() => setEditModalOpen(true)}>
              Set Picture
            </Button>
          )}
          {currentUserIsModerator && !userLoggedIn && (
            <Button variant='contained' disabled={sentUserIsBanned} onClick={() => banUser()}>
              Ban User
            </Button>
          )}
        </div>
      </div>
      <div className='rightBubble'>
        <div className='stickyTabs'>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example' centered>
            <Tab label='Badges' />
            <Tab label='Questions' />
            <Tab label='Answers' />
            <Tab label='Comments' />
          </Tabs>
        </div>
        <div className='profileTabs'>
          {value === 0 &&
            (userLoggedIn ? (
              <BadgesTab
                user={'You'}
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
            (userLoggedIn ? QuestionsTab('You', qlist) : QuestionsTab(sentUser as string, qlist))}
          {value === 2 &&
            (userLoggedIn ? AnswersTab('You', alist) : AnswersTab(sentUser as string, alist))}
          {value === 3 &&
            (userLoggedIn ? CommentsTab('you', clist) : CommentsTab(sentUser as string, clist))}
        </div>
      </div>

      {editModalOpen && (
        <EditAccountModal
          onClose={() => setEditModalOpen(false)}
          userBadges={badgeList}
          user={sentUser as string}
          nav={navigate}
          setProfilePicture={setCurrentDetails}
        />
      )}
    </div>
  );
};

export default AccountPage;
