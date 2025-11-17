import { MenuProps } from '../../types';

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

  return (
    <div className='menus'>
      <div className='menuEntry'>
        <button
          className='toggle'
          onClick={() => randOrder.set(!randOrder.get())}
        ></button>
        <p className='menuEntryTxt'>
          Randomize Playback Order: {`${randOrder.get()}`}
        </p>
      </div>
      <div className='menuEntry'>
        <button
          className='toggle'
          onClick={() => randStart.set(!randStart.get())}
        ></button>
        <p className='menuEntryTxt'>
          Randomize Playback Start: {`${randStart.get()}`}
        </p>
      </div>
      <div className='menuEntry'>
        <button
          className='toggle'
          onClick={() => autoStart.set(!autoStart.get())}
        ></button>
        <p className='menuEntryTxt'>
          Auto Start Playback: {`${autoStart.get()}`}
        </p>
      </div>
      <div className='menuEntry'>
        <button
          className='toggle'
          onClick={() => mute.set(!mute.get())}
        ></button>
        <p className='menuEntryTxt'>Mute: {`${mute.get()}`}</p>
      </div>
      <div className='menuEntry'>
        <button className='toggle' onClick={incVidSize}></button>
        <p className='menuEntryTxt'>Video Size: {`${vWidth.get()}`}</p>
      </div>
    </div>
  );
}
