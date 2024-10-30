import { Badge } from '../../../../types';
import './index.css';

interface BadgeHoverProps {
  badge: Badge;
  icon: React.ReactElement;
}

const BadgeHover = (props: BadgeHoverProps) => (
  <div className='badge-hover'>
    {props.icon}
    <div className='badge-info'>
      <div>{props.badge.name}</div>
      <div>{props.badge.description}</div>
    </div>
  </div>
);

export default BadgeHover;
