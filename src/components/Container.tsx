import { useState } from 'react';
import Button from './Button';
import Menu from './Menu';

export default function Container() {
  // state
  const [clipArray, setClipArray] = useState<string[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [randOrder, setRandOrder] = useState(false);
  const [randStart, setRandStart] = useState(false);
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

  // helper
  const entryCreator = () => {
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
            ></video>
            <figcaption>{item.slice(lastSlash)}</figcaption>
          </figure>
        </div>
      );
      keyCount++;
    }
    return result;
  };

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
      <div className='bodyContain'>{entryCreator()}</div>
    </div>
  );
}
