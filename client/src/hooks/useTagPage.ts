import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTagsWithQuestionNumber } from '../services/tagService';
import { TagData } from '../types';

/**
 * Custom hook for managing the tag page's state and navigation.
 *
 * @returns tlist - An array of tag data retrieved from the server
 * @returns clickTag - Function to navigate to the home page with the selected tag as a URL parameter.
 */
const useTagPage = () => {
  const navigate = useNavigate();
  const [tlist, setTlist] = useState<TagData[]>([]);

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
   * Function to navigate to the leaderboard page for a specified tab.
   *
   * @param tagName - The name of the tag to navigate to the leadership page of.
   */
  const clickLeaderboard = (tagName: string) => {
    navigate(`/tags/${tagName}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTagsWithQuestionNumber();
        setTlist(res || []);
      } catch (e) {
        throw new Error('Error fetching data');
      }
    };

    fetchData();
  }, []);

  return { tlist, clickTag, clickLeaderboard };
};

export default useTagPage;
