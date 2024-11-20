import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card } from '@mui/material';
import BadgeHover from '../components/main/badgePage/badgeHover';
import { Badge } from '../types';
import useBadgePage, { BadgeCategory, BadgeTier } from './useBadgePage';

/**
 * Custom hook for managing the badge tab's state, navigation, and real-time updates.
 *
 * @returns badgeCategorySection - The section for one badge category.
 */
const useBadgesTab = () => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const { getBadgeIcon, handleCardClick } = useBadgePage();

  // reusable component for rendering a badge category section
  const BadgeCategorySection = ({
    title,
    badges,
    navigate,
  }: {
    title: string;
    badges: Badge[];
    navigate: NavigateFunction;
  }) => (
    <>
      <h3 className='badge-category'>{title}:</h3>
      <div className='badge-grid'>
        {badges.length === 0 ? (
          <p className='no-badges-message'>No {title.toLowerCase()} badges earned</p>
        ) : (
          badges.map(badge => (
            <Card
              key={badge.name}
              className='badge-item'
              onMouseEnter={() => setHoveredBadge(badge.name)}
              onMouseLeave={() => setHoveredBadge(null)}
              onClick={() => handleCardClick(badge.name)}>
              <div className='badge-icon'>
                {getBadgeIcon(badge.category as BadgeCategory, badge.tier as BadgeTier)}
              </div>
              <h3 className='badge-name'>{badge.name}</h3>
              {hoveredBadge === badge.name && (
                <BadgeHover
                  badge={badge}
                  icon={getBadgeIcon(badge.category as BadgeCategory, badge.tier as BadgeTier)}
                />
              )}
            </Card>
          ))
        )}
      </div>
    </>
  );

  return {
    BadgeCategorySection,
  };
};

export default useBadgesTab;
