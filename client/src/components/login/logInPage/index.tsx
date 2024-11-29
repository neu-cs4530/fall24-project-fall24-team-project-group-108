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
    showPassword,
    isBanned,
    loginErr,
    handleSubmit,
    handleInputChange,
    handlePasswordChange,
    handleShowPassword,
  } = useLogin();
  const navigate = useNavigate();

  useEffect(() => {
    if (isBanned) {
      navigate('/ban');
    }
  }, [isBanned, navigate]);

  return (
    <div className='container'>
      <div className='logo-section'>
        <img src='/codescout.png' alt='Logo' style={{ width: '75px', height: '75px' }}></img>
        <h2 className='title'>Code Scout</h2>
      </div>
      <div className='form-container'>
        <h2>Login</h2>
        <h4>Welcome to Code Scout!</h4>
        <form onSubmit={handleSubmit}>
          <h5>Username</h5>
          <input
            type='text'
            value={username}
            onChange={handleInputChange}
            placeholder='Enter Username'
            required
            className='input-text'
            id={'usernameInput'}
          />
          <h5>Password</h5>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder='Enter Password'
            required
            className='input-text'
            id={'passwordInput'}
          />
          {loginErr && <p className='error-message'>*{loginErr}</p>}
          <span onClick={handleShowPassword} style={{ cursor: 'pointer' }}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </span>
          <button type='submit' className='login-button'>
            Login
          </button>
          <button className='signup-page-button' onClick={() => navigate('/signup')}>
            No Account? Sign Up!
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
