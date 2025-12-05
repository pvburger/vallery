import { useState /*, useEffect */ } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import Button from './Button';
import Menu from './Menu';
import VideoItem from './VideoItem';

// load saved settings from electron-store
const ranOrd = await window.valleryAPI.getStoreVal('randOrder');
const ranStar = await window.valleryAPI.getStoreVal('randStart');
const autoStar = await window.valleryAPI.getStoreVal('autoStart');
const mu = await window.valleryAPI.getStoreVal('mute');
const width = await window.valleryAPI.getStoreVal('vWidth');

export default function Container() {
  // state
  const [clipArray, setClipArray] = useState<string[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [randOrder, setRandOrder] = useState(ranOrd);
  const [randStart, setRandStart] = useState(ranStar);
  const [autoStart, setAutoStart] = useState(autoStar);
  const [mute, setMute] = useState(mu);
  const [vWidth, setVWidth] = useState(width);

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
