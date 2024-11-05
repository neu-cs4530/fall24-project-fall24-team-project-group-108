import './index.css';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useModApplication from '../../../hooks/useNewApplication';

/**
 * SignUp component that renders a page where a user can create a new account or 'user' that will post to the database if not already
 * present. Also allows for navigation back to the login page.
 */
const ModApplicationPage = () => {
  const { text, setText, textErr, handleApplicationSubmit } = useModApplication();

  return (
    <div className='container'>
      <h2>Join Our Mod Team!👮</h2>
      <Form>
        <TextArea
          title={'Please describe why we should choose you below'}
          id={'formTextInput'}
          val={text}
          setState={setText}
          err={textErr}
        />
        <div className='btn_indicator_container'>
          <button
            className='form_postBtn'
            onClick={() => {
              handleApplicationSubmit();
            }}>
            Apply
          </button>
          <div className='mandatory_indicator'>* indicates mandatory fields</div>
        </div>
      </Form>
    </div>
  );
};

export default ModApplicationPage;
