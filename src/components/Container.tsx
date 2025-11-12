import { useState } from 'react';
import Button from './Button';

export default function Container() {
  // state
  const [clipArray, setClipArray] = useState<string[]>([]);

  // wrappers
  const getFileList = async (): Promise<void> => {
    setClipArray(await window.valleryAPI.selectFiles());
  };

  const clearFileList = (): void => {
    setClipArray([] as string[]);
  };

  // misc
  const entryCreator = () => {
    const result: React.ReactElement[] = [];
    let keyCount = 1;
    for (const item of clipArray) {
      // console.log(`Item: ${item}`);
      // const srcAddress = `scrub://${item}`;
      const srcAddress = `http://127.0.0.1:3333/video?path=${item}`;
      // console.log(`srcAddress: ${srcAddress}`);
      result.push(
        <div className='vidDiv' key={`vidDiv_${keyCount}`}>
          <figure>
            <video
              src={srcAddress}
              controls
              width='1200'
              height='675'
              preload='metadata'
            ></video>
            <figcaption>{item}</figcaption>
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
        <Button
          label='OPTIONS'
          runFun={(): void => {
            console.log('Add functionality...');
          }}
        ></Button>
      </div>
      <div className='bodyContain'></div>
      {entryCreator()}
    </div>
  );
}
