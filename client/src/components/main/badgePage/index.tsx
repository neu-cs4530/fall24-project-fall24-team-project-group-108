import React, { useState } from 'react';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import StarIcon from '@mui/icons-material/Star';
import { Card } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Badge } from '../../../types';
import './index.css';
import BadgeHover from './badgeHover';

type BadgeCategory = 'Answers' | 'Questions';
type BadgeTier = 'Bronze' | 'Silver' | 'Gold';

const BadgePage = () => {
  const navigate = useNavigate();
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const dummyBadges: Badge[] = [
    {
      name: 'Helper',
      description: 'Answer 5 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 5,
      tier: 'Bronze' as BadgeTier,
    },
    {
      name: 'Guide',
      description: 'Answer 15 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 15,
      tier: 'Silver' as BadgeTier,
    },
    {
      name: 'Sage',
      description: 'Answer 25 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 25,
      tier: 'Gold' as BadgeTier,
    },
    {
      name: 'Curious',
      description: 'Ask 5 questions',
      category: 'Questions' as BadgeCategory,
      targetValue: 5,
      tier: 'Bronze' as BadgeTier,
    },
    {
      name: 'Inquirer',
      description: 'Ask 15 questions',
      category: 'Questions' as BadgeCategory,
      targetValue: 15,
      tier: 'Silver' as BadgeTier,
    },
    {
      name: 'Investigator',
      description: 'Ask 25 questions',
      category: 'Questions' as BadgeCategory,
      targetValue: 25,
      tier: 'Gold' as BadgeTier,
    },
    {
      name: 'Conversationalist',
      description: 'Answer 5 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 5,
      tier: 'Bronze' as BadgeTier,
    },
    {
      name: 'Observer',
      description: 'Answer 15 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 15,
      tier: 'Silver' as BadgeTier,
    },
    {
      name: 'Commentator',
      description: 'Answer 25 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 25,
      tier: 'Gold' as BadgeTier,
    },
    {
      name: 'Debater',
      description: 'Answer 5 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 5,
      tier: 'Bronze' as BadgeTier,
    },
    {
      name: 'Top Contributer',
      description: 'Answer 15 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 15,
      tier: 'Silver' as BadgeTier,
    },
    {
      name: 'Master',
      description: 'Answer 25 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 25,
      tier: 'Gold' as BadgeTier,
    },
    {
      name: 'Voter',
      description: 'Answer 5 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 5,
      tier: 'Bronze' as BadgeTier,
    },
    {
      name: 'Critic',
      description: 'Answer 15 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 15,
      tier: 'Silver' as BadgeTier,
    },
    {
      name: 'Curator',
      description: 'Answer 25 questions',
      category: 'Answers' as BadgeCategory,
      targetValue: 25,
      tier: 'Gold' as BadgeTier,
    },
  ];

  // maps badge tier to its icon color
  const tierColors: { [key in BadgeTier]: string } = {
    Bronze: '#cd7f32',
    Silver: '#c0c0c0',
    Gold: '#ffd700',
  };

  // maps badge category to its icon image
  const iconMap: { [key in BadgeCategory]: JSX.Element } = {
    Answers: <QuestionAnswerIcon sx={{ fontSize: '50px' }} />,
    Questions: <StarIcon sx={{ fontSize: '50px' }} />,
  };

  // determine which badgeIcon to display based on its category and tier
  const getBadgeIcon = (badgeType: BadgeCategory, tier: BadgeTier) => {
    const color = tierColors[tier];
    return React.cloneElement(iconMap[badgeType], { style: { color } });
  };

  // navigate to the specific badge name if clicked
  const handleCardClick = (badgeName: string) => {
    navigate(`/badges/${badgeName}`);
  };

  return (
    <div className='badge-page'>
      <div className='page-title'>All Badges</div>
      <div className='badge-grid'>
        {dummyBadges.map(badge => (
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
        ))}
      </div>
    </div>
  );
};

export default BadgePage;
