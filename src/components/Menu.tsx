import type { MenuProps } from '../../types';
import Toggle from './Toggle';

export default function Menu(props: MenuProps) {
  const { randOrder, randStart, autoStart, mute, vWidth } = props;

  // function to change video size
  const incVidSize = () => {
    const vWidths = [240, 360, 480, 720, 960, 1280, 1440, 1920, 2880, 3840];
    let currIdx = vWidths.indexOf(vWidth.get());
    if (currIdx === vWidths.length - 1) {
      currIdx = 0;
    } else {
      currIdx += 1;
    }
    vWidth.set(vWidths[currIdx]);
  };

  // function to establish color for buttons
  const getColor = (inp: boolean | number): string => {
    if (inp === true) return 'green';
    if (inp === false) return 'red';
    else return 'blue';
  };

  return (
    <div className='menus'>
      <div className='menuEntry'>
        <Toggle
          togBool={randOrder.get()}
          togFunction={() => randOrder.set(!randOrder.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Randomize Playback Order</p>
      </div>
      <div className='menuEntry'>
        <Toggle
          togBool={randStart.get()}
          togFunction={() => randStart.set(!randStart.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Randomize Playback Start</p>
      </div>
      <div className='menuEntry'>
        <Toggle
          togBool={autoStart.get()}
          togFunction={() => autoStart.set(!autoStart.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Auto Start Playback</p>
      </div>
      <div className='menuEntry'>
        <Toggle
          togBool={mute.get()}
          togFunction={() => mute.set(!mute.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Mute</p>
      </div>
      <div className='menuEntry'>
        <button
          className='toggle'
          style={{ backgroundColor: getColor(vWidth.get()) }}
          onClick={incVidSize}
        ></button>
        <p className='menuEntryTxt'>Video Size: {`${vWidth.get()}`}</p>
      </div>
    </div>
  );
}
