import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCategory, BadgeTier } from './useBadgePage';
import { Badge } from '../types';
import { fetchBadgesByUser, getBadgeDetailsByUsername } from '../services/badgeService';

/**
 * Custom hook for managing the state and logic of an answer view.
 *
 * @returns isHovered - whether or not the author is hovered.
 * @returns iconDetails - the profile picture details for the author.
 * @returns handleAuthorClick - handler to navigate to the author's profile page.
 * @returns setIsHovered - setter to display the ProfileHover.
 * @returns handleHoverEnter - setter to fetch data when ProfileHover is etnered.
 * @returns badges - badges obtained by the author of the answer.
 */
const useAnswerView = (ansBy: string) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [iconDetails, setIconDetails] = useState<{
    category: BadgeCategory;
    tier: BadgeTier;
  } | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

  /**
   * Function to fetch details about the user's profile icon.
   */
  const fetchProfileIconDetails = async (user: string) => {
    try {
      const details = await getBadgeDetailsByUsername(user);
      return {
        category: (details.category as BadgeCategory) || 'Unknown Category',
        tier: (details.tier as BadgeTier) || 'Unknown Tier',
      };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(`Failed to fetch details for user: ${user}`, error);
      return null;
    }
  };

  /**
   * Function to fetch all badges obtained by the user.
   */
  const fetchUserBadges = async (user: string) => {
    try {
      const res = await fetchBadgesByUser(user);
      return res;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return [];
    }
  };

  const handleHoverEnter = async () => {
    setIsHovered(true);

    const details = await fetchProfileIconDetails(ansBy);
    setIconDetails(details);

    const userBadges = await fetchUserBadges(ansBy);
    if (userBadges) {
      setBadges(userBadges);
    }
  };

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = () => {
    navigate(`/account/${ansBy}`);
  };

  return { isHovered, iconDetails, handleAuthorClick, setIsHovered, handleHoverEnter, badges };
};

export default useAnswerView;
