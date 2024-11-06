import { useState } from 'react';
import { Card } from '@mui/material';
import { NavigateFunction } from 'react-router-dom';
import { Badge } from '../../../../types';
import { BadgeCategory, BadgeTier, getBadgeIcon, handleCardClick } from '../../badgePage';
import './index.css';
import BadgeHover from '../../badgePage/badgeHover';

interface BadgesTabProps {
  user?: string;
  handleClick: () => void;
  userBadges: Badge[];
  navigate: NavigateFunction;
}

const BadgesTab = ({ user, handleClick, userBadges, navigate }: BadgesTabProps) => {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  return (
    <div className='badge_tab'>
      <div
        className='all_badges_link'
        onClick={e => {
          handleClick();
        }}>
        See all badges &gt;
      </div>
      <h1 className='page-title'>All Badges Earned By {user}:</h1>
      <div className='badge-grid'>
        {userBadges.map(badge => (
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
        ))}
      </div>
    </div>
  );
};
export default BadgesTab;
