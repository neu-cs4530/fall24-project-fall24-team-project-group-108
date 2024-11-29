import React, { useState } from 'react';
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Button,
  SelectChangeEvent,
} from '@mui/material';
import { NavigateFunction } from 'react-router-dom';
import { Badge } from '../../../../types';
import './index.css';
import useBadgePage, { BadgeCategory, BadgeTier } from '../../../../hooks/useBadgePage';
import { changeProfilePicture } from '../../../../services/userService';
import { ProfileIconDetails } from '../../../../hooks/useAccountPage';

// Interface for the props of EditAccountModal component
interface EditAccountModalProps {
  onClose: () => void;
  userBadges: Badge[];
  user: string;
  nav: NavigateFunction;
  setProfilePicture: (details: ProfileIconDetails) => void;
}

/**
 * Maps badge name to details.
 */
const iconMap: { [badgeKey in BadgeCategory]: { [tierKey in BadgeTier]: string } } = {
  answers: {
    bronze: 'Helper',
    silver: 'Guide',
    gold: 'Sage',
  },
  questions: {
    bronze: 'Curious',
    silver: 'Inquirer',
    gold: 'Investigator',
  },
  votes: {
    bronze: 'Voter',
    silver: 'Critic',
    gold: 'Curator',
  },
  comments: {
    bronze: 'Observer',
    silver: 'Commentator',
    gold: 'Debater',
  },
};

/**
 * Finds badge details based on badge name.
 */
function reverseBadgeLookup(badgeName: string): ProfileIconDetails | null {
  for (const category of Object.keys(iconMap)) {
    const tierMap = iconMap[category as BadgeCategory];
    for (const tier of Object.keys(tierMap)) {
      if (tierMap[tier as BadgeTier] === badgeName) {
        return { category: category as BadgeCategory, tier: tier as BadgeTier };
      }
    }
  }
  return null;
}

/**
 * EditAccountModal component
 */
const EditAccountModal = ({
  onClose,
  userBadges,
  user,
  nav,
  setProfilePicture,
}: EditAccountModalProps) => {
  const [selectedBadge, setSelectedBadge] = useState<string>('');
  const { getBadgeIcon } = useBadgePage();

  // Handle badge selection
  const handleBadgeChange = (event: SelectChangeEvent<string>) => {
    const badgeName = event.target.value;

    setSelectedBadge(badgeName);
  };

  // Handle profile picture change
  const handleProfileChange = () => {
    setProfilePicture(reverseBadgeLookup(selectedBadge) as ProfileIconDetails);
    changeProfilePicture(user, selectedBadge);
    onClose();
  };

  return (
    <>
      <div className='backdrop-style' onClick={onClose} />
      <div className='edit-popup'>
        <button className='close-button' onClick={onClose}>
          &times;
        </button>
        <h3>Choose A Picture From Your Badges:</h3>

        {userBadges.length === 0 ? (
          <p>
            You haven&apos;t earned any badges yet! Interact with the site to earn a badge to set as
            your profile picture.
          </p>
        ) : (
          <div className='badge-dropdown-container'>
            <FormControl fullWidth margin='normal'>
              <InputLabel id='badge-select-label'>Your Badges</InputLabel>
              <Select
                labelId='badge-select-label'
                value={selectedBadge || ''}
                onChange={handleBadgeChange}
                label='Select Badge'>
                {userBadges.map(badge => (
                  <MenuItem key={badge.name} value={badge.name}>
                    <div className='select-option'>
                      {getBadgeIcon(badge.category as BadgeCategory, badge.tier as BadgeTier)}
                      <div className='badge-name'>{badge.name}</div>
                    </div>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        )}

        <Button
          className='save-button'
          variant='contained'
          color='primary'
          onClick={handleProfileChange}
          disabled={!selectedBadge}>
          Save
        </Button>
      </div>
    </>
  );
};

export default EditAccountModal;
