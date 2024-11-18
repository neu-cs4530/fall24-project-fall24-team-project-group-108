import useUpdateCorrespondence from '../../../hooks/useUpdateCorrespondence';
import Form from '../baseComponents/form';
import Input from '../baseComponents/input';
import './index.css';

/**
 * UpdateCorrespondencePage component allows users to change which users have access to the correspondence
 */
const UpdateCorrespondencePage = () => {
  const { toNames, setToNames, toNamesErr, updateCorrespondence } = useUpdateCorrespondence();

  return (
    <Form>
      <Input
        title={'To Users'}
        hint={'List usernames you want to keep separated by comma'}
        id={'formToUsersInput'}
        val={toNames}
        setState={setToNames}
        err={toNamesErr}
      />
      <div className='btn_indicator_container'>
        <button
          className='form_postBtn'
          onClick={() => {
            updateCorrespondence();
          }}>
          Update Correspondence Members
        </button>
        <div className='mandatory_indicator'>* indicates mandatory fields</div>
      </div>
    </Form>
  );
};

export default UpdateCorrespondencePage;
