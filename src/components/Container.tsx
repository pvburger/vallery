import { useState, useEffect } from 'react';
import Button from './Button';
import Menu from './Menu';

export default function Container() {
  // state
  const [clipArray, setClipArray] = useState<string[]>([]);
  const [reactElArr, setReactElArr] = useState<React.ReactElement[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [randOrder, setRandOrder] = useState(true);
  const [randStart, setRandStart] = useState(true);
  const [autoStart, setAutoStart] = useState(true);
  const [mute, setMute] = useState(true);
  const [vWidth, setVWidth] = useState(960);

  // wrappers
  const getFileList = async (): Promise<void> => {
    setClipArray(await window.valleryAPI.selectFiles());
  };

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

  // helpers
  const genRandomTime = async (length: number) => {
    const lenMS = length * 1000;
    // define lo and hi time limit for random start times
    const lo = Math.floor(0.1 * lenMS);
    const hi = Math.ceil(0.9 * lenMS);
    return (await window.valleryAPI.getRandomNum(lo, hi)) / 1000;
  };

  // used to enable random start of video playback
  const handleMetadata = async (
    event: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const video = event.currentTarget;
    const duration = video.duration;

    // this shouldn't be stricly necessary; video files should be verifed at this point
    if (!duration || isNaN(duration)) return;

    // if random start time is enabled, compute random start time and reset current time
    if (randStart) {
      video.currentTime = await genRandomTime(duration);
    }

    // if autoPlay is enabled, begin playback at that location:
    if (video.autoplay) {
      try {
        video.play();
      } catch (err) {
        console.log(`There was an error playing the video: ${err}`);
      }
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
      // return inp;
    } catch (err) {
      console.log(`There was an error randomizing the array: ${err}`);
      // return inp;
    }
    return inp;
  };

  const entryCreator = async () => {
    const result: React.ReactElement[] = [];
    let keyCount = 1;
    for (const item of clipArray) {
      const srcAddress = `http://127.0.0.1:3333/video?path=${item}`;
      const lastSlash = item.lastIndexOf('/') + 1;
      result.push(
        <div className='vidDiv' key={`vidDiv_${keyCount}`}>
          <figure>
            <video
              src={srcAddress}
              controls
              width={vWidth}
              muted={mute}
              // audio playback must be muted for autoPlay to work
              autoPlay={mute && autoStart}
              loop={true}
              preload='metadata'
              onLoadedMetadata={(event) => handleMetadata(event)}
            ></video>
            <figcaption>{item.slice(lastSlash)}</figcaption>
          </figure>
        </div>
      );
      keyCount++;
    }

    if (!randOrder) {
      // update reactElArr state variable for entered order playback
      setReactElArr(result);
    } else {
      // update reactElArr state variable for random order playback
      setReactElArr(await randomizeArr(result));
    }
  };

  useEffect(() => {
    entryCreator();
  }, [clipArray, vWidth]);

  return (
    <div className='mainContain'>
      <div className='headContain'>
        <Button label='OPEN' runFun={getFileList}></Button>
        <Button label='CLEAR' runFun={clearFileList}></Button>
        <Button label='OPTIONS' runFun={toggleMenu}></Button>
      </div>
      {menuDisplay && (
        <Menu
          randOrder={randOrderControl}
          randStart={randStartControl}
          autoStart={autoStartControl}
          mute={muteControl}
          vWidth={vWidthControl}
        ></Menu>
      )}
      <div className='bodyContain'>{reactElArr}</div>
    </div>
  );
}
