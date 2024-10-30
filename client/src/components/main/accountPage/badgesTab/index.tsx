import './index.css';

interface BadgesTabProps {
  user?: string;
  handleClick: () => void;
}

const BadgesTab = ({ user, handleClick }: BadgesTabProps) => {
  const placeHolder = 'hi';
  // at some point will grab all the badges obtained by the user

  return (
    <div className='badge_tab'>
      <div
        className='all_badges_link'
        onClick={e => {
          handleClick();
        }}>
        See all badges &gt;
      </div>
    </div>
  );
};

export default BadgesTab;
