import { useParams } from 'react-router-dom';
import './index.css';

const LeaderboardPage = () => {
  // have to query info for the given badgeName
  const { tid } = useParams();

  return (
    <div className='leaderboard-page'>
      <div className='page-title'>Leaderboard for tag: {tid}</div>
    </div>
  );
};

export default LeaderboardPage;
