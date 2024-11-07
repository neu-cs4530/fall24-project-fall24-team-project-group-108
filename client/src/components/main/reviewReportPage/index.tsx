import './index.css';
import { useNavigate } from 'react-router-dom';

/**
 * SignUp component that renders a page where a user can create a new account or 'user' that will post to the database if not already
 * present. Also allows for navigation back to the login page.
 */
const ReviewReportsPage = () => {
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Sign Up</h2>
      <h4>Create a username and password</h4>
    </div>
  );
};

export default ReviewReportsPage;
