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
  //   const {
  //     isEditing,
  //     setIsEditing,
  //     editingText,
  //     setEditingText,
  //     isCodeStyle,
  //     setIsCodeStyle,
  //     saveClicked,
  //     setSaveClicked,
  //     isDeleted,
  //     setIsDeleted,
  //     user,
  //     showReadReceipts,
  //     setShowReadReceipts,
  //     currentMessage,
  //     setCurrentMessage,
  //   } = useMessageView(message);

  <div className='selectedUserContainer'>
    <div> {username} </div>
    {deletion ? <button onClick={() => onClickHandler(username)}> Remove </button> : null}
  </div>
);
export default SelectedUserView;
