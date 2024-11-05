import './index.css';
import Form from '../baseComponents/form';
import TextArea from '../baseComponents/textarea';
import useModApplication from '../../../hooks/useNewApplication';

/**
 * ModApplicationPage component allows users to apply to become a moderator.
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
