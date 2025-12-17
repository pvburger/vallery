import { useState, useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import Button from './Button';
import Menu from './Menu';
import VideoItem from './VideoItem';

export default function Container() {
  // state
  const [clipArray, setClipArray] = useState<string[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [randOrder, setRandOrder] = useState(false);
  const [randStart, setRandStart] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [mute, setMute] = useState(true);
  const [vWidth, setVWidth] = useState(720);
  const [aspRatio, setAspRatio] = useState<[number, number]>([16, 9]);

  // wrappers
  const clearFileList = (): void => {
    setClipArray([] as string[]);
  };

  const toggleMenu = (): void => {
    setMenuDisplay(!menuDisplay);
  };

  const randOrderControl = {
    get: () => randOrder,
    set: () => {
      window.valleryAPI.setStoreVal('randOrder', !randOrder);
      setRandOrder(!randOrder);
    },
  };

  const randStartControl = {
    get: () => randStart,
    set: () => {
      window.valleryAPI.setStoreVal('randStart', !randStart);
      setRandStart(!randStart);
    },
  };

  const autoStartControl = {
    get: () => autoStart,
    set: () => {
      window.valleryAPI.setStoreVal('autoStart', !autoStart);
      setAutoStart(!autoStart);
    },
  };

  const muteControl = {
    get: () => mute,
    set: () => {
      window.valleryAPI.setStoreVal('mute', !mute);
      setMute(!mute);
    },
  };

  const vWidthControl = {
    get: () => vWidth,
    set: (inp: number) => {
      window.valleryAPI.setStoreVal('vWidth', inp);
      setVWidth(inp);
    },
  };

  const aspRatioControl = {
    get: () => aspRatio,
    set: (inp: [number, number]) => {
      window.valleryAPI.setStoreVal('aspRatio', inp);
      setAspRatio(inp);
    },
  };

  const updateState = async (): Promise<void> => {
    try {
      // load saved settings from electron-store
      const ranOrd = await window.valleryAPI.getStoreVal('randOrder');
      const ranStar = await window.valleryAPI.getStoreVal('randStart');
      const autoStar = await window.valleryAPI.getStoreVal('autoStart');
      const mu = await window.valleryAPI.getStoreVal('mute');
      const width = await window.valleryAPI.getStoreVal('vWidth');
      const aRatio = await window.valleryAPI.getStoreVal('aspRatio');

      // update state
      setRandOrder(ranOrd);
      setRandStart(ranStar);
      setAutoStart(autoStar);
      setMute(mu);
      setVWidth(width);
      setAspRatio(aRatio);
    } catch (err) {
      console.log(
        `There was a problem updating state with electron-store values: ${err}`
      );
    }
  };

  // shuffles an input array in place using Fisher-Yates shuffle
  // the comma after the generic is needed for parsing purposes
  const randomizeArr = async <T,>(inp: T[]): Promise<T[]> => {
    try {
      for (let i = inp.length - 1; i > 0; i--) {
        const randomNum = await window.valleryAPI.getRandomNum(0, i + 1);
        // swap array elements using desctructuring
        [inp[i], inp[randomNum]] = [inp[randomNum], inp[i]];
      }
    } catch (err) {
      console.log(`There was an error randomizing the array: ${err}`);
    }
    return inp;
  };

  const getFileList = async (): Promise<void> => {
    const removeDupes = (inpArray: string[]): string[] => {
      return [...new Set(inpArray)];
    };

    try {
      // appends any newly selected files to existing file list in clipArray state variable
      const clipArr = await window.valleryAPI.selectFiles();

      if (clipArr.length > 0) {
        if (randOrder) {
          setClipArray(
            await randomizeArr(removeDupes([...clipArray, ...clipArr]))
          );
        } else {
          setClipArray(removeDupes([...clipArray, ...clipArr]));
        }
      }
    } catch (err) {
      console.log(`Whoopsie: ${err}`);
    }
  };

  // added for development
  // useEffect(() => {
  //   for (let i = 0; i < clipArray.length; i++) {
  //     console.log(`Item ${i}: ${clipArray[i]}`);
  //   }
  // }, [clipArray]);

  useEffect(() => {
    updateState();
  }, []);

  // check to see if mute is 'false'
  // if so, checks to see if autoStart is 'true' and if so, toggles it to 'false'
  // this is because browsers/electron do not support auto playing videos unless the sound is muted
  useEffect(() => {
    if (!mute) {
      autoStart && setAutoStart(!autoStart);
    }
  }, [mute, autoStart]);

  return (
    <div className='mainContain'>
      <div className='headContain'>
        <Button
          label='OPEN'
          runFun={() => {
            getFileList();
          }}
        ></Button>
        <Button label='CLEAR' runFun={clearFileList}></Button>
        <Button label='OPTIONS' runFun={toggleMenu}></Button>
      </div>
      {menuDisplay && (
        <div className='menuContain'>
          <Menu
            randOrder={randOrderControl}
            randStart={randStartControl}
            autoStart={autoStartControl}
            mute={muteControl}
            vWidth={vWidthControl}
            aspRatio={aspRatioControl}
          ></Menu>
        </div>
      )}
      <div
        className='bodyContain'
        // UPDATE STYLING OF ALL ELEMENTS SO HEIGHT IS ALWAYS CALCULATED USING vh, THEN UPDATE BELOW
        style={{ height: menuDisplay ? '25vh' : '88.5vh' }}
      >
        <VirtuosoGrid
          style={{ height: '100%' }}
          totalCount={clipArray.length}
          itemClassName='gridItem'
          listClassName='gridContainer'
          itemContent={(index) => (
            <VideoItem
              path={clipArray[index]}
              vWidth={vWidth}
              aspRatio={aspRatio}
              mute={mute}
              autoStart={autoStart}
              randStart={randStart}
            />
          )}
        ></VirtuosoGrid>
      </div>
    </div>
  );
}
