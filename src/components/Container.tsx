import { useState, useEffect, useRef } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';
import { ValSettingsUI } from '../../types';
import Button from './Button';
import Menu from './Menu';
import VideoItem from './VideoItem';

export default function Container() {
  const [clipArray, setClipArray] = useState<string[]>([]);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [stateLoaded, setStateLoaded] = useState(false);
  const [userSettings, setUserSettings] = useState(() => new ValSettingsUI());
  const [reSet, setReSet] = useState(false);
  const [maxVidId, setMaxVidId] = useState<null | string>(null);
  const virtScrollRef = useRef<null | HTMLElement>(null);

  // wrappers
  const clearFileList = (): void => {
    setClipArray([] as string[]);
  };

  const toggleMenu = (): void => {
    setMenuDisplay((prev) => !prev);
  };

  const randOrderSet = () => {
    setUserSettings((prev) => ({ ...prev, randOrder: !prev.randOrder }));
  };

  const randStartSet = () => {
    setUserSettings((prev) => ({ ...prev, randStart: !prev.randStart }));
  };

  const autoStartSet = () => {
    setUserSettings((prev) => ({ ...prev, autoStart: !prev.autoStart }));
  };

  const muteSet = () => {
    setUserSettings((prev) => ({ ...prev, mute: !prev.mute }));
  };

  const vWidthSet = (inp: number) => {
    setUserSettings((prev) => ({ ...prev, vWidth: inp }));
  };

  const vWidthArraySet = (inp: number[]) => {
    setUserSettings((prev) => ({ ...prev, vWidthArray: inp }));
  };

  const aspRatioSet = (inp: [number, number]) => {
    setUserSettings((prev) => ({ ...prev, aspRatio: inp }));
  };

  const reSetSet = () => {
    setReSet(true);
  };

  const maxVidIdSet = (inp: string | null) => {
    setMaxVidId(inp);
  };

  const updateState = async (): Promise<void> => {
    try {
      // load saved settings from electron-store
      const settingsObj = await window.valleryAPI.getSettingsObj();

      // update state
      setUserSettings(settingsObj);
      setStateLoaded(true);
      setReSet(false);
    } catch (err) {
      console.log(
        `There was a problem updating state with electron-store values: ${err}`,
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
        if (userSettings.randOrder) {
          setClipArray(
            await randomizeArr(removeDupes([...clipArray, ...clipArr])),
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
    // use for debugging
    console.log('Container: Initializing...');
    updateState();
  }, []);

  useEffect(() => {
    if (stateLoaded) {
      // use for debugging
      console.log('Container: Updating Electron-Store');

      window.valleryAPI.setSettingsObj(userSettings);
    }
  }, [
    userSettings.randOrder,
    userSettings.randStart,
    userSettings.autoStart,
    userSettings.mute,
    userSettings.vWidth,
    userSettings.aspRatio,
  ]);

  // check to see if mute is 'false'
  // if so, checks to see if autoStart is 'true' and if so, toggles it to 'false'
  // Chromium browsers/electron do not support auto playing videos unless the sound is muted
  useEffect(() => {
    // use for debugging
    console.log('Container: Checking mute status to determine autoStart state');

    if (!userSettings.mute) {
      userSettings.autoStart && autoStartSet();
    }
  }, [userSettings.mute, userSettings.autoStart]);

  // side effect to restore default user settings
  useEffect(() => {
    if (!reSet) return;

    // use for debugging
    console.log('Container: Restoring user defaults');

    (async () => {
      try {
        await window.valleryAPI.reDefault();
      } catch (err) {
        console.log(
          `There was an error restoring default user settings: ${err}`,
        );
      } finally {
        updateState();
      }
    })();
  }, [reSet]);

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
            randOrder={userSettings.randOrder}
            randOrderSet={randOrderSet}
            randStart={userSettings.randStart}
            randStartSet={randStartSet}
            autoStart={userSettings.autoStart}
            autoStartSet={autoStartSet}
            mute={userSettings.mute}
            muteSet={muteSet}
            vWidth={userSettings.vWidth}
            vWidthSet={vWidthSet}
            vWidthArray={userSettings.vWidthArray}
            vWidthArraySet={vWidthArraySet}
            aspRatio={userSettings.aspRatio}
            aspRatioSet={aspRatioSet}
            reSetSet={reSetSet}
          ></Menu>
        </div>
      )}
      <div
        className='bodyContain'
        style={{ height: menuDisplay ? '46vh' : '88.5vh' }}
      >
        <VirtuosoGrid
          style={{ height: '100%' }}
          scrollerRef={(ref) => {
            virtScrollRef.current = ref;
          }}
          totalCount={clipArray.length}
          itemClassName='gridItem'
          listClassName='gridContainer'
          overscan={0}
          itemContent={(index) => (
            <VideoItem
              path={clipArray[index]}
              vWidth={userSettings.vWidth}
              aspRatio={userSettings.aspRatio}
              mute={userSettings.mute}
              autoStart={userSettings.autoStart}
              randStart={userSettings.randStart}
              maxVidId={maxVidId}
              maxVidIdSet={maxVidIdSet}
              virtScrollRef={virtScrollRef.current}
            />
          )}
        ></VirtuosoGrid>
      </div>
    </div>
  );
}
