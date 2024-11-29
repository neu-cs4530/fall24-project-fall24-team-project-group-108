import useNewCorrespondence from '../../../hooks/useNewCorrespondence';
import Form from '../baseComponents/form';
import './index.css';
import SelectedUserView from './selectedUser';

/**
 * NewCorrespondencePage component allows users to create a new correspondence between themselves and other specified usernames
 */
const NewCorrespondencePage = () => {
  const {
    createCorrespondence,
    handleUserSelection,
    selectedUsers,
    handleUnselectUser,
    searchInput,
    handleSearchInputChange,
    filteredUnselectedUsers,
    errorMessage,
  } = useNewCorrespondence();

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
          <div className='selectedUsersList'>
            {' '}
            {selectedUsers.map(username => (
              <SelectedUserView
                key={username}
                username={username}
                onClickHandler={handleUnselectUser}
                deletion={true}
              />
            ))}{' '}
          </div>
        </div>
      </div>
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            createCorrespondence();
          }}
          disabled={false}>
          Create Correspondence
        </button>
        <div className='mandatory_indicator'>{errorMessage}</div>
      </div>
    </Form>
  );
};

export default NewCorrespondencePage;
