import { useState } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { Card } from '@mui/material';
import { Badge } from '../../../../types';
import './index.css';
import { BadgeCategory, BadgeTier, getBadgeIcon, handleCardClick } from '../../badgePage';
import BadgeHover from '../../badgePage/badgeHover';

interface BadgesTabProps {
  user?: string;
  handleClick: () => void;
  userBadges: Badge[];
  navigate: NavigateFunction;
}

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
}: {
  title: string;
  badges: Badge[];
  hoveredBadge: string | null;
  setHoveredBadge: (badgeName: string | null) => void;
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
            onClick={() => handleCardClick(badge.name, navigate)}>
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

const BadgesTab = ({ user, handleClick, userBadges, navigate }: BadgesTabProps) => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  return (
    <div className='badge_tab'>
      <div className='all_badges_link' onClick={() => handleClick()}>
        See all badges &gt;
      </div>
      <h1 className='page-title'>All Badges Earned By {user}:</h1>

      <BadgeCategorySection
        title='Questions'
        badges={filterBadgesByCategory(userBadges, 'questions')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
      />
      <BadgeCategorySection
        title='Answers'
        badges={filterBadgesByCategory(userBadges, 'answers')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
      />
      <BadgeCategorySection
        title='Comments'
        badges={filterBadgesByCategory(userBadges, 'comments')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
      />
      <BadgeCategorySection
        title='Votes'
        badges={filterBadgesByCategory(userBadges, 'votes')}
        hoveredBadge={hoveredBadge}
        setHoveredBadge={setHoveredBadge}
        navigate={navigate}
      />
    </div>
  );
};

export default BadgesTab;
