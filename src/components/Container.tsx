import { useState, useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import Button from './Button';
import Menu from './Menu';
import VideoItem from './VideoItem';

export default function Container() {

  const [clipArray, setClipArray] = useState<string[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [randOrder, setRandOrder] = useState(false);
  const [randStart, setRandStart] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [mute, setMute] = useState(false);
  const [vWidth, setVWidth] = useState(720);
  const [aspRatio, setAspRatio] = useState<[number, number]>([16, 9]);
  const [stateLoaded, setStateLoaded] = useState(false);

  // wrappers
  const clearFileList = (): void => {
    setClipArray([] as string[]);
  };

  const toggleMenu = (): void => {
    setMenuDisplay((prev) => !prev);
  };

  const randOrderControl = {
    val: randOrder,
    set: () => {
      setRandOrder((prev) => !prev);
    },
  };

  const randStartControl = {
    val: randStart,
    set: () => {
      setRandStart((prev) => !prev);
    },
  };

  const autoStartControl = {
    val: autoStart,
    set: () => {
      setAutoStart((prev) => !prev);
    },
  };

  const muteControl = {
    val: mute,
    set: () => {
      setMute((prev) => !prev);
    },
  };

  const vWidthControl = {
    val: vWidth,
    set: (inp: number) => {
      setVWidth(inp);
    },
  };

  const aspRatioControl = {
    val: aspRatio,
    set: (inp: [number, number]) => {
      setAspRatio(inp);
    },
  };

  const updateState = async (): Promise<void> => {
    // // use for debugging
    // console.log('Initialize state');
    try {
      // load saved settings from electron-store
      const settingsObj = await window.valleryAPI.getSettingsObj();

      // update state
      setRandOrder(settingsObj.randOrder);
      setRandStart(settingsObj.randStart);
      setAutoStart(settingsObj.autoStart);
      setMute(settingsObj.mute);
      setAspRatio(settingsObj.aspRatio);
      setVWidth(settingsObj.vWidth);
      setStateLoaded(true);
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
      // remove duplicates by converting array to set and back again...
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

  useEffect(() => {
    if (stateLoaded) {
      // // use for debugging
      // console.log('Settings changed; updating Electron-Store');

      window.valleryAPI.setSettingsObj({
        randOrder: randOrder,
        randStart: randStart,
        autoStart: autoStart,
        mute: mute,
        vWidth: vWidth,
        aspRatio: [...aspRatio],
        lastPath: '',
      });
    }
  }, [randOrder, randStart, autoStart, mute, vWidth, aspRatio]);

  // check to see if mute is 'false'
  // if so, checks to see if autoStart is 'true' and if so, toggles it to 'false'
  // Chromium browsers/electron do not support auto playing videos unless the sound is muted
  useEffect(() => {
    if (!mute) {
      autoStart && setAutoStart((prev) => !prev);
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
        style={{ height: menuDisplay ? '46vh' : '88.5vh' }}
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
