import './index.css';
import useBadgePage from '../../../hooks/useBadgePage';

const BadgePage = () => {
  const { BadgeCategorySection, filterBadgesByCategory } = useBadgePage();

  return (
    <div className='page-background'>
      <div className='badge-page'>
        <div className='page-title'>All Badges</div>
        <BadgeCategorySection
          title='QUESTIONS'
          filteredBadges={filterBadgesByCategory('questions')}
        />
        <BadgeCategorySection title='ANSWERS' filteredBadges={filterBadgesByCategory('answers')} />
        <BadgeCategorySection
          title='COMMENTS'
          filteredBadges={filterBadgesByCategory('comments')}
        />
        <BadgeCategorySection title='VOTES' filteredBadges={filterBadgesByCategory('votes')} />
      </div>
    </div>
  );
};

export default BadgePage;
