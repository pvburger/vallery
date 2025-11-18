import { useState, useEffect } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import Button from './Button';
import Menu from './Menu';
import VideoItem from './VideoItem';

export default function Container() {
  // state
  const [clipArray, setClipArray] = useState<string[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [randOrder, setRandOrder] = useState(true);
  const [randStart, setRandStart] = useState(true);
  const [autoStart, setAutoStart] = useState(true);
  const [mute, setMute] = useState(true);
  const [vWidth, setVWidth] = useState(720);

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
      setRandOrder(!randOrder);
    },
  };

  const randStartControl = {
    get: () => randStart,
    set: () => {
      setRandStart(!randStart);
    },
  };

  const autoStartControl = {
    get: () => autoStart,
    set: () => {
      setAutoStart(!autoStart);
    },
  };

  const muteControl = {
    get: () => mute,
    set: () => {
      setMute(!mute);
    },
  };

  const vWidthControl = {
    get: () => vWidth,
    set: (inp: number) => {
      setVWidth(inp);
    },
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
    try {
      const clipArr = await window.valleryAPI.selectFiles();

      if (randOrder) {
        setClipArray(await randomizeArr(clipArr));
      } else {
        setClipArray(clipArr);
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
          ></Menu>
        </div>
      )}
      <div className='bodyContain'>
        <VirtuosoGrid
          style={{ height: '100%' }}
          totalCount={clipArray.length}
          itemClassName='gridItem'
          listClassName='gridContainer'
          itemContent={(index) => (
            <VideoItem
              path={clipArray[index]}
              vWidth={vWidth}
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
