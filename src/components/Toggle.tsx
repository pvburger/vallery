import type { ToggleProps } from '../../types';

export default function Toggle(props: ToggleProps) {
  const { togBool, togFunction } = props;

  // function to establish color for toggle buttons
  const getColor = (inp: boolean): string => {
    if (inp === true) return '#0eff00';
    return '#ff0404';
  };

  return (
    <button
      className='togglePill'
      style={{
        backgroundColor: getColor(togBool),
        justifyContent: togBool ? 'left' : 'right',
      }}
      onClick={() => togFunction()}
    >
      <div className='toggleThumb'></div>
    </button>
  );
}
