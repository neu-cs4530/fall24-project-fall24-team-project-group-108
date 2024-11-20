import useNewCorrespondence from '../../../hooks/useNewCorrespondence';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import './index.css';
import SelectedUserView from './selectedUser';

/**
 * NewCorrespondencePage component allows users to create a new correspondence between themselves and other specified usernames
 */
const NewCorrespondencePage = () => {
  const {
    toNames,
    setToNames,
    toNamesErr,
    createCorrespondence,
    handleUserSelection,
    selectedUsers,
    unselectedUsers,
    handleUnselectUser,
    searchInput,
    setSearchInput,
    handleSearchInputChange,
    filteredUnselectedUsers,
    errorMessage,
  } = useNewCorrespondence();

  return (
    <Form>
      {/* <Input
        title={'To Users'}
        hint={'Add keywords separated by comma'}
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
            deletion={true}
          />
        ))}{' '}
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
