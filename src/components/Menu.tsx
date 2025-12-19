import type { MenuProps } from '../../types';
import Toggle from './Toggle';
import Slider from './Slider';
import { useState, useEffect } from 'react';

export default function Menu(props: MenuProps) {
  const [aspRatioInput, setAspectRatioInput] = useState<[number, number]>([
    16, 9,
  ]);

  const { randOrder, randStart, autoStart, mute, vWidth, aspRatio } = props;
  const vWidthsArr = [240, 360, 480, 720, 960, 1280, 1440, 1920, 2880, 3840];

  // onChange for text input
  const changeAspectInp = (idx: 0 | 1, val: string): void => {
    const currInput: [number, number] = [...aspRatioInput];

    // convert val to number
    const newVal = Number(val);
    if (!isNaN(newVal)) {
      currInput[idx] = newVal;
      setAspectRatioInput(currInput);
    }
  };

  useEffect(() => {
    setAspectRatioInput([...aspRatio.get()]);
  }, []);

  return (
    <div className='menus'>
      <div className='menuEntry'>
        <Toggle
          togBool={mute.get()}
          togFunction={() => mute.set(!mute.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Mute</p>
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
          togBool={randStart.get()}
          togFunction={() => randStart.set(!randStart.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Randomize Playback Start</p>
      </div>
      <div className='menuEntry'>
        <Toggle
          togBool={randOrder.get()}
          togFunction={() => randOrder.set(!randOrder.get())}
        ></Toggle>
        <p className='menuEntryTxt'>Randomize Playback Order</p>
      </div>
      <div className='aspectEntry'>
        <p className='aspectEntryTxt'>Video Aspect Ratio:</p>
        <div className='aspectInputContain'>
          <input
            className='aspectInputBox'
            type='text'
            style={{ marginLeft: 0 }}
            onChange={(e) => changeAspectInp(0, e.target.value)}
            onBlur={() => {
              aspRatio.set([...aspRatioInput]);
            }}
            value={`${aspRatioInput[0]}`}
          ></input>
          <p
            className='aspectEntryTxt'
            style={{ marginTop: 0, paddingBottom: 0 }}
          >
            :
          </p>
          <input
            className='aspectInputBox'
            type='text'
            onChange={(e) => changeAspectInp(1, e.target.value)}
            onBlur={() => {
              aspRatio.set([...aspRatioInput]);
            }}
            value={`${aspRatioInput[1]}`}
          ></input>
        </div>
      </div>
      <Slider
        stateMod={vWidth}
        stateVar={'vWidth'}
        step={20}
        valArray={vWidthsArr}
        misc={aspRatio.get()[0] / aspRatio.get()[1]}
      ></Slider>
    </div>
  );
}
