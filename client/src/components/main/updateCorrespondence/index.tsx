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
    unselectedUsers,
    searchInput,
    filteredUnselectedUsers,
    handleSearchInputChange,
    originalSelectedUsers,
    handleUnselectUser,
  } = useUpdateCorrespondence();

  return (
    <Form>
      {/* <Input
        title={'To Users'}
        hint={'List usernames you want to keep separated by comma'}
        id={'formToUsersInput'}
        val={toNames}
        setState={setToNames}
        err={toNamesErr}
      /> */}

      <div>
        <select id='dropdown' onChange={event => handleUserSelection(event.target.value)}>
          <option value=''>Select A User</option>
          {unselectedUsers.map(username => (
            <option key={username} value={username}>
              {username}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
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
      <div>
        {' '}
        {selectedUsers.map(username => (
          <SelectedUserView
            key={username}
            username={username}
            onClickHandler={handleUnselectUser}
            deletion={!originalSelectedUsers.includes(username)}
          />
        ))}{' '}
      </div>

      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            updateCorrespondence();
          }}>
          Update Correspondence Members
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default UpdateCorrespondencePage;
