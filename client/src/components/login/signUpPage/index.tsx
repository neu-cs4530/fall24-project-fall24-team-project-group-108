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
    reenterPassword,
    showPassword,
    signUpErr,
    handleSubmit,
    handleUsernameCreate,
    handlePasswordCreate,
    handlePasswordReenter,
    handleShowPassword,
  } = useSignUp();
  const navigate = useNavigate();

  return (
    <div className='container'>
      <div className='logo-section'>
        <img src='/codescout.png' alt='Logo' style={{ width: '75px', height: '75px' }}></img>
        <h2 className='title'>Code Scout</h2>
      </div>
      <div className='form-container'>
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit}>
          <h5>Username</h5>
          <input
            type='text'
            value={username}
            onChange={handleUsernameCreate}
            placeholder='Create Username'
            required
            className='input-text'
            id={'usernameInput'}
          />
          <h5>Password</h5>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordCreate}
            placeholder='Create Password'
            required
            className='input-text'
            id={'passwordInput'}
          />
          <h5>Re-Enter Password</h5>
          <input
            type={showPassword ? 'text' : 'password'}
            value={reenterPassword}
            onChange={handlePasswordReenter}
            placeholder='Re-Enter Password'
            required
            className='input-text'
            id={'reenterPasswordInput'}
          />
          {signUpErr && <p className='error-message'>*{signUpErr}</p>}
          <span onClick={handleShowPassword} style={{ cursor: 'pointer' }}>
            {showPassword ? 'Hide Password' : 'Show Password'}
          </span>
          <button type='submit' className='create-account-button'>
            Sign Up
          </button>
          <button className='login-page-button' onClick={() => navigate('/')}>
            Return to Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
