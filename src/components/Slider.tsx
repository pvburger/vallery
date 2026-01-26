import { useState, useEffect } from 'react';
import type { SliderProps } from 'types';

export default function Slider(props: SliderProps) {
  
  const { vWidth, vWidthSet, vWidthArray, step, aspRatio } = props;

  const [sliderVal, setSliderVal] = useState(0);
  const [drag, setDrag] = useState(false);
  const [label, setLabel] = useState('');

  // // STATE VARIABLES FOR DEVELOPMENT ONLY
  // const [vPortDims, setVPortDims] = useState<[number, number]>([
  //   window.innerWidth,
  //   window.innerHeight,
  // ]);

  // // DEVELOPMENT MODE
  // const devMode = true;

  // // label maker for range input title (development)
  // const labelMakerDev = (): string => {
  //   if (drag) {
  //     return `Video Resolution: ${sliderVal} x ${Math.ceil(sliderVal / (aspRatio[0]/aspRatio[1]))}____Viewport Size: ${vPortDims[0]} x ${vPortDims[1]}`;
  //   }
  //   return `Video Resolution: ${vWidth} x ${Math.ceil(vWidth / (aspRatio[0]/aspRatio[1]))}____Viewport Size: ${vPortDims[0]} x ${vPortDims[1]}`;
  // };

  // creates tick mark elements for the slider
  const tickGen = () => {
    const tickArray = [];
    let count = 1;

    // for a given SORTED array (inp), calculates the percent of each value relative to the minimum and maximum values in the array, and returns a mapped array of those percentages
    const calcPercent = (inp: number[]): number[] => {
      const divisor = inp[inp.length - 1] - inp[0];
      return inp.map((el) => ((el - inp[0]) / divisor) * 100);
    };

    const percentArray = calcPercent(vWidthArray);

    for (const element of percentArray) {
      tickArray.push(
        <div
          className='tick'
          key={`tick_vWidth-${count}`}
          style={{ left: `${element}%` }}
        ></div>,
      );
      count++;
    }

    return tickArray;
  };

  // onChange for range input
  const change = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSliderVal(Number(event.target.value));
    setLabel(
      `Video Resolution: ${sliderVal} x ${Math.ceil(sliderVal / (aspRatio[0] / aspRatio[1]))}`,
    );
  };

  // what happens when user lets go of mouse button
  const pointerUp = () => {
    let upperBoundIdx = 0;
    let newVal = vWidthArray[0];

    /*
    While binary search is generally faster for this type of functionality, given that the vWidthArray only has 9 elements, and this will only run once when the user lets go of the mouse to reset the relevant state variable, a linear search through the array for the first value greater than the input value makes the most sense 
    */
    for (let i = 0; i < vWidthArray.length; i++) {
      if (vWidthArray[i] >= sliderVal) {
        upperBoundIdx = i;
        break;
      }
    }

    // when sliderVal is equal to the lowest value in the vWidthArray
    if (upperBoundIdx === 0) {
      setSliderVal(newVal);
      vWidthSet(newVal);
    } else {
      // else, determine which vWidthArray value is closer, vWidthArray[i] or vWidthArray[i-1]
      if (
        Math.abs(vWidthArray[upperBoundIdx] - sliderVal) <=
        Math.abs(vWidthArray[upperBoundIdx - 1] - sliderVal)
      ) {
        newVal = vWidthArray[upperBoundIdx];
      } else {
        newVal = vWidthArray[upperBoundIdx - 1];
      }
      setSliderVal(newVal);
      vWidthSet(newVal);
    }
    setDrag(false);
    setLabel(
      `Video Resolution: ${newVal} x ${Math.ceil(newVal / (aspRatio[0] / aspRatio[1]))}`,
    );
  };

  useEffect(() => {
    // use for debugging
    console.log('Slider: Initializing...');

    setSliderVal(vWidth);
    setLabel(
      `Video Resolution: ${vWidth} x ${Math.ceil(vWidth / (aspRatio[0] / aspRatio[1]))}`,
    );
  }, [aspRatio, vWidthArray]);

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
      <p className='sliderEntryTxt'>{label}</p>
      <div className='sliderContain'>
        <div className='tickContain'>{drag && tickGen()}</div>
        <input
          type='range'
          className='slider'
          min={vWidthArray[0]}
          max={vWidthArray[vWidthArray.length - 1]}
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
