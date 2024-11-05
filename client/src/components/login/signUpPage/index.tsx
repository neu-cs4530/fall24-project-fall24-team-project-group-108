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
      <div className='form-container'>
        <h2>Sign Up</h2>
        <h4>Create a username and password</h4>
        <form onSubmit={handleSubmit}>
          <input
            type='text'
            value={username}
            onChange={handleUsernameCreate}
            placeholder='Username'
            required
            className='input-text'
            id={'usernameInput'}
          />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordCreate}
            placeholder='Password'
            required
            className='input-text'
            id={'passwordInput'}
          />
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
