import './index.css';
import useBadgePage from '../../../hooks/useBadgePage';

const BadgePage = () => {
  const { BadgeCategorySection, filterBadgesByCategory } = useBadgePage();

  return (
    <div className='badge-page'>
      <div className='page-title'>All Badges</div>
      <BadgeCategorySection
        title='Questions'
        filteredBadges={filterBadgesByCategory('questions')}
      />
      <BadgeCategorySection title='Answers' filteredBadges={filterBadgesByCategory('answers')} />
      <BadgeCategorySection title='Comments' filteredBadges={filterBadgesByCategory('comments')} />
      <BadgeCategorySection title='Votes' filteredBadges={filterBadgesByCategory('votes')} />
    </div>
  );
};

export default BadgePage;
