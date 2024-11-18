import { useEffect, useState } from 'react';
import useUserContext from './useUserContext';
import { Notification } from '../types';

/**
 * Custom hook to display a single notification
 */
const useNotificationView = (notification: Notification) => {
  const { socket, user } = useUserContext();

  return {
  };
};

export default useNotificationView;
