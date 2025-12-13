import { useState, useEffect } from 'react';
import type { SliderProps } from 'types';

export default function Slider(props: SliderProps) {
  const [sliderVal, setSliderVal] = useState(240);
  const [drag, setDrag] = useState(false);

  const { stateMod } = props;
  const vWidthsArr = [240, 360, 480, 720, 960, 1280, 1440, 1920, 2880, 3840];

  const vidResAsString = (val: number): string => {
    const vHeight = Math.ceil(val * (9 / 16));
    return `${val} x ${vHeight}`;
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

    const percentArray = calcPercent(vWidthsArr);

    for (const element of percentArray) {
      tickArray.push(
        <div
          className='tick'
          id={`tick_${count}`}
          style={{ left: `${element}%` }}
        ></div>
      );
      count++;
    }

    return tickArray;
  };

  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderVal(Number(event.target.value));
  };

  const pointerUp = () => {
    let upperBoundIdx = 0;
    let newResolution = vWidthsArr[0];

    /*
    While binary search is generally faster for this type of functionality, given that the vWidthsArr only has 9 elements, and this will only run once when the user lets go of the mouse to reset the vWidth state variable, a linear search through the array for the first value greater than the input value makes the most sense 
    */
    for (let i = 0; i < vWidthsArr.length; i++) {
      if (vWidthsArr[i] >= sliderVal) {
        upperBoundIdx = i;
        break;
      }
    }

    // when sliderVal is equal to the lowest value in the vWidthsArr
    if (upperBoundIdx === 0) {
      stateMod.set(vWidthsArr[0]);
    } else {
      // else, determine which vWidthsArr value is closer, vWidthsArr[i] or vWidthsArr[i-1]
      if (
        Math.abs(vWidthsArr[upperBoundIdx] - sliderVal) <=
        Math.abs(vWidthsArr[upperBoundIdx - 1] - sliderVal)
      ) {
        stateMod.set(vWidthsArr[upperBoundIdx]);
        newResolution = vWidthsArr[upperBoundIdx];
      } else {
        stateMod.set(vWidthsArr[upperBoundIdx - 1]);
        newResolution = vWidthsArr[upperBoundIdx - 1];
      }
    }

    setDrag(false);

    // reset slider to current vWidth
    setSliderVal(newResolution);
  };

  useEffect(() => {
    setSliderVal(stateMod.get());
  }, []);

  return (
    <div className='sliderEntry'>
      <p className='sliderEntryTxt'>Video Size: {vidResAsString(sliderVal)}</p>
      <div className='sliderContain'>
        <div className='tickContain'>{drag && tickGen()}</div>
        <input
          type='range'
          className='slider'
          min={vWidthsArr[0]}
          max={vWidthsArr[vWidthsArr.length - 1]}
          step={20}
          onChange={change}
          onPointerDown={() => setDrag(true)}
          onPointerUp={pointerUp}
          value={sliderVal}
        ></input>
      </div>
    </div>
  );
}
