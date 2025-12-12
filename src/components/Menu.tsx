import type { MenuProps } from '../../types';
import Toggle from './Toggle';
import Slider from './Slider';

export default function Menu(props: MenuProps) {
  const { randOrder, randStart, autoStart, mute, vWidth } = props;


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
      <Slider
        stateMod={vWidth}
      ></Slider>
    </div>
  );
}
