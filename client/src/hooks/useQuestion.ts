import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BadgeCategory, BadgeTier } from './useBadgePage';
import { Badge, Question } from '../types';
import { fetchBadgesByUser, getBadgeDetailsByUsername } from '../services/badgeService';

/**
 * Custom hook for managing the state and logic of an account page.
 *
 * @returns handleAnswer - handles posting an answer.
 * @returns clickTag - navigates to a tag.
 * @returns isHovered - state for whether the username is hovered.
 * @returns iconDetails - state to track the author's profile picture.
 * @returns handeAuthorClick - a function to navigate to a user profile.
 * @returns handleHoverEnter - handler to fetch data when author is hovered.
 * @returns setIsHovered - setter to display the hovered modal.
 * @returns badges - badges obtained by the author of this question.
 */
const useQuestion = (q: Question) => {
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
      return null; // Return null in case of an error
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
      return [];
    }
  };

  /**
   * Function to handle fetching data when a username is hovered.
   */
  const handleHoverEnter = async () => {
    setIsHovered(true);

    const details = await fetchProfileIconDetails(q.askedBy);
    setIconDetails(details);

    const userBadges = await fetchUserBadges(q.askedBy);
    if (userBadges) {
      setBadges(userBadges);
    }
  };

  /**
   * Function to navigate to the home page with the specified tag as a search parameter.
   *
   * @param tagName - The name of the tag to be added to the search parameters.
   */
  const clickTag = (tagName: string) => {
    const searchParams = new URLSearchParams();
    searchParams.set('tag', tagName);

    navigate(`/home?${searchParams.toString()}`);
  };

  /**
   * Function to navigate to the specified question page based on the question ID.
   *
   * @param questionID - The ID of the question to navigate to.
   */
  const handleAnswer = (questionID: string) => {
    navigate(`/question/${questionID}`);
  };

  /**
   * Function to navigate to the specified user profile based on the user ID.
   */
  const handleAuthorClick = () => {
    navigate(`/account/${q.askedBy}`); // Assuming you have an ID for the author
  };

  return {
    handleAnswer,
    clickTag,
    isHovered,
    iconDetails,
    handleAuthorClick,
    handleHoverEnter,
    setIsHovered,
    badges,
  };
};

export default useQuestion;
