import React, { useEffect, useState } from 'react';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarIcon from '@mui/icons-material/Star';
import { Card } from '@mui/material';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { Badge } from '../../../types';
import './index.css';
import BadgeHover from './badgeHover';
import getAllBadges from '../../../services/badgeService';

export type BadgeCategory = 'answers' | 'questions';
export type BadgeTier = 'bronze' | 'silver' | 'gold';

// maps badge tier to its icon color
export const tierColors: { [key in BadgeTier]: string } = {
  bronze: '#cd7f32',
  silver: '#c0c0c0',
  gold: '#ffd700',
};

// maps badge category to its icon image
export const iconMap: { [key in BadgeCategory]: JSX.Element } = {
  answers: <QuestionAnswerIcon sx={{ fontSize: '50px' }} />,
  questions: <StarIcon sx={{ fontSize: '50px' }} />,
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

const BadgePage = () => {
  const navigate = useNavigate();
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);

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

    fetchBadgeData();
  }, []);

  return (
    <div className='badge-page'>
      <div className='page-title'>All Badges</div>
      <div className='badge-grid'>
        {badges.map(badge => (
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

export default BadgePage;
