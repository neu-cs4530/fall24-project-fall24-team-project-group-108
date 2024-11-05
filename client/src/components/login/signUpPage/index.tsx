import './index.css';
import { useNavigate } from 'react-router-dom';
import useSignUp from '../../../hooks/useSignUp';

/**
 * SignUp component that renders a page where a user can create a new account or 'user' that will post to the database if not already
 * present. Also allows for navigation back to the login page.
 */
const SignUp = () => {
  const {
    username,
    password,
    signUpErr,
    handleSubmit,
    handleUsernameCreate,
    handlePasswordCreate,
  } = useSignUp();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <h2>Sign Up</h2>
      <h4>Create a username and password</h4>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={handleUsernameCreate}
          placeholder='Enter a valid username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <input
          type='password'
          value={password}
          onChange={handlePasswordCreate}
          placeholder='Enter a valid password'
          required
          className='input-text'
          id={'passwordInput'}
        />
        {signUpErr && <p className='error-message'>*{signUpErr}</p>}
        <button type='submit' className='create-account-button'>
          Sign Up
        </button>
        <button className='login-page-button' onClick={() => navigate('/')}>
          Return to Login
        </button>
      </form>
    </div>
  );
};

export default SignUp;
