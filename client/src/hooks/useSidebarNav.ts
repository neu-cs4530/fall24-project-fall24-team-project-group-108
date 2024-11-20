import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateHyperlink } from '../tool';
import { getCorrespondencesByOrder } from '../services/correspondenceService';
import useUserContext from './useUserContext';
import { Correspondence } from '../types';
import updateBadgeProgress from '../services/badgeProgressService';

/**
 * Custom hook to handle unread messages for the sidebarnav
 *
 * @returns title - The current value of the title input.
 * @returns text - The current value of the text input.
 * @returns tagNames - The current value of the tags input.
 * @returns titleErr - Error message for the title field, if any.
 * @returns textErr - Error message for the text field, if any.
 * @returns tagErr - Error message for the tag field, if any.
 * @returns postQuestion - Function to validate the form and submit a new question.
 */
const useSidebarNav = () => {
  const navigate = useNavigate();
  const { socket, user } = useUserContext();
  const [correspondenceBank, setCorrespondenceBank] = useState<Correspondence[] | null>(null);
  const [unreadCorrespondenceCount, setUnreadCorrespondenceCount] = useState<number>(0);

  useEffect(() => {
    const initCorrespondences = async () => {
      const dbCorrespondences = await getCorrespondencesByOrder();
      setCorrespondenceBank([
        ...dbCorrespondences.filter(c => c.messageMembers.includes(user.username)),
      ]);
      const unreadUserCorrespondences = dbCorrespondences.filter(
        correspondence =>
          correspondence.messageMembers.includes(user.username) &&
          !correspondence.views?.includes(user.username),
      );
      setUnreadCorrespondenceCount(unreadUserCorrespondences.length);
    };
    initCorrespondences();
  }, []);

  useEffect(() => {
    /**
     * Function to handle message/corresponcence updates from the socket.
     *
     * @param correspondence - The updated correspondence object.
     */
    const handleCorrespondenceUpdate = async (correspondence: Correspondence) => {
      console.log('In SidebarNav handleCorrespondenceUpdate');
      console.log(correspondence);
      if (correspondenceBank) {
        if (correspondence.messageMembers.includes(user.username)) {
          const correspondenceIdList = correspondenceBank?.map(c => c._id);
          const cIdx = correspondenceIdList.indexOf(correspondence._id);
          if (cIdx > -1) {
            const updatedCorrespondenceBank = [...correspondenceBank];
            updatedCorrespondenceBank[cIdx] = { ...correspondence };
            setCorrespondenceBank([...updatedCorrespondenceBank]);
            console.log(updatedCorrespondenceBank);
            const unreadCount = updatedCorrespondenceBank
              .map(c => c.views)
              .filter(views => !views.includes(user.username)).length;
            setUnreadCorrespondenceCount(unreadCount);
          } else {
            console.log('Adding new correspondence');
            setCorrespondenceBank([...correspondenceBank, { ...correspondence }]);

            if (!correspondence.views.includes(user.username)) {
              setUnreadCorrespondenceCount(unreadCorrespondenceCount + 1);
            }
          }
        }
      }
    };

    socket.on('correspondenceUpdate', handleCorrespondenceUpdate);

    return () => {
      socket.off('correspondenceUpdate', handleCorrespondenceUpdate);
    };
  }, [socket]);

  return {
    user,
    unreadCorrespondenceCount,
  };
};

export default useSidebarNav;
