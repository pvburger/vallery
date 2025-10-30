import { ButtonProp } from '../../types';

export default function Button(props: ButtonProp) {
  const { label, runFun } = props;

  return (
    <button className='button' onClick={runFun}>
      {label}
    </button>
  );
}
