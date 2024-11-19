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

  // update mouse position on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  // render the profile picture or a default icon if there is none
  const renderProfilePicture = () => {
    if (iconData?.category && iconData?.tier) {
      return getBadgeIcon(iconData.category as BadgeCategory, iconData.tier as BadgeTier);
    }

    return <AccountCircleIcon sx={{ fontSize: 70, margin: 0 }} />;
  };

  // create the badge list string
  const badgeList =
    badges.length > 0
      ? `Badges: ${badges.map(badge => badge.name).join(', ')}`
      : 'No badges earned yet';

  // limit the badge list to 50 characters and append "..." if necessary
  const limitedBadgeList = badgeList.length > 50 ? `${badgeList.slice(0, 50)}...` : badgeList;

  return (
    <div
      className='profile-hover'
      style={{
        left: mousePosition.x + 520,
        top: mousePosition.y - 100,
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
