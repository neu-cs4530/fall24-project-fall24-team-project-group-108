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
  const { getBadgeIcon } = useBadgePage();

  const maxX = window.innerWidth - 200;
  const maxY = window.innerHeight - 200;

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
    <div className='profile-hover'>
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
