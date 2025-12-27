import { useState, useEffect } from 'react';
import type { SliderProps } from 'types';

export default function Slider(props: SliderProps) {
  const [sliderVal, setSliderVal] = useState(0);
  const [drag, setDrag] = useState(false);
  // // STATE VARIABLES FOR DEVELOPMENT ONLY
  // const [vPortDims, setVPortDims] = useState<[number, number]>([
  //   window.innerWidth,
  //   window.innerHeight,
  // ]);

  const { stateMod, stateVar, step, valArray, misc } = props;

  // // DEVELOPMENT MODE
  // const devMode = true;

  // // label maker for range input title (development)
  // const labelMakerDev = (): string => {
  //   if (drag) {
  //     return `Video Resolution: ${sliderVal} x ${Math.ceil(sliderVal / misc)}____Viewport Size: ${vPortDims[0]} x ${vPortDims[1]}`;
  //   }
  //   return `Video Resolution: ${stateMod.val} x ${Math.ceil(stateMod.val / misc)}____Viewport Size: ${vPortDims[0]} x ${vPortDims[1]}`;
  // };

  // label maker for range input title (production)
  const labelMakerProd = (): string => {
    if (drag) {
      return `Video Resolution: ${sliderVal} x ${Math.ceil(sliderVal / misc)}`;
    }
    return `Video Resolution: ${stateMod.val} x ${Math.ceil(stateMod.val / misc)}`;
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
          key={`tick_${stateVar}-${count}`}
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
      stateMod.set(valArray[0]);
    } else {
      // else, determine which valArray value is closer, valArray[i] or valArray[i-1]
      if (
        Math.abs(valArray[upperBoundIdx] - sliderVal) <=
        Math.abs(valArray[upperBoundIdx - 1] - sliderVal)
      ) {
        stateMod.set(valArray[upperBoundIdx]);
        newVal = valArray[upperBoundIdx];
      } else {
        stateMod.set(valArray[upperBoundIdx - 1]);
        newVal = valArray[upperBoundIdx - 1];
      }
    }

    setDrag(false);

    // reset slider to current value of relevant state variable
    setSliderVal(newVal);
  };

  useEffect(() => {
    setSliderVal(stateMod.val);
  }, [stateMod.val]);

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
