import './index.css';

/**
 * BanPage component that renders a page with no other links that acts as an 'indefinite' ban if
 * the user inputs the wrong login credentials a specified number of times unsuccessfully.
 */
const BanPage = () => (
  <div className='container'>
    <img src='/gavel.png' alt='Hammer' style={{ width: '250px', height: '250px' }}></img>
    <a href='https://www.flaticon.com/free-icons/regulatory' title='regulatory icons'>
      Regulatory icons created by nangicon - Flaticon
    </a>
    <h1>The Ban Hammer Has Spoken</h1>
    <p>You have been indefinitely banned, contact moderators for support.</p>
  </div>
);

export default BanPage;
