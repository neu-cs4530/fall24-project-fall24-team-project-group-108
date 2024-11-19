import useNewCorrespondence from '../../../hooks/useNewCorrespondence';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import './index.css';

/**
 * NewCorrespondencePage component allows users to create a new correspondence between themselves and other specified usernames
 */
const NewCorrespondencePage = () => {
  const { toNames, setToNames, toNamesErr, createCorrespondence } = useNewCorrespondence();

  return (
    <Form>
      <Input
        title={'To Users'}
        hint={'Add keywords separated by comma'}
        id={'formToUsersInput'}
        val={toNames}
        setState={setToNames}
        err={toNamesErr}
      />
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            createCorrespondence();
          }}>
          Create Correspondence
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default NewCorrespondencePage;
