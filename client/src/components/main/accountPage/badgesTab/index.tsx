import { NavigateFunction } from 'react-router-dom';
import { Badge } from '../../../../types';
import './index.css';
import useBadgesTab from '../../../../hooks/useBadgesTab';

interface BadgesTabProps {
  user?: string;
  handleClick: () => void;
  userBadges: Badge[];
  navigate: NavigateFunction;
}

// helper function to filter badges by category
const filterBadgesByCategory = (badges: Badge[], category: string) =>
  badges.filter(badge => badge.category === category);

const BadgesTab = ({ user, handleClick, userBadges, navigate }: BadgesTabProps) => {
  const { BadgeCategorySection } = useBadgesTab();

  return (
    <div className='badge_tab'>
      <div className='all_badges_link' onClick={() => handleClick()}>
        See all badges &gt;
      </div>
      <h1 className='page-title'>All Badges Earned By {user}:</h1>

      <BadgeCategorySection
        title='Questions'
        badges={filterBadgesByCategory(userBadges, 'questions')}
        navigate={navigate}
      />
      <BadgeCategorySection
        title='Answers'
        badges={filterBadgesByCategory(userBadges, 'answers')}
        navigate={navigate}
      />
      <BadgeCategorySection
        title='Comments'
        badges={filterBadgesByCategory(userBadges, 'comments')}
        navigate={navigate}
      />
      <BadgeCategorySection
        title='Votes'
        badges={filterBadgesByCategory(userBadges, 'votes')}
        navigate={navigate}
      />
    </div>
  );
};

export default BadgesTab;
