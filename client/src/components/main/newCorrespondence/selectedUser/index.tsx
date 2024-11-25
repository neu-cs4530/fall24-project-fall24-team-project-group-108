import './index.css';

/**
 * Interface representing the props for the SelectedUser component.
 *
 * username - The username of the selected user
 * onClickHandler - A function detailing how to remove the current user from the selection
 * deletion - A boolean determining if the user can remove a user from the correspondence
 */
interface SelectedUserProps {
  username: string;
  onClickHandler: (username: string) => void;
  deletion: boolean;
}

/**
 * SelectedUser component renders a selected username and a remove button to unselect them
 *
 * @param message - The message object containing message details.
 */
const SelectedUserView = ({ username, onClickHandler, deletion }: SelectedUserProps) => (
  <div className='selectedUserContainer'>
    <div className='selectedUsername'> {username} </div>
    {deletion ? (
      <button className='removeButton' onClick={() => onClickHandler(username)}>
        x
      </button>
    ) : null}
  </div>
);
export default SelectedUserView;
