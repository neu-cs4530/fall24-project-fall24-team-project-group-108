import React, { useEffect, useState } from 'react';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import SendIcon from '@mui/icons-material/Send';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import { Card } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Badge } from '../../../types';
import './index.css';
import BadgeHover from './badgeHover';
import getAllBadges from '../../../services/badgeService';
import useUserContext from '../../../hooks/useUserContext';
import { getProgressStats } from '../../../services/badgeProgressService';

export type BadgeCategory = 'answers' | 'questions' | 'votes' | 'comments';
export type BadgeTier = 'bronze' | 'silver' | 'gold';
interface CategoryStats {
  category: BadgeCategory;
  count: number;
}

// maps badge tier to its icon color
export const tierColors: { [key in BadgeTier]: string } = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

// maps badge category to its icon image
export const iconMap: { [key in BadgeCategory]: JSX.Element } = {
  answers: <PsychologyAltIcon sx={{ fontSize: '50px' }} />,
  questions: <SendIcon sx={{ fontSize: '50px' }} />,
  votes: <ThumbsUpDownIcon sx={{ fontSize: '50px' }} />,
  comments: <QuestionAnswerIcon sx={{ fontSize: '50px' }} />,
};

// determine which badgeIcon to display based on its category and tier
export const getBadgeIcon = (badgeType: BadgeCategory, tier: BadgeTier) => {
  const color = tierColors[tier];
  return React.cloneElement(iconMap[badgeType], { style: { color } });
};

// navigate to the specific badge name if clicked
export const handleCardClick = (badgeName: string, navigate: NavigateFunction) => {
  navigate(`/badges/${badgeName}`);
};

// helper function to filter badges by category
const filterBadgesByCategory = (badges: Badge[], category: string) =>
  badges.filter(badge => badge.category === category);

// reusable component for rendering a badge category section
const BadgeCategorySection = ({
  title,
  badges,
  hoveredBadge,
  setHoveredBadge,
  navigate,
  badgeStats,
}: {
  title: string;
  badges: Badge[];
  hoveredBadge: string | null;
  setHoveredBadge: (badgeName: string | null) => void;
  navigate: NavigateFunction;
  badgeStats: CategoryStats[];
}) => (
  <>
    <h3 className='badge-category'>{title}:</h3>
    <div className='badge-grid'>
      {badges.length === 0 ? (
        <p className='no-badges-message'>No {title.toLowerCase()} badges earned</p>
      ) : (
        badges.map(badge => {
          const categoryStats = badgeStats.find(item => item.category === title.toLowerCase());
          const count = categoryStats ? categoryStats.count : 0; // Get the count for the category

          return (
            <Card
              key={badge.name}
              className='badge-item'
              onMouseEnter={() => setHoveredBadge(badge.name)}
              onMouseLeave={() => setHoveredBadge(null)}
              onClick={() => handleCardClick(badge.name, navigate)}>
              <div className='badge-icon'>
                {getBadgeIcon(badge.category as BadgeCategory, badge.tier as BadgeTier)}
              </div>
              <h3 className='badge-name'>{badge.name}</h3>
              {hoveredBadge === badge.name && (
                <BadgeHover
                  badge={badge}
                  icon={getBadgeIcon(badge.category as BadgeCategory, badge.tier as BadgeTier)}
                  count={count} // Ensure count is a number here
                />
              )}
            </Card>
          );
        })
      )}
    </div>
  </>
);

const BadgePage = () => {
  const navigate = useNavigate();
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const { user } = useUserContext();
  const [badgeStats, setBadgeStats] = useState<CategoryStats[]>([]);

  useEffect(() => {
    /**
     * Function to fetch all badges from the db.
     */
    const fetchBadgeData = async () => {
      try {
        const res = await getAllBadges();
        setBadges(res || []);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    /**
     * Function to fetch all user stats from the db.
     */
    const fetchStatsData = async () => {
      try {
        // grab from db for each badge category
        const badgeCategories: BadgeCategory[] = ['answers', 'questions', 'votes', 'comments'];

        const stats = await Promise.all(
          badgeCategories.map(async category => {
            const count = await getProgressStats(user.username, category);
            return { category, count }; // Just return count here since it's a number
          }),
        );

        setBadgeStats(stats);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    };

    fetchBadgeData();
    fetchStatsData();
  }, [user.username]);

  return (
    <div className='badge-page'>
      <div className='page-title'>All Badges</div>
      <BadgeCategorySection
        title='Questions'
        badges={filterBadgesByCategory(badges, 'questions')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
        badgeStats={badgeStats}
      />
      <BadgeCategorySection
        title='Answers'
        badges={filterBadgesByCategory(badges, 'answers')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
        badgeStats={badgeStats}
      />
      <BadgeCategorySection
        title='Comments'
        badges={filterBadgesByCategory(badges, 'comments')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
        badgeStats={badgeStats}
      />
      <BadgeCategorySection
        title='Votes'
        badges={filterBadgesByCategory(badges, 'votes')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
        badgeStats={badgeStats}
      />
    </div>
  );
};

export default BadgePage;
