import type { MenuProps } from '../../types';
import Toggle from './Toggle';
import Slider from './Slider';
import Button from './Button';
import { useState, useEffect } from 'react';

export default function Menu(props: MenuProps) {
  const [aspRatioInput, setAspectRatioInput] = useState<[number, number]>([
    16, 9,
  ]);

  const {
    randOrder,
    randOrderSet,
    randStart,
    randStartSet,
    autoStart,
    autoStartSet,
    mute,
    muteSet,
    vWidth,
    vWidthSet,
    aspRatio,
    aspRatioSet,
  } = props;

  // // debugger
  // const debooger = (inp: string): void => {
  //   console.log('.');
  //   console.log('.');
  //   console.log(`========================================`);
  //   console.log(`Event: ${inp}`);
  //   console.log(`vWidth: ${vWidth}`);
  //   console.log(`aspRatio: ${aspRatio}`);
  //   // console.log(`vWidthsArr: ${vWidthsArr}`);
  //   console.log(`aspectRatioInput: ${aspRatioInput}`);
  //   // console.log(`vWidthsIdx: ${vWidthsIdx}`);
  //   console.log(`========================================`);
  //   console.log('.');
  //   console.log('.');
  // };

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

  // use for debugging
  useEffect(() => {
    // use for debugging
    console.log('Menu: Initializing Menu');
    setAspectRatioInput([...aspRatio]);
  }, []);

  return (
    <div className='menus'>
      <div className='menuEntryContain'>
        <div>
          <div className='menuEntry'>
            <Toggle togBool={mute} togFunction={() => muteSet()}></Toggle>
            <p className='menuEntryTxt'>Mute</p>
          </div>
          <div className='menuEntry'>
            <Toggle
              togBool={autoStart}
              togFunction={() => autoStartSet()}
            ></Toggle>
            <p className='menuEntryTxt'>Auto Start Playback</p>
          </div>
          <div className='menuEntry'>
            <Toggle
              togBool={randStart}
              togFunction={() => randStartSet()}
            ></Toggle>
            <p className='menuEntryTxt'>Randomize Playback Start</p>
          </div>
          <div className='menuEntry'>
            <Toggle
              togBool={randOrder}
              togFunction={() => randOrderSet()}
            ></Toggle>
            <p className='menuEntryTxt'>Randomize Playback Order</p>
          </div>
        </div>
        <Button
          label='RESET'
          runFun={() => console.log('Insert Function...')}
        ></Button>
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
              aspRatioSet([...aspRatioInput]);
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
              aspRatioSet([...aspRatioInput]);
            }}
            value={`${aspRatioInput[1]}`}
          ></input>
        </div>
      </div>
      <Slider
        // stateMod={vWidth}
        vWidth={vWidth}
        vWidthSet={vWidthSet}
        // stateVar={'vWidth'}
        step={20}
        // misc={aspRatio[0] / aspRatio[1]}
        aspRatio={aspRatio}
      ></Slider>
    </div>
  );
}
