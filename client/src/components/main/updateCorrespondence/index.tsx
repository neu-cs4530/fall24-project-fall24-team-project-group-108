import useUpdateCorrespondence from '../../../hooks/useUpdateCorrespondence';
import Form from '../baseComponents/form';
import './index.css';
import SelectedUserView from '../newCorrespondence/selectedUser';

/**
 * UpdateCorrespondencePage component allows users to change which users have access to the correspondence
 */
const UpdateCorrespondencePage = () => {
  const {
    updateCorrespondence,
    handleUserSelection,
    selectedUsers,
    searchInput,
    filteredUnselectedUsers,
    handleSearchInputChange,
    originalSelectedUsers,
    handleUnselectUser,
  } = useUpdateCorrespondence();

  return (
    <Form>
      <div className='allUsers'>
        <div className='userSelection'>
          <input
            className='searchBar'
            type='text'
            placeholder='Search for username'
            value={searchInput}
            onChange={event => handleSearchInputChange(event.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              boxSizing: 'border-box',
              border: 'none',
              borderBottom: '1px solid #ccc',
            }}
          />
          {filteredUnselectedUsers.map(username => (
            <div
              className='unselectedUser'
              key={username}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #f0f0f0',
              }}
              onClick={() => handleUserSelection(username)}>
              {username}
            </div>
          ))}
        </div>
        <div className='selectionSide'>
          <div className='selectedUsersTitle'>Selected Users:</div>
          {selectedUsers.map(username => (
            <SelectedUserView
              key={username}
              username={username}
              onClickHandler={handleUnselectUser}
              deletion={!originalSelectedUsers.includes(username)}
            />
          ))}
        </div>
      </div>

      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            updateCorrespondence();
          }}>
          Update Correspondence Members
        </button>
      </div>
    </Form>
  );
};

export default UpdateCorrespondencePage;
