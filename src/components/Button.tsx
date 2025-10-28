import { ButtonProp } from '../../types';

export default function Button(props: ButtonProp) {
  const { label, flip } = props;

  return (
    <button className='button' onClick={flip}>
      {label}
    </button>
  );
}
