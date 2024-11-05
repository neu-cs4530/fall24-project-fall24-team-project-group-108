import './index.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../../../hooks/useLogin';

/**
 * Login component that renders a page where a user can use their existing credentials to login to the website with
 * the correct credentials. Also allows for navigation to the sign up page to create an account, and if a user
 * provides the wrong credentials 5 times, the user is navigated to the ban page.
 */
const Login = () => {
  const {
    username,
    password,
    isBanned,
    loginErr,
    handleSubmit,
    handleInputChange,
    handlePasswordChange,
  } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isBanned) {
      navigate('/ban');
    }
  }, [isBanned, navigate]);

  return (
    <div className='container'>
      <h2>Welcome to FakeStackOverflow!</h2>
      <h4>Please enter your username and password</h4>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={username}
          onChange={handleInputChange}
          placeholder='Enter your username'
          required
          className='input-text'
          id={'usernameInput'}
        />
        <input
          type='password'
          value={password}
          onChange={handlePasswordChange}
          placeholder='Enter your password'
          required
          className='input-text'
          id={'passwordInput'}
        />
        {loginErr && <p className='error-message'>*{loginErr}</p>}
        <button type='submit' className='login-button'>
          Log In
        </button>
        <button className='signup-page-button' onClick={() => navigate('/signup')}>
          No Account? Sign Up!
        </button>
      </form>
    </div>
  );
};

export default Login;
