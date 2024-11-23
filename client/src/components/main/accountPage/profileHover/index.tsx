import './index.css';
import React, { useState } from 'react';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useBadgePage, { BadgeCategory, BadgeTier } from '../../../../hooks/useBadgePage';
import { Badge } from '../../../../types';

interface ProfileHoverProps {
  user?: string;
  iconData: { category: BadgeCategory; tier: BadgeTier } | null;
  badges: Badge[];
}

const ProfileHover = ({ user, iconData, badges }: ProfileHoverProps) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const { getBadgeIcon } = useBadgePage();

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  const maxX = window.innerWidth - 200;
  const maxY = window.innerHeight - 200;

  const adjustedX = Math.min(mousePosition.x + 630, maxX);
  const adjustedY = Math.min(mousePosition.y + 270, maxY);

  const renderProfilePicture = () => {
    if (iconData?.category && iconData?.tier) {
      return getBadgeIcon(iconData.category as BadgeCategory, iconData.tier as BadgeTier);
    }

    return <AccountCircleIcon sx={{ fontSize: 70, margin: 0 }} />;
  };

  const badgeList =
    badges.length > 0
      ? `Badges: ${badges.map(badge => badge.name).join(', ')}`
      : 'No badges earned yet';

  const limitedBadgeList = badgeList.length > 110 ? `${badgeList.slice(0, 50)}...` : badgeList;

  return (
    <div
      className='profile-hover'
      style={{
        left: adjustedX,
        top: adjustedY,
      }}
      onMouseMove={handleMouseMove}>
      <div className='hover-container'>
        <div className='profile-icon'>{renderProfilePicture()}</div>

        <div className='user-info'>
          <div className='username'>{user}</div>

          <div className='badge-list'>{limitedBadgeList}</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHover;
