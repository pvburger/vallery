import { useState, useEffect } from 'react';
import type { SliderProps } from 'types';

const landscapeArr = [240, 352, 480, 720, 960, 1280, 1440, 1920, 2880, 3840];

export default function Slider(props: SliderProps) {
  const [sliderVal, setSliderVal] = useState(0);
  const [drag, setDrag] = useState(false);
  const [valArray, setValArray] = useState(landscapeArr);
  const [valArrayIdx, setValArrayIdx] = useState(-1);
  const [initialized, setInitialized] = useState(false);

  // // STATE VARIABLES FOR DEVELOPMENT ONLY
  // const [vPortDims, setVPortDims] = useState<[number, number]>([
  //   window.innerWidth,
  //   window.innerHeight,
  // ]);

  const { vWidth, vWidthSet, step, aspRatio } = props;

  // // DEVELOPMENT MODE
  // const devMode = true;

  // // label maker for range input title (development)
  // const labelMakerDev = (): string => {
  //   if (drag) {
  //     return `Video Resolution: ${sliderVal} x ${Math.ceil(sliderVal / (aspRatio[0]/aspRatio[1]))}____Viewport Size: ${vPortDims[0]} x ${vPortDims[1]}`;
  //   }
  //   return `Video Resolution: ${vWidth} x ${Math.ceil(vWidth / (aspRatio[0]/aspRatio[1]))}____Viewport Size: ${vPortDims[0]} x ${vPortDims[1]}`;
  // };

  // label maker for range input title (production)
  const labelMakerProd = (): string => {
    if (drag) {
      return `Video Resolution: ${sliderVal} x ${Math.ceil(sliderVal / (aspRatio[0] / aspRatio[1]))}`;
    }
    return `Video Resolution: ${vWidth} x ${Math.ceil(vWidth / (aspRatio[0] / aspRatio[1]))}`;
  };

  // creates tick mark elements for the slider
  const tickGen = () => {
    const tickArray = [];
    let count = 1;

    // for a given SORTED array (inp), calculates the percent of each value relative to the minimum and maximum values in the array, and returns a mapped array of those percentages
    const calcPercent = (inp: number[]): number[] => {
      const divisor = inp[inp.length - 1] - inp[0];
      return inp.map((el) => ((el - inp[0]) / divisor) * 100);
    };

    const percentArray = calcPercent(valArray);

    for (const element of percentArray) {
      tickArray.push(
        <div
          className='tick'
          key={`tick_vWidth-${count}`}
          style={{ left: `${element}%` }}
        ></div>
      );
      count++;
    }

    return tickArray;
  };

  // onChange for range input
  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderVal(Number(event.target.value));
  };

  const pointerUp = () => {
    let upperBoundIdx = 0;
    let newVal = valArray[0];

    /*
    While binary search is generally faster for this type of functionality, given that the valArray only has 9 elements, and this will only run once when the user lets go of the mouse to reset the relevant state variable, a linear search through the array for the first value greater than the input value makes the most sense 
    */
    for (let i = 0; i < valArray.length; i++) {
      if (valArray[i] >= sliderVal) {
        upperBoundIdx = i;
        break;
      }
    }

    // when sliderVal is equal to the lowest value in the valArray
    if (upperBoundIdx === 0) {
      vWidthSet(valArray[0]);
    } else {
      // else, determine which valArray value is closer, valArray[i] or valArray[i-1]
      if (
        Math.abs(valArray[upperBoundIdx] - sliderVal) <=
        Math.abs(valArray[upperBoundIdx - 1] - sliderVal)
      ) {
        vWidthSet(valArray[upperBoundIdx]);
        newVal = valArray[upperBoundIdx];
      } else {
        vWidthSet(valArray[upperBoundIdx - 1]);
        newVal = valArray[upperBoundIdx - 1];
      }
    }

    setDrag(false);

    // reset slider to current value of relevant state variable
    setSliderVal(newVal);
  };

  // useEffect helper to get valArrayIdx
  const getIdx = (inp: number[]): number => {
    // set index of current horizontal resolution in vWidthsArr
    let currIdx = inp.indexOf(vWidth);

    if (currIdx === -1) {
      console.log(
        'Error getting index of current horizontal resolution value in vWidthArr'
      );
      currIdx = 0;
    }
    return currIdx;
  };

  // useEffect helper to set valArray
  const pickValArray = (): number[] => {
    let newValArray = [...landscapeArr];

    // check and modify vWidthsArr as needed
    if (aspRatio[0] < aspRatio[1]) {
      newValArray = landscapeArr.map((el) => el * (aspRatio[0] / aspRatio[1]));
    }
    return newValArray;
  };

  useEffect(() => {
    // use for debugging
    console.log('Slider: Initializing...');

    // get relevant valArray
    const newArray = pickValArray();

    // update state variables
    setValArrayIdx(getIdx(newArray));
    setValArray(newArray);
    setSliderVal(vWidth);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;

    // use for debugging
    console.log('Slider: Aspect ratio has changed; updating state');

    // get relevant valArray
    const newArray = pickValArray();

    // update state variables
    setValArray(newArray);
    // reset vWidth after valArray change...
    vWidthSet(newArray[valArrayIdx]);
    setSliderVal(newArray[valArrayIdx]);
  }, [initialized, aspRatio]);

  // // USE FOR DEVELOPMENT ONLY
  // useEffect(() => {
  //   const updVPortDims = () => {
  //     setVPortDims([window.innerWidth, window.innerHeight]);
  //   };

  //   window.addEventListener('resize', updVPortDims);
  //   return () => window.removeEventListener('resize', updVPortDims);
  // }, []);

  return (
    <div className='sliderEntry'>
      <p className='sliderEntryTxt'>{labelMakerProd()}</p>
      <div className='sliderContain'>
        <div className='tickContain'>{drag && tickGen()}</div>
        <input
          type='range'
          className='slider'
          min={valArray[0]}
          max={valArray[valArray.length - 1]}
          step={step}
          onChange={change}
          onPointerDown={() => setDrag(true)}
          onPointerUp={pointerUp}
          value={sliderVal}
        ></input>
      </div>
    </div>
  );
}
