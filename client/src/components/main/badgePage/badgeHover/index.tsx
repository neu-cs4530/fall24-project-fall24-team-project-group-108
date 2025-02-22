import { Badge } from '../../../../types';
import './index.css';

interface BadgeHoverProps {
  badge: Badge;
  icon: React.ReactElement;
  count?: number;
}

const BadgeHover = (props: BadgeHoverProps) => (
  <div className='badge-hover'>
    {props.icon}
    <div className='badge-info'>
      <div>{props.badge.name}</div>
      <div>{props.badge.description}</div>
      <div className='progress-bar-container'>
        <div
          className='progress-bar'
          style={{ width: `${((props.count || 0) / props.badge.targetValue) * 100}%` }}></div>
      </div>

      {props.count ? <div className='user-count'>Your Count: {props.count}</div> : <></>}
    </div>
  </div>
);

export default BadgeHover;
